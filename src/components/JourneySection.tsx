"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface JourneyStage {
  numeral: string;
  indexStr: string;
  period: string;
  title: string;
  description: string;
  milestones: string[];
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    numeral: "I",
    indexStr: "01",
    period: "The Genesis",
    title: "LEARNING\nTO CODE",
    description:
      "Started with boundless curiosity, tearing apart web systems to understand how they work. Writing first lines of code and discovering the craft of building digital tools from first principles.",
    milestones: ["Algorithms", "Web Foundations", "Architecture"],
  },
  {
    numeral: "II",
    indexStr: "02",
    period: "System Architecture",
    title: "ANDROID\nDEVELOPMENT",
    description:
      "Dove deep into mobile engineering with Android and Kotlin. Built native applications, learned asynchronous architectures, and discovered what makes software feel tactile and responsive in hands.",
    milestones: ["Kotlin & Jetpack", "State Machines", "Performance Tuning"],
  },
  {
    numeral: "III",
    indexStr: "03",
    period: "Decentralized Protocols",
    title: "ENTERING\nWEB3",
    description:
      "Explored open protocols, cryptographic verification, and decentralized computing. Built interfaces and developer utilities for emerging networks and community ecosystems.",
    milestones: ["Smart Contracts", "Cryptographic Tools", "Decentralized State"],
  },
  {
    numeral: "IV",
    indexStr: "04",
    period: "Ecosystem Utilities",
    title: "BUILDING\nFOR PEOPLE",
    description:
      "Directed focus toward human-centric community tools. Developed real-time telemetry bots, transaction trackers, and automation suites supporting thousands of active network members.",
    milestones: ["Community Bots", "Real-Time Telemetry", "Event Pipelines"],
  },
  {
    numeral: "V",
    indexStr: "05",
    period: "Present Day",
    title: "INDEPENDENT\nPRODUCTS",
    description:
      "Architecting focused, independent digital software. Combining classic Greek proportion and aesthetics with high-performance modern web engineering to solve tangible problems.",
    milestones: ["Creative Engineering", "High-End UX", "Production Ship"],
  },
];

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const timer = setTimeout(() => {
      const calculateScroll = () => {
        const totalScroll = track.scrollWidth - window.innerWidth + 120;
        return Math.max(100, totalScroll);
      };

      const totalScroll = calculateScroll();

      const tween = gsap.to(track, {
        x: () => -calculateScroll(),
        ease: "none",
        scrollTrigger: {
          id: "journey-horizontal",
          trigger: container,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const idx = Math.min(
              JOURNEY_STAGES.length - 1,
              Math.floor(self.progress * JOURNEY_STAGES.length)
            );
            setActiveIndex(idx);
          },
        },
      });

      stRef.current = tween.scrollTrigger ?? null;
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      stRef.current?.kill();
    };
  }, []);

  // Jump to stage
  const jumpToStage = (idx: number) => {
    const st = stRef.current;
    if (!st) return;
    const targetProgress = idx / (JOURNEY_STAGES.length - 1);
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      id="journey"
      ref={containerRef}
      className="relative w-full min-h-[520px] h-screen overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] flex flex-col justify-between"
      aria-label="The Path and Journey"
    >
      {/* Background warm yellow ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(245,158,11,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Pinned Top Bar (Compact & Responsive) */}
      <div className="relative z-20 w-full pt-4 sm:pt-6 md:pt-8 px-6 md:px-12 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2.5 border-b border-[var(--border-subtle)]">
          <div>
            <p className="text-micro text-[var(--accent)] tracking-[0.25em] uppercase mb-1 font-semibold">
              Chronicles & Milestones
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-[var(--text-primary)] uppercase tracking-wide">
              The Path
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden md:inline-flex items-center gap-1.5 text-micro text-[var(--text-muted)] tracking-wider uppercase font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="7" />
                <line x1="12" y1="6" x2="12" y2="10" />
              </svg>
              <span>Scroll down on mouse wheel to navigate</span>
            </span>

            {/* Quick jump arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => jumpToStage(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="w-8 h-8 rounded-full border border-[var(--border-medium)] bg-white shadow-sm flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Previous phase"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => jumpToStage(Math.min(JOURNEY_STAGES.length - 1, activeIndex + 1))}
                disabled={activeIndex === JOURNEY_STAGES.length - 1}
                className="w-8 h-8 rounded-full border border-[var(--border-medium)] bg-white shadow-sm flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                aria-label="Next phase"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="max-w-7xl mx-auto w-full h-[2.5px] bg-[var(--border-subtle)] mt-2 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-100 rounded-full"
            style={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
          />
        </div>
      </div>

      {/* Pinned Horizontal Translating Track (Centered & Fully Visible) */}
      <div className="relative z-10 w-full flex-1 flex items-center overflow-visible py-2 sm:py-4">
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 items-stretch pl-6 sm:pl-10 md:pl-16 pr-28 w-max will-change-transform"
        >
          {JOURNEY_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={stage.indexStr}
                onClick={() => jumpToStage(idx)}
                className={`relative flex flex-col justify-between w-[340px] sm:w-[410px] md:w-[470px] p-6 sm:p-7 md:p-8 rounded-3xl border transition-all duration-300 cursor-pointer backdrop-blur-2xl ${
                  isActive
                    ? "bg-[#faf6ef]/95 border-[var(--accent)] shadow-[0_20px_50px_rgba(217,138,8,0.2),inset_0_1px_1px_rgba(255,255,255,0.9)] scale-[1.01]"
                    : "bg-[#faf6ef]/80 border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:border-black/20 hover:bg-[#faf6ef]/95"
                }`}
              >
                <div>
                  {/* Top numeral and phase header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.06]">
                    <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[var(--accent)] tracking-widest">
                      {stage.numeral}
                    </span>
                    <span className="text-[0.68rem] font-mono text-[var(--text-muted)] tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-black/[0.04]">
                      PHASE {stage.indexStr}
                    </span>
                  </div>

                  {/* Period */}
                  <span className="inline-block text-[0.68rem] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold mb-1">
                    {stage.period}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--text-primary)] leading-[1.15] mb-2 whitespace-pre-line tracking-wide">
                    {stage.title}
                  </h3>

                  {/* Inset Translucent Content Box (Inspired by reference modal) */}
                  <div className="my-3 p-4 sm:p-5 rounded-2xl bg-black/[0.025] border border-black/[0.06] backdrop-blur-sm shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-normal leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Milestone pills + Phase tag */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {stage.milestones.map((m) => (
                      <span
                        key={m}
                        className="text-[0.66rem] tracking-wider uppercase font-semibold px-3 py-1 rounded-full bg-white/95 text-[var(--text-primary)] border border-black/[0.08] shadow-sm hover:border-[var(--accent)] transition-colors"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <span className="text-[0.68rem] font-semibold px-3 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                    Phase {stage.indexStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned Bottom Dots Navigation */}
      <div className="relative z-20 pb-4 sm:pb-6 flex-shrink-0 flex items-center justify-center gap-2.5">
        {JOURNEY_STAGES.map((s, i) => (
          <button
            key={s.indexStr}
            type="button"
            onClick={() => jumpToStage(i)}
            aria-label={`Jump to phase ${s.numeral}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === activeIndex
                ? "w-7 h-2 bg-[var(--accent)]"
                : "w-2 h-2 bg-[var(--border-medium)] hover:bg-[var(--text-muted)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
