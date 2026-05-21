"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Cpu, Target, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function About() {
  const milestones = [
    { year: "2024", title: "Crucible Formed", desc: "Launched by AlgoForce AI as an experimental coding sandbox for 50 elite hackers." },
    { year: "2025", title: "Incubating Startups", desc: "First 12 incubated teams raised over $20M in seed capital from tier-one global VCs." },
    { year: "2026", title: "AI Labs Launch", desc: "Deployed shared private compute grids and custom API nodes for all resident makers." },
    { year: "Beyond", title: "Futuristic Startup Society", desc: "Forging the future of software infrastructure, robotics integrations, and agent networks." }
  ];

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

        {/* 1. Header Hero Area */}
        <div className="max-w-3xl mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
              PHILOSOPHY & VISION
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            FORGING THE <br />
            <span className="text-gradient-amber-gold">NEXT GENERATION.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base font-semibold text-crucible-slate mt-6 leading-relaxed"
          >
            Crucible is not a generic startup school or shared workspace. It is a highly integrated innovation foundry, co-developed with AlgoForce AI, to turn technological breakthroughs into scalable, world-class companies.
          </motion.p>
        </div>

        {/* 2. Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
          >
            <div className="p-3.5 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-mono font-black text-crucible-navy uppercase">
              AI-Native Stack
            </h3>
            <p className="text-xs font-semibold text-crucible-slate leading-relaxed">
              We design our resident pipelines around direct machine resources: private local API cores, fine-tuning hardware node credits, and fully automated testing pipelines.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
          >
            <div className="p-3.5 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-mono font-black text-crucible-navy uppercase">
              Raw Founder Masterminds
            </h3>
            <p className="text-xs font-semibold text-crucible-slate leading-relaxed">
              Makers are isolated by default. We cluster elite hackers into vetted circles, matching technical co-founders with veterans who have taken tech pipelines to public offerings.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col gap-6"
          >
            <div className="p-3.5 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-mono font-black text-crucible-navy uppercase">
              AlgoForce AI Incubation
            </h3>
            <p className="text-xs font-semibold text-crucible-slate leading-relaxed">
              Backed by the advanced neural research of AlgoForce AI, resident companies inherit powerful architectural assets, compliance guarantees, and direct pre-seed check-writings.
            </p>
          </motion.div>

        </div>

        {/* 3. Interactive Milestone Timeline */}
        <div className="w-full bg-white border border-crucible-navy/5 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-40 pointer-events-none" />
          
          <div className="max-w-md mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              PROJECT TIMELINE
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              Forging Milestones.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <span className="text-4xl font-mono font-black text-gradient-amber-gold">
                  {milestone.year}
                </span>
                <div className="w-full h-[2px] bg-crucible-navy/5 relative">
                  <span className="absolute -top-1 left-0 w-2.5 h-2.5 rounded-full bg-crucible-amber" />
                </div>
                <h4 className="text-base font-mono font-black text-crucible-navy uppercase mt-1">
                  {milestone.title}
                </h4>
                <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">
                  {milestone.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Closing CTA */}
        <div className="text-center py-8">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber transition-all duration-300 shadow-md group"
          >
            <span>Apply For Resident Status</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
