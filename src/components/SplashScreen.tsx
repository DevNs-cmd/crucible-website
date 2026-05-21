"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Monotonically increasing progress simulation
    let current = 0;
    const duration = 1200; // Total ms of loader
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      current += step + Math.random() * 3;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 800); // Complete animation time
        }, 400);
      }
      setProgress(Math.floor(current));
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Letters of the logo
  const letters = "CRUCIBLE".split("");

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.05,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-crucible-bg select-none tech-grid-bg"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-amber-radial pointer-events-none" />

          {/* Central Logo Reveal Group */}
          <div className="relative flex flex-col items-center gap-6 z-10">
            {/* Logo Cube SVG representing Crucible Logo */}
            <motion.div
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 10, scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-16 h-16 mb-4 flex items-center justify-center"
            >
              {/* Outer isometric cube structure */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Cube Top Face */}
                <path 
                  d="M 50 15 L 80 30 L 50 45 L 20 30 Z" 
                  fill="#D28E2B" 
                  stroke="#0F1D30" 
                  strokeWidth="4" 
                  strokeLinejoin="round"
                />
                {/* Cube Left Face */}
                <path 
                  d="M 20 30 L 50 45 L 50 80 L 20 65 Z" 
                  fill="#FDFDFD" 
                  stroke="#0F1D30" 
                  strokeWidth="4" 
                  strokeLinejoin="round"
                />
                {/* Cube Right Face */}
                <path 
                  d="M 50 45 L 80 30 L 80 65 L 50 80 Z" 
                  fill="#F5ECE0" 
                  stroke="#0F1D30" 
                  strokeWidth="4" 
                  strokeLinejoin="round"
                />
                {/* Eyes on left face (sleeping smiley cube face like logo) */}
                <path
                  d="M 33 46 Q 36 49 39 46" 
                  fill="none" 
                  stroke="#0F1D30" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                <path
                  d="M 43 51 Q 46 54 49 51" 
                  fill="none" 
                  stroke="#0F1D30" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />
                <path 
                  d="M 39 58 Q 41 60 43 58"
                  fill="none"
                  stroke="#0F1D30"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {/* Golden Core energy glow coming out of top */}
              <div className="absolute top-1 w-10 h-6 bg-crucible-gold/25 rounded-full blur-md animate-pulse" />
            </motion.div>

            {/* Letter reveal grid */}
            <div className="flex gap-2">
              {letters.map((letter, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1 * idx, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`text-4xl md:text-5xl font-mono font-black tracking-wider uppercase ${
                    idx >= 3 ? "text-crucible-amber" : "text-crucible-navy"
                  }`}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Micro Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xs md:text-sm font-mono tracking-[0.25em] text-crucible-slate uppercase text-center mt-1"
            >
              Where Founders Are Forged
            </motion.p>
          </div>

          {/* Loading percentage status bar */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3">
            <div className="font-mono text-xs tracking-widest text-crucible-slate/60 flex justify-between w-full">
              <span>FROM ALGOFORCE AI</span>
              <span>{progress.toString().padStart(3, "0")}%</span>
            </div>
            {/* Sleek light mode trackbar */}
            <div className="w-full h-[2px] bg-crucible-navy/5 overflow-hidden rounded-full relative">
              <motion.div
                className="h-full bg-gradient-to-r from-crucible-navy to-crucible-amber"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
