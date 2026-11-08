"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TECH_ITEMS } from "./TechLogos";

gsap.registerPlugin(ScrollTrigger);

const HEADING_WORDS = [
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

// Repeated so each half of the track is wider than any screen
const TICKER_ITEMS = [...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS, ...TECH_ITEMS];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // The sentence lights up word by word as you read down it
      const words = headingRef.current?.querySelectorAll(".word");
      if (words) {
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 78%",
              end: "bottom 45%",
              scrub: true,
            },
          }
        );
      }

      if (copyRef.current) {
        gsap.from(copyRef.current.children, {
          y: 28,
          opacity: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: copyRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-[2] bg-[var(--bg-primary)] overflow-hidden pt-16 sm:pt-28 md:pt-36"
      aria-label="About and Background"
    >
      <div className="meander absolute top-0 inset-x-0" aria-hidden="true" />

      {/* Right column stays empty on desktop: the sword hangs there */}
      <div className="px-[var(--content-padding)] lg:pr-[28vw] pb-12 sm:pb-20 md:pb-28">
        <p className="text-micro text-[var(--gold)] mb-4 sm:mb-8">About</p>

        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-display)] text-[2.15rem] sm:text-5xl md:text-6xl xl:text-7xl leading-[1.08] text-[var(--ivory)] mb-8 sm:mb-14"
        >
          {HEADING_WORDS.map((item, i) => (
            <span
              key={i}
              className={`word inline-block mr-[0.26em] ${item.isAccent ? "text-[var(--gold)]" : ""}`}
            >
              {item.text}
            </span>
          ))}
        </h2>

        <div ref={copyRef} className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 pt-5 border-t border-[var(--border-medium)]">
          <p className="md:col-span-7 text-base md:text-lg text-[var(--ivory-dim)] leading-relaxed">
            I specialize in bridging artistic visual direction and robust software engineering. Whether building high-performance web applications, interactive motion experiences, or developer toolkits, my focus is always on speed, beauty, and effortless user flow.
          </p>
          <p className="md:col-span-5 text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
            From architecture planning to the final micro-interaction, every detail is engineered with intention and craft. I take the work seriously, so the results do not have to explain themselves.
          </p>
        </div>
      </div>

      {/* Skills: the type is the design, two rows drifting against each other */}
      <div className="border-t border-[var(--border-medium)] pt-4 sm:pt-6 pb-6 sm:pb-10">
        <p className="text-micro text-[var(--gold)] px-[var(--content-padding)] mb-3 sm:mb-5">My Skills</p>

        <div className="ticker-row overflow-hidden">
          <div className="ticker-track">
            {TICKER_ITEMS.map((tech, index) => (
              <span
                key={`${tech.name}-${index}`}
                className="flex items-center gap-4 sm:gap-6 pr-6 sm:pr-10 font-[family-name:var(--font-display)] text-3xl sm:text-5xl lg:text-6xl text-[var(--ivory)] whitespace-nowrap"
              >
                {tech.name}
                <span className="w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                  {tech.svg("#e3b25c")}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="ticker-row overflow-hidden mt-2 sm:mt-3" aria-hidden="true">
          <div className="ticker-track reverse">
            {TICKER_ITEMS.map((tech, index) => (
              <span
                key={`${tech.name}-${index}`}
                className="text-outline pr-8 sm:pr-14 font-[family-name:var(--font-display)] text-3xl sm:text-5xl lg:text-6xl whitespace-nowrap"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
