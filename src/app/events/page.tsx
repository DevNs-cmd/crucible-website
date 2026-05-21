"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Events() {
  const [timeLeft, setTimeLeft] = useState({ days: 8, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    // Simple mock countdown ticker
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingEvents = [
    {
      title: "Crucible AI Agent Summit 2026",
      date: "June 14-15, 2026",
      time: "09:00 AM PST",
      location: "San Francisco, CA & Virtual",
      desc: "Our flagship annual conference assembling 500+ elite engineers, researchers, and venture partners for direct panels and fine-tuning workshops.",
      type: "Summit"
    },
    {
      title: "Weekly Founder Mastermind Circle",
      date: "Every Thursday",
      time: "06:00 PM PST",
      location: "Crucible SF HQ & Discord",
      desc: "Private peer-to-peer engineering teardowns and operational mastermind circles. Resident founders only.",
      type: "Mastermind"
    },
    {
      title: "Demo Day: Cohort 04 Showcase",
      date: "July 22, 2026",
      time: "10:00 AM PST",
      location: "London, UK & Live Stream",
      desc: "Watch 18 freshly forged AI startups pitch their prototypes to over 120 early-stage VCs, syndicates, and corporate venture funds.",
      type: "Showcase"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto w-full z-10 relative">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[450px] h-[450px] glow-amber-radial opacity-60 pointer-events-none" />

        {/* 1. Header Banner & Countdown */}
        <div className="w-full bg-white border border-crucible-navy/5 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-40 pointer-events-none" />
          
          <div className="max-w-xl">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              NEXT MAJOR SUMMIT
            </span>
            <h2 className="text-3xl md:text-4xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1 leading-none">
              Crucible AI Agent <br />
              <span className="text-gradient-amber-gold">Summit 2026.</span>
            </h2>
            <p className="text-xs font-semibold text-crucible-slate mt-4 leading-relaxed">
              Assembling elite LLM researchers, startup operators, and top venture partners in San Francisco. Secure your delegate credentials below.
            </p>
          </div>

          {/* Monospace Countdown Ticker */}
          <div className="flex gap-4 font-mono text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col gap-1">
                <div className="w-16 sm:w-20 py-4 rounded-2xl bg-crucible-bg border border-crucible-navy/5 text-2xl sm:text-3xl font-black text-crucible-navy shadow-sm">
                  {value.toString().padStart(2, "0")}
                </div>
                <span className="text-[9px] font-bold text-crucible-slate/60 uppercase tracking-widest">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Upcoming Events Directory */}
        <div className="mb-20">
          <div className="max-w-md mb-12">
            <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
              LIVE SCHEDULE
            </span>
            <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1">
              Upcoming Events.
            </h2>
          </div>

          {/* Grid layout of events */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * idx }}
                className="p-8 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Type badge */}
                  <span className="px-2.5 py-1 rounded-full bg-crucible-bg border border-crucible-navy/5 font-mono text-[8px] font-bold tracking-wider text-crucible-amber uppercase">
                    {event.type}
                  </span>

                  <h3 className="text-xl font-mono font-black text-crucible-navy uppercase mt-4 leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xxs font-medium text-crucible-slate/85 mt-4 leading-relaxed">
                    {event.desc}
                  </p>

                  <div className="w-full h-[1px] bg-crucible-navy/5 my-6" />

                  {/* Datetime / Place lists */}
                  <div className="flex flex-col gap-2.5 font-mono text-xxs font-bold text-crucible-slate/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-crucible-amber" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-crucible-amber" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-crucible-amber" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="/apply"
                    className="w-full py-3.5 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Register Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
