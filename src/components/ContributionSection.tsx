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
 * Revealed from underneath when the sword cuts the intro stage open, so it
 * must fill the viewport and carries a negative top margin to sit under the
 * intro's sticky stage. An index of rows: everything readable at once, each
 * row opening in place for detail.
 */
export function ContributionSection() {
  const [openId, setOpenId] = useState(CONTRIBUTIONS[0].id);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    // Pause video when offscreen to preserve mobile GPU/CPU resources
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="contributions"
      className="relative z-0 -mt-[100svh] min-h-[100svh] w-full flex flex-col justify-center overflow-hidden bg-[var(--bg-primary)] py-20 sm:py-24"
      aria-label="Projects I Have Contributed To"
    >
      {/* Ruins, toned to the night palette */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: "grayscale(1) contrast(1.15) brightness(0.85)" }}
      >
        <source src="/greek-ruins-loop.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,9,0.9) 0%, rgba(8,8,9,0.6) 55%, rgba(8,8,9,0.35) 100%), linear-gradient(180deg, var(--bg-primary) 0%, transparent 18%, transparent 82%, var(--bg-primary) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-7xl mx-auto px-[var(--content-padding)]">
        <p className="text-micro section-index mb-3"><span>Α</span><span className="text-[var(--red)]">Ecosystem Collaborations</span></p>
        <h2 data-reveal="lines" className="text-section text-[var(--bone)] mb-6 sm:mb-10">Contributions</h2>

        <div className="border-t border-[var(--border-medium)]">
          {CONTRIBUTIONS.map((project, index) => {
            const isOpen = openId === project.id;
            return (
              <div key={project.id} className="border-b border-[var(--border-medium)]">
                <button
                  type="button"
                  onClick={() => setOpenId(project.id)}
                  aria-expanded={isOpen}
                  className="group relative w-full flex items-center gap-3 sm:gap-6 py-3.5 sm:py-5 text-left cursor-pointer"
                >
                  <span
                    className="absolute inset-x-0 bottom-0 h-px bg-[var(--red)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                    style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                    aria-hidden="true"
                  />
                  <span className="text-micro text-[var(--red)] w-6 flex-shrink-0">0{index + 1}</span>
                  <span
                    className={`font-[family-name:var(--font-display)] font-semibold text-[1.8rem] sm:text-5xl md:text-6xl leading-none tracking-[-0.04em] transition-[color,transform] duration-500 group-hover:translate-x-3 ${
                      isOpen ? "text-[var(--red-bright)]" : "text-[var(--bone)] group-hover:text-[var(--red-bright)]"
                    }`}
                  >
                    {project.name}
                  </span>
                  <span className="hidden sm:block ml-auto text-micro text-[var(--text-secondary)] text-right">
                    {project.category}
                  </span>
                  <span
                    className={`ml-auto sm:ml-4 text-xl leading-none text-[var(--red)] transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-500"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transitionTimingFunction: "var(--ease-out-expo)",
                  }}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <div className="pb-4 sm:pb-6 pl-9 sm:pl-12 flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
                      <div className="relative h-8 w-24 flex-shrink-0 hidden sm:block">
                        <Image src={project.logoSrc} alt="" fill sizes="96px" className="object-contain object-left" />
                      </div>
                      <div className="max-w-2xl">
                        <p className="text-sm font-semibold text-[var(--bone)] mb-1">{project.roleHint}</p>
                        <p className="text-sm leading-relaxed text-[var(--bone-dim)]">{project.descriptionHint}</p>
                      </div>
                      <a
                        href={project.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="md:ml-auto flex-shrink-0 text-micro text-[var(--red)] hover:text-[var(--red-bright)] transition-colors"
                      >
                        <span className="link-underline">Official Project</span> ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
