import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  getSupabaseAdminClient,
  getSupabaseConfigDiagnostics,
  getSupabaseWriteClient,
} from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ApplicationTier = "Elite Resident" | "Incubator" | "Core Builder";
type ApplicationStatus = "pending" | "approved" | "rejected";

interface Application {
  id: string;
  name: string;
  founder: string;
  email?: string;
  links?: string;
  project: string;
  score: number;
  tier: ApplicationTier;
  status: ApplicationStatus;
}

interface ApplicationInsertPayload {
  founder_name: string;
  startup_name: string;
  email: string;
  stage: string | null;
  fit_score: number;
  status: ApplicationStatus;
  name: string;
  founder: string;
  links: string | null;
  project: string;
  score: number;
  tier: ApplicationTier;
}

const fallbackApplications: Application[] = [
  {
    id: "app-1",
    name: "Nexus Labs",
    founder: "Aria Chen",
    email: "aria@nexus.example",
    project:
      "Decentralized physical infrastructure network (DePIN) for local browser model compute sharing.",
    score: 96,
    tier: "Elite Resident",
    status: "pending",
  },
  {
    id: "app-2",
    name: "Zephyr Systems",
    founder: "Marcus Vance",
    email: "marcus@zephyr.example",
    project:
      "Zero-latency audio-to-audio conversational agents running on lightweight edge matrices.",
    score: 89,
    tier: "Incubator",
    status: "pending",
  },
  {
    id: "app-3",
    name: "Solaris Bio",
    founder: "Dr. Elena Rostova",
    email: "elena@solaris.example",
    project:
      "Generative protein engineering workflow models accelerated via multi-node H100 clusters.",
    score: 93,
    tier: "Elite Resident",
    status: "pending",
  },
  {
    id: "app-4",
    name: "Crux AI",
    founder: "Devon Miller",
    email: "devon@crux.example",
    project:
      "Collaborative developer sandbox layer incorporating dynamic semantic code indexing.",
    score: 82,
    tier: "Core Builder",
    status: "pending",
  },
];

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanEmail(value: unknown) {
  return cleanString(value).toLowerCase();
}

function firstString(
  body: Record<string, unknown>,
  keys: string[]
) {
  for (const key of keys) {
    const value = cleanString(body[key]);

    if (value) {
      return value;
    }
  }

  return "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseTier(value: unknown): ApplicationTier {
  const tier = cleanString(value);

  if (
    tier === "Elite Resident" ||
    tier === "Incubator" ||
    tier === "Core Builder"
  ) {
    return tier;
  }

  return "Core Builder";
}

function parseStatus(value: unknown): ApplicationStatus | null {
  const status = cleanString(value);

  if (status === "pending" || status === "approved" || status === "rejected") {
    return status;
  }

  return null;
}

function calculateFitScore(name: string, project: string, links: string) {
  const haystack = `${name} ${project} ${links}`.toLowerCase();
  const keywords = [
    "ai",
    "neural",
    "tensor",
    "depin",
    "model",
    "compute",
    "blockchain",
    "sandbox",
    "h100",
    "gpu",
  ];

  return keywords.reduce((score, word) => {
    return haystack.includes(word) ? Math.min(100, score + 2) : score;
  }, 80 + Math.floor(Math.random() * 15));
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

export async function GET(request: Request) {
  const admin = await requireAdmin(request);

  if (!admin.authorized) {
    return admin.response;
  }

  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        mocked: true,
        data: fallbackApplications,
      });
    }

    const { data, error } = await supabase
      .from("applications")
      .select("id,name,founder,email,links,project,score,tier,status,created_at")
      .order("created_at", { ascending: false });

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
  try {
    const body = (await request.json()) as Record<string, unknown>;
    console.info("APPLICATION REQUEST BODY:", body);

    const startupName = firstString(body, [
      "name",
      "startup_name",
      "startupName",
    ]);
    const founder = firstString(body, [
      "founder",
      "founder_name",
      "founderName",
      "fullName",
      "name",
    ]);
    const email = cleanEmail(body.email);
    const links = cleanString(body.links);
    const projectBrief = firstString(body, ["project", "description"]);
    const project = projectBrief || startupName;
    const stage = cleanString(body.stage) || null;
    const tier = parseTier(body.tier);
    const missingFields = [];

    if (!startupName) {
      missingFields.push("name or startup_name");
    }

    if (!founder) {
      missingFields.push("founder or founder_name");
    }

    if (!email) {
      missingFields.push("email");
    }

    if (!project) {
      missingFields.push("project, description, name, or startup_name");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required application fields",
          missingFields,
        },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const score = calculateFitScore(startupName, project, links);
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

    const insertPayload: ApplicationInsertPayload = {
      founder_name: founder,
      startup_name: startupName,
      email,
      stage,
      fit_score: score,
      status: "pending",
      name: startupName,
      founder,
      links: links || null,
      project,
      score,
      tier,
    };

    console.info("APPLICATION INSERT PAYLOAD:", insertPayload);

    const { data, error } = await supabase
      .from("applications")
      .insert([insertPayload]);

    console.info("SUPABASE APPLICATION INSERT RESPONSE:", {
      data,
      error,
    });

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    const { error: logError } = await supabase.from("logs").insert([
      {
        source: "WAITLIST_SVC",
        message: `New startup application received: ${startupName} (Score: ${score}/100)`,
        type: "success",
      },
    ]);

    if (logError) {
      console.error("SUPABASE LOG INSERT ERROR:", logError);
    }

    return NextResponse.json({
      success: true,
      persisted: true,
      data: {
        name: startupName,
        founder,
        email,
        links,
        project,
        score,
        tier,
        status: "pending",
      },
    });
  } catch (error) {
    logStackTrace("APPLICATION POST ERROR:", error);
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
    const { id, status } = await request.json();
    const applicationId = cleanString(id);
    const nextStatus = parseStatus(status);

    if (!applicationId || !nextStatus) {
      return NextResponse.json(
        { error: "Valid id and status are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      const appIdx = fallbackApplications.findIndex(
        (app) => app.id === applicationId
      );

      if (appIdx === -1) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }

      fallbackApplications[appIdx] = {
        ...fallbackApplications[appIdx],
        status: nextStatus,
      };

      return NextResponse.json({
        success: true,
        mocked: true,
        data: fallbackApplications[appIdx],
      });
    }

    const { data, error } = await supabase
      .from("applications")
      .update({ status: nextStatus })
      .eq("id", applicationId)
      .select("id,name,founder,email,links,project,score,tier,status,created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const actionName =
      nextStatus === "approved" ? "Approved" : "Rejected/Waitlisted";

    await supabase.from("logs").insert([
      {
        source: "ADMIN_CONSOLE",
        message: `${actionName} application for '${data.name}'.`,
        type: nextStatus === "approved" ? "success" : "warning",
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
