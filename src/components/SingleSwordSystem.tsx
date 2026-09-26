"use client";

import { useEffect, useRef } from "react";

/**
 * SingleSwordSystem
 * 
 * Manages the single celestial sword across the portfolio:
 * - Hidden during Hero (Hermes statue).
 * - Appears and unsheathes smoothly in SwordIntroSection with golden glint.
 * - COMPLETELY HIDDEN (0% visibility) in Contributions / Projects section.
 * - Reappears in About section with elegant rotating floating effect (~22deg).
 * - Rotates dynamically across Philosophy (~60deg).
 * - Aligns vertically (90deg) down the spine of Journey / The Path.
 * - Grand cinematic zoom-in at ContactGatewaySection (scales up to 34x into the flare).
 */
export function SingleSwordSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);
  const scabbardRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const sword = swordRef.current;
    const scabbard = scabbardRef.current;
    const glint = glintRef.current;
    if (!container || !sword || !scabbard || !glint) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    let rafId: number;

    function tick() {
      if (!container || !sword || !scabbard || !glint) return;
      const viewH = window.innerHeight;
      const vw = window.innerWidth;
      const mobile = vw < 768;

      const heroEl = document.getElementById("hero");
      const introEl = document.getElementById("sword-intro");
      const contribEl = document.getElementById("contributions");
      const aboutEl = document.getElementById("about");
      const philEl = document.getElementById("philosophy");
      const journeyEl = document.getElementById("journey");
      const contactEl = document.getElementById("contact");

      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : viewH;
      const introRect = introEl ? introEl.getBoundingClientRect() : null;
      const contribRect = contribEl ? contribEl.getBoundingClientRect() : null;
      const aboutRect = aboutEl ? aboutEl.getBoundingClientRect() : null;
      const philRect = philEl ? philEl.getBoundingClientRect() : null;
      const journeyRect = journeyEl ? journeyEl.getBoundingClientRect() : null;
      const contactRect = contactEl ? contactEl.getBoundingClientRect() : null;

      // 1. STRICT PRIORITY: CONTRIBUTIONS SECTION MUST HAVE 0% SWORD VISIBILITY
      // If Contributions is entering the viewport or currently on screen, sword is 100% hidden
      const isContribEnteringOrActive =
        contribRect && contribRect.top < viewH * 1.05 && contribRect.bottom > -50;

      if (isContribEnteringOrActive) {
        container.style.opacity = "0";
        container.style.visibility = "hidden";
        container.style.pointerEvents = "none";
        rafId = requestAnimationFrame(tick);
        return;
      }

      let opacity = 0;
      let x = 0;
      let y = 0;
      let rotation = 0;
      let scale = mobile ? 0.72 : 1.0;
      let unsheatheProgress = 0;

      // 2. HERO PHASE: Invisible while viewing 3D Hermes head
      if (heroBottom > viewH * 0.45) {
        opacity = 0;
        unsheatheProgress = 0;
      }
      // 3. SWORD INTRO PHASE: Fade in & Unsheathe smoothly
      else if (introRect && introRect.bottom > 0) {
        const appearT = clamp((viewH * 0.45 - heroBottom) / (viewH * 0.35), 0, 1);
        
        // As we approach contributions, fade to 0 before contributions hits viewport
        let exitT = 1;
        if (contribRect && contribRect.top < viewH * 1.25) {
          exitT = clamp((contribRect.top - viewH * 1.05) / (viewH * 0.2), 0, 1);
        }

        opacity = appearT * exitT * 0.65;

        const introProgress = clamp((viewH * 0.85 - introRect.top) / (introRect.height * 0.85), 0, 1);
        unsheatheProgress = introProgress;

        x = 0;
        y = 0;
        rotation = 0;
        scale = mobile ? 0.72 : 1.0;
      }
      // 4. ABOUT PHASE: Reappears unsheathed with elegant rotation (~22deg)
      else if (aboutRect && aboutRect.bottom > viewH * 0.15) {
        unsheatheProgress = 1;

        // Fade in smoothly as contributions leaves
        let enterT = 1;
        if (aboutRect.top > viewH * 0.5) {
          enterT = clamp((viewH - aboutRect.top) / (viewH * 0.5), 0, 1);
        }

        opacity = 0.42 * enterT;

        const t = clamp((viewH * 0.85 - aboutRect.top) / aboutRect.height, 0, 1);
        x = lerp(0, mobile ? vw * 0.08 : vw * 0.16, t);
        y = lerp(0, -viewH * 0.03, t);
        rotation = lerp(0, 22, t);
        scale = lerp(mobile ? 0.72 : 1.0, mobile ? 0.68 : 0.92, t);
      }
      // 5. PHILOSOPHY PHASE: Dynamic floating rotation (~60deg)
      else if (philRect && philRect.bottom > viewH * 0.15) {
        opacity = 0.32;
        unsheatheProgress = 1;

        const t = clamp((viewH * 0.85 - philRect.top) / philRect.height, 0, 1);
        x = lerp(mobile ? vw * 0.08 : vw * 0.16, mobile ? vw * 0.05 : vw * 0.1, t);
        y = lerp(-viewH * 0.03, 0, t);
        rotation = lerp(22, 60, t);
        scale = lerp(mobile ? 0.68 : 0.92, mobile ? 0.75 : 0.98, t);
      }
      // 6. JOURNEY PHASE: Rotates vertically to 90deg down the spine
      else if (journeyRect && journeyRect.bottom > viewH * 0.1) {
        unsheatheProgress = 1;

        const t = clamp((viewH * 0.85 - journeyRect.top) / journeyRect.height, 0, 1);
        opacity = lerp(0.32, 0.55, t);
        x = lerp(mobile ? vw * 0.05 : vw * 0.1, 0, t);
        y = 0;
        rotation = lerp(60, 90, t);
        scale = lerp(mobile ? 0.75 : 0.98, mobile ? 0.85 : 1.05, t);
      }
      // 7. CONTACT GATEWAY: CINEMATIC ZOOM-IN OPENING COLLAPSE/COLLAB DOOR
      else if (contactRect) {
        unsheatheProgress = 1;
        x = 0;
        y = 0;
        rotation = 90;

        if (contactRect.top > 0) {
          const t = clamp((viewH - contactRect.top) / viewH, 0, 1);
          opacity = lerp(0.55, 0.7, t);
          scale = mobile ? 0.85 : 1.05;
        } else {
          const scrollDistance = Math.max(1, (contactRect.height || viewH * 2.2) - viewH);
          const zoomProgress = clamp(-contactRect.top / scrollDistance, 0, 1);

          const swordT = Math.min(zoomProgress / 0.65, 1);
          scale = lerp(mobile ? 0.85 : 1.05, mobile ? 18 : 34, Math.pow(swordT, 1.8));

          if (swordT <= 0.42) {
            opacity = 0.7;
          } else {
            opacity = lerp(0.7, 0, (swordT - 0.42) / 0.45);
          }
        }
      } else {
        opacity = 0;
      }

      container.style.visibility = opacity > 0 ? "visible" : "hidden";
      container.style.opacity = String(opacity);
      container.style.transform =
        `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;

      // Unsheathe mechanics
      if (unsheatheProgress <= 0.05) {
        sword.style.transform = "translateX(0%)";
        scabbard.style.transform = "translateX(0%) rotate(0deg) translateY(0px)";
        scabbard.style.opacity = "1";
        glint.style.opacity = "0";
      } else if (unsheatheProgress < 1) {
        const u = unsheatheProgress;
        sword.style.transform = `translateX(${-38 * u}%)`;
        const s = Math.min(u * 1.35, 1);
        scabbard.style.transform = `translateX(${36 * s}%) rotate(${8 * s}deg) translateY(${120 * s}px)`;
        scabbard.style.opacity = String(Math.max(0, 1 - s * 1.4));

        const g = clamp((u - 0.25) / 0.5, 0, 1);
        glint.style.opacity = String(g > 0 && g < 1 ? 0.95 : 0);
        glint.style.transform = `translateX(${lerp(-60, 240, g)}%)`;
      } else {
        sword.style.transform = "translateX(-38%)";
        scabbard.style.opacity = "0";
        glint.style.opacity = "0";
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        width: "clamp(460px, 58vw, 880px)",
        height: "clamp(110px, 14vw, 190px)",
        transformOrigin: "50% 50%",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 9990,
        opacity: 0,
        visibility: "hidden",
        transform: "translate(-50%, -50%)",
        transition: "opacity 0.15s ease-out",
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
                "drop-shadow(0 0 12px rgba(212,175,55,0.4)) drop-shadow(0 0 25px rgba(255,255,255,0.25))",
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
                "linear-gradient(90deg, transparent, rgba(255,245,210,0.95) 50%, rgba(212,175,55,0.9) 70%, transparent)",
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
              filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(212,175,55,0.25))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
