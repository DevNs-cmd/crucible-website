"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Membership() {
  const tiers = [
    {
      name: "Builder",
      cost: "Free",
      desc: "For raw hackers, developers, and makers exploring ideas.",
      perks: ["Crucible Discord access", "Monthly public hackathons", "Public knowledge databases", "Community directory search"]
    },
    {
      name: "Maker",
      cost: "$29/mo",
      desc: "For active side-builders and domain experts forming teams.",
      perks: ["Private team matchmaking", "Shared compute credits (100k)", "Weekly co-building office hours", "Standard API gateway limits"]
    },
    {
      name: "Founder",
      cost: "Vetted / Equity",
      desc: "For serious founders actively operating and raising pre-seed capital.",
      perks: ["Full Crucible Studio incubation", "Demo Day investor priority", "$150k Credits & Private fine-tuning", "Dedicated partner mastermind circles", "Corporate legal assistance"]
    },
    {
      name: "Crucible Studio",
      cost: "Joint Venture",
      desc: "For corporate venture spin-outs and AlgoForce joint-developments.",
      perks: ["Direct dev team co-building", "Custom enterprise AI tooling", "Dedicated regulatory compliance support", "Advanced priority node support"]
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
              ECOSYSTEM TIERING
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-[0.95]"
          >
            MEMBERSHIP <br />
            <span className="text-gradient-amber-gold">COMPILATIONS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold text-crucible-slate mt-5 leading-relaxed"
          >
            Crucible supports multiple developmental and operational tiers to match your specific engineering scale. Vetted founders gain immediate premium compute access.
          </motion.p>
        </div>

        {/* 2. Custom Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {tiers.map((tier, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider text-crucible-slate uppercase">{tier.name}</span>
                <h3 className="text-3xl font-mono font-black text-crucible-navy mt-1">{tier.cost}</h3>
                <p className="text-xxs font-medium text-crucible-slate mt-3 leading-relaxed">{tier.desc}</p>
                <div className="w-full h-[1px] bg-crucible-navy/5 my-6" />
                
                {/* Perks Bullet checklist */}
                <ul className="flex flex-col gap-3 font-mono text-[10px] tracking-wide text-crucible-slate">
                  {tier.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-crucible-amber flex-shrink-0 mt-0.5" />
                      <span className="leading-normal">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/apply"
                  className="w-full py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Apply access</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
