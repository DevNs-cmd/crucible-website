import { NextResponse } from "next/server";
import { getSupabaseWriteClient } from "@/lib/supabaseServer";

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error";
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = getSupabaseWriteClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        mocked: true,
        message: "Supabase keys are not configured yet. Waitlist accepted in preview mode.",
      });
    }

    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email: normalizedEmail }])
      .select("id,email,created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          duplicate: true,
          message: "Email is already on the waitlist",
        });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("logs").insert([{
      source: "WAITLIST_SVC",
      message: `New email queue registered: ${normalizedEmail}`,
      type: "success"
    }]);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
