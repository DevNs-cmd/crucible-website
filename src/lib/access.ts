import "server-only";

import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabaseServer";

export const ACCESS_COOKIE_NAME = "crucible_access_session";

export type AccessTier =
  | "Builder"
  | "Maker"
  | "Founder"
  | "Elite Resident"
  | "Incubator"
  | "Core Builder"
  | "Crucible Studio";

export type AccessCodeStatus = "active" | "revoked" | "exhausted" | "expired";

export interface AccessGrant {
  redemptionId: string;
  accessCodeId: string;
  email: string;
  name: string | null;
  label: string;
  tier: AccessTier;
  codeHint: string;
  assignedEmail: string | null;
  redeemedAt: string;
  expiresAt: string;
  status: AccessCodeStatus;
  maxRedemptions: number;
  redemptionCount: number;
}

interface AccessCodeRow {
  id: string;
  code_hint: string;
  label: string;
  assigned_email: string | null;
  tier: AccessTier;
  status: AccessCodeStatus;
  max_redemptions: number;
  redemption_count: number;
}

interface AccessRedemptionRow {
  id: string;
  access_code_id: string;
  email: string;
  name: string | null;
  redeemed_at: string;
  expires_at: string;
  access_codes: AccessCodeRow | AccessCodeRow[] | null;
}

const accessCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const validTiers: AccessTier[] = [
  "Builder",
  "Maker",
  "Founder",
  "Elite Resident",
  "Incubator",
  "Core Builder",
  "Crucible Studio",
];

export function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function cleanEmail(value: unknown) {
  return cleanString(value).toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseAccessTier(value: unknown): AccessTier {
  const tier = cleanString(value);

  return validTiers.includes(tier as AccessTier) ? (tier as AccessTier) : "Builder";
}

export function normalizeAccessCode(value: unknown) {
  return cleanString(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function formatAccessCode(normalizedCode: string) {
  const code = normalizeAccessCode(normalizedCode);
  const prefix = code.startsWith("CRU") ? code.slice(0, 3) : "CRU";
  const body = code.startsWith("CRU") ? code.slice(3) : code;
  const chunks = body.match(/.{1,4}/g) || [];

  return [prefix, ...chunks].filter(Boolean).join("-");
}

export function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashAccessCode(code: string) {
  return hashSecret(normalizeAccessCode(code));
}

export function generateAccessCode() {
  const bytes = randomBytes(12);
  let body = "";

  for (const byte of bytes) {
    body += accessCodeAlphabet[byte % accessCodeAlphabet.length];
  }

  return formatAccessCode(`CRU${body}`);
}

export function generateSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function getSecretHint(secret: string) {
  return normalizeAccessCode(secret).slice(-4);
}

export function getSessionTokenHint(token: string) {
  return token.slice(-8);
}

export function getCookieMaxAge(expiresAt: string) {
  const expiresMs = new Date(expiresAt).getTime();
  const seconds = Math.floor((expiresMs - Date.now()) / 1000);

  return Math.max(0, seconds);
}

function getJoinedCode(row: AccessRedemptionRow) {
  if (Array.isArray(row.access_codes)) {
    return row.access_codes[0] || null;
  }

  return row.access_codes || null;
}

function toAccessGrant(row: AccessRedemptionRow): AccessGrant | null {
  const code = getJoinedCode(row);

  if (!code) {
    return null;
  }

  return {
    redemptionId: row.id,
    accessCodeId: row.access_code_id,
    email: row.email,
    name: row.name,
    label: code.label,
    tier: code.tier,
    codeHint: code.code_hint,
    assignedEmail: code.assigned_email,
    redeemedAt: row.redeemed_at,
    expiresAt: row.expires_at,
    status: code.status,
    maxRedemptions: code.max_redemptions,
    redemptionCount: code.redemption_count,
  };
}

export async function getAccessGrantBySessionToken(sessionToken: string | null) {
  const token = cleanString(sessionToken);

  if (!token) {
    return null;
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("access_redemptions")
    .select(
      [
        "id",
        "access_code_id",
        "email",
        "name",
        "redeemed_at",
        "expires_at",
        "access_codes(id,code_hint,label,assigned_email,tier,status,max_redemptions,redemption_count)",
      ].join(",")
    )
    .eq("session_token_hash", hashSecret(token))
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const row = data as unknown as AccessRedemptionRow;

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    return null;
  }

  await supabase
    .from("access_redemptions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", row.id);

  return toAccessGrant(row);
}

export async function getCurrentAccessGrant() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value || null;

  return getAccessGrantBySessionToken(token);
}
