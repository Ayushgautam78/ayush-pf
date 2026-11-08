"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // A short lerp settles quickly once the wheel stops; a long duration made
    // the page keep gliding on its own after the user had finished scrolling
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.12,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
    });

    setLenis(lenis);
    // Held still until the preloader lifts (Preloader mounts before this runs)
    if (document.documentElement.dataset.intro !== "done") lenis.stop();

    // Connect Lenis scroll to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Display type changes section heights once it swaps in
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(updateTicker);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
