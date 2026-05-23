import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabaseProjectRef() {
  if (!supabaseUrl) {
    return null;
  }

  try {
    return new URL(supabaseUrl).hostname.split(".")[0] || null;
  } catch {
    return "invalid-url";
  }
}

const createSupabaseServerClient = (key: string) =>
  createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

export function getSupabaseWriteClient() {
  const key = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !key) {
    return null;
  }

  return createSupabaseServerClient(key);
}

export function getSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createSupabaseServerClient(supabaseServiceRoleKey);
}

export function getSupabaseAuthVerifierClient() {
  const key = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !key) {
    return null;
  }

  return createSupabaseServerClient(key);
}

export function hasSupabaseServiceRoleKey() {
  return Boolean(supabaseServiceRoleKey);
}

export function getSupabaseConfigDiagnostics() {
  return {
    hasUrl: Boolean(supabaseUrl),
    projectRef: getSupabaseProjectRef(),
    hasAnonKey: Boolean(supabaseAnonKey),
    hasServiceRoleKey: Boolean(supabaseServiceRoleKey),
    writeKeySource: supabaseServiceRoleKey
      ? "service_role"
      : supabaseAnonKey
        ? "anon"
        : "none",
  };
}
