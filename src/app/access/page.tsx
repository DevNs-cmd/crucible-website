"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AccessPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: "",
    email: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/access", { cache: "no-store" });
        const data = (await response.json().catch(() => ({}))) as {
          success?: boolean;
        };

        if (!cancelled && response.ok && data.success) {
          setHasSession(true);
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    };

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = formData.code.trim();
    const email = formData.email.trim().toLowerCase();
    const name = formData.name.trim();

    if (!code || !email) {
      setError("Access code and email are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, email, name }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        redirectTo?: string;
        success?: boolean;
      };

      if (response.ok && data.success) {
        router.replace(data.redirectTo || "/dashboard");
      } else {
        setError(data.error || "Unable to unlock access.");
      }
    } catch {
      setError("Unable to connect to the Crucible access vault.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-6xl mx-auto w-full z-10 relative grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[420px] h-[420px] glow-amber-radial opacity-60 pointer-events-none" />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10 flex flex-col gap-6"
        >
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
              PRIVATE ACCESS VAULT
            </span>
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]">
              UNLOCK <br />
              <span className="text-gradient-amber-gold">CRUCIBLE.</span>
            </h1>
            <p className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed max-w-xl">
              Founder portal entry is reserved for builders with an active team-issued code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            {[
              { label: "Session", value: hasSession ? "Unlocked" : "Code Locked" },
              { label: "Vault", value: "Supabase Verified" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl bg-white border border-crucible-navy/5 shadow-sm"
              >
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-crucible-slate/60">
                  {item.label}
                </span>
                <p className="font-mono text-sm font-black text-crucible-navy mt-1 uppercase">
                  {checkingSession ? "Checking..." : item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="relative z-10 p-8 md:p-10 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-45 pointer-events-none" />

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-crucible-bg/80 border border-crucible-navy/5 flex items-center justify-center text-crucible-amber">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-black text-crucible-navy uppercase tracking-tight">
                Access Code
              </h2>
              <p className="text-xxs font-semibold text-crucible-slate mt-1">
                Redeem once, land in your founder dashboard.
              </p>
            </div>
          </div>

          {hasSession ? (
            <div className="flex flex-col gap-5">
              <div className="p-4 rounded-2xl border border-crucible-amber/20 bg-crucible-amber/10 text-crucible-navy flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-crucible-amber flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-xs font-black uppercase">
                    Access session active.
                  </p>
                  <p className="text-xxs font-semibold text-crucible-slate mt-1">
                    Continue into the portal connected to your redeemed code.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="w-full py-4 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:border-crucible-amber flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-[10px] font-mono text-red-600 font-bold">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">
                  Code
                </label>
                <input
                  type="text"
                  autoComplete="one-time-code"
                  required
                  disabled={loading}
                  placeholder="CRU-XXXX-XXXX-XXXX"
                  value={formData.code}
                  onChange={(event) =>
                    setFormData({ ...formData, code: event.target.value })
                  }
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono uppercase tracking-widest placeholder:tracking-normal placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy disabled:opacity-55"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="founder@company.ai"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData({ ...formData, email: event.target.value })
                  }
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy disabled:opacity-55"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  disabled={loading}
                  placeholder="Ada Lovelace"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy disabled:opacity-55"
                />
              </div>

              <button
                type="submit"
                disabled={loading || checkingSession}
                className="w-full py-4 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:border-crucible-amber flex items-center justify-center gap-2 group transition-all duration-300 shadow-md mt-2 disabled:opacity-70 disabled:hover:bg-crucible-navy cursor-pointer"
              >
                <span>{loading ? "Verifying..." : "Unlock Access"}</span>
                {!loading && (
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>
          )}
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
