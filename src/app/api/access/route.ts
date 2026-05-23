import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  cleanEmail,
  cleanString,
  generateSessionToken,
  getAccessGrantBySessionToken,
  getCookieMaxAge,
  getCurrentAccessGrant,
  getSessionTokenHint,
  hashAccessCode,
  hashSecret,
  isValidEmail,
  normalizeAccessCode,
} from "@/lib/access";
import {
  getSupabaseAdminClient,
  getSupabaseConfigDiagnostics,
} from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RedeemResult {
  success: boolean;
  error: string | null;
  redemption_id: string | null;
  access_code_id: string | null;
  label: string | null;
  tier: string | null;
  assigned_email: string | null;
  session_expires_at: string | null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error";
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip");
}

export async function GET() {
  const grant = await getCurrentAccessGrant();

  if (!grant) {
    return NextResponse.json(
      { success: false, error: "Access session not found" },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, data: grant });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const code = normalizeAccessCode(body.code);
    const email = cleanEmail(body.email);
    const name = cleanString(body.name);

    if (!code || code.length < 8) {
      return NextResponse.json(
        { error: "Enter the access code your Crucible team contact gave you." },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        {
          error: "Supabase admin client is not configured",
          details: getSupabaseConfigDiagnostics(),
        },
        { status: 500 }
      );
    }

    const sessionToken = generateSessionToken();
    const { data, error } = await supabase.rpc("redeem_access_code", {
      p_code_hash: hashAccessCode(code),
      p_email: email,
      p_name: name || null,
      p_session_token_hash: hashSecret(sessionToken),
      p_session_token_hint: getSessionTokenHint(sessionToken),
      p_user_agent: request.headers.get("user-agent"),
      p_ip_address: getClientIp(request),
    });

    if (error) {
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    const result = (Array.isArray(data) ? data[0] : data) as
      | RedeemResult
      | undefined;

    if (!result?.success || !result.session_expires_at) {
      return NextResponse.json(
        { error: result?.error || "Invalid or expired access code." },
        { status: 400 }
      );
    }

    const grant = await getAccessGrantBySessionToken(sessionToken);
    const response = NextResponse.json({
      success: true,
      redirectTo: "/dashboard",
      data: grant || {
        redemptionId: result.redemption_id,
        accessCodeId: result.access_code_id,
        email,
        name: name || null,
        label: result.label,
        tier: result.tier,
        assignedEmail: result.assigned_email,
        expiresAt: result.session_expires_at,
      },
    });

    response.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getCookieMaxAge(result.session_expires_at),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
