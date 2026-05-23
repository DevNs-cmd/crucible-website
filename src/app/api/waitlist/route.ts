import { NextResponse } from "next/server";
import {
  getSupabaseConfigDiagnostics,
  getSupabaseWriteClient,
} from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error";
}

function logStackTrace(label: string, error: unknown) {
  console.error(label, error);

  if (error instanceof Error && error.stack) {
    console.error(`${label} STACK:`, error.stack);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    console.info("WAITLIST REQUEST BODY:", body);

    const { email } = body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Email is required", missingFields: ["email"] },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = getSupabaseWriteClient();

    if (!supabase) {
      const diagnostics = getSupabaseConfigDiagnostics();
      console.error("SUPABASE CONFIG ERROR:", diagnostics);

      return NextResponse.json(
        {
          error: "Supabase write client is not configured",
          details: diagnostics,
        },
        { status: 500 }
      );
    }

    const insertPayload = { email: normalizedEmail };
    console.info("WAITLIST INSERT PAYLOAD:", insertPayload);

    const { data, error } = await supabase
      .from("waitlist")
      .insert([insertPayload]);

    console.info("SUPABASE WAITLIST INSERT RESPONSE:", {
      data,
      error,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          duplicate: true,
          message: "Email is already on the waitlist",
        });
      }

      console.error("SUPABASE INSERT ERROR:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    const { error: logError } = await supabase.from("logs").insert([{
      source: "WAITLIST_SVC",
      message: `New email queue registered: ${normalizedEmail}`,
      type: "success"
    }]);

    if (logError) {
      console.error("SUPABASE LOG INSERT ERROR:", logError);
    }

    return NextResponse.json({
      success: true,
      persisted: true,
      data: insertPayload,
    });
  } catch (error) {
    logStackTrace("WAITLIST POST ERROR:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
