"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseBrowserConfigured, supabase } from "@/lib/supabaseClient";
import { 
  Users, 
  Terminal, 
  Cpu, 
  Send, 
  Radio, 
  Check, 
  X, 
  Activity, 
  HardDrive, 
  Zap, 
  TrendingUp, 
  Lock,
  LogOut,
  AlertTriangle,
  Copy,
  KeyRound,
  Plus
} from "lucide-react";

type AdminTab = "analytics" | "applications" | "access" | "compute" | "broadcast";

interface Application {
  id: string;
  name: string;
  founder: string;
  email?: string;
  project: string;
  score: number;
  tier: "Elite Resident" | "Incubator" | "Core Builder";
  status: "pending" | "approved" | "rejected";
}

interface AccessCode {
  id: string;
  code_hint: string;
  label: string;
  assigned_email: string | null;
  tier: string;
  max_redemptions: number;
  redemption_count: number;
  status: "active" | "revoked" | "exhausted" | "expired";
  expires_at: string | null;
  created_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface AccessCodeCreatePayload {
  label: string;
  assignedEmail: string;
  tier: string;
  expiresAt?: string | null;
  notes?: string | null;
}

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

type AdminUser = Pick<User, "email" | "user_metadata">;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [broadcastTarget, setBroadcastTarget] = useState("all-founders");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Auth state
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [submittingAuth, setSubmittingAuth] = useState<boolean>(false);

  // Telemetry grid state
  const [applications, setApplications] = useState<Application[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [accessCodeForm, setAccessCodeForm] = useState({
    label: "",
    assignedEmail: "",
    tier: "Builder",
    expiresAt: "",
    notes: "",
  });
  const [latestAccessCode, setLatestAccessCode] = useState<{
    code: string;
    label: string;
    assignedEmail: string | null;
  } | null>(null);
  const [creatingAccessCode, setCreatingAccessCode] = useState(false);

  // Toast trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const getAdminFetchHeaders = useCallback(async (activeSession?: Session | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (
      process.env.NODE_ENV !== "production" &&
      localStorage.getItem("crucible_admin_bypass")
    ) {
      headers["x-crucible-dev-bypass"] = "enabled";
      return headers;
    }

    const resolvedSession =
      activeSession ?? session ?? (await supabase.auth.getSession()).data.session;

    if (resolvedSession?.access_token) {
      headers.Authorization = `Bearer ${resolvedSession.access_token}`;
    }

    return headers;
  }, [session]);

  // Load database content
  const fetchTelemetryData = useCallback(async (activeSession?: Session | null) => {
    try {
      const appRes = await fetch("/api/applications", {
        headers: await getAdminFetchHeaders(activeSession),
      });
      const appData = await appRes.json();
      if (appData.success) {
        setApplications(appData.data);
      }

      const logRes = await fetch("/api/logs", {
        headers: await getAdminFetchHeaders(activeSession),
      });
      const logData = await logRes.json();
      if (logData.success) {
        setLogs(logData.data);
      }

      const accessRes = await fetch("/api/access-codes", {
        headers: await getAdminFetchHeaders(activeSession),
      });
      const accessData = await accessRes.json();
      if (accessData.success) {
        setAccessCodes(accessData.data);
      }
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    }
  }, [getAdminFetchHeaders]);

  const handleAuthSession = useCallback((nextSession: Session | null) => {
    setSession(nextSession);

    if (nextSession?.user) {
      const email = nextSession.user.email || "";
      const authorizedEmailsStr =
        process.env.NEXT_PUBLIC_AUTHORIZED_ADMIN_EMAILS ||
        (process.env.NODE_ENV !== "production" ? "developer@nextgen.ai" : "");
      const allowedEmailsList = authorizedEmailsStr.split(",").map(e => e.trim().toLowerCase());

      if (allowedEmailsList.includes(email.toLowerCase())) {
        setUser(nextSession.user);
        setIsAuthorized(true);
        fetchTelemetryData(nextSession);
      } else {
        setUser(nextSession.user);
        setIsAuthorized(false);
      }
    } else {
      setUser(null);
      setSession(null);
      setIsAuthorized(false);
    }
    setAuthLoading(false);
  }, [fetchTelemetryData]);

  // Auth synchronization & Session handling
  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      await Promise.resolve();

      if (cancelled) return;

      const localBypass = localStorage.getItem("crucible_admin_bypass");
      if (localBypass) {
        setUser({
          email: "developer@nextgen.ai",
          user_metadata: { full_name: "Lead Developer" }
        });
        setSession(null);
        setIsAuthorized(true);
        setAuthLoading(false);
        fetchTelemetryData(null);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        handleAuthSession(data.session);
      }
    };

    void initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      handleAuthSession(nextSession);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchTelemetryData, handleAuthSession]);

  // Login handler
  const handleGoogleLogin = async () => {
    setSubmittingAuth(true);
    try {
      if (!isSupabaseBrowserConfigured) {
        triggerToast("Supabase publishable key is not configured yet.");
        setSubmittingAuth(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      if (error) throw error;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown auth error";
      triggerToast(`Authentication Request Failed: ${message}`);
      setSubmittingAuth(false);
    }
  };

  // Developer bypass bypasses OAuth settings for immediate preview testing
  const handleSimulateDevMode = () => {
    setSubmittingAuth(true);
    setTimeout(() => {
      localStorage.setItem("crucible_admin_bypass", "enabled");
      setUser({
        email: "developer@nextgen.ai",
        user_metadata: { full_name: "Sandbox Overlord" }
      });
      setSession(null);
      setIsAuthorized(true);
      setSubmittingAuth(false);
      fetchTelemetryData();
      triggerToast("Authorized inside Sandbox Overlord dashboard.");
    }, 8000);
  };

  // Logout handler
  const handleLogout = async () => {
    localStorage.removeItem("crucible_admin_bypass");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAuthorized(false);
    triggerToast("Admin security tunnel closed.");
  };

  const requestAccessCode = async (
    payload: AccessCodeCreatePayload,
    successMessage = "Access code created."
  ) => {
    const res = await fetch("/api/access-codes", {
      method: "POST",
      headers: await getAdminFetchHeaders(),
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      code?: string;
      data?: AccessCode;
      error?: string;
      success?: boolean;
    };

    if (!res.ok || !data.success || !data.code || !data.data) {
      triggerToast(data.error || "Access code creation failed.");
      return null;
    }

    setAccessCodes((prev) => [data.data as AccessCode, ...prev]);
    setLatestAccessCode({
      code: data.code,
      label: data.data.label,
      assignedEmail: data.data.assigned_email,
    });
    triggerToast(successMessage);
    return data;
  };

  const handleCreateAccessCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreatingAccessCode(true);

    try {
      const created = await requestAccessCode({
        label: accessCodeForm.label.trim() || "Crucible access grant",
        assignedEmail: accessCodeForm.assignedEmail.trim().toLowerCase(),
        tier: accessCodeForm.tier,
        expiresAt: accessCodeForm.expiresAt || null,
        notes: accessCodeForm.notes.trim() || null,
      });

      if (created) {
        setAccessCodeForm({
          label: "",
          assignedEmail: "",
          tier: "Builder",
          expiresAt: "",
          notes: "",
        });
        fetchTelemetryData();
      }
    } finally {
      setCreatingAccessCode(false);
    }
  };

  const handleAccessCodeStatus = async (
    id: string,
    status: AccessCode["status"]
  ) => {
    try {
      const res = await fetch("/api/access-codes", {
        method: "PATCH",
        headers: await getAdminFetchHeaders(),
        body: JSON.stringify({ id, status }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        data?: AccessCode;
        error?: string;
        success?: boolean;
      };

      if (res.ok && data.success && data.data) {
        setAccessCodes((prev) =>
          prev.map((code) => (code.id === id ? (data.data as AccessCode) : code))
        );
        triggerToast(`Access code marked ${status}.`);
        fetchTelemetryData();
      } else {
        triggerToast(data.error || "Failed to update access code.");
      }
    } catch {
      triggerToast("Access vault network timed out.");
    }
  };

  const handleCopyLatestCode = async () => {
    if (!latestAccessCode) return;

    try {
      await navigator.clipboard.writeText(latestAccessCode.code);
      triggerToast("Access code copied.");
    } catch {
      triggerToast(latestAccessCode.code);
    }
  };

  // Application Approvals
  const handleApprove = async (id: string, name: string) => {
    try {
      const application = applications.find((app) => app.id === id);
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: await getAdminFetchHeaders(),
        body: JSON.stringify({ id, status: "approved" })
      });
      if (res.ok) {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: "approved" } : app));
        if (application) {
          await requestAccessCode(
            {
              label: `${application.name} founder access`,
              assignedEmail: application.email || "",
              tier: application.tier,
              notes: `Generated after approving application ${application.id}.`,
            },
            `Application '${name}' approved and access code generated.`
          );
        } else {
          triggerToast(`Application '${name}' Approved!`);
        }
        fetchTelemetryData(); // Reload logs
      } else {
        triggerToast("Server rejected status transition request.");
      }
    } catch {
      triggerToast("Network link timed out.");
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: await getAdminFetchHeaders(),
        body: JSON.stringify({ id, status: "rejected" })
      });
      if (res.ok) {
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: "rejected" } : app));
        triggerToast(`Application '${name}' Waitlisted.`);
        fetchTelemetryData(); // Reload logs
      } else {
        triggerToast("Server rejected status transition request.");
      }
    } catch {
      triggerToast("Network link timed out.");
    }
  };

  // Broadcast Transmissions
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastContent) {
      triggerToast("Please fill in all broadcast fields.");
      return;
    }

    const targetName = broadcastTarget === "all-founders" ? "All Vetted Founders" : 
                       broadcastTarget === "waitlist" ? "All Waitlisted Applicants" : "AlgoForce Computing Group";

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: await getAdminFetchHeaders(),
        body: JSON.stringify({
          source: "BROADCAST_TWR",
          message: `Cryptographic broadcast '${broadcastSubject}' dispatched to [${targetName}].`,
          type: "success"
        })
      });
      if (res.ok) {
        triggerToast(`Ecosystem Broadcast Dispatched Successfully!`);
        setBroadcastSubject("");
        setBroadcastContent("");
        fetchTelemetryData(); // Reload logs
      } else {
        triggerToast("Failed to dispatch ecosystem broadcast.");
      }
    } catch {
      triggerToast("Broadcast network offline.");
    }
  };

  // Telemetry node sharding optimizer simulation
  const handleNodeShardOptimize = async () => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: await getAdminFetchHeaders(),
        body: JSON.stringify({
          source: "SYS_METRICS",
          message: "Manual compute allocation optimizer completed. Telemetry latency locked at 14ms.",
          type: "info"
        })
      });
      triggerToast("Compute grid optimized. Shards re-balanced.");
      fetchTelemetryData();
    } catch {
      triggerToast("Failed to optimization dispatch.");
    }
  };

  // Ticker simulation for background alerts if connected
  useEffect(() => {
    if (!isAuthorized) return;

    const timer = setInterval(async () => {
      const sources = ["ALGOFORCE_GRID", "SYS_METRICS", "NETWORK_EDGE", "COMPUTE_NODE"];
      const messages = [
        "Node telemetry sync complete. All systems nominal.",
        "GPU temperature normalized to 41.5°C across cluster.",
        "Pending cohort batch index updated dynamically.",
        "Telemetry latency optimized to 18ms grid-wide."
      ];
      const types: Array<LogEntry["type"]> = ["info", "success", "info"];

      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      fetch("/api/logs", {
        method: "POST",
        headers: await getAdminFetchHeaders(),
        body: JSON.stringify({ source, message, type })
      }).then(() => {
        fetchTelemetryData();
      }).catch(() => {});

    }, 20000); // Trigger slower interval to reduce network requests in sandboxes

    return () => clearInterval(timer);
  }, [fetchTelemetryData, getAdminFetchHeaders, isAuthorized]);

  // Loading phase rendering
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center tech-grid-bg bg-crucible-bg text-crucible-navy">
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-crucible-amber animate-spin" />
          <span className="font-mono text-xs font-bold tracking-widest uppercase opacity-75">
            Synchronizing admin telemetry tunnels...
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  // Login Gate Rendering
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-md mx-auto w-full z-10 relative flex flex-col justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] glow-amber-radial opacity-60 pointer-events-none" />

          <div className="p-8 md:p-12 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm relative overflow-hidden z-10 text-center">
            <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-40 pointer-events-none" />

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-crucible-bg/80 border border-crucible-navy/5 flex items-center justify-center text-crucible-amber relative">
                <Lock className="w-6 h-6 animate-pulse" />
                <div className="absolute inset-0 rounded-2xl border border-crucible-amber/20 animate-ping opacity-35" />
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase block mb-1">
              SECURE PORTAL ACCESS REQUIRED
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-none mb-4">
              Crucible Core.
            </h2>
            <p className="text-xxs font-semibold text-crucible-slate mb-8 leading-relaxed max-w-xs mx-auto">
              Please authenticate with Google to access the AlgoForce telemetry control dashboard, review cohorts, and dispatch server broadcasts.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={submittingAuth}
                className="w-full py-3.5 rounded-xl border border-crucible-navy/10 bg-white hover:bg-crucible-bg text-crucible-navy text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {/* Google Logo Icon SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.65 0 3.12.57 4.29 1.69l3.21-3.21C17.55 1.64 14.97 1 12 1 7.24 1 3.23 3.73 1.34 7.74l3.85 2.99C6.1 7.64 8.84 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.61z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.19 14.22c-.24-.74-.38-1.54-.38-2.37s.14-1.63.38-2.37L1.34 6.49C.49 8.19 0 10.04 0 12s.49 3.81 1.34 5.51l3.85-3.29z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.96-1.07 7.96-2.92l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.16 0-5.9-2.6-6.81-5.69L1.34 15.9C3.23 19.91 7.24 23 12 23z"
                  />
                </svg>
                <span>{submittingAuth ? "Connecting Flow..." : "Sign In with Google"}</span>
              </button>

              <div className="relative my-3 flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-crucible-navy/5" />
                <span className="relative px-3 bg-white font-mono text-[8px] font-bold text-crucible-slate/50 uppercase">
                  LOCAL SANDBOX
                </span>
              </div>

              <button
                onClick={handleSimulateDevMode}
                disabled={submittingAuth}
                className="w-full py-3 rounded-xl border border-crucible-amber bg-crucible-amber hover:bg-crucible-navy text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{submittingAuth ? "Booting Grid..." : "Simulate Dev Mode (Bypass)"}</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Unauthorized Account Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-md mx-auto w-full z-10 relative flex flex-col justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

          <div className="p-8 md:p-12 rounded-3xl bg-white border border-red-500/10 shadow-sm relative overflow-hidden z-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase block mb-1">
              ACCESS DECREED DENIED
            </span>
            <h2 className="text-2xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-none mb-4">
              Restricted Portal.
            </h2>
            <p className="text-xxs font-semibold text-crucible-slate mb-8 leading-relaxed max-w-xs mx-auto">
              Your account (**{user.email || "unknown account"}**) has authenticated successfully, but does not possess administrator clearance credentials. Please request key access permissions.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy hover:bg-crucible-amber hover:border-crucible-amber text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Account</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Authorized Admin Portal Rendering
  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl glass-panel-gold border-crucible-amber text-crucible-navy font-mono text-xs font-bold flex items-center gap-3 shadow-xl"
          >
            <Zap className="w-4 h-4 text-crucible-amber animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative flex flex-col gap-10">
        
        {/* Glow Effects */}
        <div className="absolute top-12 right-12 w-[500px] h-[500px] glow-amber-radial opacity-40 pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] glow-navy-radial opacity-50 pointer-events-none" />

        {/* 1. Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-crucible-navy/5 pb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber animate-ping" />
              <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
                ADMIN SECURE TUNNEL // {(user.email || "admin").toUpperCase()}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
            >
              CRUCIBLE <br />
              <span className="text-gradient-amber-gold">TELEMETRY GRID.</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-5 bg-white px-5 py-3.5 rounded-2xl border border-crucible-navy/5 shadow-sm"
          >
            <div className="flex items-center gap-3 font-mono text-[10px] text-crucible-slate border-r border-crucible-navy/5 pr-4">
              <Activity className="w-4 h-4 text-crucible-amber animate-pulse" />
              <div className="flex flex-col">
                <span className="font-bold text-crucible-navy uppercase">GRID CONNECTION SECURE</span>
                <span>LATENCY: 14ms // DB LINK: SUPABASE</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-red-500/10 hover:border-red-500 hover:bg-red-50 text-red-500 transition-all font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Disconnect</span>
            </button>
          </motion.div>
        </div>

        {/* 2. Global Core Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Cohort Founders", val: accessCodes.reduce((total, code) => total + code.redemption_count, 0).toString(), sub: "Redeemed Access Sessions", icon: Users },
            { label: "Total Applications", val: applications.length.toString(), sub: `Pending Review: ${applications.filter(app => app.status === "pending").length}`, icon: TrendingUp },
            { label: "H100 Active Clusters", val: "28 / 32 Nodes", sub: "AlgoForce Shared GPU", icon: Cpu },
            { label: "Access Codes", val: accessCodes.filter(code => code.status === "active").length.toString(), sub: `Total Issued: ${accessCodes.length}`, icon: KeyRound }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                key={idx}
                className="p-6 rounded-2xl bg-white border border-crucible-navy/5 shadow-sm flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-crucible-slate/60 uppercase tracking-widest block mb-1">
                    {stat.label}
                  </span>
                  <h3 className="text-2xl font-mono font-black text-crucible-navy">{stat.val}</h3>
                  <span className="text-[10px] text-crucible-slate/70 font-semibold">{stat.sub}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-crucible-bg/60 border border-crucible-navy/5 flex items-center justify-center text-crucible-amber">
                  <Icon className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. Operational Grid (Interactive Tab Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel - Tab Content */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Tab selection header */}
            <div className="p-1.5 rounded-2xl bg-white border border-crucible-navy/5 shadow-sm flex flex-wrap gap-1">
              {([
                { id: "analytics", label: "Analytics Matrix" },
                { id: "applications", label: "Pending Founders" },
                { id: "access", label: "Access Vault" },
                { id: "compute", label: "Compute Overlord" },
                { id: "broadcast", label: "Broadcast Tower" }
              ] satisfies Array<{ id: AdminTab; label: string }>).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-grow md:flex-grow-0 px-5 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-crucible-navy text-white shadow-md"
                      : "text-crucible-slate/75 hover:bg-crucible-bg hover:text-crucible-navy"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Render Tab Contents */}
            <div className="min-h-[420px]">
              {activeTab === "analytics" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-8"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      Telemetry Analytics.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Ecosystem metrics compiled from AlgoForce grid node networks.</p>
                  </div>

                  {/* Simulated charts using CSS styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Founder Activity */}
                    <div className="p-6 rounded-2xl bg-crucible-bg/30 border border-crucible-navy/5 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-crucible-navy/5 pb-2">
                        <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Ecosystem Velocity (Weekly)</span>
                        <span className="font-mono text-[9px] font-bold text-crucible-amber">+24.5%</span>
                      </div>
                      <div className="h-32 flex items-end justify-between gap-2.5 pt-4">
                        {[40, 55, 48, 70, 85, 62, 92].map((height, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full bg-crucible-navy/5 rounded-t-md relative h-full overflow-hidden">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 1, delay: 0.1 * idx }}
                                className="w-full bg-gradient-to-t from-crucible-amber to-crucible-gold absolute bottom-0 rounded-t-md"
                              />
                            </div>
                            <span className="font-mono text-[8px] font-bold text-crucible-slate/60">W0{idx+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compute allocations */}
                    <div className="p-6 rounded-2xl bg-crucible-bg/30 border border-crucible-navy/5 flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-crucible-navy/5 pb-2">
                        <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase">GPU Allocation Breakdown</span>
                        <span className="font-mono text-[9px] font-bold text-crucible-slate/75">87.5% Bound</span>
                      </div>
                      <div className="flex flex-col gap-3 pt-2">
                        {[
                          { label: "Elite Resident Clusters", pct: 60, val: "1,500 hrs" },
                          { label: "Incubator Nodes", pct: 25, val: "625 hrs" },
                          { label: "Core Sandbox Compute", pct: 15, val: "375 hrs" }
                        ].map((cItem, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-center font-mono text-[9px] font-bold">
                              <span className="text-crucible-slate/70">{cItem.label}</span>
                              <span className="text-crucible-navy">{cItem.val} ({cItem.pct}%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-crucible-navy/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${cItem.pct}%` }}
                                transition={{ duration: 0.8, delay: 0.2 * idx }}
                                className="h-full bg-crucible-navy"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Technical Spec Logs */}
                  <div className="p-6 rounded-2xl bg-crucible-navy text-[#FAF8F5] border border-white/5 font-mono text-[10px] flex flex-col gap-3.5 shadow-lg">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-crucible-amber" />
                        <span className="font-bold uppercase tracking-wider text-white">Ecosystem Diagnostics Matrix</span>
                      </div>
                      <span className="text-crucible-amber text-[9px] font-bold px-2 py-0.5 rounded-full bg-crucible-amber/15 border border-crucible-amber/25 uppercase">SECURE SHELL</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-white/50 block">AUTHENTICATED AS:</span>
                        <span className="font-bold text-white uppercase truncate block max-w-[200px]" title={user.email || "admin"}>
                          {user.email || "admin"}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/50 block">VAULT STORAGE:</span>
                        <span className="font-bold text-white uppercase">SUPABASE DATABASE (SSL)</span>
                      </div>
                      <div>
                        <span className="text-white/50 block">COHORT DURATION:</span>
                        <span className="font-bold text-white uppercase">12 MONTH CYCLES</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {activeTab === "applications" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      Pending Founder Applications.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Review incoming builders requesting ecosystem access and H100 compute pools.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                      {applications.filter(app => app.status === "pending").map(app => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.4 }}
                          key={app.id}
                          className="p-5 rounded-2xl border border-crucible-navy/5 bg-crucible-bg/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-crucible-navy/10 hover:bg-white transition-all duration-300"
                        >
                          <div className="max-w-xl">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono text-xs font-black text-crucible-navy uppercase">{app.name}</span>
                              <span className="text-[9px] font-mono text-crucible-slate/60 font-semibold">by {app.founder}</span>
                              {app.email && (
                                <span className="text-[9px] font-mono text-crucible-slate/60 font-semibold">
                                  {app.email}
                                </span>
                              )}
                              <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-crucible-navy/10 bg-white text-crucible-navy">
                                {app.tier}
                              </span>
                            </div>
                            <p className="text-xxs font-medium text-crucible-slate/90 leading-relaxed font-sans">
                              {app.project}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-crucible-navy/5 pt-3 md:pt-0">
                            <div className="text-right flex flex-col">
                              <span className="font-mono text-[8px] font-bold text-crucible-slate/50 uppercase tracking-wider">FIT SCORE</span>
                              <span className="font-mono text-sm font-black text-crucible-amber">{app.score}%</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleReject(app.id, app.name)}
                                className="w-9 h-9 rounded-xl border border-red-500/10 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-all duration-300 cursor-pointer"
                                title="Reject / Waitlist"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApprove(app.id, app.name)}
                                className="w-9 h-9 rounded-xl border border-crucible-amber/20 bg-crucible-amber/10 hover:bg-crucible-amber hover:text-white text-crucible-amber flex items-center justify-center transition-all duration-300 cursor-pointer"
                                title="Approve Entry"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {applications.filter(app => app.status === "pending").length === 0 && (
                      <div className="text-center py-12 border border-dashed border-crucible-navy/10 rounded-2xl bg-crucible-bg/30">
                        <span className="font-mono text-[10px] text-crucible-slate/50 uppercase font-bold">All pending applications reviewed. Telemetry queue clear.</span>
                      </div>
                    )}
                  </div>

                  {/* History of Decisions */}
                  {applications.filter(app => app.status !== "pending").length > 0 && (
                    <div className="border-t border-crucible-navy/5 pt-6 mt-2">
                      <h4 className="font-mono text-[10px] font-bold text-crucible-navy uppercase mb-3">Audit Logs (Decided Session batch)</h4>
                      <div className="flex flex-col gap-2">
                        {applications.filter(app => app.status !== "pending").map(app => (
                          <div key={app.id} className="flex justify-between items-center text-[10px] font-mono px-3 py-2 bg-white rounded-lg border border-crucible-navy/5">
                            <span className="text-crucible-navy font-bold">{app.name} ({app.founder})</span>
                            <span className={`font-bold uppercase text-[9px] ${app.status === "approved" ? "text-crucible-amber" : "text-red-500"}`}>
                              {app.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

              {activeTab === "access" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      Access Code Vault.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">
                      Generate team-issued codes and track redemptions into the founder portal.
                    </p>
                  </div>

                  {latestAccessCode && (
                    <div className="p-4 rounded-2xl border border-crucible-amber/25 bg-crucible-amber/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-crucible-slate/70">
                          Latest Code
                        </span>
                        <p className="font-mono text-lg font-black text-crucible-navy mt-1 tracking-widest">
                          {latestAccessCode.code}
                        </p>
                        <p className="text-[10px] font-semibold text-crucible-slate mt-1">
                          {latestAccessCode.label}
                          {latestAccessCode.assignedEmail
                            ? ` // ${latestAccessCode.assignedEmail}`
                            : ""}
                        </p>
                      </div>
                      <button
                        onClick={handleCopyLatestCode}
                        className="w-fit px-4 py-3 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-crucible-amber hover:border-crucible-amber flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                  )}

                  <form
                    onSubmit={handleCreateAccessCode}
                    className="p-5 rounded-2xl border border-crucible-navy/5 bg-crucible-bg/30 flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">
                          Label
                        </label>
                        <input
                          type="text"
                          placeholder="Cohort 05 founder access"
                          value={accessCodeForm.label}
                          onChange={(event) =>
                            setAccessCodeForm({
                              ...accessCodeForm,
                              label: event.target.value,
                            })
                          }
                          className="p-3 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-semibold focus:outline-none focus:border-crucible-amber font-sans"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">
                          User Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="founder@company.ai"
                          value={accessCodeForm.assignedEmail}
                          onChange={(event) =>
                            setAccessCodeForm({
                              ...accessCodeForm,
                              assignedEmail: event.target.value,
                            })
                          }
                          className="p-3 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-semibold focus:outline-none focus:border-crucible-amber font-sans"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">
                          Tier
                        </label>
                        <select
                          value={accessCodeForm.tier}
                          onChange={(event) =>
                            setAccessCodeForm({
                              ...accessCodeForm,
                              tier: event.target.value,
                            })
                          }
                          className="p-3 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-mono font-bold focus:outline-none focus:border-crucible-amber"
                        >
                          <option value="Builder">Builder</option>
                          <option value="Maker">Maker</option>
                          <option value="Founder">Founder</option>
                          <option value="Core Builder">Core Builder</option>
                          <option value="Incubator">Incubator</option>
                          <option value="Elite Resident">Elite Resident</option>
                          <option value="Crucible Studio">Crucible Studio</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl border border-crucible-navy/10 bg-white flex flex-col justify-center">
                          <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase">
                            Redemption Limit
                          </span>
                          <span className="text-[10px] font-semibold text-crucible-slate mt-1">
                            One code, one user, one redemption
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">
                            Expires
                          </label>
                          <input
                            type="date"
                            value={accessCodeForm.expiresAt}
                            onChange={(event) =>
                              setAccessCodeForm({
                                ...accessCodeForm,
                                expiresAt: event.target.value,
                              })
                            }
                            className="p-3 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-mono font-bold focus:outline-none focus:border-crucible-amber"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">
                        Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Internal context for this access grant"
                        value={accessCodeForm.notes}
                        onChange={(event) =>
                          setAccessCodeForm({
                            ...accessCodeForm,
                            notes: event.target.value,
                          })
                        }
                        className="p-3 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-semibold focus:outline-none focus:border-crucible-amber font-sans resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={creatingAccessCode}
                      className="w-fit px-5 py-3 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:border-crucible-amber flex items-center gap-2 transition-all duration-300 shadow-md cursor-pointer self-end disabled:opacity-60"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{creatingAccessCode ? "Creating..." : "Create Code"}</span>
                    </button>
                  </form>

                  <div className="flex flex-col gap-3">
                    {accessCodes.map((code) => (
                      <div
                        key={code.id}
                        className="p-4 rounded-2xl border border-crucible-navy/5 bg-crucible-bg/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <KeyRound className="w-3.5 h-3.5 text-crucible-amber" />
                            <span className="font-mono text-xs font-black text-crucible-navy uppercase">
                              {code.label}
                            </span>
                            <span
                              className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                                code.status === "active"
                                  ? "border-crucible-amber/20 bg-crucible-amber/10 text-crucible-amber"
                                  : code.status === "revoked"
                                    ? "border-red-500/20 bg-red-50 text-red-500"
                                    : "border-crucible-navy/10 bg-white text-crucible-slate"
                              }`}
                            >
                              {code.status}
                            </span>
                            <span className="font-mono text-[8px] text-crucible-slate/60 font-bold uppercase">
                              Ends {code.code_hint}
                            </span>
                          </div>
                          <p className="text-[10px] font-semibold text-crucible-slate leading-relaxed">
                            {`${code.assigned_email || "Unassigned legacy code"} // ${code.tier} // ${code.redemption_count}/1 redeemed${
                              code.expires_at
                                ? ` // Expires ${new Date(code.expires_at).toLocaleDateString()}`
                                : ""
                            }`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {code.status === "active" ? (
                            <button
                              onClick={() => handleAccessCodeStatus(code.id, "revoked")}
                              className="px-3 py-2 rounded-xl border border-red-500/10 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-[9px] font-mono font-bold uppercase transition-all cursor-pointer"
                            >
                              Revoke
                            </button>
                          ) : code.status === "revoked" &&
                            code.redemption_count < 1 &&
                            code.assigned_email ? (
                            <button
                              onClick={() => handleAccessCodeStatus(code.id, "active")}
                              className="px-3 py-2 rounded-xl border border-crucible-amber/20 bg-crucible-amber/10 hover:bg-crucible-amber hover:text-white text-crucible-amber text-[9px] font-mono font-bold uppercase transition-all cursor-pointer"
                            >
                              Activate
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {accessCodes.length === 0 && (
                      <div className="text-center py-12 border border-dashed border-crucible-navy/10 rounded-2xl bg-crucible-bg/30">
                        <span className="font-mono text-[10px] text-crucible-slate/50 uppercase font-bold">
                          No access codes issued yet.
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "compute" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      AlgoForce GPU Cluster Core.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Control active compute clusters, monitor hardware telemetry, and manage shard partitions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Node status lists */}
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase tracking-wider">GRID SPEC Telemetry</span>
                      
                      {[
                        { name: "ALGOFORCE_GRID_01", load: 92, temp: "42°C", status: "ACTIVE" },
                        { name: "ALGOFORCE_GRID_02", load: 78, temp: "39°C", status: "ACTIVE" },
                        { name: "ALGOFORCE_GRID_03", load: 45, temp: "35°C", status: "ACTIVE" },
                        { name: "ALGOFORCE_GRID_04", load: 0, temp: "22°C", status: "STANDBY" }
                      ].map((node, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-crucible-navy/5 bg-crucible-bg/30 flex items-center justify-between text-[10px] font-mono">
                          <div className="flex items-center gap-2">
                            <Cpu className={`w-3.5 h-3.5 ${node.status === "ACTIVE" ? "text-crucible-amber animate-pulse" : "text-crucible-slate/40"}`} />
                            <span className="font-bold text-crucible-navy">{node.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-crucible-slate">{node.temp}</span>
                            <span className="text-crucible-slate font-bold">{node.load}% LOAD</span>
                            <span className={`font-bold text-[8px] px-2 py-0.5 rounded-full ${
                              node.status === "ACTIVE" ? "bg-crucible-amber/15 text-crucible-amber border border-crucible-amber/20" : "bg-white text-crucible-slate/60 border border-crucible-navy/5"
                            }`}>{node.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* GPU Controls & Hardware Stats */}
                    <div className="p-6 rounded-2xl bg-crucible-bg/30 border border-crucible-navy/5 flex flex-col justify-between">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-crucible-amber" />
                          <span className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Total Cluster Footprint</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white rounded-xl border border-crucible-navy/5 flex flex-col">
                            <span className="font-mono text-[8px] text-crucible-slate/50">TOTAL CORES</span>
                            <span className="font-mono text-sm font-black text-crucible-navy">32,768 Tensor</span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-crucible-navy/5 flex flex-col">
                            <span className="font-mono text-[8px] text-crucible-slate/50">MEMORY BANDWIDTH</span>
                            <span className="font-mono text-sm font-black text-crucible-navy">3.2 TB/s</span>
                          </div>
                        </div>
                        
                        <p className="text-[10px] text-crucible-slate font-sans leading-normal">
                          AlgoForce AI incubator grants Crucible residents on-demand access to high-performance local H100 GPU clusters for advanced training and telemetry simulations.
                        </p>
                      </div>

                      <button
                        onClick={handleNodeShardOptimize}
                        className="w-full py-3 mt-6 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy transition-all duration-300 cursor-pointer"
                      >
                        Optimize Node Shards
                      </button>
                    </div>

                  </div>

                </motion.div>
              )}

              {activeTab === "broadcast" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                      Broadcasting Tower.
                    </h3>
                    <p className="text-xs text-crucible-slate mt-1">Disseminate cohort updates, waitlist status alerts, or technical announcements across the Crucible matrix.</p>
                  </div>

                  <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Dispatch Target</label>
                        <select
                          value={broadcastTarget}
                          onChange={(e) => setBroadcastTarget(e.target.value)}
                          className="p-3 rounded-xl border border-crucible-navy/10 bg-crucible-bg text-xxs font-mono font-bold focus:outline-none focus:border-crucible-amber"
                        >
                          <option value="all-founders">All Vetted Founders</option>
                          <option value="waitlist">Waitlist Applicants</option>
                          <option value="compute-shards">Compute Shard Users</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Broadcast Subject</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Crucible Incubation Cohort 05 Application Deadlines"
                          value={broadcastSubject}
                          onChange={(e) => setBroadcastSubject(e.target.value)}
                          className="p-3 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-semibold focus:outline-none focus:border-crucible-amber font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] font-bold text-crucible-navy uppercase">Telemetry Body Content</label>
                      <textarea
                        rows={6}
                        required
                        placeholder="Write cohort notifications or news here... (Accepts standard plaintext message)"
                        value={broadcastContent}
                        onChange={(e) => setBroadcastContent(e.target.value)}
                        className="p-4 rounded-xl border border-crucible-navy/10 bg-white text-xxs font-medium focus:outline-none focus:border-crucible-amber font-sans leading-normal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-fit px-6 py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center gap-2 transition-all duration-300 shadow-md cursor-pointer self-end"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Broadcast</span>
                    </button>

                  </form>

                </motion.div>
              )}
            </div>

          </div>

          {/* Right panel - Live Log Feeds */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col h-[560px]">
            <div className="flex justify-between items-center border-b border-crucible-navy/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-crucible-amber animate-pulse" />
                <h3 className="text-xs font-mono font-black text-crucible-navy uppercase tracking-wider">
                  Live Log Telemetry
                </h3>
              </div>
              <span className="font-mono text-[8px] font-bold bg-crucible-bg text-crucible-slate/70 px-2 py-0.5 rounded-full border border-crucible-navy/5">LIVE FEED</span>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-3 font-mono text-[9px] leading-relaxed custom-scrollbar">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-xl border text-[9px] flex flex-col gap-1 transition-all duration-300 ${
                    log.type === "success" 
                      ? "border-crucible-amber/20 bg-crucible-amber/5 text-crucible-navy" 
                      : log.type === "warning"
                      ? "border-red-500/20 bg-red-50 text-red-700"
                      : "border-crucible-navy/5 bg-crucible-bg/30 text-crucible-slate"
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-[8px] tracking-wide">
                    <span className={log.type === "success" ? "text-crucible-amber" : "text-crucible-navy/70"}>
                      [{log.source}]
                    </span>
                    <span className="opacity-60">{log.timestamp}</span>
                  </div>
                  <p className="font-medium">{log.message}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-crucible-navy/5 pt-4 mt-4 flex items-center justify-between font-mono text-[8px] text-crucible-slate/60 font-bold">
              <span>ACTIVE SESSION: SYNCED</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber animate-ping" />
                DATABASE SYNC NOMINAL
              </span>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
