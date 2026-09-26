"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServiceCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: string;
  chips: string[];
  gradient: string;
}

const SERVICES: ServiceCard[] = [
  {
    id: "motion-3d",
    badge: "EXPERIENCE DESIGN",
    title: "Interactive Motion & 3D Web",
    description:
      "Turning product concepts into cinematic scroll choreography, hardware-accelerated animations, and responsive interactive web experiences that wow users.",
    icon: "⚡",
    chips: ["GSAP & Scrub Physics", "Canvas & Frame Morphing", "Lenis Smooth Scroll", "GPU Micro-Animations"],
    gradient: "from-[var(--metallic-highlight)]/15 via-transparent to-transparent",
  },
  {
    id: "fullstack",
    badge: "ENGINEERING",
    title: "Full-Stack Web Architecture",
    description:
      "Building resilient web applications and creator tools powered by Next.js 16, React 19, and TypeScript. Optimized for sub-second render speeds and clean modular scalability.",
    icon: "💻",
    chips: ["Next.js App Router", "React 19 Server Components", "REST & GraphQL APIs", "PostgreSQL & Redis"],
    gradient: "from-[var(--slate-blue)]/20 via-transparent to-transparent",
  },
  {
    id: "web3-infra",
    badge: "DECENTRALIZED",
    title: "Web3 Protocols & Tooling",
    description:
      "Developing community bots, real-time event indexing, developer testing suites, and utility infrastructure supporting decentralized protocols.",
    icon: "🌐",
    chips: ["Protocol Telemetry", "Ecosystem Helper Bots", "Decentralized Compute Testing", "Event Radar"],
    gradient: "from-[var(--cold-blue-gray)]/20 via-transparent to-transparent",
  },
  {
    id: "design-systems",
    badge: "FOUNDATIONS",
    title: "UI/UX & Design Systems",
    description:
      "Creating token-driven design systems, accessible typography scales, and component libraries that ensure visual consistency from Figma prototypes to live code.",
    icon: "📐",
    chips: ["Design Tokens", "WCAG Accessibility", "Figma to React", "Tailwind Architecture"],
    gradient: "from-[var(--muted-bronze)]/20 via-transparent to-transparent",
  },
];

export function ServicesBentoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-10 py-16 md:py-24 px-[var(--content-padding)] border-t border-[var(--slate-blue)]/30"
      aria-label="Services & Capabilities"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--slate-blue)]/60 bg-[var(--bg-storm-deep)]/60 text-micro tracking-[0.2em] text-[var(--muted-bronze)] uppercase font-medium mb-3">
            <span>MY SERVICES</span>
          </div>

          <h2 className="text-section font-bold tracking-tight text-[var(--warm-ivory)] leading-tight mb-3">
            Diverse Services To Meet Needs
          </h2>

          <p className="text-body text-[var(--weathered-stone)] max-w-2xl font-light">
            Unveiling insights through UX research, engineering craft, interactive animation, and digital product excellence.
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="group relative p-7 md:p-9 rounded-2xl md:rounded-3xl border border-[var(--slate-blue)]/50 bg-[var(--bg-storm-deep)]/40 hover:bg-[var(--bg-storm-deep)]/75 hover:border-[var(--metallic-highlight)]/50 transition-all duration-400 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Subtle top background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}
                aria-hidden="true"
              />

              <div className="relative z-10">
                {/* Header row: Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full border border-[var(--slate-blue)]/70 bg-[var(--bg-primary)]/80 text-[var(--metallic-highlight)] font-mono tracking-wider uppercase font-medium">
                    {service.badge}
                  </span>
                  <span className="text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-[var(--warm-ivory)] group-hover:text-[var(--metallic-highlight)] transition-colors duration-300 mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-small text-[var(--weathered-stone)] leading-relaxed font-light mb-6">
                  {service.description}
                </p>
              </div>

              {/* Capability Chips */}
              <div className="relative z-10 flex flex-wrap gap-2 pt-4 border-t border-[var(--slate-blue)]/40">
                {service.chips.map((chip) => (
                  <span
                    key={chip}
                    className="text-[0.7rem] px-2.5 py-1 rounded-full border border-[var(--slate-blue)]/50 bg-[var(--bg-primary)]/60 text-[var(--weathered-stone)] group-hover:border-[var(--slate-blue)] transition-colors"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
