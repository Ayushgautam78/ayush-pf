"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useIntroDone } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Scroll reveals for the whole page, declared in markup:
 * - data-reveal="lines": each line rises out of a mask
 * - data-reveal="fade": the element lifts in
 * Each plays once, the first time it comes into view. With reduced motion
 * they fade in place instead.
 */
export function Reveals() {
  const introDone = useIntroDone();

  useEffect(() => {
    if (!introDone) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        splits.push(
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "reveal-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                ...(reduced ? { opacity: 0 } : { yPercent: 110 }),
                duration: 1.25,
                stagger: 0.09,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          })
        );
      });

      document.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, {
          y: reduced ? 0 : 36,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    });

    return () => {
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, [introDone]);

  return null;
}
