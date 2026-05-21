"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Award, Shield, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Founders() {
  const mentors = [
    { name: "Sarah Jenkins", role: "Partner, AlgoForce AI", background: "Ex-Google DeepMind Principal Researcher, building autonomous agent networks." },
    { name: "David Chen", role: "Venture Architect", background: "Co-founded 3 major AI startups that reached public listing. Specializing in hardware nodes." },
    { name: "Elena Rostova", role: "Resident Legal Counsel", background: "Specialist in compliance, automated IP controls, and international security standards." }
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
              VETTED DIRECTORY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            CRUCIBLE <br />
            <span className="text-gradient-amber-gold">FOUNDERS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Crucible houses vetted founders who bypass standard slide deck building and focus on core engineering milestones. We support teams with deep technical, operational, and capital partners.
          </motion.p>
        </div>

        {/* 2. Mentor Directory List */}
        <div className="mb-20">
          <div className="max-w-md mb-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              EXECUTIVE BOARD
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              Resident Partners.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentors.map((mentor, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-mono font-black text-crucible-navy uppercase">
                    {mentor.name}
                  </h4>
                  <div className="text-xs font-bold text-crucible-amber uppercase tracking-wider mt-1.5 font-mono">
                    {mentor.role}
                  </div>
                  <p className="text-xxs font-medium text-crucible-slate mt-4 leading-relaxed">
                    {mentor.background}
                  </p>
                </div>
                
                <div className="w-full h-[1px] bg-crucible-navy/5 mt-6" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Program Support Tiers */}
        <div className="w-full bg-white border border-crucible-navy/5 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-48 h-48 glow-amber-radial opacity-45 pointer-events-none" />
          
          <div className="max-w-md mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              SUPPORT PROTOCOLS
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              Incubation Pipeline.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-mono font-black text-crucible-navy uppercase">Peer Masterminds</h4>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">Cluster into focused peer circles. Review architecture pipelines with expert operators.</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-mono font-black text-crucible-navy uppercase">Investor Demo Days</h4>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">Get direct access to leading pre-seed venture syndicates upon reaching technical benchmarks.</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-crucible-bg w-fit text-crucible-amber">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-mono font-black text-crucible-navy uppercase">Security Compliance</h4>
              <p className="text-xxs font-semibold text-crucible-slate leading-relaxed">Inherent full regulatory legal support, automated IP checks, and compliance guarantees.</p>
            </div>
          </div>
        </div>

        {/* 4. Action */}
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
