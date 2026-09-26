"use client";

import { useEffect, useRef } from "react";

/**
 * HermesCharacter: SINGLE IMAGE, 9-FRAME INSTANT SWAP
 *
 * WHY this works:
 * - Opacity crossfading between two head orientations creates ghostly double-exposure = GLITCHY.
 * - Instead: ONE <img>, instant .src swap across 9 tightly-spaced frames.
 * - Smoothness comes from HEAVY mouse input interpolation (lerp 0.06), NOT from blending images.
 * - 9 frames = tiny angular difference between neighbors = almost imperceptible frame changes.
 * - Hysteresis at boundaries prevents frame jitter when cursor sits near a boundary.
 *
 * Rules:
 * 1. Exactly ONE <img> element. Zero stacking, zero opacity tricks.
 * 2. All 9 frames preloaded and decoded into browser cache.
 * 3. Frame changes are INSTANT (img.src swap). No CSS transitions on the image.
 * 4. Mouse input is heavily interpolated (lerp factor 0.06) for buttery cursor tracking.
 * 5. Hysteresis buffer (0.015) prevents rapid bouncing at frame boundaries.
 * 6. When mouse stops, Hermes is completely static: zero idle animation.
 */

// 9 frames in left-to-right gaze order (mouse X=0 → frame 0, mouse X=1 → frame 8)
const FRAMES = [
  "/hermes/hermes-0.webp",              // 0: strong left gaze
  "/hermes/hermes-1.webp",              // 1: left gaze
  "/hermes/hermes-left-stronger.webp",  // 2: left-of-center (strong)
  "/hermes/hermes-left-center.webp",    // 3: left-of-center (slight)
  "/hermes/hermes-2.webp",              // 4: center
  "/hermes/hermes-right-center.webp",   // 5: right-of-center (slight)
  "/hermes/hermes-right-stronger.webp", // 6: right-of-center (strong)
  "/hermes/hermes-3.webp",              // 7: right gaze
  "/hermes/hermes-4.webp",              // 8: strong right gaze
];

const FRAME_COUNT = FRAMES.length; // 9
const CENTER_FRAME = 4;

// 8 boundaries dividing 9 equal zones across normalized [0, 1] mouse X
// Zone widths: 1/9 ≈ 0.111 each
const BOUNDARIES: number[] = [];
for (let i = 1; i < FRAME_COUNT; i++) {
  BOUNDARIES.push(i / FRAME_COUNT);
}

// Hysteresis buffer: must cross boundary by this much to trigger frame change
const HYSTERESIS = 0.015;

// Mouse interpolation: lower = smoother/laggier, higher = snappier/jerkier
const LERP = 0.06;

// Convergence threshold
const EPSILON = 0.0002;

export function HermesCharacter() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Preload and decode ALL 9 frames into browser cache
    const preloaded: HTMLImageElement[] = [];
    FRAMES.forEach((src) => {
      const preImg = new Image();
      preImg.src = src;
      preImg.decoding = "sync";
      if (preImg.decode) {
        preImg.decode().catch(() => {});
      }
      preloaded.push(preImg);
    });

    // State
    let currentFrame = CENTER_FRAME;
    let smoothX = 0.5;
    let targetX = 0.5;
    let animId = 0;

    // Set initial frame
    img.src = FRAMES[CENTER_FRAME];

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetX = e.touches[0].clientX / window.innerWidth;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const tick = () => {
      // Interpolate smoothly toward target
      const diff = targetX - smoothX;
      if (Math.abs(diff) > EPSILON) {
        smoothX += diff * LERP;
      } else {
        smoothX = targetX;
      }

      // Clamp to [0, 1]
      const x = Math.max(0, Math.min(1, smoothX));

      // Determine target frame from smoothed position with hysteresis
      let newFrame = currentFrame;

      // Check if we should move DOWN (toward frame 0 / left)
      if (currentFrame > 0) {
        const boundary = BOUNDARIES[currentFrame - 1]; // boundary between currentFrame-1 and currentFrame
        if (x < boundary - HYSTERESIS) {
          newFrame = currentFrame - 1;
        }
      }

      // Check if we should move UP (toward frame 8 / right)
      if (currentFrame < FRAME_COUNT - 1) {
        const boundary = BOUNDARIES[currentFrame]; // boundary between currentFrame and currentFrame+1
        if (x > boundary + HYSTERESIS) {
          newFrame = currentFrame + 1;
        }
      }

      // Instant src swap: NO transition, NO animation
      if (newFrame !== currentFrame) {
        currentFrame = newFrame;
        img.src = FRAMES[currentFrame];
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="relative pointer-events-none select-none flex items-center justify-center"
      style={{
        width: "clamp(300px, 38vw, 560px)",
        aspectRatio: "1/1",
      }}
      aria-label="Hermes character"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/hermes/hermes-2.webp"
        alt="Hermes"
        width={1254}
        height={1254}
        loading="eager"
        decoding="sync"
        draggable={false}
        className="w-full h-full object-contain pointer-events-none select-none"
        style={{
          transition: "none",
          animation: "none",
          transform: "none",
          filter: "none",
          opacity: 1,
          willChange: "auto",
        }}
      />
    </div>
  );
}
