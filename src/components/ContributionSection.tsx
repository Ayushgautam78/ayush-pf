"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ContributionProject {
  id: string;
  name: string;
  category: string;
  roleHint: string;
  logoSrc: string;
  officialUrl: string;
  descriptionHint: string;
}

const CONTRIBUTIONS: ContributionProject[] = [
  {
    id: "prismax",
    name: "PrismaX",
    category: "Decentralized Tools",
    roleHint: "Core Ecosystem & Community Tooling",
    logoSrc: "/projects/prismax.png",
    officialUrl: "https://x.com/PrismaX_AI",
    descriptionHint:
      "Contributed to tools, applications, and community integrations within the PrismaX ecosystem.",
  },
  {
    id: "sentient",
    name: "Sentient AGI",
    category: "Open AGI Protocols",
    roleHint: "Protocol & Community Utilities",
    logoSrc: "/projects/sentient-glyph.png",
    officialUrl: "https://sentient.foundation",
    descriptionHint:
      "Participated in developer workflows, community frameworks, and ecosystem tools supporting open-source AGI.",
  },
  {
    id: "gensyn",
    name: "Gensyn AI",
    category: "Decentralized Compute",
    roleHint: "Developer Testing & Community Ecosystem",
    logoSrc: "/projects/gensyn.svg",
    officialUrl: "https://gensyn.ai",
    descriptionHint:
      "Contributed to testing, developer experimentation, and community tooling around decentralized compute.",
  },
  {
    id: "fermah",
    name: "Fermah",
    category: "Universal Proof Layer",
    roleHint: "Monitoring & Bot Infrastructure",
    logoSrc: "/projects/fermah.svg",
    officialUrl: "https://fermah.xyz",
    descriptionHint:
      "Built notifications, tracking bots, and community utility infrastructure supporting the proof network.",
  },
];

/**
 * ContributionSection
 *
 * Black section with crisp white text.
 * Background video tone is calibrated to be bright, vibrant, and luminous.
 * The sword is strictly 0% visible in this section.
 */
export function ContributionSection() {
  const [selectedProject, setSelectedProject] =
    useState<ContributionProject | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);

  // Reliable video autoplay across all browsers (Chrome, Brave, Safari, Firefox)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback until user interaction
        const startPlayback = () => {
          if (video) {
            video.play().catch(() => {});
          }
          window.removeEventListener("scroll", startPlayback);
          window.removeEventListener("touchstart", startPlayback);
          window.removeEventListener("click", startPlayback);
        };
        window.addEventListener("scroll", startPlayback, { passive: true });
        window.addEventListener("touchstart", startPlayback, { passive: true });
        window.addEventListener("click", startPlayback, { passive: true });
      });
    }
  }, []);

  // Continuous JS ticker: runs smoothly across Brave and all browsers
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isHovered = false;
    let animId: number;
    const speed = 0.85;

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

  // Duplicate items for seamless infinite loop
  const tickerItems = [...CONTRIBUTIONS, ...CONTRIBUTIONS, ...CONTRIBUTIONS, ...CONTRIBUTIONS];

  return (
    <section
      id="contributions"
      className="relative z-10 w-full py-14 md:py-20 overflow-hidden bg-[var(--bg-primary)] text-[var(--ivory)]"
      aria-label="Projects I Have Contributed To"
    >
      <div id="work" className="absolute -top-20 left-0 w-0 h-0 pointer-events-none" aria-hidden="true" />

      {/* Cinematic Background Video: Editorial Monochrome Grey Aesthetic */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.78,
          zIndex: 0,
          pointerEvents: "none",
          filter: "grayscale(100%) contrast(1.25) brightness(0.92)",
        }}
      >
        <source src="/greek-ruins-loop.mp4" type="video/mp4" />
      </video>

      {/* Dotted Halftone / Micro-dot Black Dots Overlay for High Visual Impact */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0.88) 1.2px, transparent 1.2px)",
          backgroundSize: "4px 4px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Soft translucent vignette overlay that frames the video and keeps text crisp */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(9,10,13,0.12) 0%, rgba(9,10,13,0.8) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Subtle top/bottom borders on black */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" style={{ zIndex: 3 }} />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" style={{ zIndex: 3 }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-[var(--content-padding)] mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-micro text-[var(--crimson)] tracking-[0.25em] uppercase mb-2 font-semibold">
              Ecosystem Collaborations
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)] uppercase tracking-wide">
              Contributions
            </h2>
          </div>
          <p className="text-micro text-[var(--text-secondary)] tracking-widest uppercase">
            Click any tile for details
          </p>
        </div>

        {/* Infinite horizontal ticker with black edge vignette masks */}
        <div className="relative overflow-hidden w-full">
          {/* Left / Right edge masks fading from black */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />

          <div ref={trackRef} className="flex items-center w-max will-change-transform" style={{ backfaceVisibility: "hidden" }}>
            {tickerItems.map((project, index) => (
              <div
                key={`${project.id}-${index}`}
                onClick={() => setSelectedProject(project)}
                className="group flex-shrink-0 w-[280px] md:w-[320px] p-5 md:p-6 mx-3 rounded-xl border border-white/10 bg-[#0e1016]/85 backdrop-blur-md hover:border-[var(--crimson)] hover:shadow-[0_8px_30px_rgba(169,24,35,0.35)] transition-all duration-300 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              >
                {/* Top: Number + arrow */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.68rem] text-[var(--crimson)] font-mono font-semibold">
                    0{(index % CONTRIBUTIONS.length) + 1}
                  </span>
                  <svg
                    width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="text-[var(--text-secondary)] group-hover:text-[var(--crimson)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>

                {/* Logo + Name */}
                <div className="flex items-center gap-3">
                  <div className="relative h-7 w-20 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={project.logoSrc}
                      alt={project.name}
                      fill
                      sizes="80px"
                      className="object-contain object-left"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--ivory)] group-hover:text-[var(--crimson)] transition-colors truncate">
                      {project.name}
                    </h3>
                    <p className="text-[0.62rem] text-[var(--text-secondary)] truncate">
                      {project.category}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-lg p-6 md:p-8 rounded-2xl border border-white/15 bg-[#0f1118] shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-[var(--ivory)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-24 h-8 flex-shrink-0">
                <Image src={selectedProject.logoSrc} alt={selectedProject.name} fill sizes="96px" className="object-contain object-left" />
              </div>
              <div>
                <span className="text-micro text-[var(--text-secondary)] uppercase tracking-wider block">Overview</span>
                <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-[var(--ivory)]">{selectedProject.name}</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--crimson)]/10 border border-[var(--crimson)]/30 mb-4">
              <span className="text-[0.65rem] text-[var(--text-secondary)] uppercase tracking-wider block mb-1">Area of Contribution</span>
              <p className="text-sm font-semibold text-[var(--crimson)]">{selectedProject.roleHint}</p>
            </div>

            <p className="text-sm text-[var(--ivory-dim)] font-light mb-6 leading-relaxed">{selectedProject.descriptionHint}</p>

            <div className="flex items-center justify-between pt-3 border-t border-white/15">
              <a
                href={selectedProject.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-[var(--text-secondary)] hover:text-[var(--crimson)] transition-colors"
              >
                <span>Official Project</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-1.5 rounded-lg border border-white/20 text-sm text-[var(--ivory)] hover:bg-[var(--crimson)] hover:border-[var(--crimson)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
