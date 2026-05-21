"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Terminal, Cpu, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Ecosystem Level", val: "Level 14 // Maker", desc: "XP system for active builders." },
    { title: "Allocated Computes", val: "2,450 / 5,000 hrs", desc: "H100 shared compute quota." },
    { title: "Active Programs", val: "Cohort 04 Incubation", desc: "Vetted founder status." }
  ];

  const upcomingChecklist = [
    { title: "Weekly SF Mastermind Standup", time: "Thurs @ 06:00 PM PST", status: "PENDING" },
    { title: "Submit Prototype Telemetry (Milestone 2)", time: "Due June 01, 2026", status: "PENDING" },
    { title: "Schedule Mentor Session (Sarah Jenkins)", time: "Completed", status: "COMPLETED" }
  ];

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative flex flex-col gap-12">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

        {/* 1. Header Area */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
              FOUNDER PORTAL
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            RESIDENT <br />
            <span className="text-gradient-amber-gold">DASHBOARD.</span>
          </motion.h1>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between h-44">
              <div>
                <span className="text-xs font-mono font-bold text-crucible-slate/60 uppercase tracking-widest">{stat.title}</span>
                <h3 className="text-xl font-mono font-black text-crucible-navy mt-2">{stat.val}</h3>
              </div>
              <p className="text-xxs font-medium text-crucible-slate/80 leading-normal border-t border-crucible-navy/5 pt-3 mt-3">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. Checklist and details columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Interactive Checklist */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm">
            <h3 className="text-lg font-mono font-black text-crucible-navy uppercase mb-6">
              Action Checklist.
            </h3>
            
            <div className="flex flex-col gap-4">
              {upcomingChecklist.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-crucible-navy/5 bg-crucible-bg/30 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.status === "COMPLETED" ? "text-crucible-amber" : "text-crucible-navy/20"}`} />
                    <div>
                      <h5 className="text-xs font-mono font-black text-crucible-navy uppercase">{item.title}</h5>
                      <span className="text-xxs font-semibold text-crucible-slate/70 font-sans">{item.time}</span>
                    </div>
                  </div>
                  <span className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded-full border ${
                    item.status === "COMPLETED"
                      ? "border-crucible-amber/20 bg-crucible-amber/10 text-crucible-amber"
                      : "border-crucible-navy/10 bg-white text-crucible-navy/60"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Side computing and resource widgets */}
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
                  <span className="text-crucible-amber font-mono text-[9px]">ACTIVE</span>
                </div>
                <div className="w-full h-[2px] bg-crucible-navy/5 rounded-full overflow-hidden">
                  <div className="h-full bg-crucible-amber w-[49%]" />
                </div>
                <div className="flex justify-between font-mono text-xxs font-bold text-crucible-slate/60">
                  <span>USED: 2,450 hrs</span>
                  <span>TOTAL: 5,000 hrs</span>
                </div>
              </div>
            </div>

            <a
              href="/apply"
              className="w-full py-4 mt-8 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Enter Web Sandbox</span>
            </a>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
