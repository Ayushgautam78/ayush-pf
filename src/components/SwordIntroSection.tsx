"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SwordIntroSection
 *
 * Compact starting section that anchors the celestial sword unsheathing.
 * The sword itself is seamlessly rendered and orchestrated by SingleSwordSystem
 * so it can rotate and travel down through About, Philosophy, Journey, and Contact.
 */
export function SwordIntroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sword-intro"
      ref={containerRef}
      className="relative w-full min-h-[110vh] flex flex-col items-center justify-between pt-24 pb-20 px-4 pointer-events-none"
      aria-label="The Celestial Blade"
    >
      {/* Scroll invitation */}
      <div
        ref={labelRef}
        className="relative z-10 text-center max-w-xl mx-auto will-change-transform flex flex-col items-center pt-8"
      >
        <span className="text-micro text-[var(--crimson)] tracking-[0.3em] uppercase mb-2 font-semibold">
          ( The Celestial Blade )
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)] uppercase tracking-wide mb-3">
          Unsheathe &amp; Explore
        </h2>
        <p className="text-[0.72rem] text-[var(--text-secondary)] tracking-[0.25em] uppercase font-light">
          Scroll down to draw the blade
        </p>
      </div>

      {/* Center breathing space where the sword rests and unsheathes */}
      <div className="w-full flex-1 min-h-[300px]" />

      {/* Bottom hint leading to Contributions */}
      <div className="relative z-10 text-center text-micro text-[var(--text-muted)] tracking-widest uppercase pb-4">
        <span>Proceeding to Ecosystem</span>
      </div>
    </section>
  );
}
