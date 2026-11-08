"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A red point with a trailing ring. The ring swells over anything clickable
 * and shows a word for elements with data-cursor="View" and the like.
 * Only for precise pointers; touch devices keep their native behaviour.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08 });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    let hovering: Element | null = null;

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, overwrite: "auto" });

      const target = (e.target as Element | null)?.closest("a, button, [data-cursor], select, label") ?? null;
      if (target === hovering) return;
      hovering = target;
      const text = target?.getAttribute("data-cursor") ?? "";
      label.textContent = text;
      gsap.to(ring, {
        scale: text ? 2.6 : target ? 1.7 : 1,
        backgroundColor: text ? "rgba(214,42,31,1)" : "rgba(214,42,31,0)",
        borderColor: text ? "rgba(214,42,31,1)" : "rgba(242,238,230,0.6)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(label, { opacity: text ? 1 : 0, duration: 0.25 });
      gsap.to(dot, { scale: target ? 0 : 1, duration: 0.3 });
    };

    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    const onDown = () => gsap.to(ring, { scale: "-=0.25", duration: 0.15, yoyo: true, repeat: 1 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[150] w-9 h-9 rounded-full border border-[rgba(242,238,230,0.6)] pointer-events-none flex items-center justify-center opacity-0"
        aria-hidden="true"
      >
        <span ref={labelRef} className="text-[0.32rem] font-mono font-semibold tracking-[0.15em] uppercase text-[var(--bone)] opacity-0" />
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[151] w-1.5 h-1.5 rounded-full bg-[var(--red)] pointer-events-none opacity-0"
        aria-hidden="true"
      />
    </>
  );
}
