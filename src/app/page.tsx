"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreeHeroCanvas from "@/components/ThreeHeroCanvas";
import EcosystemMap3D from "@/components/EcosystemMap3D";
import { ArrowUpRight, ArrowRight, ShieldCheck, Sparkles, Cpu, Code2, CpuIcon } from "lucide-react";
import Link from "next/link";
import Lenis from "lenis";

export default function Home() {
  const [loading, setLoading] = useState(true);
  type TierId = "builder" | "maker" | "founder" | "studio";
  const [activeTier, setActiveTier] = useState<TierId>("founder");

  useEffect(() => {
    // Initialize Lenis smooth scroll once loaded
    if (!loading) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [loading]);

  const tiers: Array<{
    id: TierId;
    name: string;
    cost: string;
    desc: string;
    features: string[];
  }> = [
    {
      id: "builder",
      name: "Builder",
      cost: "Free",
      desc: "For raw hackers, developers, and makers searching for ideas.",
      features: ["Crucible Discord access", "Monthly open hackathons", "Public knowledge databases"]
    },
    {
      id: "maker",
      name: "Maker",
      cost: "$29/mo",
      desc: "For active side-builders and domain experts forming teams.",
      features: ["Private team matchmaking", "Shared compute credits", "Weekly co-building office hours"]
    },
    {
      id: "founder",
      name: "Founder",
      cost: "Equity / Vetted",
      desc: "For serious founders actively operating and raising pre-seed capital.",
      features: ["Full Crucible Studio incubation", "Demo Day investor priority", "$150k credits & private model rigs"]
    },
    {
      id: "studio",
      name: "Crucible Studio",
      cost: "Joint Venture",
      desc: "For corporate venture spin-outs and AlgoForce joint-developments.",
      features: ["Direct dev team co-building", "Custom enterprise AI tooling", "Dedicated regulatory compliance support"]
    }
  ];

  return (
    <>
      {/* Cinematic Splash Screen */}
      <SplashScreen onComplete={() => setLoading(false)} />

      {/* Main Experience Layout */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="min-h-screen flex flex-col relative tech-grid-bg bg-crucible-bg"
        >
          {/* Header Navigation */}
          <Navbar />

          {/* 1. HERO SECTION */}
          <section className="relative min-h-screen pt-24 pb-16 md:pt-0 md:pb-0 flex items-center px-6 md:px-8 max-w-7xl mx-auto w-full overflow-hidden">
            {/* Top Amber Sunburst Glow */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] glow-amber-radial opacity-70 pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] glow-navy-radial opacity-50 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center w-full z-10">
              
              {/* Hero Text */}
              <div className="flex flex-col gap-5 md:gap-6 items-start">
                {/* Parent brand label */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-crucible-navy/5 bg-white shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-crucible-amber animate-pulse" />
                  <span className="font-mono text-[10px] font-bold tracking-widest text-crucible-navy/70 uppercase">
                    An AlgoForce AI Initiative
                  </span>
                </motion.div>

                {/* Main Slogan */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-[clamp(2.75rem,12vw,4.5rem)] md:text-7xl font-mono font-black tracking-tight text-crucible-navy uppercase leading-[0.95]"
                >
                  Where Founders <br />
                  <span className="text-gradient-amber-gold">Are Forged.</span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-base md:text-lg font-medium text-crucible-slate leading-relaxed max-w-lg"
                >
                  Crucible is the futuristic startup ecosystem powering the next generation of builders, hackers, and AI-native founders. We replace traditional gatekeeping with high-octane engineering labs and direct capital pipelines.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-wrap gap-4 mt-2 w-full sm:w-auto"
                >
                  <Link
                    href="/apply"
                    className="flex-1 sm:flex-initial text-center px-7 py-4 rounded-full bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:scale-[1.02] shadow-lg shadow-crucible-navy/10 transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <span>Join Ecosystem</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="#ecosystem"
                    className="flex-1 sm:flex-initial text-center px-7 py-4 rounded-full border border-crucible-navy/10 bg-white hover:bg-crucible-bg text-crucible-navy text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300"
                  >
                    Explore 3D Map
                  </a>
                </motion.div>
                
                {/* Stats quick view */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 mt-8 md:mt-12 w-full pt-6 md:pt-8 border-t border-crucible-navy/5 font-mono"
                >
                  <div>
                    <h5 className="text-[10px] font-bold text-crucible-navy/40 uppercase tracking-widest">INCUBATED</h5>
                    <p className="text-xl font-black text-crucible-navy mt-1">$45M+ Raised</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-crucible-navy/40 uppercase tracking-widest">BUILDERS</h5>
                    <p className="text-xl font-black text-crucible-navy mt-1">1,800+ Active</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-crucible-navy/40 uppercase tracking-widest">AI PLATFORMS</h5>
                    <p className="text-xl font-black text-crucible-navy mt-1">12 Custom Labs</p>
                  </div>
                </motion.div>
              </div>

              {/* R3F Canvas Container */}
              <div className="w-full h-[340px] sm:h-[420px] md:h-[580px] relative order-first lg:order-last overflow-visible">
                <div className="absolute inset-x-[-12%] inset-y-[-8%] glow-amber-radial opacity-80 pointer-events-none" />
                <div className="absolute inset-0 tech-grid-bg opacity-40 pointer-events-none [mask-image:radial-gradient(circle_at_center,black_35%,transparent_72%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ThreeHeroCanvas />
                </div>
              </div>

            </div>
          </section>

          {/* 2. THE FORGING PROCESS STORYTELLING SECTION */}
          <section className="w-full bg-white border-y border-crucible-navy/5 py-24 md:py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
              
              <div className="max-w-xl mb-20">
                <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
                  THE CRUCIBLE METHOD
                </span>
                <h2 className="text-3xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
                  How Founders Are Forged.
                </h2>
                <p className="text-sm font-semibold text-crucible-slate leading-relaxed mt-4">
                  Traditional accelerators give you a pitch deck. Crucible gives you a dynamic AI product sandbox, expert engineering nodes, and raw capital partnerships.
                </p>
              </div>

              {/* Horizontal / Stacked Forging Process Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Stage 1: Melting */}
                <div className="p-8 rounded-3xl bg-crucible-bg/50 border border-crucible-navy/5 flex flex-col gap-6 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 glow-amber-radial opacity-50 group-hover:scale-125 transition-transform" />
                  <div className="font-mono text-xs font-black tracking-widest text-crucible-amber/60">
                    STAGE 01 // MELTING
                  </div>
                  <h4 className="text-xl font-mono font-black text-crucible-navy uppercase">
                    Deconstruct Traditional Models
                  </h4>
                  <p className="text-xs font-semibold text-crucible-slate leading-relaxed">
                    Break down the outdated, slow-moving overhead of old VC frameworks. We melt away slide decks and focus entirely on building high-performance AI tech prototypes within days.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-crucible-navy tracking-widest uppercase mt-4">
                    <span>Active Labs</span>
                    <Sparkles className="w-3.5 h-3.5 text-crucible-amber" />
                  </div>
                </div>

                {/* Stage 2: Shaping */}
                <div className="p-8 rounded-3xl bg-crucible-bg/50 border border-crucible-navy/5 flex flex-col gap-6 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 glow-amber-radial opacity-50 group-hover:scale-125 transition-transform" />
                  <div className="font-mono text-xs font-black tracking-widest text-crucible-amber/60">
                    STAGE 02 // SHAPING
                  </div>
                  <h4 className="text-xl font-mono font-black text-crucible-navy uppercase">
                    Assemble Tech Ecosystems
                  </h4>
                  <p className="text-xs font-semibold text-crucible-slate leading-relaxed">
                    We equip your pipeline with direct GPU credits, open fine-tuning rigs, co-building mastermind groups, and immediate early-stage developer chapters across standard interfaces.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-crucible-navy tracking-widest uppercase mt-4">
                    <span>Developer chapter</span>
                    <Code2 className="w-3.5 h-3.5 text-crucible-amber" />
                  </div>
                </div>

                {/* Stage 3: Tempering */}
                <div className="p-8 rounded-3xl bg-crucible-bg/50 border border-crucible-navy/5 flex flex-col gap-6 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 glow-amber-radial opacity-50 group-hover:scale-125 transition-transform" />
                  <div className="font-mono text-xs font-black tracking-widest text-crucible-amber/60">
                    STAGE 03 // TEMPERING
                  </div>
                  <h4 className="text-xl font-mono font-black text-crucible-navy uppercase">
                    Harden Against Velocity
                  </h4>
                  <p className="text-xs font-semibold text-crucible-slate leading-relaxed">
                    We harden and scale incubated projects by syndicating pre-seed funds directly from the AlgoForce network, preparing teams for multi-million dollar venture cycles.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-crucible-navy tracking-widest uppercase mt-4">
                    <span>Scale secure</span>
                    <Cpu className="w-3.5 h-3.5 text-crucible-amber" />
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* 3. 3D INTERACTIVE ECOSYSTEM MAP SECTION */}
          <section id="ecosystem" className="w-full py-24 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
                  FLEXIBLE 3D DIRECTORY
                </span>
                <h2 className="text-3xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
                  The Crucible Ecosystem
                </h2>
              </div>
              <p className="text-sm font-semibold text-crucible-slate max-w-md">
                Ecosystem components connect dynamically. Rotate the three-dimensional node graph to understand the links mapping founders to investors.
              </p>
            </div>

            {/* Render 3D Ecosystem Map and Detail Pane */}
            <EcosystemMap3D />
          </section>

          {/* 4. AI FUTURE LABS NEURAL GRID HIGHLIGHT */}
          <section className="w-full bg-white border-y border-crucible-navy/5 py-24 md:py-32 overflow-hidden relative">
            {/* Soft backdrop glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-amber-radial opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Graphic neural net layout */}
              <div className="relative flex flex-col justify-center items-center p-8 border border-crucible-navy/5 rounded-3xl bg-crucible-bg/30 overflow-hidden shadow-inner h-[380px]">
                {/* Tech styling: floating grids, lines, numbers */}
                <div className="absolute inset-0 tech-grid-bg opacity-40" />
                
                {/* Custom animated grid items representing neural pathways */}
                <div className="relative z-10 flex flex-col gap-6 w-full max-w-md font-mono text-xxs tracking-wider text-crucible-navy/60">
                  <div className="p-4 rounded-xl border border-crucible-navy/5 bg-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CpuIcon className="w-4 h-4 text-crucible-amber animate-spin" />
                      <span>ALGOFORCE AGENT LAYER</span>
                    </div>
                    <span className="text-crucible-amber font-bold font-mono">ONLINE</span>
                  </div>

                  <div className="p-4 rounded-xl border border-crucible-navy/5 bg-white shadow-sm flex items-center justify-between ml-8">
                    <div className="flex items-center gap-3">
                      <Code2 className="w-4 h-4 text-crucible-navy" />
                      <span>FINE-TUNING CRUCIBLE-V4</span>
                    </div>
                    <span className="text-crucible-slate">ACTIVE // 98.4%</span>
                  </div>

                  <div className="p-4 rounded-xl border border-crucible-navy/5 bg-white shadow-sm flex items-center justify-between mr-8">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-crucible-amber" />
                      <span>SECURITY COMPLIANCE AUDIT</span>
                    </div>
                    <span className="text-crucible-amber font-bold">SECURED</span>
                  </div>
                </div>
              </div>

              {/* Labs text info */}
              <div className="flex flex-col gap-6 items-start">
                <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
                  AI FUTURE LABS
                </span>
                <h2 className="text-3xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight leading-none">
                  AI-Native <br />
                  Product Tooling.
                </h2>
                <p className="text-sm font-semibold text-crucible-slate leading-relaxed">
                  Crucible is not just a community—we are developers building the tools you use to build. Partnering with AlgoForce AI, we provide incubated teams with custom API layers, dedicated open-weights fine-tuning rigs, and pre-packaged agentic frameworks.
                </p>
                <Link
                  href="/ailabs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-crucible-navy bg-white hover:bg-crucible-navy hover:text-white text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 group"
                >
                  <span>Explore AI Labs</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>
          </section>

          {/* 5. MEMBERSHIP TIERS SECTION */}
          <section className="w-full py-24 md:py-32 px-6 md:px-8 max-w-7xl mx-auto relative">
            <div className="text-center max-w-xl mx-auto mb-20">
              <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
                MEMBERSHIP SYSTEMS
              </span>
              <h2 className="text-3xl md:text-5xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
                Choose Your Tier.
              </h2>
              <p className="text-xs md:text-sm font-semibold text-crucible-slate mt-4 leading-relaxed">
                Whether you are a solo hacker coding a project or an operating startup raising seed capital, we have a custom ecosystem tier designed for your scale.
              </p>
            </div>

            {/* Grid structure of tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
              {tiers.map((tier) => {
                const isActive = activeTier === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setActiveTier(tier.id)}
                    className={`p-7 rounded-3xl flex flex-col justify-between border cursor-pointer transition-all duration-300 relative ${
                      isActive
                        ? "bg-white border-crucible-amber shadow-lg shadow-crucible-amber/[0.04] scale-[1.02]"
                        : "bg-white/60 border-crucible-navy/5 hover:border-crucible-navy/15 shadow-sm"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-crucible-amber text-white font-mono text-[9px] font-bold tracking-widest uppercase shadow">
                        SELECTED
                      </div>
                    )}
                    
                    <div>
                      {/* Name & Cost */}
                      <span className="text-xs font-mono font-bold tracking-wider text-crucible-slate uppercase">
                        {tier.name}
                      </span>
                      <h4 className="text-2xl font-mono font-black text-crucible-navy mt-1.5">
                        {tier.cost}
                      </h4>
                      <p className="text-xs font-medium text-crucible-slate/80 mt-3 leading-relaxed">
                        {tier.desc}
                      </p>

                      <div className="w-full h-[1px] bg-crucible-navy/5 my-5" />

                      {/* Features checklist */}
                      <ul className="flex flex-col gap-2.5">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xxs font-semibold text-crucible-slate leading-normal">
                            <span className="w-1.5 h-1.5 rounded-full bg-crucible-amber mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Link
                        href="/apply"
                        className={`w-full py-3.5 rounded-xl text-center text-[10px] font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all ${
                          isActive
                            ? "bg-crucible-navy text-white hover:bg-crucible-amber shadow-sm"
                            : "border border-crucible-navy/15 text-crucible-navy hover:bg-crucible-bg"
                        }`}
                      >
                        <span>Apply For Access</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Footer Component */}
          <Footer />

        </motion.div>
      )}
    </>
  );
}
