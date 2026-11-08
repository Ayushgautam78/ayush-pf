"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useHorizontalTrack } from "./useHorizontalTrack";
import { Tilt } from "./Tilt";

export interface ContentStripItem {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  tagline: string;
  thumbnailWebp: string;
  thumbnailPng: string;
  liveUrl?: string; // undefined for bots
  isBot?: boolean;
  techTags: string[];
}

// 1st: PrismaX Content Maker (newly updated image), then the others in exact specified order
export const STRIP_ITEMS: ContentStripItem[] = [
  {
    id: "prismax-content-maker",
    orderNumber: "01",
    title: "PrismaX Content Maker",
    category: "Canvas Engine",
    tagline: "GPU canvas studio & Web3 social asset generator",
    thumbnailWebp: "/content-assets/prismax-content-maker.webp",
    thumbnailPng: "/content-assets/prismax-content-maker.png",
    liveUrl: "https://prismax-content-maker.vercel.app/",
    techTags: ["Canvas API", "WebGL", "TypeScript"],
  },
  {
    id: "prismax-tracker",
    orderNumber: "02",
    title: "PrismaX Content Tracker",
    category: "Analytics Engine",
    tagline: "Real-time X telemetry & social velocity dashboard",
    thumbnailWebp: "/content-assets/prismax-content-tracker.webp",
    thumbnailPng: "/content-assets/prismax-content-tracker.png",
    liveUrl: "https://prismax-x-tracker-rqdf.onrender.com/",
    techTags: ["Telemetry", "Next.js", "REST APIs"],
  },
  {
    id: "prismax-event-manager",
    orderNumber: "03",
    title: "PrismaX Event Manager",
    category: "Community Operations",
    tagline: "Ecosystem schedule & decentralized hackathon suite",
    thumbnailWebp: "/content-assets/prismax-event-manager.webp",
    thumbnailPng: "/content-assets/prismax-event-manager.png",
    liveUrl: "https://prismax-event-manager.vercel.app/",
    techTags: ["Schedule", "Framer", "Edge"],
  },
  {
    id: "prismax-birthday",
    orderNumber: "04",
    title: "PrismaX Happy Birthday",
    category: "Interactive App",
    tagline: "Interactive particle celebration & celebratory tribute",
    thumbnailWebp: "/content-assets/birthday-celebration-prismax.webp",
    thumbnailPng: "/content-assets/birthday-celebration-prismax.png",
    liveUrl: "https://prismax-happy-birthday.vercel.app/",
    techTags: ["Particles", "Web Audio", "Interactive"],
  },
  {
    id: "discord-telegram-bots",
    orderNumber: "05",
    title: "Discord & Telegram Bots",
    category: "Autonomous Systems",
    tagline: "24/7 security, anti-phishing & telemetry infrastructure",
    thumbnailWebp: "/content-assets/discord-telegram-bots.webp",
    thumbnailPng: "/content-assets/discord-telegram-bots.png",
    liveUrl: undefined, // No website needed for bots
    isBot: true,
    techTags: ["Discord.js", "Telegram API", "Redis"],
  },
];

const BOT_HIGHLIGHTS = [
  {
    title: "Anti-Phishing & Member Verification",
    body: "Automated captcha screening, link heuristic filtering, and token-gated roles.",
  },
  {
    title: "Real-time Telemetry Dispatcher",
    body: "Instant webhook broadcasting network milestones and community transactions.",
  },
  {
    title: "Distributed Redis Worker Architecture",
    body: "Sub-150ms command latency with 99.9% fault-tolerant continuous uptime.",
  },
];

function CardBody({ item, isActive, action }: { item: ContentStripItem; isActive: boolean; action: string }) {
  return (
    <>
      <div className="relative aspect-video overflow-hidden bg-[var(--bg-elevated)]">
        <picture>
          <source srcSet={item.thumbnailWebp} type="image/webp" />
          <img
            src={item.thumbnailPng}
            alt={item.title}
            loading="lazy"
            draggable={false}
            className={`w-full h-full object-cover transition-[filter,transform] duration-700 group-hover:scale-[1.03] ${
              isActive ? "" : "grayscale brightness-[0.55]"
            }`}
          />
        </picture>
        <span
          className={`absolute bottom-0 left-0 h-[3px] bg-[var(--red)] transition-[width] duration-700 ${isActive ? "w-full" : "w-0"}`}
          style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
          aria-hidden="true"
        />
      </div>

      <div className="flex items-start gap-3 sm:gap-5 pt-3 sm:pt-4">
        <span className="text-micro text-[var(--red)] pt-1.5">{item.orderNumber}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.03em] text-xl sm:text-2xl md:text-3xl leading-tight text-[var(--bone)] group-hover:text-[var(--red-bright)] transition-colors">
            {item.title}
          </h3>
          <p className="text-[0.82rem] sm:text-sm leading-snug text-[var(--text-secondary)] mt-1">{item.tagline}</p>
          <p className="hidden sm:block text-[0.66rem] font-mono tracking-wider uppercase text-[var(--text-muted)] mt-2">
            {item.category} · {item.techTags.join(" · ")}
          </p>
        </div>
        <span className="text-micro text-[var(--red)] whitespace-nowrap pt-1.5">{action}</span>
      </div>
    </>
  );
}

export function ContentShowcaseSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [botModalOpen, setBotModalOpen] = useState(false);

  const onProgress = useCallback((progress: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.04, progress)})`;
    setActiveIndex(Math.round(progress * (STRIP_ITEMS.length - 1)));
  }, []);

  const jump = useHorizontalTrack(wrapperRef, trackRef, onProgress);

  const cardClass =
    "group block flex-shrink-0 text-left cursor-pointer w-[min(86vw,calc((100svh-290px)*16/9))] sm:w-[min(70vw,calc((100svh-290px)*16/9))] lg:w-[min(58vw,calc((100svh-290px)*16/9))]";

  return (
    <div
      id="work"
      ref={wrapperRef}
      className="relative z-[1] w-full bg-[var(--bg-primary)]"
      style={{ height: "400svh" }}
      aria-label="Content Showcase and Live Applications Strip"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center select-none">
        <div className="w-full px-[var(--content-padding)] mb-3 sm:mb-6">
          <div className="flex items-end justify-between gap-4 pb-3">
            <div>
              <p className="text-micro section-index mb-2 sm:mb-3"><span>Β</span><span className="text-[var(--red)]">Creations Suite</span></p>
              <h2 data-reveal="lines" className="font-[family-name:var(--font-display)] font-bold uppercase tracking-[-0.04em] text-[1.7rem] sm:text-5xl md:text-6xl leading-[0.95] text-[var(--bone)]">
                Featured Content &amp; Live Apps
              </h2>
            </div>
            <span className="text-micro text-[var(--text-secondary)] whitespace-nowrap">
              0{activeIndex + 1} / 0{STRIP_ITEMS.length}
            </span>
          </div>
          <div className="h-px bg-[var(--border-medium)]">
            <div ref={barRef} className="h-full bg-[var(--red)] origin-left" style={{ transform: "scaleX(0.04)" }} />
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex items-start gap-5 sm:gap-8 px-[var(--content-padding)] w-max will-change-transform"
        >
          {STRIP_ITEMS.map((item, idx) =>
            item.isBot ? (
              <button
                key={item.id}
                type="button"
                onClick={() => setBotModalOpen(true)}
                className={cardClass}
                aria-label={`Open details for ${item.title}`}
                data-cursor="Specs"
              >
                <Tilt><CardBody item={item} isActive={idx === activeIndex} action="Specs +" /></Tilt>
              </button>
            ) : (
              <a
                key={item.id}
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
                aria-label={`Launch ${item.title}`}
                data-cursor="Open"
              >
                <Tilt><CardBody item={item} isActive={idx === activeIndex} action="Launch ↗" /></Tilt>
              </a>
            )
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4 sm:mt-6">
          {STRIP_ITEMS.map((s, i) => (
            <button
              key={s.orderNumber}
              type="button"
              onClick={() => jump(i / (STRIP_ITEMS.length - 1))}
              aria-label={`Jump to ${s.title}`}
              className="py-2.5 px-1 cursor-pointer"
            >
              <span
                className={`block h-[2px] transition-all duration-300 ${
                  i === activeIndex ? "w-8 bg-[var(--red)]" : "w-4 bg-[var(--border-medium)]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {botModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[var(--bg-primary)]/85 backdrop-blur-md"
            onClick={() => setBotModalOpen(false)}
            data-lenis-prevent
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Discord & Telegram Bots"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl max-h-[90svh] overflow-y-auto p-6 sm:p-9 border border-[var(--red-border)] bg-[var(--bg-surface)] text-[var(--bone)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                autoFocus
                onClick={() => setBotModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 text-xl text-[var(--text-secondary)] hover:text-[var(--red-bright)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ×
              </button>

              <p className="text-micro text-[var(--red)] mb-2 pr-10">Autonomous Ecosystem Infrastructure</p>
              <h3 className="font-[family-name:var(--font-display)] font-bold tracking-[-0.03em] text-3xl sm:text-4xl leading-tight mb-4">
                Discord &amp; Telegram Bots
              </h3>
              <p className="text-sm leading-relaxed text-[var(--bone-dim)] mb-5">
                Operating directly inside Discord communities and Telegram channels for 24/7 security, anti-phishing protection, and protocol event telemetry without needing an external web interface.
              </p>

              <div className="border-t border-[var(--border-medium)]">
                {BOT_HIGHLIGHTS.map((highlight, i) => (
                  <div key={highlight.title} className="flex gap-4 py-3.5 border-b border-[var(--border-medium)]">
                    <span className="text-micro text-[var(--red)] pt-0.5">0{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold mb-0.5">{highlight.title}</p>
                      <p className="text-[0.82rem] leading-relaxed text-[var(--text-secondary)]">{highlight.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 pt-5">
                <span className="text-[0.68rem] font-mono text-[var(--text-secondary)]">Status: 99.9% Uptime Verified</span>
                <button type="button" onClick={() => setBotModalOpen(false)} className="btn-red px-5 py-2.5">
                  Done
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
}
