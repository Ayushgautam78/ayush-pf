"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { markIntroDone } from "@/lib/intro";
import { setScrollLocked } from "@/lib/scroll";

const LETTERS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const SEEN_KEY = "intro-seen";

/**
 * A short curtain on the first visit of a session: the Greek alphabet counts
 * up to Omega, then the curtain lifts. Returning visits within the session
 * get a quick fade instead.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const letter = letterRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    if (!root || !letter || !count || !bar) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage can be unavailable (private mode); just play the intro
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setScrollLocked(true);

    const finish = () => {
      setScrollLocked(false);
      root.style.display = "none";
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Nothing to remember it in; the intro plays again next time
      }
    };

    if (seen) {
      markIntroDone();
      const tween = gsap.to(root, { opacity: 0, duration: 0.4, onComplete: finish });
      return () => {
        tween.kill();
        setScrollLocked(false);
      };
    }

    const state = { p: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(state, {
      p: 1,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        letter.textContent = LETTERS[Math.min(LETTERS.length - 1, Math.floor(state.p * LETTERS.length))];
        count.textContent = String(Math.round(state.p * 100)).padStart(3, "0");
        bar.style.transform = `scaleX(${state.p})`;
      },
    })
      .to([letter, count, bar], { opacity: 0, duration: 0.3 }, "+=0.15")
      .add(markIntroDone)
      .to(root, reducedMotion ? { opacity: 0, duration: 0.6 } : { yPercent: -100, duration: 1, ease: "expo.inOut" }, "<0.1");

    return () => {
      tl.kill();
      setScrollLocked(false);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] bg-[var(--bg-primary)] flex flex-col items-center justify-center will-change-transform"
      aria-hidden="true"
    >
      <span
        ref={letterRef}
        className="font-greek italic text-[28vw] sm:text-[16vw] leading-none text-[var(--bone)]"
      >
        Α
      </span>
      <div className="mt-6 w-[min(320px,60vw)]">
        <div className="h-px bg-[var(--border-medium)]">
          <div ref={barRef} className="h-full bg-[var(--red)] origin-left" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="flex justify-between mt-3 text-micro text-[var(--text-secondary)]">
          <span>Ayush Gautam</span>
          <span ref={countRef}>000</span>
        </div>
      </div>
    </div>
  );
}
