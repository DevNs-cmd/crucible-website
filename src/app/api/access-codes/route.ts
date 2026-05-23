import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  cleanEmail,
  cleanString,
  formatAccessCode,
  generateAccessCode,
  getSecretHint,
  hashAccessCode,
  isValidEmail,
  normalizeAccessCode,
  parseAccessTier,
  type AccessCodeStatus,
} from "@/lib/access";
import {
  getSupabaseAdminClient,
  getSupabaseConfigDiagnostics,
} from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const validStatuses: AccessCodeStatus[] = [
  "active",
  "revoked",
  "exhausted",
  "expired",
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error";
}

function parseStatus(value: unknown) {
  const status = cleanString(value);

  return validStatuses.includes(status as AccessCodeStatus)
    ? (status as AccessCodeStatus)
    : null;
}

function parseMaxRedemptions(value: unknown) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 500) {
    return 1;
  }

  return parsed;
}

function parseExpiresAt(value: unknown) {
  const raw = cleanString(value);

  if (!raw) {
    return null;
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return "invalid";
  }

  return date.toISOString();
}

function normalizeCustomCode(value: unknown) {
  const normalized = normalizeAccessCode(value);

  if (!normalized) {
    return null;
  }

  return formatAccessCode(normalized);
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin.authorized) {
    return admin.response;
  }

  try {
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

    const { data, error } = await supabase
      .from("access_codes")
      .select(
        [
          "id",
          "code_hint",
          "label",
          "assigned_email",
          "tier",
          "max_redemptions",
          "redemption_count",
          "status",
          "expires_at",
          "created_by",
          "notes",
          "created_at",
          "updated_at",
        ].join(",")
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
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

    const assignedEmail = cleanEmail(body.assignedEmail ?? body.assigned_email);
    const label = cleanString(body.label) || "Crucible access grant";
    const tier = parseAccessTier(body.tier);
    const maxRedemptions = parseMaxRedemptions(
      body.maxRedemptions ?? body.max_redemptions
    );
    const notes = cleanString(body.notes) || null;
    const expiresAt = parseExpiresAt(body.expiresAt ?? body.expires_at);
    const customCode = normalizeCustomCode(body.code);

    if (assignedEmail && !isValidEmail(assignedEmail)) {
      return NextResponse.json(
        { error: "Assigned email must be a valid email address." },
        { status: 400 }
      );
    }

    if (expiresAt === "invalid") {
      return NextResponse.json(
        { error: "Expiration date is invalid." },
        { status: 400 }
      );
    }

    if (customCode && normalizeAccessCode(customCode).length < 8) {
      return NextResponse.json(
        { error: "Custom access codes must contain at least 8 letters or numbers." },
        { status: 400 }
      );
    }

    let rawCode = customCode || generateAccessCode();
    let insertError: { code?: string; message: string } | null = null;
    let created = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      rawCode = attempt === 0 ? rawCode : generateAccessCode();

      const { data, error } = await supabase
        .from("access_codes")
        .insert([
          {
            code_hash: hashAccessCode(rawCode),
            code_hint: getSecretHint(rawCode),
            label,
            assigned_email: assignedEmail || null,
            tier,
            max_redemptions: maxRedemptions,
            expires_at: expiresAt,
            created_by: admin.email,
            notes,
          },
        ])
        .select(
          [
            "id",
            "code_hint",
            "label",
            "assigned_email",
            "tier",
            "max_redemptions",
            "redemption_count",
            "status",
            "expires_at",
            "created_by",
            "notes",
            "created_at",
            "updated_at",
          ].join(",")
        )
        .single();

      if (!error) {
        created = data;
        insertError = null;
        break;
      }

      insertError = error;

      if (customCode || error.code !== "23505") {
        break;
      }
    }

    if (insertError || !created) {
      return NextResponse.json(
        { error: insertError?.message || "Failed to create access code" },
        { status: insertError?.code === "23505" ? 409 : 500 }
      );
    }

    await supabase.from("logs").insert([
      {
        source: "ACCESS_VAULT",
        message: `Access code created for ${assignedEmail || label} (${tier}).`,
        type: "success",
      },
    ]);

    return NextResponse.json({
      success: true,
      code: rawCode,
      data: created,
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const id = cleanString(body.id);
    const status = parseStatus(body.status);

    if (!id || !status) {
      return NextResponse.json(
        { error: "Valid id and status are required." },
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

    const { data, error } = await supabase
      .from("access_codes")
      .update({ status })
      .eq("id", id)
      .select(
        [
          "id",
          "code_hint",
          "label",
          "assigned_email",
          "tier",
          "max_redemptions",
          "redemption_count",
          "status",
          "expires_at",
          "created_by",
          "notes",
          "created_at",
          "updated_at",
        ].join(",")
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const updatedCode = data as unknown as {
      code_hint: string;
    };

    await supabase.from("logs").insert([
      {
        source: "ACCESS_VAULT",
        message: `Access code ${updatedCode.code_hint} marked ${status} by ${admin.email}.`,
        type: status === "active" ? "success" : "warning",
      },
    ]);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
