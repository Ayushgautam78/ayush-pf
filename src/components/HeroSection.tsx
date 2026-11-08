"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HermesCharacter } from "./HermesCharacter";
import { DustMotes } from "./DustMotes";
import { useIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as const;
const RING_TEXT =
  "AYUSH GAUTAM · ΤΕΧΝΗ · CREATIVE ENGINEER · ΛΟΓΟΣ · STRUCTURE AND INSTINCT · ";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const bustRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ready = useIntroDone();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;
      const scrub = (target: Element | null, vars: gsap.TweenVars, end = "bottom top") =>
        gsap.to(target, {
          ...vars,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end, scrub: true },
        });

      scrub(nameRef.current, { yPercent: -30, opacity: 0.1 });
      scrub(discRef.current, { yPercent: 18, scale: 1.35 });
      scrub(bustRef.current, { yPercent: 10, scale: 0.94, opacity: 0.25 });
      scrub(metaRef.current, { y: -40, opacity: 0 }, "40% top");
    }, sectionRef);

    // Depth on pointer move: each layer shifts by a different amount. These
    // wrappers belong to GSAP alone; the entrance animations run on their
    // children, so the two never write the same transform.
    const layers = Array.from(sectionRef.current?.querySelectorAll<HTMLElement>("[data-depth]") ?? []).map((el) => ({
      depth: Number(el.dataset.depth),
      x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
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
        background: "radial-gradient(ellipse 70% 60% at 50% 60%, #171313 0%, var(--bg-primary) 70%)",
        // Width of the bust; the name is placed against its top edge
        ["--bust" as string]: "min(70svh, 150vw)",
      }}
    >
      <DustMotes />

      {/* The red sun: a hoplite shield behind the head */}
      <div
        ref={discRef}
        className="absolute left-1/2 bottom-[18svh] -translate-x-1/2 pointer-events-none will-change-transform"
        style={{ width: "min(64svh, 136vw)", aspectRatio: "1 / 1" }}
        aria-hidden="true"
      >
        <div data-depth="8" className="w-full h-full">
          <motion.div
            className="relative w-full h-full"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={ready ? { scale: 1, opacity: 1 } : undefined}
            transition={{ duration: 1.8, delay: 0.15, ease: EASE }}
          >
            <div className="absolute inset-[11%] rounded-full bg-[var(--red)]" />
            <svg viewBox="0 0 400 400" className="hero-ring absolute inset-0 w-full h-full">
              <defs>
                <path id="hero-ring-path" d="M200 200 m-188 0 a188 188 0 1 1 376 0 a188 188 0 1 1 -376 0" />
              </defs>
              <circle cx="200" cy="200" r="198" fill="none" stroke="rgba(242,238,230,0.18)" strokeWidth="0.5" />
              <text fill="rgba(242,238,230,0.7)" fontSize="9" letterSpacing="2.4" fontFamily="var(--font-code), monospace">
                <textPath href="#hero-ring-path">{RING_TEXT + RING_TEXT}</textPath>
              </text>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Name: set against the top of the bust, so the laurel and hair cover the
          lower part of the letters and the head reads as standing in front */}
      <div
        ref={nameRef}
        className="absolute inset-x-0 flex justify-center will-change-transform select-none [--lift:0.34em] sm:[--lift:0.46em]"
        style={{ fontSize: "min(15.5vw, 30svh)", top: "calc(100% - var(--bust) - var(--lift))" }}
      >
        <h1
          data-depth="-14"
          className="flex font-[family-name:var(--font-display)] font-extrabold uppercase text-[var(--bone)] leading-[0.86] tracking-[-0.05em]"
          style={{ fontSize: "inherit" }}
          aria-label="Ayush Gautam"
        >
          {"AYUSH".split("").map((letter, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.04em]" aria-hidden="true">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={ready ? { y: 0 } : undefined}
                transition={{ duration: 1.4, delay: 0.25 + i * 0.07, ease: EASE }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>

      {/* Hermes bust, in marble: rests on the bottom edge of the screen */}
      <div
        ref={bustRef}
        className="absolute left-1/2 bottom-0 -translate-x-1/2 origin-bottom pointer-events-none will-change-transform"
        style={{ width: "var(--bust)", aspectRatio: "1 / 1" }}
      >
        <div data-depth="22" className="w-full h-full">
          <motion.div
            className="w-full h-full"
            style={{ filter: "grayscale(1) contrast(1.12) brightness(1.04)" }}
            initial={{ opacity: 0, y: 90 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.6, delay: 0.35, ease: EASE }}
          >
            <HermesCharacter />
          </motion.div>
        </div>
      </div>

      {/* Blend the bust's cut-off base into the next scene */}
      <div
        className="absolute inset-x-0 bottom-0 h-[20svh] pointer-events-none bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
        aria-hidden="true"
      />

      <motion.div
        ref={metaRef}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 1.1 }}
        className="absolute inset-x-0 bottom-5 sm:bottom-9 px-[var(--content-padding)] flex items-end justify-between gap-6"
      >
        <div className="max-w-[16rem]">
          <p className="text-micro text-[var(--red)] mb-2">Creative Engineer</p>
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
