"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Careers() {
  const roles = [
    {
      title: "Senior AI Agent Architect",
      company: "Nexus Agentic Systems",
      location: "San Francisco, CA (Hybrid)",
      compensation: "$180k - $240k + Equity",
      desc: "Lead architectural design of multi-agent state machines, reasoning graphs, and secure credential delegation blocks."
    },
    {
      title: "Full-Stack WebGL Engineer",
      company: "Crucible Studio",
      location: "London, UK (Hybrid)",
      compensation: "£90k - £120k + Equity",
      desc: "Construct immersive, high-end 3D interfaces and procedurally shader-animated directories for flagship AlgoForce clients."
    },
    {
      title: "Robotics edge fine-tuning dev",
      company: "Orbit Robotics Nodes",
      location: "Tokyo, Japan (On-site)",
      compensation: "¥12M - ¥16M + Equity",
      desc: "Implement parameter-efficient fine-tuning protocols running on real-time embedded sensor edge systems."
    }
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
              JOIN THE FOUNDRY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            FORGE THE FUTURE <br />
            <span className="text-gradient-amber-gold">WITH US.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Explore vacant operational roles inside the Crucible Studio team or discover opportunities directly inside incubated high-growth AI startups.
          </motion.p>
        </div>

        {/* 2. Open Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Company Badge */}
                <span className="px-2.5 py-1 rounded-full bg-crucible-bg border border-crucible-navy/5 font-mono text-[8px] font-bold tracking-wider text-crucible-amber uppercase">
                  {role.company}
                </span>

                <h3 className="text-lg font-mono font-black text-crucible-navy uppercase mt-4 leading-snug">
                  {role.title}
                </h3>

                <p className="text-xxs font-medium text-crucible-slate mt-3 leading-relaxed">
                  {role.desc}
                </p>

                <div className="w-full h-[1px] bg-crucible-navy/5 my-6" />

                {/* Metadata */}
                <div className="flex flex-col gap-2 font-mono text-xxs tracking-wider text-crucible-slate/70">
                  <div className="flex items-center gap-2 font-bold text-crucible-navy">
                    <MapPin className="w-3.5 h-3.5 text-crucible-amber" />
                    <span>{role.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-crucible-amber" />
                    <span>{role.compensation}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/apply"
                  className="w-full py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-1.5 transition-all shadow-sm group"
                >
                  <span>Apply For Role</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
