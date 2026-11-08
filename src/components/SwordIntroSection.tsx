"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { INTRO, easeInOutCubic, lerp, range, stickyProgress } from "@/lib/motion";

const PANEL_BACKGROUND =
  "radial-gradient(ellipse 70% 55% at 50% 58%, #1c1514 0%, #0e0c0c 48%, var(--bg-primary) 100%)";

/**
 * SwordIntroSection
 *
 * The stage for the sword's first scene. The sword itself is rendered by
 * SingleSwordSystem; this owns everything behind it: the word that fills with
 * red as the blade is drawn, and the two panels that split along the cut to
 * reveal the next section, which sits directly underneath (see page.tsx).
 */
export function SwordIntroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<SVGSVGElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    const fill = fillRef.current;
    const caption = captionRef.current;
    const panelA = panelARef.current;
    const panelB = panelBRef.current;
    const slash = slashRef.current;
    const flash = flashRef.current;
    if (!container || !title || !fill || !caption || !panelA || !panelB || !slash || !flash) return;

    const update = () => {
      const viewH = window.innerHeight;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewH) return;
      const p = stickyProgress(rect, viewH);

      const drawn = range(p, INTRO.drawStart, INTRO.drawEnd);
      const titleOut = range(p, INTRO.drawEnd, INTRO.fallEnd);
      title.style.opacity = String(1 - titleOut);
      title.style.transform = `translate3d(0, ${lerp(0, -40, titleOut)}px, 0) scale(${lerp(0.96, 1.04, drawn)})`;
      fill.style.clipPath = `inset(0 ${100 - drawn * 100}% 0 0)`;
      caption.style.opacity = String(1 - titleOut);

      const cut = range(p, INTRO.slashStart, INTRO.slashEnd);
      const lineOut = range(p, INTRO.splitStart, INTRO.splitEnd);
      // The line runs right to left, following the blade
      slash.style.clipPath = `inset(0 0 0 ${(1 - cut) * 100}%)`;
      slash.style.opacity = cut > 0 ? String(1 - lineOut) : "0";

      const peak = range(p, INTRO.slashEnd - 0.02, INTRO.slashEnd) * (1 - range(p, INTRO.slashEnd, INTRO.slashEnd + 0.03));
      flash.style.opacity = String(peak);

      const split = easeInOutCubic(range(p, INTRO.splitStart, INTRO.splitEnd));
      panelA.style.transform = `translate3d(${-split * 5}%, ${-split * 82}%, 0)`;
      panelB.style.transform = `translate3d(${split * 5}%, ${split * 82}%, 0)`;
      const open = split >= 0.999;
      panelA.style.visibility = open ? "hidden" : "visible";
      panelB.style.visibility = open ? "hidden" : "visible";
    };

    gsap.ticker.add(update);
    update();
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <section
      id="sword-intro"
      ref={containerRef}
      className="relative z-10 w-full pointer-events-none"
      style={{ height: "460svh" }}
      aria-label="The Celestial Blade"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Both halves of the stage, split along the same diagonal as the cut */}
        <div
          ref={panelARef}
          className="absolute inset-[-1px] will-change-transform"
          style={{ background: PANEL_BACKGROUND, clipPath: "polygon(0 0, 100% 0, 100% 22%, 0 78%)" }}
        />
        <div
          ref={panelBRef}
          className="absolute inset-[-1px] will-change-transform"
          style={{ background: PANEL_BACKGROUND, clipPath: "polygon(0 78%, 100% 22%, 100% 100%, 0 100%)" }}
        />

        <div
          ref={titleRef}
          className="absolute left-0 right-0 top-[22%] sm:top-[17%] flex flex-col items-center will-change-transform"
        >
          <p className="text-micro text-[var(--red)] mb-3 sm:mb-5">The Celestial Blade</p>
          <h2 className="relative font-[family-name:var(--font-display)] font-extrabold text-[8.8vw] leading-none tracking-[-0.05em] uppercase whitespace-nowrap">
            <span className="text-outline">Unsheathe</span>
            <span
              ref={fillRef}
              aria-hidden="true"
              className="absolute inset-0 text-[var(--red)]"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              Unsheathe
            </span>
          </h2>
        </div>

        <p
          ref={captionRef}
          className="absolute left-0 right-0 bottom-[12%] text-center text-micro text-[var(--text-secondary)] px-6"
        >
          Scroll down to draw the blade
        </p>

        {/* The cut itself */}
        <svg
          ref={slashRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <line x1="100" y1="22" x2="0" y2="78" stroke="rgba(214,42,31,0.55)" strokeWidth="10" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="22" x2="0" y2="78" stroke="#ffffff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>

        <div
          ref={flashRef}
          className="absolute inset-0"
          style={{
            opacity: 0,
            mixBlendMode: "screen",
            background: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(214,42,31,0.25) 40%, rgba(214,42,31,0.06) 70%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
