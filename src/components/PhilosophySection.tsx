"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const line4Ref = useRef<HTMLDivElement>(null);
  const line5Ref = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const lines = [
        line1Ref.current,
        line2Ref.current,
        line3Ref.current,
        line4Ref.current,
        line5Ref.current,
      ];

      lines.forEach((line, i) => {
        if (!line) return;

        gsap.from(line, {
          y: 100,
          opacity: 0,
          rotateX: -15,
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        });

        // Horizontal slide: odd lines go left, even go right
        gsap.from(line, {
          x: i % 2 === 0 ? -60 : 60,
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            end: "top 40%",
            scrub: 1.5,
          },
        });
      });

      // Accent line animation
      if (accentRef.current) {
        gsap.from(accentRef.current, {
          scaleX: 0,
          scrollTrigger: {
            trigger: accentRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative py-[var(--section-padding)] px-[var(--content-padding)] min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Philosophy"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(200,184,138,0.3) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top label */}
        <p className="text-micro text-[var(--text-muted)] mb-16 md:mb-24 tracking-[0.25em]">
          (Philosophy)
        </p>

        {/* Main statement */}
        <div className="space-y-2 md:space-y-4" style={{ perspective: "600px" }}>
          <div ref={line1Ref}>
            <h2 className="text-section text-[var(--off-white-dim)]">
              I DON&apos;T BUILD
            </h2>
          </div>
          <div ref={line2Ref}>
            <h2 className="text-section text-[var(--off-white-dim)]">
              JUST ANOTHER
            </h2>
          </div>
          <div ref={line3Ref}>
            <h2 className="text-section text-[var(--text-primary)]">
              WEBSITE.
            </h2>
          </div>
        </div>

        {/* Accent divider */}
        <div
          ref={accentRef}
          className="my-12 md:my-20 h-px w-full origin-left"
          style={{
            background:
              "linear-gradient(to right, var(--text-primary), var(--border-medium), transparent)",
          }}
        />

        {/* Second statement */}
        <div className="space-y-2 md:space-y-4">
          <div ref={line4Ref}>
            <h2 className="text-section">I BUILD</h2>
          </div>
          <div ref={line5Ref}>
            <h2
              className="text-section"
              style={{ color: "var(--accent)" }}
            >
              USEFUL THINGS.
            </h2>
          </div>
        </div>

        {/* Supporting text */}
        <div className="mt-16 md:mt-24 max-w-md ml-auto">
          <p className="text-body text-[var(--off-white-dim)] font-light">
            Every project starts with a problem worth solving. No fluff, no
            filler. Just products that people actually use.
          </p>
        </div>
      </div>
    </section>
  );
}
