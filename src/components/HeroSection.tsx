"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HermesCharacter } from "./HermesCharacter";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleAyushRef = useRef<HTMLHeadingElement>(null);
  const titlePortfolioRef = useRef<HTMLHeadingElement>(null);
  const hermesRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Parallax on AYUSH PORTFOLIO title behind Hermes
      gsap.to(titleContainerRef.current, {
        y: -140,
        scale: 0.94,
        opacity: 0.25,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      // Subtle scroll response on Hermes
      gsap.to(hermesRef.current, {
        y: -80,
        scale: 0.96,
        opacity: 0.35,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Subtitle fade
      gsap.to(subtitleRef.current, {
        y: -40,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "45% top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[var(--bg-primary)]"
      aria-label="Hero: Ayush Portfolio"
    >
      {/* Background Layer: Near-black foundation with subtle atmospheric depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(169, 24, 35, 0.07) 0%, rgba(9, 10, 13, 0.98) 75%)",
        }}
        aria-hidden="true"
      />

      {/* Main Title Layer: BEHIND Hermes (z-10) - Bold Ivory & Crimson Contrast */}
      <div
        ref={titleContainerRef}
        className="relative z-10 w-full px-4 flex flex-col items-center justify-center text-center select-none pointer-events-none will-change-transform"
      >
        <motion.h1
          ref={titleAyushRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-hero font-black tracking-[-0.04em] uppercase text-[var(--ivory)] leading-[0.88]"
        >
          AYUSH
        </motion.h1>

        <motion.h2
          ref={titlePortfolioRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-hero font-black tracking-[-0.04em] uppercase text-[var(--crimson)] leading-[0.88] -mt-2 md:-mt-6"
        >
          PORTFOLIO
        </motion.h2>
      </div>

      {/* Hermes Character Layer: PHYSICALLY IN FRONT of Title (z-20) */}
      <div
        ref={hermesRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none will-change-transform"
      >
        <HermesCharacter />
      </div>

      {/* Subtitle, Action Indicator & Directional Arrow (z-30) */}
      <div
        ref={subtitleRef}
        className="absolute bottom-8 md:bottom-12 left-0 right-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-[#12141a]/85 backdrop-blur-sm mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--crimson)] inline-block" />
          <span className="text-[0.68rem] text-[var(--ivory-dim)] tracking-[0.22em] uppercase font-medium">
            Creative Developer
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col items-center gap-2"
        >
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 24"
            fill="none"
            className="text-[var(--text-secondary)] opacity-70 hover:text-[var(--crimson)] transition-colors"
          >
            <path
              d="M6 0v18m0 0l-4-4m4 4l4-4"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </motion.div>
      </div>

      {/* Bottom subtle divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
