"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Cpu, Terminal, ShieldAlert, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AILabs() {
  const specs = [
    { title: "Shared Compute Nodes", stat: "12x NVIDIA H100s", desc: "Private hardware compute nodes dedicated exclusively to resident founder prototyping." },
    { title: "Fine-Tuning Rigs", stat: "Vetted LLaMA / Qwen", desc: "Custom adapters running on local parameter-efficient structures for low latency workloads." },
    { title: "Agentic Sandbox", stat: "12 Private APIs", desc: "Pre-packaged multi-agent scheduling frameworks, credential vaults, and testing sandboxes." }
  ];

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative">
        {/* Glow */}
        <div className="absolute top-1/4 right-1/4 -translate-x-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

        {/* 1. Header Banner */}
        <div className="max-w-3xl mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
              COMPUTE INFRASTRUCTURE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            CRUCIBLE <br />
            <span className="text-gradient-amber-gold">AI FUTURE LABS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            We supply incubated teams with direct, high-end computational power and agentic middleware, in partnership with AlgoForce AI. Skip standard API rate limits and build on bare-metal systems.
          </motion.p>
        </div>

        {/* 2. Specs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {specs.map((spec, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between h-64">
              <div>
                <span className="text-xs font-mono font-bold text-crucible-amber uppercase tracking-wider">{spec.title}</span>
                <h3 className="text-2xl font-mono font-black text-crucible-navy mt-1">{spec.stat}</h3>
                <p className="text-xxs font-medium text-crucible-slate mt-4 leading-relaxed">{spec.desc}</p>
              </div>
              <div className="w-full h-[1px] bg-crucible-navy/5 mt-6" />
            </div>
          ))}
        </div>

        {/* 3. Neural pipeline specs panel */}
        <div className="w-full bg-white border border-crucible-navy/5 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute -bottom-12 -left-12 w-48 h-48 glow-amber-radial opacity-45 pointer-events-none" />
          
          <div className="max-w-md mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              TECHNICAL SCHEMA
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              Developer Pipeline.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10 font-mono text-xxs tracking-wider text-crucible-slate">
            <div className="p-6 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 shadow-inner">
              <div className="flex items-center gap-2 text-crucible-navy font-bold mb-3">
                <Terminal className="w-4 h-4 text-crucible-amber" />
                <span>API ENDPOINTS</span>
              </div>
              <p className="leading-relaxed">Pre-loaded endpoints with direct connection into AlgoForce pipelines. Guaranteed 99.9% uptime for prototyping.</p>
            </div>

            <div className="p-6 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 shadow-inner">
              <div className="flex items-center gap-2 text-crucible-navy font-bold mb-3">
                <Cpu className="w-4 h-4 text-crucible-amber" />
                <span>COMPUTATION GRIDS</span>
              </div>
              <p className="leading-relaxed">Direct dynamic scheduling and GPU clustering hooks. Instantly allocate compute arrays during high-demand workflows.</p>
            </div>

            <div className="p-6 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 shadow-inner">
              <div className="flex items-center gap-2 text-crucible-navy font-bold mb-3">
                <ShieldAlert className="w-4 h-4 text-crucible-amber" />
                <span>INTELLIGENT COMPLIANCE</span>
              </div>
              <p className="leading-relaxed">Real-time automated auditing frameworks ensuring pipelines are optimized and secured before deployment.</p>
            </div>
          </div>
        </div>

        {/* 4. Action */}
        <div className="text-center py-8">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber transition-all duration-300 shadow-md group"
          >
            <span>Request Compute Access</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
