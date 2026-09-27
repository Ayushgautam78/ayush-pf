"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export interface ContentStripItem {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  tagline: string;
  thumbnailWebp: string;
  thumbnailPng: string;
  liveUrl?: string; // undefined for bots
  platform: string;
  badgeText: string;
  isBot?: boolean;
  accentColor: string;
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
    platform: "Live on Vercel",
    badgeText: "GPU Canvas Studio",
    accentColor: "rgba(220, 38, 38, 0.9)",
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
    platform: "Live",
    badgeText: "Live Telemetry",
    accentColor: "rgba(169, 24, 35, 0.9)",
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
    platform: "Live",
    badgeText: "Hackathon Hub",
    accentColor: "rgba(185, 28, 28, 0.9)",
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
    platform: "Live",
    badgeText: "Particle Physics",
    accentColor: "rgba(239, 68, 68, 0.9)",
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
    platform: "Active Deployment",
    badgeText: "Bot Architecture",
    isBot: true,
    accentColor: "rgba(130, 18, 27, 0.9)",
    techTags: ["Discord.js", "Telegram API", "Redis"],
  },
];

export function ContentShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [botModalOpen, setBotModalOpen] = useState(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  // GSAP ScrollTrigger Pinned Horizontal Scroll on Mouse Scroll Down
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const timer = setTimeout(() => {
      const calculateScroll = () => {
        // Exact horizontal distance to align last card flush with right margin (zero empty space)
        const totalScroll = track.scrollWidth - window.innerWidth;
        return Math.max(0, totalScroll);
      };

      const totalScroll = calculateScroll();

      const tween = gsap.to(track, {
        x: () => -calculateScroll(),
        ease: "none",
        scrollTrigger: {
          id: "content-horizontal",
          trigger: container,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 0.8, // Snappy, direct response to mouse wheel
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const idx = Math.min(
              STRIP_ITEMS.length - 1,
              Math.floor(self.progress * STRIP_ITEMS.length)
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

  // Jump to specific card on button or dot click
  const jumpToCard = (idx: number) => {
    const st = stRef.current;
    if (!st) return;
    const targetProgress = idx / (STRIP_ITEMS.length - 1);
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      id="work"
      ref={containerRef}
      className="relative w-full h-screen min-h-[570px] max-h-[920px] bg-[#090a0e] border-t border-b border-white/10 flex flex-col justify-start sm:justify-between overflow-hidden select-none"
      aria-label="Content Showcase and Live Applications Strip"
    >
      {/* Background Subtle Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(169, 24, 35, 0.16) 0%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Top Header Bar & Progress Indicator */}
      <div className="relative z-20 w-full pt-3 sm:pt-6 md:pt-8 px-4 sm:px-8 md:px-12 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 pb-2 sm:pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--crimson)] animate-pulse" />
              <span className="text-[0.62rem] font-mono text-[var(--crimson-bright)] font-semibold uppercase tracking-[0.25em]">
                CREATIONS SUITE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)] uppercase tracking-wide">
              Featured Content & Live Apps
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[0.68rem] font-mono text-[var(--crimson-bright)] tracking-wider font-medium">
              0{activeIndex + 1} / 0{STRIP_ITEMS.length}
            </span>
          </div>
        </div>

        {/* Global Scrubbing Progress Bar */}
        <div className="max-w-7xl mx-auto w-full h-[2.5px] bg-white/10 mt-2 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-[var(--crimson)] transition-all duration-75 rounded-full shadow-[0_0_8px_rgba(169,24,35,0.6)]"
            style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
          />
        </div>
      </div>

      {/* Pinned Horizontal Translating Track (Centered & Tight on Mobile) */}
      <div className="relative z-10 w-full flex-1 flex items-center overflow-visible py-2 sm:py-4">
        {/* Left & Right Subtle Vignette Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#090a0e] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#090a0e] to-transparent z-20" />

        <div
          ref={trackRef}
          className="flex items-stretch gap-4 sm:gap-6 pl-4 sm:pl-10 md:pl-16 pr-4 sm:pr-10 md:pr-16 w-max will-change-transform"
          style={{ backfaceVisibility: "hidden" }}
        >
          {STRIP_ITEMS.map((item, idx) => {
            const isActive = idx === activeIndex;

            if (item.isBot) {
              return (
                <div
                  key={item.id}
                  onClick={() => setBotModalOpen(true)}
                  className={`group relative flex-shrink-0 w-[295px] sm:w-[340px] md:w-[370px] h-[355px] sm:h-[350px] md:h-[365px] rounded-2xl border transition-all duration-300 p-3.5 sm:p-5 flex flex-col justify-between cursor-pointer backdrop-blur-xl active:scale-[0.985] select-none overflow-hidden ${
                    isActive
                      ? "bg-[#141722]/95 border-[var(--crimson)] shadow-[0_12px_40px_rgba(169,24,35,0.35)] scale-[1.01]"
                      : "bg-[#0f1118]/85 border-white/10 hover:border-white/25 hover:bg-[#11131a]"
                  }`}
                  style={{ touchAction: "manipulation" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for ${item.title}`}
                >
                  {/* Top: Thumbnail Preview */}
                  <div>
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 mb-2.5 sm:mb-3 shadow-inner group/img flex-shrink-0">
                      <picture>
                        <source srcSet={item.thumbnailWebp} type="image/webp" />
                        <img
                          src={item.thumbnailPng}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </picture>

                      {/* Glint Light Sweep on Hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />

                      {/* Action Pill on Image */}
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-[var(--crimson)] text-white text-[0.62rem] font-bold shadow-md group-hover:scale-105 transition-transform flex items-center gap-1">
                        <span>Specs</span>
                        <span>✦</span>
                      </div>
                    </div>

                    {/* Meta Row: Numeral & Category */}
                    <div className="flex items-center justify-between gap-2 mb-1 sm:mb-1.5">
                      <span className="text-[0.68rem] font-mono text-[var(--crimson)] font-bold">
                        #{item.orderNumber}
                      </span>
                      <span className="text-[0.6rem] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-[var(--ivory)] group-hover:text-[var(--crimson-bright)] transition-colors leading-snug line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Tagline */}
                    <p className="text-[0.70rem] sm:text-[0.74rem] text-[var(--text-secondary)] line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed font-light">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Bottom Action Row (Functions as button) */}
                  <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 overflow-hidden min-w-0">
                      {item.techTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.56rem] sm:text-[0.58rem] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white/60 border border-white/5 truncate max-w-[85px]"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.techTags.length > 2 && (
                        <span className="hidden sm:inline-block text-[0.56rem] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white/60 border border-white/5">
                          +{item.techTags.length - 2}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[0.68rem] sm:text-xs font-semibold text-[var(--crimson-bright)] group-hover:underline flex-shrink-0">
                      <span>Explore Specs</span>
                      <span>✦</span>
                    </span>
                  </div>
                </div>
              );
            }

            // Web App Cards: Entire Card is an anchor button
            return (
              <a
                key={item.id}
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex-shrink-0 w-[295px] sm:w-[340px] md:w-[370px] h-[355px] sm:h-[350px] md:h-[365px] rounded-2xl border transition-all duration-300 p-3.5 sm:p-5 flex flex-col justify-between cursor-pointer backdrop-blur-xl active:scale-[0.985] select-none overflow-hidden ${
                  isActive
                    ? "bg-[#141722]/95 border-[var(--crimson)] shadow-[0_12px_40px_rgba(169,24,35,0.35)] scale-[1.01]"
                    : "bg-[#0f1118]/85 border-white/10 hover:border-white/25 hover:bg-[#11131a]"
                }`}
                style={{ touchAction: "manipulation" }}
                aria-label={`Launch ${item.title}`}
              >
                {/* Top: Thumbnail Preview */}
                <div>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 mb-2.5 sm:mb-3 shadow-inner group/img flex-shrink-0">
                    <picture>
                      <source srcSet={item.thumbnailWebp} type="image/webp" />
                      <img
                        src={item.thumbnailPng}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </picture>

                    {/* Glint Light Sweep on Hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />

                    {/* Action Pill on Image */}
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-[var(--crimson)] text-white text-[0.62rem] font-bold shadow-md group-hover:scale-105 transition-transform flex items-center gap-1">
                      <span>Launch</span>
                      <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 font-bold">
                        ↗
                      </span>
                    </div>
                  </div>

                  {/* Meta Row: Numeral & Category */}
                  <div className="flex items-center justify-between gap-2 mb-1 sm:mb-1.5">
                    <span className="text-[0.68rem] font-mono text-[var(--crimson)] font-bold">
                      #{item.orderNumber}
                    </span>
                    <span className="text-[0.6rem] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[var(--ivory)] group-hover:text-[var(--crimson-bright)] transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Tagline */}
                  <p className="text-[0.70rem] sm:text-[0.74rem] text-[var(--text-secondary)] line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed font-light">
                    {item.tagline}
                  </p>
                </div>

                {/* Bottom Action Row (Functions as button) */}
                <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-hidden min-w-0">
                    {item.techTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.56rem] sm:text-[0.58rem] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white/60 border border-white/5 truncate max-w-[85px]"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.techTags.length > 2 && (
                      <span className="hidden sm:inline-block text-[0.56rem] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white/60 border border-white/5">
                        +{item.techTags.length - 2}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[0.68rem] sm:text-xs font-semibold text-[var(--crimson-bright)] group-hover:underline flex-shrink-0">
                    <span>Launch App</span>
                    <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 font-bold">
                      ↗
                    </span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Pinned Bottom Dots Navigation */}
      <div className="relative z-20 pb-4 sm:pb-6 flex-shrink-0 flex items-center justify-center gap-2.5">
        {STRIP_ITEMS.map((s, i) => (
          <button
            key={s.orderNumber}
            type="button"
            onClick={() => jumpToCard(i)}
            aria-label={`Jump to ${s.title}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === activeIndex
                ? "w-7 h-2 bg-[var(--crimson)] shadow-[0_0_8px_rgba(169,24,35,0.6)]"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Bot Architecture Modal (For Bot Project) */}
      <AnimatePresence>
        {botModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setBotModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg p-5 sm:p-7 rounded-2xl border border-white/15 bg-[#0f1118] shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-[var(--ivory)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setBotModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--crimson)] flex items-center justify-center shadow-lg text-white font-bold text-lg">
                  🤖
                </div>
                <div>
                  <span className="text-[0.62rem] text-[var(--crimson-bright)] font-mono font-semibold tracking-wider uppercase block">
                    Autonomous Ecosystem Infrastructure
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-display)] text-[var(--ivory)]">
                    Discord & Telegram Bots
                  </h3>
                </div>
              </div>

              {/* Note */}
              <div className="p-3 rounded-xl bg-[var(--crimson)]/10 border border-[var(--crimson)]/30 mb-4 text-xs text-[var(--ivory-dim)] font-light leading-relaxed">
                <strong className="text-[var(--crimson-bright)] font-semibold">Active in Ecosystem:</strong> Operating directly inside Discord communities and Telegram channels for 24/7 security, anti-phishing protection, and protocol event telemetry without needing an external web interface.
              </div>

              {/* Highlights */}
              <div className="space-y-2.5 mb-5 text-xs text-[var(--text-secondary)] font-light">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                  <span className="text-[var(--ivory)] font-semibold block mb-0.5">🛡 Anti-Phishing & Member Verification</span>
                  Automated captcha screening, link heuristic filtering, and token-gated roles.
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                  <span className="text-[var(--ivory)] font-semibold block mb-0.5">⚡ Real-time Telemetry Dispatcher</span>
                  Instant webhook broadcasting network milestones and community transactions.
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                  <span className="text-[var(--ivory)] font-semibold block mb-0.5">⚙ Distributed Redis Worker Architecture</span>
                  Sub-150ms command latency with 99.9% fault-tolerant continuous uptime.
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-[0.65rem] font-mono text-[var(--text-secondary)]">
                  Status: 99.9% Uptime Verified
                </span>
                <button
                  type="button"
                  onClick={() => setBotModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[var(--crimson)] hover:bg-[var(--crimson-bright)] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
