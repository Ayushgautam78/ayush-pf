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
      className="relative w-full min-h-[48vh] md:min-h-[52vh] flex flex-col items-center justify-start pt-16 md:pt-20 px-4 pointer-events-none"
      aria-label="Scroll to explore"
    >
      {/* Scroll invitation */}
      <div
        ref={labelRef}
        className="relative z-10 text-center max-w-xl mx-auto will-change-transform"
      >
        <p className="text-micro text-[var(--accent)] tracking-[0.3em] uppercase mb-2 font-semibold">
          Scroll to explore
        </p>
      </div>

      {/* Spacer for sword unsheathing animation */}
      <div className="w-full flex-1 flex items-center justify-center min-h-[200px]" />
    </section>
  );
}
