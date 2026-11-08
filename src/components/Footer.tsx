"use client";

import { scrollToY } from "@/lib/scroll";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="relative z-[2] overflow-hidden bg-[var(--bg-primary)] text-[var(--ivory)] pt-10 sm:pt-16">
      <div className="meander absolute top-0 inset-x-0" aria-hidden="true" />

      <div className="px-[var(--content-padding)] flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 sm:mb-12">
        <div>
          <p className="text-micro text-[var(--gold)] mb-3">Somewhere between structure and instinct.</p>
          <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-3">
            Creative engineer crafting digital experiences and interactive web motion.
          </p>
          <a href="mailto:hello@ayush.dev" className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl hover:text-[var(--gold-bright)] transition-colors">
            hello@ayush.dev
          </a>
        </div>

        <div className="flex flex-col items-start md:items-end gap-5">
          <SocialLinks />
          <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
            <p>© {new Date().getFullYear()} Ayush Gautam</p>
            <button
              onClick={() => scrollToY(0)}
              className="hover:text-[var(--gold-bright)] transition-colors cursor-pointer group flex items-center gap-1"
            >
              <span>Top</span>
              <span className="group-hover:-translate-y-0.5 transition-transform text-[var(--gold)]">↑</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wordmark, cropped by the bottom of the page */}
      <p
        className="font-[family-name:var(--font-display)] uppercase text-center leading-[0.74] text-[var(--ivory)] select-none whitespace-nowrap -mb-[0.06em]"
        style={{ fontSize: "26.5vw" }}
        aria-hidden="true"
      >
        Ayush
      </p>
    </footer>
  );
}
