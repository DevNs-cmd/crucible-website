"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Apply() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", links: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-xl mx-auto w-full z-10 relative flex flex-col justify-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

        <div className="p-8 md:p-12 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm relative overflow-hidden z-10">
          <div className="absolute -top-12 -right-12 w-48 h-48 glow-amber-radial opacity-40 pointer-events-none" />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="mb-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
                  ECOSYSTEM MEMBERSHIP
                </span>
                <h2 className="text-2xl md:text-3xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1 leading-none">
                  Forge Status.
                </h2>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Hedy Lamarr"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="hedy@forged.ai"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy"
                />
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">Github / LinkedIn / Twitter</label>
                <input
                  type="text"
                  placeholder="https://github.com/forger"
                  value={formData.links}
                  onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">What are you forging?</label>
                <textarea
                  rows={4}
                  placeholder="Description of your AI product, agent, or technology node..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:text-white flex items-center justify-center gap-2 group transition-all duration-300 shadow-md mt-4"
              >
                <span>Submit Application</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-6 py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-crucible-amber animate-bounce" />
              <div>
                <h3 className="text-2xl font-mono font-black text-crucible-navy uppercase tracking-tight">Application Lodged.</h3>
                <p className="text-xs font-semibold text-crucible-slate mt-3 leading-relaxed max-w-sm">
                  Thank you, **{formData.name}**. Your operational telemetry has been syndicated. The AlgoForce AI board will review your profile and chapter invite within 48 hours.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
