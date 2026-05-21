"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MessageSquare, Users, Globe, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Community() {
  const hubs = [
    { city: "San Francisco", chapter: "Chapter #01", lead: "Alex Rivers", count: "1,200 Builders" },
    { city: "London", chapter: "Chapter #02", lead: "Clara Vance", count: "850 Builders" },
    { city: "Tokyo", chapter: "Chapter #03", lead: "Kenji Sato", count: "600 Builders" },
    { city: "Bengaluru", chapter: "Chapter #04", lead: "Rajesh Iyer", count: "950 Builders" }
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
              FUTURISTICstartupSOCIETY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            THE CRUCIBLE <br />
            <span className="text-gradient-amber-gold">SOCIETY.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Crucible is the premium builder network. We link engineers, makers, and founders across major regional chapters into a single high-energy collaborative framework.
          </motion.p>
        </div>

        {/* 2. Global Social Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          <div className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between h-64">
            <div>
              <MessageSquare className="w-8 h-8 text-crucible-amber mb-4" />
              <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                Vetted Discord
              </h3>
              <p className="text-xxs font-semibold text-crucible-slate mt-2 leading-relaxed">
                Connect dynamically in our private Discord chapter. Join standard channel masterminds on fine-tuning, hardware adapters, or syndicate pitching.
              </p>
            </div>
            <a href="#" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-crucible-amber hover:text-crucible-navy uppercase transition-colors mt-4">
              <span>Request Discord Invite</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between h-64">
            <div>
              <Users className="w-8 h-8 text-crucible-amber mb-4" />
              <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                Peer masterminds
              </h3>
              <p className="text-xxs font-semibold text-crucible-slate mt-2 leading-relaxed">
                Participate in weekly co-building reviews and standups. Teardown active code prototypes with vetted serial operators.
              </p>
            </div>
            <Link href="/membership" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-crucible-amber hover:text-crucible-navy uppercase transition-colors mt-4">
              <span>View tiers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between h-64">
            <div>
              <Globe className="w-8 h-8 text-crucible-amber mb-4" />
              <h3 className="text-lg font-mono font-black text-crucible-navy uppercase">
                Regional Hubs
              </h3>
              <p className="text-xxs font-semibold text-crucible-slate mt-2 leading-relaxed">
                Gain access to local partner co-working hubs and physical meeting frameworks across major tech epicenters.
              </p>
            </div>
            <Link href="/ecosystem" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-crucible-amber hover:text-crucible-navy uppercase transition-colors mt-4">
              <span>Explore map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* 3. Regional Chapters List */}
        <div className="w-full bg-white border border-crucible-navy/5 rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-45 pointer-events-none" />
          
          <div className="max-w-md mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              LOCAL HUBS
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              Active Chapters.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 font-mono">
            {hubs.map((hub, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-crucible-bg/60 border border-crucible-navy/5 shadow-inner">
                <span className="text-[10px] font-bold text-crucible-amber uppercase tracking-widest">{hub.chapter}</span>
                <h4 className="text-lg font-black text-crucible-navy mt-1.5 uppercase">{hub.city}</h4>
                <p className="text-xxs text-crucible-slate mt-4">Co-lead: {hub.lead}</p>
                <div className="w-full h-[1px] bg-crucible-navy/5 my-3" />
                <p className="text-xs font-bold text-crucible-navy">{hub.count}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
