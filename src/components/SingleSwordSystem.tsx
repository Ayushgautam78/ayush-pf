"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SingleSwordSystem
 * 
 * Manages the single celestial sword across the portfolio:
 * - Hidden during Hero (Hermes statue).
 * - Appears sheathed and unsheathes smoothly in SwordIntroSection with golden glint.
 * - COMPLETELY HIDDEN (0% visibility) in Contributions / Projects section.
 * - Reappears in About section with elegant rotating floating effect (~22deg).
 * - Rotates dynamically across Philosophy (~60deg).
 * - Aligns vertically (90deg) down the spine of Journey / The Path.
 * - Gracefully concludes and fades to 0 before Contact and Footer (no zoom trap, no lag).
 */
export function SingleSwordSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);
  const scabbardRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);

  // Physics-based smoothed state
  const state = useRef({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    opacity: 0,
    unsheathe: 0,
    lastScrollY: 0,
    scrollVelocity: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const sword = swordRef.current;
    const scabbard = scabbardRef.current;
    const glint = glintRef.current;
    if (!container || !sword || !scabbard || !glint) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    state.current.lastScrollY = window.scrollY;

    function tick(time: number, deltaTime: number) {
      if (!container || !sword || !scabbard || !glint) return;

      const viewH = window.innerHeight;
      const vw = window.innerWidth;
      const mobile = vw < 768;

      const dt = deltaTime ? Math.min(deltaTime / 1000, 0.08) : 0.016;
      const tSec = typeof time === "number" ? time : performance.now() / 1000;

      // Calculate instantaneous scroll velocity with smooth decay
      const currentScrollY = window.scrollY;
      const rawVelocity = (currentScrollY - state.current.lastScrollY) / (dt * 60);
      state.current.lastScrollY = currentScrollY;
      state.current.scrollVelocity = lerp(state.current.scrollVelocity, rawVelocity, 0.20);
      const scrollVel = clamp(state.current.scrollVelocity, -30, 30);

      const heroEl = document.getElementById("hero");
      const introEl = document.getElementById("sword-intro");
      const contribEl = document.getElementById("contributions");
      const workEl = document.getElementById("work");
      const aboutEl = document.getElementById("about");
      const journeyEl = document.getElementById("journey");
      const contactEl = document.getElementById("contact");

      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : viewH;
      const introRect = introEl ? introEl.getBoundingClientRect() : null;
      const contribRect = contribEl ? contribEl.getBoundingClientRect() : null;
      const workRect = workEl ? workEl.getBoundingClientRect() : null;
      const aboutRect = aboutEl ? aboutEl.getBoundingClientRect() : null;
      const journeyRect = journeyEl ? journeyEl.getBoundingClientRect() : null;
      const contactRect = contactEl ? contactEl.getBoundingClientRect() : null;

      let targetOpacity = 0;
      let targetX = 0;
      let targetY = 0;
      let targetRotation = 0;
      let targetScale = mobile ? 0.72 : 1.0;
      let targetUnsheathe = 0;

      // 1. HERO PHASE: Completely invisible while viewing Hermes statue in Hero
      if (heroBottom > viewH * 0.5) {
        targetOpacity = 0;
        targetUnsheathe = 0;
      }
      // 2. SWORD INTRO PHASE: Dramatic Discovery & Unsheathe with kinetic float
      else if (introRect && introRect.bottom > viewH * 0.1 && (!contribRect || contribRect.top > viewH * 0.15)) {
        const appearT = clamp((viewH * 0.5 - heroBottom) / (viewH * 0.25), 0, 1);
        let exitT = 1;
        if (contribRect && contribRect.top < viewH * 0.7) {
          exitT = clamp((contribRect.top - viewH * 0.15) / (viewH * 0.5), 0, 1);
        }

        targetOpacity = appearT * exitT * 0.32;
        const introProgress = clamp((viewH * 0.75 - introRect.top) / (introRect.height * 0.65), 0, 1);
        targetUnsheathe = introProgress;

        // Subtle ambient levitation + velocity responsiveness
        targetX = Math.cos(tSec * 2.2) * 3;
        targetY = Math.sin(tSec * 2.8) * 6 + clamp(scrollVel * 0.8, -25, 25);
        targetRotation = Math.cos(tSec * 2.4) * 1.5 + clamp(scrollVel * 0.2, -6, 6);
        targetScale = mobile ? 0.72 : 1.0;
      }
      // 3. CONTRIBUTIONS & WORK / CONTENT SHOWCASE: 100% HIDDEN over cards & video
      else if (
        (contribRect && contribRect.top <= viewH * 0.15 && contribRect.bottom > -50) ||
        (workRect && workRect.top <= viewH * 0.15 && workRect.bottom > -50)
      ) {
        targetOpacity = 0;
        targetUnsheathe = 1;
      }
      // 4. ABOUT PHASE: Reappears unsheathed with frequent harmonic rotation & gliding
      else if (aboutRect && aboutRect.top <= viewH * 0.85 && aboutRect.bottom > viewH * 0.15) {
        targetUnsheathe = 1;
        let enterT = 1;
        if (aboutRect.top > viewH * 0.5) {
          enterT = clamp((viewH - aboutRect.top) / (viewH * 0.5), 0, 1);
        }

        const aboutProgress = clamp((viewH * 0.85 - aboutRect.top) / (aboutRect.height + viewH * 0.3), 0, 1);

        // Frequent rhythmic movement across About:
        const baseAboutY = lerp(-viewH * 0.12, viewH * 0.12, aboutProgress);
        const waveAboutY = Math.sin(aboutProgress * Math.PI * 3) * (mobile ? 16 : 28);
        const waveAboutX = lerp(mobile ? vw * 0.05 : vw * 0.10, mobile ? -vw * 0.03 : vw * 0.18, aboutProgress)
                          + Math.sin(aboutProgress * Math.PI * 2) * (mobile ? 12 : 24);
        const waveAboutRot = lerp(12, 34, aboutProgress) + Math.sin(aboutProgress * Math.PI * 3) * 6;

        const velY = clamp(scrollVel * 1.3, -35, 35);
        const velRot = clamp(scrollVel * 0.28, -8, 8);
        const ambientY = Math.sin(tSec * 2.4) * 6;
        const ambientX = Math.cos(tSec * 1.9) * 4;
        const ambientRot = Math.cos(tSec * 2.1) * 1.5;

        targetX = waveAboutX + ambientX;
        targetY = baseAboutY + waveAboutY + velY + ambientY;
        targetRotation = waveAboutRot + velRot + ambientRot;
        targetScale = lerp(mobile ? 0.72 : 1.0, mobile ? 0.76 : 0.94, aboutProgress);
        targetOpacity = 0.18 * enterT;
      }
      // 5. JOURNEY PHASE: Dynamic vertical sweep down the spine, frequent stage wave, and kinetic banking
      else if (journeyRect && journeyRect.bottom > viewH * 0.1) {
        targetUnsheathe = 1;

        const journeyST = ScrollTrigger.getById("journey-horizontal");
        const pinProgress = journeyST
          ? journeyST.progress
          : clamp(-journeyRect.top / Math.max(1, journeyRect.height), 0, 1);

        if (journeyRect.top > 0) {
          // Entering Journey from About: rotate smoothly from 25deg to 90deg
          const enterT = clamp((viewH * 0.85 - journeyRect.top) / (viewH * 0.85), 0, 1);
          targetOpacity = lerp(0.18, 0.28, enterT);
          targetX = lerp(mobile ? vw * 0.08 : vw * 0.16, 0, enterT);
          targetY = lerp(-viewH * 0.03, mobile ? -viewH * 0.16 : -viewH * 0.22, enterT);
          targetRotation = lerp(25, 90, enterT);
          targetScale = lerp(mobile ? 0.68 : 0.92, mobile ? 0.82 : 1.05, enterT);
        } else {
          // While Journey is pinned: rich, frequent motion traversing the spine across stages!
          // 1. Long, expressive vertical sweep
          const baseSweepY = lerp(
            mobile ? -viewH * 0.16 : -viewH * 0.24,
            mobile ? viewH * 0.16 : viewH * 0.24,
            pinProgress
          );

          // 2. Frequent stage wave: 3 full harmonic waves as you scroll through all 4 milestones
          const stageWaveX = Math.sin(pinProgress * Math.PI * 6) * (mobile ? 20 : 42);

          // 3. Dynamic banking angle: blade aligns and tilts dynamically with each milestone turn
          const stageWaveRot = 90 + Math.sin(pinProgress * Math.PI * 6) * 12;

          // 4. Kinetic scroll velocity surge: immediate reaction whenever user scrolls
          const velocityY = clamp(scrollVel * 1.6, -45, 45);
          const velocityRot = clamp(scrollVel * 0.42, -14, 14);

          // 5. Continuous ethereal floating & breathing
          const ambientFloatY = Math.sin(tSec * 2.8) * (mobile ? 5 : 8);
          const ambientFloatX = Math.cos(tSec * 2.2) * (mobile ? 3 : 6);
          const ambientFloatRot = Math.cos(tSec * 2.5) * 2;

          targetX = stageWaveX + ambientFloatX;
          targetY = baseSweepY + velocityY + ambientFloatY;
          targetRotation = stageWaveRot + velocityRot + ambientFloatRot;
          targetScale = (mobile ? 0.82 : 1.05) + Math.sin(pinProgress * Math.PI * 6) * 0.04;
          targetOpacity = lerp(0.24, 0.36, Math.sin(Math.max(0.1, pinProgress) * Math.PI));
        }
      }
      // 6. CONTACT GATEWAY: Cinematic zoom-in into portal flare
      else if (contactRect && contactRect.bottom > 0) {
        targetUnsheathe = 1;
        targetX = Math.cos(tSec * 2.0) * 2;
        targetY = Math.sin(tSec * 2.5) * 4;
        targetRotation = 90;

        if (contactRect.top > 0) {
          const t = clamp((viewH - contactRect.top) / viewH, 0, 1);
          targetOpacity = lerp(0.18, 0.30, t);
          targetScale = mobile ? 0.85 : 1.05;
        } else {
          const scrollDistance = Math.max(1, contactRect.height - viewH);
          const zoomProgress = clamp(-contactRect.top / scrollDistance, 0, 1);

          const swordT = Math.min(zoomProgress / 0.6, 1);
          targetScale = lerp(mobile ? 0.85 : 1.05, mobile ? 4.5 : 10, Math.pow(swordT, 1.8));

          if (swordT <= 0.35) {
            targetOpacity = 0.28;
          } else {
            targetOpacity = clamp(lerp(0.28, 0, (swordT - 0.35) / 0.28), 0, 0.28);
          }
        }
      }
      // 7. FOOTER / OFF-SCREEN: COMPLETELY HIDDEN
      else {
        targetOpacity = 0;
        targetUnsheathe = 1;
      }

      // Physics Interpolation: smooth frame-to-frame damping
      const smoothFactor = clamp(1 - Math.pow(0.001, dt), 0.08, 0.22);
      const curr = state.current;
      curr.x = lerp(curr.x, targetX, smoothFactor);
      curr.y = lerp(curr.y, targetY, smoothFactor);
      curr.rotation = lerp(curr.rotation, targetRotation, smoothFactor);
      curr.scale = lerp(curr.scale, targetScale, smoothFactor);
      curr.opacity = lerp(curr.opacity, targetOpacity, smoothFactor);
      curr.unsheathe = lerp(curr.unsheathe, targetUnsheathe, smoothFactor);

      if (curr.opacity <= 0.01) {
        container.style.visibility = "hidden";
        container.style.opacity = "0";
      } else {
        container.style.visibility = "visible";
        container.style.opacity = String(curr.opacity);
        container.style.transform =
          `translate(-50%, -50%) translate(${curr.x}px, ${curr.y}px) rotate(${curr.rotation}deg) scale(${curr.scale})`;
      }

      // Unsheathe mechanics & glint
      if (curr.unsheathe <= 0.02) {
        sword.style.transform = "translateX(0%)";
        scabbard.style.transform = "translateX(0%) rotate(0deg) translateY(0px)";
        scabbard.style.opacity = "1";
        glint.style.opacity = "0";
      } else if (curr.unsheathe < 0.92) {
        const u = curr.unsheathe;
        sword.style.transform = `translateX(${-38 * u}%)`;
        const s = Math.min(u * 1.3, 1);
        scabbard.style.transform = `translateX(${38 * s}%) rotate(${10 * s}deg) translateY(${120 * s}px)`;
        scabbard.style.opacity = String(Math.max(0, 1 - s * 1.25));

        const g = clamp((u - 0.15) / 0.55, 0, 1);
        glint.style.opacity = String(g > 0 && g < 1 ? 0.85 : 0);
        glint.style.transform = `translateX(${lerp(-60, 240, g)}%)`;
      } else {
        sword.style.transform = "translateX(-38%)";
        scabbard.style.opacity = "0";
        // Subtle flare when scrolling fast during active sections
        const isFastScroll = Math.abs(scrollVel) > 10 && curr.opacity > 0.15;
        glint.style.opacity = isFastScroll ? "0.38" : "0";
        if (isFastScroll) {
          glint.style.transform = `translateX(${Math.sin(tSec * 4) * 120 + 60}%)`;
        }
      }
    }

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        width: "clamp(290px, 55vw, 880px)",
        height: "clamp(75px, 14vw, 190px)",
        transformOrigin: "50% 50%",
        pointerEvents: "none",
        touchAction: "none",
        userSelect: "none",
        zIndex: 9990,
        opacity: 0,
        visibility: "hidden",
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      {/* Unsheathed Blade */}
      <div
        ref={swordRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          willChange: "transform",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src="/greek-sword.webp"
            alt="Greek Sword"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter:
                "drop-shadow(0 0 10px rgba(0,0,0,0.5)) drop-shadow(0 0 10px rgba(169,24,35,0.12))",
            }}
          />
          {/* Gleaming Glint Streak */}
          <div
            ref={glintRef}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "35%",
              width: 140,
              pointerEvents: "none",
              opacity: 0,
              background:
                "linear-gradient(90deg, transparent, rgba(245,242,234,0.95) 50%, rgba(220,215,205,0.85) 70%, transparent)",
              filter: "blur(6px)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>

      {/* Scabbard (Drops away during sword-intro) */}
      <div
        ref={scabbardRef}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "71.8%",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          willChange: "transform, opacity",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src="/greek-scabbard.webp"
            alt="Greek Scabbard"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter:
                "drop-shadow(0 0 10px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(169,24,35,0.14))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
