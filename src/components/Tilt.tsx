"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

// Pointer-driven, so it stays on with reduced motion: it only moves when you do
const canHover = () => window.matchMedia("(pointer: fine)").matches;

/**
 * Tilts toward the pointer in 3D, with a soft glare that follows it.
 * Springs back to flat when the pointer leaves.
 */
export function Tilt({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const glare = glareRef.current;
    if (!el || !glare || !canHover()) return;

    gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });
    const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      rotateY((nx - 0.5) * max * 2);
      rotateX((0.5 - ny) * max * 2);
      glare.style.setProperty("--glare-x", `${nx * 100}%`);
      glare.style.setProperty("--glare-y", `${ny * 100}%`);
      glare.style.opacity = "1";
    };
    const onLeave = () => {
      rotateX(0);
      rotateY(0);
      glare.style.opacity = "0";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`relative will-change-transform ${className}`}>
      {children}
      <div ref={glareRef} className="tilt-glare" aria-hidden="true" />
    </div>
  );
}

/** Drifts toward the pointer while it is near, like it is being pulled. */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canHover()) return;

    const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x((e.clientX - (rect.left + rect.width / 2)) * strength);
      y((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      x(0);
      y(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
