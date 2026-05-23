"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EcosystemMap3D from "@/components/EcosystemMap3D";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function EcosystemPage() {
  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative flex flex-col gap-12">
        {/* Glow */}
        <div className="absolute top-1/3 right-1/4 -translate-x-1/2 w-[400px] h-[400px] glow-amber-radial opacity-50 pointer-events-none" />

        {/* Header Text */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crucible-navy/5 bg-white shadow-sm mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-crucible-navy/70 uppercase">
              INTERACTIVE 3D DIRECTORY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            THE CRUCIBLE <br />
            <span className="text-gradient-amber-gold">NETWORK GRAPH.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Inspect the live 3D nodes of Crucible. Click, drag, and rotate the model to see the relationships between founders, hackathons, VC networks, and compute nodes inside the AI Labs.
          </motion.p>
        </div>

        {/* 3D Map Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <EcosystemMap3D />
        </motion.div>

        {/* Additional Directory Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm">
            <h3 className="text-lg font-mono font-black text-crucible-navy uppercase mb-4">
              Collaborative Labs Map
            </h3>
            <p className="text-xs font-semibold text-crucible-slate leading-relaxed mb-6">
              Our builders are located across major technology nodes worldwide: Silicon Valley, London, Bengaluru, and Tokyo. Explore local community chapters, physical hubs, and collaborative co-working partners.
            </p>
            <Link
              href="/access"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-crucible-amber hover:text-crucible-navy uppercase transition-colors"
            >
              <span>Apply for local access</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm">
            <h3 className="text-lg font-mono font-black text-crucible-navy uppercase mb-4">
              Incubator Portfolios
            </h3>
            <p className="text-xs font-semibold text-crucible-slate leading-relaxed mb-6">
              Vetted founders gain immediate, high-fidelity entry into the portfolio registry, exposing active prototypes to active seed partnerships and automated recruitment frameworks.
            </p>
            <Link
              href="/membership"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-crucible-amber hover:text-crucible-navy uppercase transition-colors"
            >
              <span>Explore Founder Tiers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
