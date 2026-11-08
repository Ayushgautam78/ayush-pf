"use client";

import { useCallback, useRef, useState } from "react";
import { useHorizontalTrack } from "./useHorizontalTrack";
import { Tilt } from "./Tilt";

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
    title: "Learning to Code",
    description:
      "Started with boundless curiosity, tearing apart web systems to understand how they work. Writing first lines of code and discovering the craft of building digital tools from first principles.",
    milestones: ["Algorithms", "Web Foundations", "Architecture"],
  },
  {
    numeral: "II",
    indexStr: "02",
    period: "System Architecture",
    title: "Android Development",
    description:
      "Dove deep into mobile engineering with Android and Kotlin. Built native applications, learned asynchronous architectures, and discovered what makes software feel tactile and responsive in hands.",
    milestones: ["Kotlin & Jetpack", "State Machines", "Performance Tuning"],
  },
  {
    numeral: "III",
    indexStr: "03",
    period: "Decentralized Protocols",
    title: "Entering Web3",
    description:
      "Explored open protocols, cryptographic verification, and decentralized computing. Built interfaces and developer utilities for emerging networks and community ecosystems.",
    milestones: ["Smart Contracts", "Cryptographic Tools", "Decentralized State"],
  },
  {
    numeral: "IV",
    indexStr: "04",
    period: "Ecosystem Utilities",
    title: "Building for People",
    description:
      "Directed focus toward human-centric community tools. Developed real-time telemetry bots, transaction trackers, and automation suites supporting thousands of active network members.",
    milestones: ["Community Bots", "Real-Time Telemetry", "Event Pipelines"],
  },
  {
    numeral: "V",
    indexStr: "05",
    period: "Present Day",
    title: "Independent Products",
    description:
      "Architecting focused, independent digital software. Combining classic Greek proportion and aesthetics with high-performance modern web engineering to solve tangible problems.",
    milestones: ["Creative Engineering", "High-End UX", "Production Ship"],
  },
];

const LAST_STAGE = JOURNEY_STAGES.length - 1;

export function JourneySection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const railFillRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((progress: number) => {
    if (railFillRef.current) railFillRef.current.style.transform = `scaleX(${progress})`;
    setActiveIndex(Math.round(progress * LAST_STAGE));
  }, []);

  const jump = useHorizontalTrack(wrapperRef, trackRef, onProgress);
  const jumpToStage = (idx: number) => jump(idx / LAST_STAGE);

  return (
    <div
      id="journey"
      ref={wrapperRef}
      className="relative z-[2] w-full bg-[var(--bg-primary)]"
      style={{ height: "400svh" }}
      aria-label="The Path and Journey"
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 100%, #1f1110 0%, transparent 72%)",
        }}
      >
        <div className="px-[var(--content-padding)] mb-4 sm:mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-micro section-index mb-2 sm:mb-3"><span>Δ</span><span className="text-[var(--red)]">Chronicles &amp; Milestones</span></p>
            <h2 data-reveal="lines" className="text-section text-[var(--bone)]">The Path</h2>
          </div>
          <span className="text-micro text-[var(--text-secondary)] whitespace-nowrap">
            0{activeIndex + 1} / 0{JOURNEY_STAGES.length}
          </span>
        </div>

        <div>
          <div
            ref={trackRef}
            className="flex items-stretch gap-8 sm:gap-14 px-[var(--content-padding)] w-max will-change-transform"
          >
            {JOURNEY_STAGES.map((stage, idx) => {
              const isActive = idx === activeIndex;
              return (
                <article
                  key={stage.indexStr}
                  className={`relative flex-shrink-0 w-[82vw] sm:w-[480px] lg:w-[560px] transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <Tilt max={4}>
                    <div className="flex items-baseline gap-4 mb-2 sm:mb-3">
                      <span className="font-greek italic text-5xl sm:text-7xl leading-none text-[var(--red)]">
                        {stage.numeral}
                      </span>
                      <span className="text-micro text-[var(--text-secondary)]">{stage.period}</span>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-[1.7rem] sm:text-4xl leading-tight text-[var(--bone)] mb-2 sm:mb-3">
                      {stage.title}
                    </h3>
                    <p className="text-[0.86rem] sm:text-base leading-relaxed text-[var(--bone-dim)] mb-3">
                      {stage.description}
                    </p>
                    <p className="text-[0.64rem] sm:text-[0.68rem] font-mono tracking-wider uppercase text-[var(--text-secondary)]">
                      {stage.milestones.join(" · ")}
                    </p>
                  </Tilt>
                </article>
              );
            })}
          </div>
        </div>

        {/* The rail: SingleSwordSystem lays the sword along it, tip on the active phase */}
        <div className="px-[var(--content-padding)] mt-5 sm:mt-8">
          <div className="relative h-[clamp(44px,6.5vw,92px)]">
            <div id="journey-rail" className="absolute inset-x-0 top-0 bottom-0">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--border-medium)]" />
              <div ref={railFillRef} className="absolute inset-x-0 top-1/2 h-px bg-[var(--red)] origin-left" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
          <div className="relative h-7">
            {JOURNEY_STAGES.map((s, i) => (
              <button
                key={s.indexStr}
                type="button"
                onClick={() => jumpToStage(i)}
                aria-label={`Jump to phase ${s.numeral}`}
                className={`absolute top-0 -translate-x-1/2 px-2 py-1 font-greek italic text-lg cursor-pointer transition-colors duration-300 ${
                  i <= activeIndex ? "text-[var(--red-bright)]" : "text-[var(--text-muted)] hover:text-[var(--bone)]"
                }`}
                style={{ left: `${(i / LAST_STAGE) * 100}%` }}
              >
                {s.numeral}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
