"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  words: string[];
  direction?: "left" | "right";
  speed?: number;
}

export function Marquee({
  words,
  direction = "left",
  speed = 40,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    // Duplicate content for seamless loop
    const content = track.innerHTML;
    track.innerHTML = content + content;

    const totalWidth = track.scrollWidth / 2;
    const duration = totalWidth / speed;

    const tl = gsap.timeline({ repeat: -1 });

    if (direction === "left") {
      tl.fromTo(track, { x: 0 }, { x: -totalWidth, duration, ease: "none" });
    } else {
      tl.fromTo(
        track,
        { x: -totalWidth },
        { x: 0, duration, ease: "none" }
      );
    }

    // Speed up on scroll
    const scrollTl = gsap.to(tl, {
      timeScale: 3,
      paused: true,
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        if (velocity > 50) {
          gsap.to(tl, {
            timeScale: Math.min(1 + velocity / 500, 5),
            duration: 0.3,
          });
        } else {
          gsap.to(tl, { timeScale: 1, duration: 1 });
        }
      },
    });

    return () => {
      tl.kill();
      scrollTl.kill();
    };
  }, [direction, speed, words]);

  const text = words.join("  ·  ");

  return (
    <div
      ref={containerRef}
      className="overflow-hidden py-8 md:py-12 border-y border-[var(--off-white-ghost)]"
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <span className="text-section text-[var(--off-white-faint)] font-light tracking-tight mx-8">
          {text}
        </span>
      </div>
    </div>
  );
}
