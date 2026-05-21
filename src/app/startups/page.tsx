"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Cpu, ArrowUpRight, TrendingUp } from "lucide-react";

export default function Startups() {
  const portfolio = [
    {
      name: "Nexus Agentic Systems",
      sector: "Enterprise AI Agents",
      raised: "$8.5M Seed",
      stack: "AlgoForce Private API Core // Llama-3-70B Adapters",
      desc: "Autonomously orchestrating operations and compliance audits for fortune 500 banks."
    },
    {
      name: "Orbit Robotics Nodes",
      sector: "Autonomous Middleware",
      raised: "$12.0M Series A",
      stack: "ROS2 // Real-time Edge fine-tuning protocols",
      desc: "Creating specialized real-world embedded sensor system middleware for manufacturing warehouses."
    },
    {
      name: "Agentic Flow",
      sector: "Low-code Workflow AI",
      raised: "$4.2M Pre-seed",
      stack: "Agentic API Layers // Fine-tuned Crucible-v4 Core",
      desc: "Low-code workspace empowering non-technical operators to build custom agent schedules."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

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
              STUDIO PORTFOLIO
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            CRUCIBLE <br />
            <span className="text-gradient-amber-gold">COMPANIES.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Explore high-growth, AI-first startups incubated and forged directly inside the Crucible Studio pipeline. Backed by AlgoForce AI and leading venture funds worldwide.
          </motion.p>
        </div>

        {/* 2. Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {portfolio.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded-full bg-crucible-bg border border-crucible-navy/5 font-mono text-[8px] font-bold tracking-wider text-crucible-amber uppercase">
                  {item.sector}
                </span>

                <h3 className="text-xl font-mono font-black text-crucible-navy uppercase mt-4 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xxs font-medium text-crucible-slate mt-3 leading-relaxed">
                  {item.desc}
                </p>

                <div className="w-full h-[1px] bg-crucible-navy/5 my-6" />

                <div className="flex flex-col gap-2 font-mono text-xxs tracking-wider text-crucible-slate/70">
                  <div className="flex items-center gap-2 font-bold text-crucible-navy">
                    <TrendingUp className="w-3.5 h-3.5 text-crucible-amber" />
                    <span>RAISED: {item.raised}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Cpu className="w-3.5 h-3.5 text-crucible-amber flex-shrink-0 mt-0.5" />
                    <span className="leading-normal">{item.stack}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="/apply"
                  className="w-full py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-1.5 transition-all shadow-sm group"
                >
                  <span>Explore stack details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
