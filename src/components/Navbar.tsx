"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Ecosystem", href: "/ecosystem" },
    { name: "Events", href: "/events" },
    { name: "Founders", href: "/founders" },
    { name: "AI Labs", href: "/ailabs" },
    { name: "Membership", href: "/membership" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-crucible-bg/85 backdrop-blur-md border-b border-crucible-navy/5 shadow-md shadow-crucible-navy/[0.01]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Brand Logo Container */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            {/* Minimal SVG Cube */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transition-transform duration-500 group-hover:scale-110">
                <path d="M 50 15 L 80 30 L 50 45 L 20 30 Z" fill="#D28E2B" stroke="#0F1D30" strokeWidth="5" strokeLinejoin="round"/>
                <path d="M 20 30 L 50 45 L 50 80 L 20 65 Z" fill="#FFFFFF" stroke="#0F1D30" strokeWidth="5" strokeLinejoin="round"/>
                <path d="M 50 45 L 80 30 L 80 65 L 50 80 Z" fill="#F4EDE1" stroke="#0F1D30" strokeWidth="5" strokeLinejoin="round"/>
                {/* Eyes */}
                <path d="M 33 46 Q 36 49 39 46" fill="none" stroke="#0F1D30" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 43 51 Q 46 54 49 51" fill="none" stroke="#0F1D30" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            
            {/* Logo text - CRU (Navy) CIBLE (Orange) */}
            <div className="flex font-mono text-xl font-black tracking-wide">
              <span className="text-crucible-navy transition-colors duration-300">CRU</span>
              <span className="text-crucible-amber transition-colors duration-300">CIBLE</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-semibold tracking-wide font-sans text-crucible-navy/70 hover:text-crucible-navy transition-colors duration-200 py-1.5"
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-crucible-amber rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-mono font-bold tracking-widest text-crucible-navy/60 hover:text-crucible-navy uppercase transition-colors"
            >
              Portal
            </Link>
            
            <Link
              href="/apply"
              className="relative overflow-hidden inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-crucible-navy bg-crucible-navy text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-transparent hover:text-crucible-navy transition-all duration-300 group"
            >
              <span>Join Ecosystem</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Burger Trigger for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-crucible-navy hover:text-crucible-amber transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden flex justify-end bg-crucible-navy/40 backdrop-blur-sm"
          >
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />
            
            {/* Drawer container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm h-full bg-crucible-bg border-l border-crucible-navy/5 p-8 flex flex-col justify-between shadow-2xl z-10"
            >
              <div>
                {/* Close handle & Logo */}
                <div className="flex items-center justify-between mb-12">
                  <div className="flex font-mono text-lg font-black tracking-wider">
                    <span className="text-crucible-navy">CRU</span>
                    <span className="text-crucible-amber">CIBLE</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-crucible-navy hover:text-crucible-amber transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Staggered Links */}
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-xl font-bold tracking-wide ${
                          pathname === link.href ? "text-crucible-amber" : "text-crucible-navy"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 border border-crucible-navy/10 rounded-full font-mono text-xs font-bold tracking-widest text-crucible-navy uppercase hover:bg-crucible-navy/5 transition-all"
                >
                  Founder Portal
                </Link>
                
                <Link
                  href="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-crucible-navy text-white rounded-full font-mono text-xs font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-1.5 hover:bg-crucible-amber transition-all duration-300"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
