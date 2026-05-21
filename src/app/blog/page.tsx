"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowUpRight } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      title: "Fine-Tuning Specialized LLMs at Scale",
      category: "Engineering",
      date: "May 18, 2026",
      read: "8 min read",
      desc: "A comprehensive deep dive into parameters, adapters, and data pipelines constructed directly inside the Crucible AI Future Labs."
    },
    {
      name: "The Crucible Incubation Thesis",
      title: "Beyond Slide Decks: Building Raw Prototypes",
      category: "Thesis",
      date: "May 10, 2026",
      read: "5 min read",
      desc: "Why traditional pitch decks fail tech-native builders, and why we replaced them with direct compute sandboxes and vetted founder Masterminds."
    },
    {
      title: "Multi-Agent System Orchestration",
      category: "Research",
      date: "April 28, 2026",
      read: "12 min read",
      desc: "AlgoForce AI research paper regarding dynamic credential vaults and autonomous scheduling in multi-agent hierarchies."
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
              EDITORIAL PORTAL
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            CRUCIBLE <br />
            <span className="text-gradient-amber-gold">JOURNAL & INSIGHTS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Stay up to date with specialized engineering updates, research disclosures, and operational thesis disclosures curated by Crucible and AlgoForce AI.
          </motion.p>
        </div>

        {/* 2. Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Category Badge */}
                <span className="px-2.5 py-1 rounded-full bg-crucible-bg border border-crucible-navy/5 font-mono text-[8px] font-bold tracking-wider text-crucible-amber uppercase">
                  {post.category}
                </span>

                <h3 className="text-xl font-mono font-black text-crucible-navy uppercase mt-4 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xxs font-medium text-crucible-slate mt-3 leading-relaxed">
                  {post.desc}
                </p>

                <div className="w-full h-[1px] bg-crucible-navy/5 my-6" />

                {/* Metadata */}
                <div className="flex justify-between items-center font-mono text-[10px] text-crucible-slate/60">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-crucible-amber" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-crucible-amber" />
                    <span>{post.read}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="/waitlist"
                  className="w-full py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-1.5 transition-all shadow-sm group"
                >
                  <span>Read Article</span>
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
