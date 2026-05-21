"use client";

import Link from "next/link";
import { BriefcaseBusiness, Code2, MessageCircle, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-crucible-navy/5 relative overflow-hidden">
      {/* Subtle Radial Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] glow-amber-radial opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-8 relative z-10">
        
        {/* Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center gap-2 group">
              <svg viewBox="0 0 100 100" className="w-6 h-6">
                <path d="M 50 15 L 80 30 L 50 45 L 20 30 Z" fill="#D28E2B" stroke="#0F1D30" strokeWidth="6" strokeLinejoin="round"/>
                <path d="M 20 30 L 50 45 L 50 80 L 20 65 Z" fill="#FFFFFF" stroke="#0F1D30" strokeWidth="6" strokeLinejoin="round"/>
                <path d="M 50 45 L 80 30 L 80 65 L 50 80 Z" fill="#F4EDE1" stroke="#0F1D30" strokeWidth="6" strokeLinejoin="round"/>
              </svg>
              <span className="font-mono text-lg font-black tracking-wide">
                <span className="text-crucible-navy">CRU</span>
                <span className="text-crucible-amber">CIBLE</span>
              </span>
            </div>
            
            <p className="text-sm text-crucible-slate/85 max-w-sm font-sans leading-relaxed">
              Crucible is the futuristic startup society where builders collaborate, founders are forged, and AI innovation goes zero-to-one.
            </p>

            {/* Newsletter input */}
            <div className="flex flex-col gap-2.5 max-w-sm mt-2">
              <label className="text-xs font-mono font-bold tracking-widest text-crucible-navy/60 uppercase">
                Forging Newsletter
              </label>
              <div className="flex relative items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-full px-5 py-3 text-xs font-mono font-medium placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all pr-12 text-crucible-navy"
                />
                <button className="absolute right-1 p-2 rounded-full bg-crucible-navy hover:bg-crucible-amber text-white transition-all duration-300">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-mono font-black tracking-widest text-crucible-navy uppercase">
              Ecosystem
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/ecosystem" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                Ecosystem Map
              </Link>
              <Link href="/founders" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                Founder Network
              </Link>
              <Link href="/startups" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                Incubated Startups
              </Link>
              <Link href="/ailabs" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                AI Future Labs
              </Link>
            </div>
          </div>

          {/* Column 3: Opportunities */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-mono font-black tracking-widest text-crucible-navy uppercase">
              Opportunities
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/events" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                Community Events
              </Link>
              <Link href="/hackathons" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                Global Hackathons
              </Link>
              <Link href="/membership" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                Membership Tiers
              </Link>
              <Link href="/careers" className="text-sm text-crucible-slate hover:text-crucible-navy transition-colors font-sans">
                Careers
              </Link>
            </div>
          </div>

          {/* Column 4: Parent & Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-mono font-black tracking-widest text-crucible-navy uppercase">
              From AlgoForce AI
            </h4>
            <p className="text-xs text-crucible-slate/70 font-sans leading-relaxed">
              Crucible is a premium startup ecosystem created from the AlgoForce AI innovation studio.
            </p>
            
            <div className="flex gap-3.5 mt-2">
              <a href="#" className="p-2 border border-crucible-navy/5 rounded-full hover:bg-crucible-bg transition-colors text-crucible-navy/60 hover:text-crucible-navy">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-crucible-navy/5 rounded-full hover:bg-crucible-bg transition-colors text-crucible-navy/60 hover:text-crucible-navy">
                <BriefcaseBusiness className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-crucible-navy/5 rounded-full hover:bg-crucible-bg transition-colors text-crucible-navy/60 hover:text-crucible-navy">
                <Code2 className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Dynamic Massive Text Background (Linear style) */}
        <div className="w-full text-center pointer-events-none select-none relative mb-6">
          <h1 className="text-[12vw] font-mono font-black leading-none tracking-tighter text-crucible-navy/[0.025] uppercase">
            CRUCIBLE
          </h1>
        </div>

        {/* Footer bottom metrics */}
        <div className="w-full border-t border-crucible-navy/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xxs text-crucible-slate/60">
          <div>
            © {new Date().getFullYear()} Crucible Brand. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-crucible-navy transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-crucible-navy transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-crucible-navy transition-colors">Cookie Controls</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
