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
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden"
      aria-label="Hero: Ayush Portfolio"
    >
      {/* Background Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(217, 138, 8, 0.05) 0%, rgba(234, 229, 220, 0.98) 75%)",
        }}
        aria-hidden="true"
      />

      {/* Main Title Layer: BEHIND Hermes (z-10) */}
      <div
        ref={titleContainerRef}
        className="relative z-10 w-full px-4 flex flex-col items-center justify-center text-center select-none pointer-events-none will-change-transform"
      >
        <motion.h1
          ref={titleAyushRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-hero font-black tracking-[-0.04em] uppercase text-[var(--text-primary)] leading-[0.88]"
        >
          AYUSH
        </motion.h1>

        <motion.h2
          ref={titlePortfolioRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-hero font-black tracking-[-0.04em] uppercase text-[var(--text-secondary)] opacity-60 leading-[0.88] -mt-2 md:-mt-6"
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

      {/* Subtitle, Action Buttons & Directional Indicator (z-30) */}
      <div
        ref={subtitleRef}
        className="absolute bottom-8 md:bottom-12 left-0 right-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs text-[var(--text-muted)] tracking-[0.2em] uppercase mb-6"
        >
          Creative Developer
        </motion.p>

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
            className="text-[var(--text-muted)] opacity-60"
          >
            <path
              d="M6 0v18m0 0l-4-4m4 4l4-4"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>

      {/* Bottom subtle divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[var(--off-white-faint)] to-transparent" />
      </div>
    </section>
  );
}
