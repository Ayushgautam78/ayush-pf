"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TECH_ITEMS } from "./TechLogos";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const techTrackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Heading words animation: staggered reveal
      const words = headingRef.current?.querySelectorAll(".word");
      if (words) {
        gsap.from(words, {
          y: 80,
          opacity: 0,
          stagger: 0.04,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Tagline slide up
      if (taglineRef.current) {
        gsap.from(taglineRef.current, {
          y: 30,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Bio text
      if (bioRef.current) {
        gsap.from(bioRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Continuous JS ticker: runs smoothly across Brave and all browsers
  useEffect(() => {
    const track = techTrackRef.current;
    if (!track) return;

    let isHovered = false;
    let animId: number;
    const speed = 0.9;

    const onEnter = () => {
      isHovered = true;
    };
    const onLeave = () => {
      isHovered = false;
    };

    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    const step = () => {
      if (!isHovered) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && posRef.current >= halfWidth) {
          posRef.current -= halfWidth;
        }
        track.style.transform = `translate3d(-${posRef.current}px, 0, 0)`;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const headingWords = [
    { text: "I", isAccent: false },
    { text: "am", isAccent: false },
    { text: "Ayush,", isAccent: false },
    { text: "a", isAccent: false },
    { text: "creative", isAccent: false },
    { text: "engineer", isAccent: false },
    { text: "who", isAccent: false },
    { text: "turns", isAccent: false },
    { text: "ambitious", isAccent: false },
    { text: "ideas", isAccent: false },
    { text: "into", isAccent: false },
    { text: "resilient", isAccent: true },
    { text: "digital", isAccent: true },
    { text: "products.", isAccent: true },
  ];

  // Quadruple items for seamless infinite horizontal rotation
  const rotatingTechItems = [
    ...TECH_ITEMS,
    ...TECH_ITEMS,
    ...TECH_ITEMS,
    ...TECH_ITEMS,
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 py-24 md:py-36 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] overflow-hidden"
      aria-label="About and Background"
    >
      <div className="max-w-6xl mx-auto px-[var(--content-padding)] mb-16 md:mb-20">
        {/* Section Label */}
        <p className="text-micro text-[var(--crimson)] tracking-[0.3em] uppercase mb-8 md:mb-12 font-semibold">
          (About)
        </p>

        {/* Large Editorial Heading */}
        <div ref={headingRef} className="mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)] leading-[1.1] max-w-5xl tracking-wide">
            {headingWords.map((item, i) => (
              <span
                key={i}
                className={`word inline-block mr-[0.28em] ${
                  item.isAccent ? "text-[var(--crimson)]" : "text-[var(--ivory)]"
                }`}
              >
                {item.text}
              </span>
            ))}
          </h2>
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 pt-4 border-t border-[var(--border-subtle)]">
          <p
            ref={taglineRef}
            className="md:col-span-7 text-base md:text-lg text-[var(--ivory-dim)] font-light leading-relaxed"
          >
            I specialize in bridging artistic visual direction and robust software engineering. Whether building high-performance web applications, interactive motion experiences, or developer toolkits, my focus is always on speed, beauty, and effortless user flow.
          </p>
          <div
            ref={bioRef}
            className="md:col-span-5 text-sm md:text-base text-[var(--text-secondary)] font-light leading-relaxed space-y-4"
          >
            <p>
              From architecture planning to the final micro-interaction, every detail is engineered with intention and craft. I take the work seriously, so the results do not have to explain themselves.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Rotating Tech Strip (Black/Charcoal with Crimson Block Accents) */}
      <div className="w-full relative mt-4 pt-8 pb-6 border-t border-b border-white/10 bg-[#0e1015]">
        {/* Strip Header */}
        <div className="max-w-6xl mx-auto px-[var(--content-padding)] mb-5 flex items-center justify-between">
          <span className="text-micro tracking-[0.25em] uppercase text-[var(--crimson)] font-semibold">
            Technology Stack & Tools
          </span>
          <span className="text-micro tracking-widest uppercase text-[var(--text-secondary)] hidden sm:inline font-mono">
            Active Engineering Arsenal
          </span>
        </div>

        {/* Continuous Horizontal Ticker */}
        <div className="relative overflow-hidden w-full py-2">
          {/* Edge vignette fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0e1015] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0e1015] to-transparent z-10" />

          {/* JS RAF Driven Track (Brave-compatible) */}
          <div
            ref={techTrackRef}
            className="flex items-center w-max will-change-transform"
            style={{ backfaceVisibility: "hidden" }}
          >
            {rotatingTechItems.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="group flex items-center gap-3.5 p-1.5 pr-5 mx-2.5 rounded-2xl bg-[#13151c] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:border-[var(--crimson)] hover:shadow-[0_8px_25px_rgba(169,24,35,0.3)] hover:scale-[1.03] transition-all duration-300 flex-shrink-0 cursor-default select-none"
              >
                {/* Crimson Rounded Square Icon Block */}
                <div className="w-9 h-9 rounded-xl bg-[var(--crimson)] flex items-center justify-center flex-shrink-0 shadow-[0_2px_10px_rgba(169,24,35,0.4)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <div className="w-5 h-5 flex items-center justify-center text-[var(--ivory)]">
                    {tech.svg("#f5f2ea")}
                  </div>
                </div>

                {/* Modern Bold Typography */}
                <span className="text-xs sm:text-sm font-bold tracking-wide text-[var(--ivory)] group-hover:text-[var(--crimson-bright)] transition-colors whitespace-nowrap">
                  {tech.name}
                </span>

                {/* Subtle indicator dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[var(--crimson)] transition-colors ml-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
