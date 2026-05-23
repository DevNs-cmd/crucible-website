import { NextResponse } from "next/server";
import { getCurrentAccessGrant } from "@/lib/access";
import { getSupabaseAdminClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error";
}

export async function GET() {
  try {
    // 1. Verify access session
    const grant = await getCurrentAccessGrant();
    if (!grant) {
      return NextResponse.json(
        { success: false, error: "Access session not found. Please log in." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database configuration error." },
        { status: 500 }
      );
    }

    // 2. Fetch projects matching the user's verified access email
    const { data, error } = await supabase
      .from("user_projects")
      .select("id, repo_name, file_path, code_content, last_synced_at, created_at, updated_at")
      .eq("email", grant.email)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Format fields to camelCase for the frontend UI
    const projects = (data || []).map((row) => ({
      id: row.id,
      repoName: row.repo_name,
      filePath: row.file_path,
      codeContent: row.code_content,
      lastSyncedAt: row.last_synced_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verify access session
    const grant = await getCurrentAccessGrant();
    if (!grant) {
      return NextResponse.json(
        { success: false, error: "Access session not found. Please log in." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database configuration error." },
        { status: 500 }
      );
    }

    // 2. Parse request parameters
    const body = await request.json().catch(() => ({}));
    const repoName = typeof body.repoName === "string" ? body.repoName.trim() : "";
    const filePath = typeof body.filePath === "string" ? body.filePath.trim() : "";
    const codeContent = typeof body.codeContent === "string" ? body.codeContent : "";

    if (!repoName) {
      return NextResponse.json(
        { success: false, error: "Repository name is required." },
        { status: 400 }
      );
    }

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: "File path is required." },
        { status: 400 }
      );
    }

    // 3. Upsert the file content
    const { data, error } = await supabase
      .from("user_projects")
      .upsert(
        {
          email: grant.email,
          repo_name: repoName,
          file_path: filePath,
          code_content: codeContent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email, repo_name, file_path" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Local state saved in database.",
      data: {
        id: data.id,
        repoName: data.repo_name,
        filePath: data.file_path,
        codeContent: data.code_content,
        updatedAt: data.updated_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
