"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Terminal, Cpu, CheckCircle, LogOut } from "lucide-react";

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
