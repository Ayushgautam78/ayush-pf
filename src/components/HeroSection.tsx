"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HermesCharacter } from "./HermesCharacter";
import { GoldDust } from "./GoldDust";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as const;
const RING_TEXT =
  "AYUSH GAUTAM ✦ CREATIVE ENGINEER ✦ STRUCTURE AND INSTINCT ✦ AYUSH GAUTAM ✦ CREATIVE ENGINEER ✦ STRUCTURE AND INSTINCT ✦ ";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const bustRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const scrub = (target: Element | null, vars: gsap.TweenVars, end = "bottom top") =>
        gsap.to(target, {
          ...vars,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end, scrub: true },
        });

      scrub(nameRef.current, { yPercent: -28, opacity: 0.1 });
      scrub(ringRef.current, { yPercent: -10, scale: 1.25, opacity: 0 });
      scrub(bustRef.current, { yPercent: 10, scale: 0.94, opacity: 0.2 });
      scrub(metaRef.current, { y: -40, opacity: 0 }, "40% top");
    }, sectionRef);

    // Depth on pointer move: each layer shifts by a different amount
    const layers = [
      { el: nameRef.current?.firstElementChild, depth: -12 },
      { el: ringRef.current?.firstElementChild, depth: 10 },
      { el: bustRef.current?.firstElementChild, depth: 20 },
    ].map(({ el, depth }) => ({
      depth,
      x: gsap.quickTo(el as Element, "x", { duration: 1.1, ease: "power3" }),
      y: gsap.quickTo(el as Element, "y", { duration: 1.1, ease: "power3" }),
    }));

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((layer) => {
        layer.x(nx * layer.depth);
        layer.y(ny * layer.depth * 0.6);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[540px] overflow-hidden"
      aria-label="Ayush Gautam, Creative Engineer"
      style={{
        background:
          "radial-gradient(ellipse 62% 58% at 50% 62%, #1b2750 0%, #0d1326 46%, var(--bg-primary) 100%)",
      }}
    >
      <GoldDust />

      {/* Inscription ring: a halo behind the head */}
      <div
        ref={ringRef}
        className="absolute left-1/2 bottom-[-4svh] -translate-x-1/2 pointer-events-none will-change-transform"
        style={{ width: "min(84svh, 150vw)", aspectRatio: "1 / 1" }}
        aria-hidden="true"
      >
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.5, ease: EASE }}
        >
          <svg viewBox="0 0 400 400" className="hero-ring w-full h-full">
            <defs>
              <path id="hero-ring-path" d="M200 200 m-182 0 a182 182 0 1 1 364 0 a182 182 0 1 1 -364 0" />
            </defs>
            <circle cx="200" cy="200" r="194" fill="none" stroke="rgba(227,178,92,0.28)" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="172" fill="none" stroke="rgba(227,178,92,0.16)" strokeWidth="0.5" />
            <text fill="rgba(227,178,92,0.72)" fontSize="9.2" letterSpacing="2.15" fontFamily="var(--font-code), monospace">
              <textPath href="#hero-ring-path">{RING_TEXT}</textPath>
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Name: sits high so the bust only overlaps the bottom edge of the letters */}
      <div
        ref={nameRef}
        className="absolute inset-x-0 top-[11svh] sm:top-[9svh] flex justify-center will-change-transform select-none"
      >
        <h1
          className="flex font-[family-name:var(--font-display)] uppercase text-[var(--ivory)] leading-[0.92]"
          style={{ fontSize: "min(26.5vw, 50svh)" }}
          aria-label="Ayush Gautam"
        >
          {"AYUSH".split("").map((letter, i) => (
            <span key={i} className="inline-block overflow-hidden" aria-hidden="true">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.3, delay: 0.1 + i * 0.07, ease: EASE }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* Hermes bust: rests on the bottom edge of the screen */}
      <div
        ref={bustRef}
        className="absolute left-1/2 bottom-0 -translate-x-1/2 origin-bottom pointer-events-none will-change-transform"
        style={{ width: "min(70svh, 128vw)", aspectRatio: "1 / 1" }}
      >
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.25, ease: EASE }}
        >
          <HermesCharacter />
        </motion.div>
      </div>

      {/* Blend the bust's cut-off base into the next scene */}
      <div
        className="absolute inset-x-0 bottom-0 h-[20svh] pointer-events-none bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
        aria-hidden="true"
      />

      <motion.div
        ref={metaRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute inset-x-0 bottom-5 sm:bottom-9 px-[var(--content-padding)] flex items-end justify-between gap-6"
      >
        <div className="max-w-[15rem]">
          <p className="text-micro text-[var(--gold)] mb-2">Creative Engineer</p>
          <p className="hidden sm:block text-sm leading-relaxed text-[var(--text-secondary)]">
            Somewhere between structure and instinct.
          </p>
        </div>
        <div className="flex items-center gap-3 text-micro text-[var(--text-secondary)]">
          <span>Scroll</span>
          <span className="scroll-cue" aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
}
