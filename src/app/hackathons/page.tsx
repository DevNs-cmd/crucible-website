"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Zap, Cpu, Code2, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Hackathons() {
  const prizes = [
    { title: "Grand Prize Winner", amount: "$25,000", desc: "Plus direct pre-seed vetting for Crucible Studio and $50k in GPU credits." },
    { title: "Best Agentic AI Tool", amount: "$15,000", desc: "Awarded to the team constructing the most innovative multi-agent workflow solution." },
    { title: "Best Open-Weights Hack", amount: "$10,000", desc: "Awarded to the team with the most optimized custom fine-tuned model implementation." }
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
              HIGH-OCTANE SPRINT
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            CRUCIBLE HACKATHON <br />
            <span className="text-gradient-amber-gold">COHORT 04.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Join 300+ elite engineers, designers, and domain experts for a 48-hour sprint in SF & London. Build bleeding-edge AI models, agents, or tools and secure venture backing on the spot.
          </motion.p>
        </div>

        {/* 2. Prize pool grids */}
        <div className="mb-20">
          <div className="max-w-md mb-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              PRIZE DISTRIBUTIONS
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              $50,000 Cash Pool.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prizes.map((prize, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-mono font-black text-crucible-navy uppercase">
                    {prize.title}
                  </h4>
                  <div className="text-3xl font-black text-gradient-amber-gold font-sans mt-3">
                    {prize.amount}
                  </div>
                  <p className="text-xxs font-medium text-crucible-slate mt-3 leading-relaxed">
                    {prize.desc}
                  </p>
                </div>
                <div className="w-full h-[2px] bg-crucible-navy/5 mt-6" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Event tracks info */}
        <div className="w-full bg-white border border-crucible-navy/5 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute -bottom-12 -left-12 w-48 h-48 glow-amber-radial opacity-35 pointer-events-none" />
          
          <div className="max-w-md mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              HACKATHON TRACKS
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              Key Focus Areas.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-mono font-black text-crucible-navy uppercase">Autonomous Agents</h4>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">Multi-agent frameworks, collaborative agent hierarchies, and task-automation execution pipelines.</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-mono font-black text-crucible-navy uppercase">LLM Finetuning</h4>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">Domain-specific models, custom parameter-efficient adapters, and specialized synthetic data loops.</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-mono font-black text-crucible-navy uppercase">Hardware Nodes</h4>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">Robotics middleware, edge computation frameworks, and real-world embedded sensor agent loops.</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-mono font-black text-crucible-navy uppercase">AI Social Nets</h4>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">Agent-human network tools, custom decentralized builder verification systems, and reputation markets.</p>
            </div>
          </div>
        </div>

        {/* 4. Action */}
        <div className="text-center py-8">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber transition-all duration-300 shadow-md group"
          >
            <span>Register Team Now</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
