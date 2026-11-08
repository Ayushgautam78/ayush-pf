"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { damp, stickyProgress } from "@/lib/motion";
import { scrollToY } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Vertical scroll drives a horizontal track inside a CSS sticky stage.
 * Sticky is handled by the compositor, so unlike a JS pin it cannot jitter
 * during touch scrolling.
 */
export function useHorizontalTrack(
  wrapperRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void
) {
  const distanceRef = useRef(0);
  const callbackRef = useRef(onProgress);

  useEffect(() => {
    callbackRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    // The sticky stage is 100svh, which ignores the mobile address bar
    const stage = (wrapper.firstElementChild as HTMLElement | null) ?? wrapper;
    let lastHeight = 0;
    let x = 0;

    const measure = () => {
      const distance = Math.max(0, track.scrollWidth - window.innerWidth);
      const stageH = stage.offsetHeight;
      if (distance === distanceRef.current && stageH === lastHeight) return;
      distanceRef.current = distance;
      lastHeight = stageH;
      wrapper.style.height = `${distance + stageH}px`;
      ScrollTrigger.refresh();
    };

    const tick = (_time: number, deltaTime: number) => {
      const viewH = stage.offsetHeight;
      const rect = wrapper.getBoundingClientRect();
      if (rect.bottom < -viewH || rect.top > viewH * 2) return;
      const progress = stickyProgress(rect, viewH);
      x = damp(x, progress * distanceRef.current, 16, Math.min(deltaTime / 1000, 0.05));
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
      callbackRef.current(progress);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    measure();
    gsap.ticker.add(tick);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      gsap.ticker.remove(tick);
    };
  }, [wrapperRef, trackRef]);

  return useCallback(
    (progress: number) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const top = wrapper.getBoundingClientRect().top + window.scrollY;
      scrollToY(top + progress * distanceRef.current);
    },
    [wrapperRef]
  );
}
