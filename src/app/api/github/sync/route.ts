import { NextResponse } from "next/server";
import { getCurrentAccessGrant } from "@/lib/access";
import { getSupabaseAdminClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error";
}

// Helper to make authenticated GitHub requests
async function fetchGitHub(path: string, token: string, options: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `https://api.github.com${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "Crucible-Sync-App",
      ...options.headers,
    },
  });
  return response;
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

    // 2. Parse request body
    const body = await request.json().catch(() => ({}));
    const repoName = typeof body.repoName === "string" ? body.repoName.trim() : "";
    const filePath = typeof body.filePath === "string" ? body.filePath.trim() : "";
    const codeContent = typeof body.codeContent === "string" ? body.codeContent : "";
    
    // Fall back to server environment variable if no token supplied in request
    const githubToken = (typeof body.githubToken === "string" && body.githubToken.trim()) 
      ? body.githubToken.trim() 
      : process.env.GITHUB_PERSONAL_ACCESS_TOKEN || "";

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

    if (!githubToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: "GitHub Personal Access Token is required to sync changes. Please enter one in the settings section." 
        },
        { status: 400 }
      );
    }

    // 3. Save locally to Supabase database first
    const { error: dbError } = await supabase
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
      );

    if (dbError) {
      return NextResponse.json(
        { success: false, error: `Local database save failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 4. Authenticate against GitHub and get user login
    const userRes = await fetchGitHub("/user", githubToken);
    if (!userRes.ok) {
      const errorText = await userRes.text();
      return NextResponse.json(
        { 
          success: false, 
          error: "Could not authenticate with GitHub. Please check your Personal Access Token.",
          details: errorText 
        },
        { status: 401 }
      );
    }
    const userData = await userRes.json();
    const username = userData.login;

    // 5. Check if repository already exists on GitHub
    const repoCheckRes = await fetchGitHub(`/repos/${username}/${repoName}`, githubToken);
    let repoExists = repoCheckRes.ok;
    let isNewRepo = false;

    // 6. If repository does not exist, create it dynamically
    if (!repoExists) {
      if (repoCheckRes.status === 404) {
        const createRepoRes = await fetchGitHub("/user/repos", githubToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: repoName,
            private: true,
            auto_init: true,
            description: "Crucible Project workspace dynamically synced from web portal.",
          }),
        });

        if (!createRepoRes.ok) {
          const createError = await createRepoRes.text();
          return NextResponse.json(
            { 
              success: false, 
              error: `GitHub repository creation failed: ${createRepoRes.statusText}`, 
              details: createError 
            },
            { status: 500 }
          );
        }

        isNewRepo = true;
        repoExists = true;

        // Give GitHub's systems 2 seconds to provision and initialize the new repository
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        return NextResponse.json(
          { success: false, error: `Error checking repository: ${repoCheckRes.statusText}` },
          { status: repoCheckRes.status }
        );
      }
    }

    // 7. Check if file already exists in repository to get its blob SHA (required for file updates)
    const fileCheckRes = await fetchGitHub(`/repos/${username}/${repoName}/contents/${filePath}`, githubToken);
    let fileSha: string | undefined = undefined;

    if (fileCheckRes.ok) {
      const fileData = await fileCheckRes.json();
      if (!Array.isArray(fileData) && fileData.type === "file") {
        fileSha = fileData.sha;
      }
    }

    // 8. Commit and push the file contents to GitHub
    const base64Content = Buffer.from(codeContent).toString("base64");
    const commitMessage = fileSha 
      ? `Update ${filePath} from Crucible Dashboard Editor`
      : `Initialize ${filePath} from Crucible Dashboard Editor`;

    const commitRes = await fetchGitHub(`/repos/${username}/${repoName}/contents/${filePath}`, githubToken, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        sha: fileSha, // Required to edit existing files, omitted for new files
      }),
    });

    if (!commitRes.ok) {
      const commitError = await commitRes.text();
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to commit changes to GitHub: ${commitRes.statusText}`, 
          details: commitError 
        },
        { status: 500 }
      );
    }

    const commitData = await commitRes.json();
    const repoUrl = `https://github.com/${username}/${repoName}`;
    const fileUrl = `${repoUrl}/blob/main/${filePath}`;

    // 9. Update last_synced_at time in Supabase database
    await supabase
      .from("user_projects")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("email", grant.email)
      .eq("repo_name", repoName)
      .eq("file_path", filePath);

    return NextResponse.json({
      success: true,
      message: isNewRepo 
        ? "New GitHub repository created and file committed successfully!" 
        : "File synced to existing GitHub repository successfully!",
      data: {
        isNewRepo,
        repoUrl,
        fileUrl,
        commitSha: commitData.commit.sha,
        commitUrl: commitData.commit.html_url,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
