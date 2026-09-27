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
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    if (e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger only if horizontal swipe gesture dominates
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
      if (deltaX < 0) {
        jumpToStage(Math.min(JOURNEY_STAGES.length - 1, activeIndex + 1));
      } else {
        jumpToStage(Math.max(0, activeIndex - 1));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const timer = setTimeout(() => {
      const calculateScroll = () => {
        const totalScroll = track.scrollWidth - window.innerWidth;
        return Math.max(0, totalScroll);
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
      className="relative w-full min-h-[520px] h-screen overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] flex flex-col justify-start sm:justify-between"
      aria-label="The Path and Journey"
    >
      {/* Background subtle crimson ambient depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(169,24,35,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Pinned Top Bar (Compact & Responsive) */}
      <div className="relative z-20 w-full pt-3 sm:pt-6 md:pt-8 px-4 sm:px-8 md:px-12 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 pb-2 border-b border-white/10">
          <div>
            <p className="text-micro text-[var(--crimson)] tracking-[0.25em] uppercase mb-1 font-semibold">
              Chronicles & Milestones
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)] uppercase tracking-wide">
              The Path
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hidden md:inline-flex items-center gap-1.5 text-micro text-[var(--text-secondary)] tracking-wider uppercase font-medium">
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
                className="w-8 h-8 rounded-full border border-white/15 bg-[#12141c] shadow-sm flex items-center justify-center text-[var(--ivory)] hover:border-[var(--crimson)] hover:text-[var(--crimson)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
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
                className="w-8 h-8 rounded-full border border-white/15 bg-[#12141c] shadow-sm flex items-center justify-center text-[var(--ivory)] hover:border-[var(--crimson)] hover:text-[var(--crimson)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
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
        <div className="max-w-7xl mx-auto w-full h-[2.5px] bg-white/10 mt-2 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-[var(--crimson)] transition-all duration-100 rounded-full shadow-[0_0_8px_rgba(169,24,35,0.6)]"
            style={{ width: `${Math.max(10, scrollProgress * 100)}%` }}
          />
        </div>
      </div>

      {/* Pinned Horizontal Translating Track (Centered & Thin & Fully Visible) */}
      <div
        className="relative z-10 w-full flex-1 flex items-start sm:items-center overflow-visible pt-3 sm:pt-0 pb-1 sm:py-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 items-center pl-4 sm:pl-10 md:pl-16 pr-4 sm:pr-10 md:pr-16 w-max will-change-transform"
        >
          {JOURNEY_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={stage.indexStr}
                onClick={() => jumpToStage(idx)}
                className={`relative flex flex-col justify-between w-[285px] sm:w-[340px] md:w-[370px] h-[310px] sm:h-[295px] p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                  isActive
                    ? "bg-[#141722]/95 border-[var(--crimson)] shadow-[0_14px_36px_rgba(169,24,35,0.28)] scale-[1.01]"
                    : "bg-[#11131a]/80 border-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.5)] hover:border-white/20 hover:bg-[#11131a]/95"
                }`}
              >
                <div>
                  {/* Top numeral and phase header */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                    <span className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold text-[var(--crimson)] tracking-widest leading-none">
                      {stage.numeral}
                    </span>
                    <span className="text-[0.62rem] font-mono text-[var(--ivory-dim)] tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/[0.06]">
                      PHASE {stage.indexStr}
                    </span>
                  </div>

                  {/* Period */}
                  <span className="inline-block text-[0.62rem] uppercase tracking-[0.2em] text-[var(--crimson)] font-semibold mb-0.5">
                    {stage.period}
                  </span>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold font-[family-name:var(--font-display)] text-[var(--ivory)] leading-tight mb-2 whitespace-pre-line tracking-wide">
                    {stage.title}
                  </h3>

                  {/* Thin Inset Content Box */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm">
                    <p className="text-[0.72rem] sm:text-[0.78rem] text-[var(--ivory-dim)] font-normal leading-relaxed line-clamp-3">
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Milestone pills + Phase tag */}
                <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-white/10">
                  <div className="flex flex-wrap gap-1">
                    {stage.milestones.slice(0, 3).map((m) => (
                      <span
                        key={m}
                        className="text-[0.58rem] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-md bg-[#181b25] text-[var(--ivory-dim)] border border-white/10"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <span className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full bg-[var(--crimson)]/15 text-[var(--crimson)] border border-[var(--crimson)]/35 whitespace-nowrap">
                    P{stage.indexStr}
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
                ? "w-7 h-2 bg-[var(--crimson)] shadow-[0_0_8px_rgba(169,24,35,0.6)]"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
