import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  getSupabaseAdminClient,
  getSupabaseWriteClient,
} from "@/lib/supabaseServer";

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

let fallbackApplications: Application[] = [
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
    const body = await request.json();
    const name = cleanString(body.name);
    const founder = cleanString(body.founder) || name;
    const email = cleanEmail(body.email);
    const links = cleanString(body.links);
    const project =
      cleanString(body.project) ||
      cleanString(body.description) ||
      "Application submitted without a project brief.";
    const tier = parseTier(body.tier);

    if (!name || !email || !isEmail(email)) {
      return NextResponse.json(
        { error: "Name and a valid email are required" },
        { status: 400 }
      );
    }

    const score = calculateFitScore(name, project, links);
    const fallbackApplication: Application = {
      id: `app-${Date.now()}`,
      name,
      founder,
      email,
      links,
      project,
      score,
      tier,
      status: "pending",
    };

    const supabase = getSupabaseWriteClient();

    if (!supabase) {
      fallbackApplications = [fallbackApplication, ...fallbackApplications];
      return NextResponse.json({
        success: true,
        mocked: true,
        data: fallbackApplication,
      });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          name,
          founder,
          email,
          links: links || null,
          project,
          score,
          tier,
          status: "pending",
        },
      ])
      .select("id,name,founder,email,links,project,score,tier,status,created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("logs").insert([
      {
        source: "WAITLIST_SVC",
        message: `New startup application received: ${name} (Score: ${score}/100)`,
        type: "success",
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
