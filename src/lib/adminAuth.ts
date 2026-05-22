import "server-only";

import { NextResponse } from "next/server";
import { getSupabaseAuthVerifierClient } from "@/lib/supabaseServer";

const devBypassEmail = "developer@nextgen.ai";

type AdminAuthResult =
  | { authorized: true; email: string }
  | { authorized: false; response: NextResponse };

function getAllowedAdminEmails() {
  const raw =
    process.env.AUTHORIZED_ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_AUTHORIZED_ADMIN_EMAILS ||
    (process.env.NODE_ENV !== "production" ? devBypassEmail : "");

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  return match?.[1] || null;
}

export async function requireAdmin(request: Request): Promise<AdminAuthResult> {
  if (
    process.env.NODE_ENV !== "production" &&
    request.headers.get("x-crucible-dev-bypass") === "enabled"
  ) {
    return { authorized: true, email: devBypassEmail };
  }

  const token = getBearerToken(request);

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      ),
    };
  }

  const supabase = getSupabaseAuthVerifierClient();

  if (!supabase) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Supabase authentication is not configured" },
        { status: 503 }
      ),
    };
  }

  const { data, error } = await supabase.auth.getUser(token);
  const email = data.user?.email?.toLowerCase();

  if (error || !email) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Invalid admin session" },
        { status: 401 }
      ),
    };
  }

  if (!getAllowedAdminEmails().includes(email)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Admin account is not authorized" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, email };
}
