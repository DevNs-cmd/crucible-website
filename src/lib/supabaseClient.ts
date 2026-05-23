import { createClient } from "@supabase/supabase-js";

const unconfiguredSupabaseUrl = "https://missing-supabase-project.supabase.co";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";
export const isSupabaseBrowserConfigured = Boolean(
  supabaseUrl && supabaseAnonKey
);

export const supabase = createClient(
  supabaseUrl || unconfiguredSupabaseUrl,
  supabaseAnonKey || "missing-supabase-publishable-key",
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  }
);
