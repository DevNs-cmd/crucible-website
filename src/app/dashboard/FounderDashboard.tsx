"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Cpu, 
  CheckCircle, 
  LogOut, 
  Code, 
  Plus, 
  Check, 
  Save, 
  Loader2, 
  ArrowUpRight, 
  ShieldAlert, 
  Sparkles, 
  FolderCode,
  FileCode2,
  GitBranch,
  RefreshCw
} from "lucide-react";

// Inline Github SVG component to ensure maximum package compatibility
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface AccessGrant {
  email: string;
  name: string | null;
  label: string;
  tier: string;
  codeHint: string;
  redeemedAt: string;
  expiresAt: string;
  maxRedemptions: number;
  redemptionCount: number;
}

interface FounderDashboardProps {
  grant: AccessGrant;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getComputeQuota(tier: string) {
  switch (tier) {
    case "Elite Resident":
    case "Founder":
      return { used: 2450, total: 5000 };
    case "Incubator":
    case "Crucible Studio":
      return { used: 1220, total: 2500 };
    case "Maker":
      return { used: 360, total: 900 };
    default:
      return { used: 120, total: 300 };
  }
}

export default function FounderDashboard({ grant }: FounderDashboardProps) {
  const [signingOut, setSigningOut] = useState(false);
  const quota = getComputeQuota(grant.tier);
  const usedPct = Math.min(100, Math.round((quota.used / quota.total) * 100));
  const displayName = grant.name || grant.email.split("@")[0] || "Founder";

  // Code Sync Workspace State
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Form states for creating a new file
  const [showNewFileForm, setShowNewFileForm] = useState(false);
  const [newRepoName, setNewRepoName] = useState("crucible-sandbox");
  const [newFilePath, setNewFilePath] = useState("index.html");
  
  // Editor states
  const [editorContent, setEditorContent] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [saveTokenLocal, setSaveTokenLocal] = useState(true);
  
  // Status & Log states for the Sync HUD
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "checking" | "initializing" | "committing" | "success" | "error">("idle");
  const [syncError, setSyncError] = useState("");
  const [syncResult, setSyncResult] = useState<any>(null);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Load projects and stored token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("crucible_github_token");
    if (savedToken) {
      setGithubToken(savedToken);
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch("/api/github/projects");
      const json = await res.json();
      if (json.success && json.data) {
        setProjects(json.data);
        if (json.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(json.data[0].id);
          setEditorContent(json.data[0].codeContent);
        }
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSelectProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setSelectedProjectId(projectId);
      setEditorContent(proj.codeContent);
      setSyncStatus("idle");
      setSyncResult(null);
      setSyncLogs([]);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim() || !newFilePath.trim()) return;

    try {
      setSyncStatus("saving");
      setSyncLogs(["💾 Creating local record in Supabase..."]);
      const res = await fetch("/api/github/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: newRepoName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
          filePath: newFilePath.trim(),
          codeContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Crucible Sandbox App</title>
  <style>
    body {
      background: #020617;
      color: #f8fafc;
      font-family: monospace;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
    }
    h1 {
      color: #f59e0b;
      letter-spacing: -0.05em;
    }
  </style>
</head>
<body>
  <h1>Crucible Project Provisioned.</h1>
  <p>Dynamic deployment push to GitHub succeeded.</p>
</body>
</html>`,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setProjects((prev) => [json.data, ...prev]);
        setSelectedProjectId(json.data.id);
        setEditorContent(json.data.codeContent);
        setShowNewFileForm(false);
        setSyncStatus("idle");
        setSyncLogs([]);
        setNewRepoName("crucible-sandbox");
        setNewFilePath("index.html");
      } else {
        setSyncStatus("error");
        setSyncError(json.error || "Failed to create local record.");
      }
    } catch (err: any) {
      setSyncStatus("error");
      setSyncError(err.message || "Failed to create local record.");
    }
  };

  const handleSaveLocal = async () => {
    const selected = projects.find((p) => p.id === selectedProjectId);
    if (!selected) return;

    try {
      setSyncStatus("saving");
      setSyncLogs(["💾 Saving changes locally in Supabase database..."]);
      const res = await fetch("/api/github/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: selected.repoName,
          filePath: selected.filePath,
          codeContent: editorContent,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProjectId ? json.data : p))
        );
        setSyncStatus("idle");
        setSyncLogs(["✅ Local state saved successfully!"]);
        setTimeout(() => setSyncLogs([]), 3000);
      } else {
        setSyncStatus("error");
        setSyncError(json.error || "Failed to save local state.");
      }
    } catch (err: any) {
      setSyncStatus("error");
      setSyncError(err.message || "Failed to save local state.");
    }
  };

  const handleSyncGithub = async () => {
    const selected = projects.find((p) => p.id === selectedProjectId);
    if (!selected) return;

    if (!githubToken.trim()) {
      setSyncStatus("error");
      setSyncError("GitHub Personal Access Token is required. Paste it below.");
      return;
    }

    if (saveTokenLocal) {
      localStorage.setItem("crucible_github_token", githubToken.trim());
    } else {
      localStorage.removeItem("crucible_github_token");
    }

    try {
      setSyncStatus("saving");
      setSyncLogs([
        "💾 Step 1: Saving latest code snapshot to Supabase database...",
      ]);

      const res = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: selected.repoName,
          filePath: selected.filePath,
          codeContent: editorContent,
          githubToken: githubToken.trim(),
        }),
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProjectId ? { ...p, codeContent: editorContent } : p
        )
      );

      setSyncLogs((prev) => [
        ...prev,
        "🔍 Step 2: Contacting GitHub API to verify repository...",
      ]);

      const json = await res.json();
      if (!json.success) {
        setSyncStatus("error");
        setSyncError(json.error || "Synchronization pipeline failed.");
        setSyncLogs((prev) => [...prev, `❌ Error: ${json.error || "Sync failed"}`]);
        return;
      }

      if (json.data.isNewRepo) {
        setSyncLogs((prev) => [
          ...prev,
          "🚀 Step 3: Repository not found on GitHub. Dynamically created new private repository!",
          "📦 Step 4: Compiling files and pushing git commit contents...",
        ]);
      } else {
        setSyncLogs((prev) => [
          ...prev,
          "📂 Step 3: Target repository verified on GitHub.",
          "📦 Step 4: Comparing changes and pushing git commit contents...",
        ]);
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSyncStatus("success");
      setSyncResult(json.data);
      setSyncLogs((prev) => [
        ...prev,
        `✅ Step 5: Synced successfully! File committed at SHA: ${json.data.commitSha.slice(0, 7)}`,
      ]);

      fetchProjects();
    } catch (err: any) {
      setSyncStatus("error");
      setSyncError(err.message || "Failed to complete synchronizer pipeline.");
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  const stats = [
    {
      title: "Ecosystem Level",
      val: `${grant.tier} // Active`,
      desc: `Access code ending ${grant.codeHint} verified by Crucible.`,
    },
    {
      title: "Allocated Compute",
      val: `${quota.used.toLocaleString()} / ${quota.total.toLocaleString()} hrs`,
      desc: "Shared compute quota assigned to your access tier.",
    },
    {
      title: "Active Program",
      val: grant.label,
      desc: `Session expires ${formatDate(grant.expiresAt)}.`,
    },
  ];

  const upcomingChecklist = [
    {
      title: "Complete Founder Profile",
      time: `Authenticated as ${grant.email}`,
      status: "PENDING",
    },
    {
      title: "Book Crucible Onboarding",
      time: "Available after portal activation",
      status: "PENDING",
    },
    {
      title: "Redeem Team Access Code",
      time: `Completed ${formatDate(grant.redeemedAt)}`,
      status: "COMPLETED",
    },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    await fetch("/api/access", { method: "DELETE" }).catch(() => {});
    window.location.href = "/access";
  };

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative flex flex-col gap-12">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber" />
              <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
                FOUNDER PORTAL // {grant.tier}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
            >
              WELCOME, <br />
              <span className="text-gradient-amber-gold">{displayName}.</span>
            </motion.h1>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-fit px-4 py-3 rounded-xl border border-red-500/10 bg-white hover:bg-red-50 text-red-500 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{signingOut ? "Closing..." : "Close Access"}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between min-h-44"
            >
              <div>
                <span className="text-xs font-mono font-bold text-crucible-slate/60 uppercase tracking-widest">
                  {stat.title}
                </span>
                <h3 className="text-xl font-mono font-black text-crucible-navy mt-2 uppercase leading-tight">
                  {stat.val}
                </h3>
              </div>
              <p className="text-xxs font-medium text-crucible-slate/80 leading-normal border-t border-crucible-navy/5 pt-3 mt-3">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Code Sync Workspace Component */}
        <div className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm relative overflow-hidden flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 glow-amber-radial opacity-20 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-crucible-navy/5 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crucible-amber opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-crucible-amber"></span>
                </span>
                <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                  Workspace Code Synchronizer.
                </h3>
              </div>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">
                Write code in the sandbox below, commit it to Supabase locally, and dynamically sync it with GitHub. 
                If the repository doesn&apos;t exist on your GitHub, the synchronizer will automatically initialize it as a private repository.
              </p>
            </div>
            
            <button
              onClick={() => setShowNewFileForm(!showNewFileForm)}
              className="w-fit self-start px-4 py-2.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:border-crucible-amber flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New File</span>
            </button>
          </div>

          {/* New File Creation Panel */}
          {showNewFileForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleCreateFile}
              className="p-5 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 flex flex-col md:flex-row gap-4 items-end"
            >
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-crucible-navy/60 uppercase">
                  Target GitHub Repository Name
                </label>
                <div className="relative">
                  <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crucible-navy/40" />
                  <input
                    type="text"
                    required
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    placeholder="e.g., my-awesome-project"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-crucible-navy/10 text-xs font-mono tracking-tight outline-none focus:border-crucible-amber focus:ring-1 focus:ring-crucible-amber/20"
                  />
                </div>
              </div>

              <div className="flex-grow flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-crucible-navy/60 uppercase">
                  Target File Path (inside Repo)
                </label>
                <div className="relative">
                  <FileCode2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crucible-navy/40" />
                  <input
                    type="text"
                    required
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    placeholder="e.g., src/index.html"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-crucible-navy/10 text-xs font-mono tracking-tight outline-none focus:border-crucible-amber focus:ring-1 focus:ring-crucible-amber/20"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-crucible-navy border border-crucible-navy text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-crucible-amber hover:border-crucible-amber transition-all cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewFileForm(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-crucible-navy/10 text-crucible-navy/60 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Main workspace editor and file tree split panel */}
          {loadingProjects ? (
            <div className="min-h-56 flex flex-col justify-center items-center gap-2">
              <Loader2 className="w-8 h-8 text-crucible-amber animate-spin" />
              <span className="text-xxs font-mono font-bold text-crucible-slate/60 uppercase tracking-widest">
                Retrieving local repositories...
              </span>
            </div>
          ) : projects.length === 0 ? (
            <div className="min-h-56 border border-dashed border-crucible-navy/10 rounded-2xl flex flex-col justify-center items-center gap-4 bg-crucible-bg/20 p-6 text-center">
              <FolderCode className="w-10 h-10 text-crucible-navy/30" />
              <div>
                <h5 className="text-xs font-mono font-black text-crucible-navy uppercase mb-1">
                  Workspace is Empty
                </h5>
                <p className="text-xxs font-semibold text-crucible-slate/70 max-w-sm">
                  Get started by provisioning your first repository and code file using the &quot;New File&quot; button above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              
              {/* Directory Explorer Panel */}
              <div className="lg:col-span-1 rounded-2xl bg-crucible-bg/40 border border-crucible-navy/5 p-4 flex flex-col gap-3 min-h-[300px]">
                <span className="text-[9px] font-mono font-bold text-crucible-slate/60 uppercase tracking-widest block border-b border-crucible-navy/5 pb-2">
                  Directory Listing
                </span>
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[400px]">
                  {projects.map((proj) => {
                    const isSelected = proj.id === selectedProjectId;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => handleSelectProject(proj.id)}
                        className={`w-full text-left p-3 rounded-xl border flex flex-col gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white border-crucible-navy shadow-sm"
                            : "bg-transparent border-transparent hover:bg-white/50 text-crucible-slate"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <GithubIcon className="w-3.5 h-3.5 text-crucible-navy/60" />
                          <span className="text-xxs font-mono font-black text-crucible-navy uppercase truncate">
                            {proj.repoName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 pl-5">
                          <Code className="w-3 h-3 text-crucible-amber/80" />
                          <span className="text-[10px] font-mono text-crucible-slate truncate">
                            {proj.filePath}
                          </span>
                        </div>
                        {proj.lastSyncedAt && (
                          <span className="text-[8px] pl-5 font-mono text-green-600 font-bold uppercase tracking-tight mt-0.5">
                            Synced {formatDate(proj.lastSyncedAt)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monospaced Editor and Control Area */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                
                {/* Editor Container */}
                <div className="flex-grow flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden min-h-[380px]">
                  <div className="bg-zinc-900 px-5 py-3 border-b border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-zinc-400 font-bold uppercase tracking-wider">
                        {currentProject?.repoName} / {currentProject?.filePath}
                      </span>
                    </div>
                    <div className="text-[9px] text-zinc-500">
                      LINES: {editorContent.split("\n").length} // CHARS: {editorContent.length}
                    </div>
                  </div>
                  
                  {/* Textarea Area */}
                  <div className="flex-grow flex relative font-mono text-[11px] leading-relaxed">
                    <div className="w-10 bg-zinc-900 border-r border-zinc-800 text-zinc-600 text-right pr-2 py-4 select-none flex flex-col font-bold">
                      {Array.from({ length: Math.max(1, editorContent.split("\n").length) }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <textarea
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      className="flex-grow bg-zinc-950 text-zinc-200 px-4 py-4 resize-none outline-none font-mono tracking-wide min-h-[320px] focus:ring-0 leading-6"
                      spellCheck="false"
                      placeholder="// Write code here..."
                    />
                  </div>
                </div>

                {/* GitHub Authentication Credentials Fields */}
                <div className="p-5 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono font-bold text-crucible-navy/60 uppercase">
                        GitHub Personal Access Token (PAT)
                      </label>
                      <Link 
                        href="https://github.com/settings/tokens/new?scopes=repo" 
                        target="_blank"
                        className="text-[8px] font-mono font-bold text-crucible-amber hover:underline uppercase flex items-center gap-0.5"
                      >
                        <span>Generate Token</span>
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-crucible-navy/10 text-xs font-mono tracking-tight outline-none focus:border-crucible-amber focus:ring-1 focus:ring-crucible-amber/20"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3.5 select-none">
                    <input
                      type="checkbox"
                      id="saveToken"
                      checked={saveTokenLocal}
                      onChange={(e) => setSaveTokenLocal(e.target.checked)}
                      className="rounded text-crucible-amber border-crucible-navy/10 focus:ring-crucible-amber"
                    />
                    <label htmlFor="saveToken" className="text-[9px] font-mono font-bold text-crucible-navy/60 uppercase cursor-pointer">
                      Auto-Save Token
                    </label>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={handleSaveLocal}
                      disabled={syncStatus !== "idle" && syncStatus !== "success" && syncStatus !== "error"}
                      className="flex-1 md:flex-none px-4 py-3 rounded-xl border border-crucible-navy/10 bg-white hover:bg-gray-50 text-crucible-navy text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Local</span>
                    </button>
                    
                    <button
                      onClick={handleSyncGithub}
                      disabled={syncStatus !== "idle" && syncStatus !== "success" && syncStatus !== "error"}
                      className="flex-1 md:flex-none px-5 py-3 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all hover:bg-crucible-amber hover:border-crucible-amber cursor-pointer disabled:opacity-60"
                    >
                      {syncStatus === "saving" || syncStatus === "checking" || syncStatus === "initializing" || syncStatus === "committing" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <GithubIcon className="w-3.5 h-3.5" />
                      )}
                      <span>Sync GitHub</span>
                    </button>
                  </div>
                </div>

                {/* Progress and HUD console log */}
                {(syncLogs.length > 0 || syncStatus === "error" || syncStatus === "success") && (
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-zinc-300 font-bold border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-crucible-amber" />
                        <span className="uppercase">Synchronizer Execution Log</span>
                      </div>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full border ${
                        syncStatus === "success" 
                          ? "border-green-800 bg-green-950 text-green-400"
                          : syncStatus === "error"
                            ? "border-red-800 bg-red-950 text-red-400"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400 animate-pulse"
                      }`}>
                        {syncStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {syncLogs.map((log, index) => (
                        <div key={index} className="leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>

                    {syncStatus === "error" && (
                      <div className="p-3 rounded-xl border border-red-900/50 bg-red-950/20 text-red-400 flex gap-2 items-start mt-2">
                        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold uppercase text-[9px] mb-0.5">Execution Interrupted</div>
                          <p>{syncError}</p>
                        </div>
                      </div>
                    )}

                    {syncStatus === "success" && syncResult && (
                      <div className="p-4 rounded-xl border border-green-950 bg-green-950/20 text-green-400 flex flex-col gap-2 mt-2">
                        <div className="font-bold uppercase text-[9px] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-crucible-amber" />
                          <span>Synchronization Pipeline Complete</span>
                        </div>
                        <div className="flex flex-col gap-1 text-[9px] text-zinc-400 mt-1">
                          <div>
                            <span className="font-bold text-zinc-300 uppercase">Target Repository:</span>{" "}
                            <a href={syncResult.repoUrl} target="_blank" rel="noreferrer" className="text-crucible-amber hover:underline inline-flex items-center gap-0.5">
                              {syncResult.repoUrl}
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                          <div>
                            <span className="font-bold text-zinc-300 uppercase">Synced File Path:</span>{" "}
                            <a href={syncResult.fileUrl} target="_blank" rel="noreferrer" className="text-crucible-amber hover:underline inline-flex items-center gap-0.5">
                              {currentProject?.filePath}
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                          <div>
                            <span className="font-bold text-zinc-300 uppercase">Git Commit SHA:</span>{" "}
                            <span className="font-mono text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">{syncResult.commitSha}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Existing lower dashboard checklist & Compute grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm">
            <h3 className="text-lg font-mono font-black text-crucible-navy uppercase mb-6">
              Action Checklist.
            </h3>

            <div className="flex flex-col gap-4">
              {upcomingChecklist.map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl border border-crucible-navy/5 bg-crucible-bg/30 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        item.status === "COMPLETED"
                          ? "text-crucible-amber"
                          : "text-crucible-navy/20"
                      }`}
                    />
                    <div>
                      <h5 className="text-xs font-mono font-black text-crucible-navy uppercase">
                        {item.title}
                      </h5>
                      <span className="text-xxs font-semibold text-crucible-slate/70 font-sans">
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded-full border ${
                      item.status === "COMPLETED"
                        ? "border-crucible-amber/20 bg-crucible-amber/10 text-crucible-amber"
                        : "border-crucible-navy/10 bg-white text-crucible-navy/60"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-mono font-black text-crucible-navy uppercase mb-6">
                Active Compute Node.
              </h3>
              <div className="p-5 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 font-mono text-[10px] tracking-wide text-crucible-slate flex flex-col gap-3">
                <div className="flex justify-between items-center text-crucible-navy font-bold">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-crucible-amber" />
                    <span>ALGOFORCE H100 GRID</span>
                  </div>
                  <span className="text-crucible-amber font-mono text-[9px]">
                    ACTIVE
                  </span>
                </div>
                <div className="w-full h-[2px] bg-crucible-navy/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-crucible-amber"
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono text-xxs font-bold text-crucible-slate/60">
                  <span>USED: {quota.used.toLocaleString()} hrs</span>
                  <span>TOTAL: {quota.total.toLocaleString()} hrs</span>
                </div>
              </div>
            </div>

            <Link
              href="/ailabs"
              className="w-full py-4 mt-8 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Enter Web Sandbox</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
