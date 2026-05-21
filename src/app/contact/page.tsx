"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, MapPin, Globe } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col tech-grid-bg bg-crucible-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-8 max-w-5xl mx-auto w-full z-10 relative flex items-center justify-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] glow-amber-radial opacity-60 pointer-events-none" />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch z-10 relative">
          
          {/* Text and contacts details */}
          <div className="flex flex-col justify-between p-8 md:p-12 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-crucible-amber uppercase">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-4xl font-mono font-black text-crucible-navy uppercase tracking-tight mt-1 leading-none">
                Contact Crucible.
              </h2>
              <p className="text-xs font-semibold text-crucible-slate mt-4 leading-relaxed max-w-sm">
                Have questions regarding Crucible membership, incubator studio applications, compute resources, or corporate joint-ventures? Drop us a line.
              </p>
            </div>

            {/* Icons */}
            <div className="flex flex-col gap-4 font-mono text-xxs font-bold text-crucible-slate mt-10">
              <div className="flex items-center gap-3.5">
                <div className="p-2 bg-crucible-bg border border-crucible-navy/5 rounded-full text-crucible-amber">
                  <Mail className="w-4 h-4" />
                </div>
                <span>forge@crucible.algoforce.ai</span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2 bg-crucible-bg border border-crucible-navy/5 rounded-full text-crucible-amber">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>100 Crucible Way, San Francisco, CA</span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2 bg-crucible-bg border border-crucible-navy/5 rounded-full text-crucible-amber">
                  <Globe className="w-4 h-4" />
                </div>
                <span>www.crucible.algoforce.ai</span>
              </div>
            </div>
          </div>

          {/* Form container */}
          <div className="p-8 md:p-12 rounded-3xl bg-white border border-crucible-navy/5 shadow-sm flex flex-col justify-center">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-crucible-navy/60 uppercase">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-crucible-bg/60 border border-crucible-navy/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-crucible-navy/35 focus:outline-none focus:border-crucible-amber focus:bg-white transition-all text-crucible-navy resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-crucible-amber hover:text-white flex items-center justify-center gap-2 group transition-all duration-300 shadow-md mt-2"
                >
                  <span>Send Message</span>
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
                  <h3 className="text-2xl font-mono font-black text-crucible-navy uppercase tracking-tight">Message Dispatched.</h3>
                  <p className="text-xs font-semibold text-crucible-slate mt-3 leading-relaxed max-w-xs">
                    Thank you, **{formData.name}**. Your transmission has been captured. We will route it to the appropriate chapter coordinator and respond shortly.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
