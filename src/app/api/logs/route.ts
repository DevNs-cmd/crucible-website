import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdminClient } from "@/lib/supabaseServer";

type LogType = "info" | "success" | "warning" | "error";

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: LogType;
}

let fallbackLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "22:42:01",
    source: "ALGOFORCE_GRID",
    message: "Node 12 auto-scaled to meet H100 GPU compute spike.",
    type: "info",
  },
  {
    id: "2",
    timestamp: "22:40:15",
    source: "WAITLIST_SVC",
    message: "New application received from AuraAI (Score: 94/100).",
    type: "success",
  },
  {
    id: "3",
    timestamp: "22:35:12",
    source: "BROADCAST_TWR",
    message: "Weekly ecosystem digest sent successfully to 1,420 members.",
    type: "success",
  },
  {
    id: "4",
    timestamp: "22:15:40",
    source: "SECURITY_AUTH",
    message: "Admin role initialized with cryptographically signed token.",
    type: "info",
  },
];

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLogType(value: unknown): LogType {
  const type = cleanString(value);

  if (
    type === "info" ||
    type === "success" ||
    type === "warning" ||
    type === "error"
  ) {
    return type;
  }

  return "info";
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
        data: fallbackLogs,
      });
    }

    const { data, error } = await supabase
      .from("logs")
      .select("id,created_at,source,message,type")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((item) => ({
      id: item.id,
      timestamp: new Date(item.created_at).toLocaleTimeString("en-US", {
        hour12: false,
      }),
      source: item.source,
      message: item.message,
      type: parseLogType(item.type),
    }));

    return NextResponse.json({ success: true, data: formatted });
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
    const { source, message, type } = await request.json();
    const logSource = cleanString(source);
    const logMessage = cleanString(message);
    const logType = parseLogType(type);

    if (!logSource || !logMessage) {
      return NextResponse.json(
        { error: "Source and message are required" },
        { status: 400 }
      );
    }

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      source: logSource,
      message: logMessage,
      type: logType,
    };

    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      fallbackLogs = [newLog, ...fallbackLogs].slice(0, 30);
      return NextResponse.json({
        success: true,
        mocked: true,
        data: newLog,
      });
    }

    const { data, error } = await supabase
      .from("logs")
      .insert([
        {
          source: logSource,
          message: logMessage,
          type: logType,
        },
      ])
      .select("id,created_at,source,message,type")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
