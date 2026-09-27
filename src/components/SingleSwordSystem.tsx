"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

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

  useEffect(() => {
    const container = containerRef.current;
    const sword = swordRef.current;
    const scabbard = scabbardRef.current;
    const glint = glintRef.current;
    if (!container || !sword || !scabbard || !glint) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    function tick() {
      if (!container || !sword || !scabbard || !glint) return;
      const viewH = window.innerHeight;
      const vw = window.innerWidth;
      const mobile = vw < 768;

      const heroEl = document.getElementById("hero");
      const introEl = document.getElementById("sword-intro");
      const contribEl = document.getElementById("contributions");
      const aboutEl = document.getElementById("about");
      const journeyEl = document.getElementById("journey");
      const contactEl = document.getElementById("contact");

      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : viewH;
      const introRect = introEl ? introEl.getBoundingClientRect() : null;
      const contribRect = contribEl ? contribEl.getBoundingClientRect() : null;
      const aboutRect = aboutEl ? aboutEl.getBoundingClientRect() : null;
      const journeyRect = journeyEl ? journeyEl.getBoundingClientRect() : null;
      const contactRect = contactEl ? contactEl.getBoundingClientRect() : null;

      let opacity = 0;
      let x = 0;
      let y = 0;
      let rotation = 0;
      let scale = mobile ? 0.72 : 1.0;
      let unsheatheProgress = 0;

      // 1. HERO PHASE: Completely invisible while viewing Hermes statue in Hero
      if (heroBottom > viewH * 0.5) {
        opacity = 0;
        unsheatheProgress = 0;
      }
      // 2. SWORD INTRO PHASE: Dramatic Discovery & Unsheathe (Soft ethereal tone)
      else if (introRect && introRect.bottom > viewH * 0.1 && (!contribRect || contribRect.top > viewH * 0.15)) {
        // Fade in smoothly as Hero leaves
        const appearT = clamp((viewH * 0.5 - heroBottom) / (viewH * 0.25), 0, 1);

        // Fade out smoothly before Contributions arrives
        let exitT = 1;
        if (contribRect && contribRect.top < viewH * 0.7) {
          exitT = clamp((contribRect.top - viewH * 0.15) / (viewH * 0.5), 0, 1);
        }

        opacity = appearT * exitT * 0.28;

        // Unsheathe progress: as user scrolls through introRect
        const introProgress = clamp((viewH * 0.75 - introRect.top) / (introRect.height * 0.65), 0, 1);
        unsheatheProgress = introProgress;

        x = 0;
        y = 0;
        rotation = 0;
        scale = mobile ? 0.72 : 1.0;
      }
      // 3. CONTRIBUTIONS SECTION: 100% HIDDEN (0% sword visibility over the video)
      else if (contribRect && contribRect.top <= viewH * 0.15 && contribRect.bottom > -50) {
        opacity = 0;
        unsheatheProgress = 1;
      }
      // 4. ABOUT PHASE: Reappears unsheathed with subtle rotation (~22deg, toned down)
      else if (aboutRect && aboutRect.bottom > viewH * 0.15) {
        unsheatheProgress = 1;
        let enterT = 1;
        if (aboutRect.top > viewH * 0.5) {
          enterT = clamp((viewH - aboutRect.top) / (viewH * 0.5), 0, 1);
        }
        opacity = 0.14 * enterT;

        const t = clamp((viewH * 0.85 - aboutRect.top) / aboutRect.height, 0, 1);
        x = lerp(0, mobile ? vw * 0.08 : vw * 0.16, t);
        y = lerp(0, -viewH * 0.03, t);
        rotation = lerp(0, 22, t);
        scale = lerp(mobile ? 0.72 : 1.0, mobile ? 0.68 : 0.92, t);
      }
      // 5. JOURNEY PHASE: Rotates vertically from 22deg to 90deg down the spine (Subtle spine guide)
      else if (journeyRect && journeyRect.bottom > viewH * 0.1) {
        unsheatheProgress = 1;

        const t = clamp((viewH * 0.85 - journeyRect.top) / journeyRect.height, 0, 1);
        opacity = lerp(0.14, 0.22, t);
        x = lerp(mobile ? vw * 0.08 : vw * 0.16, 0, t);
        y = lerp(-viewH * 0.03, 0, t);
        rotation = lerp(22, 90, t);
        scale = lerp(mobile ? 0.68 : 0.92, mobile ? 0.85 : 1.05, t);
      }
      // 7. CONTACT GATEWAY: CINEMATIC ZOOM-IN INTO PORTAL FLARE (Calibrated softness)
      else if (contactRect && contactRect.bottom > 0) {
        unsheatheProgress = 1;
        x = 0;
        y = 0;
        rotation = 90;

        if (contactRect.top > 0) {
          const t = clamp((viewH - contactRect.top) / viewH, 0, 1);
          opacity = lerp(0.16, 0.26, t);
          scale = mobile ? 0.85 : 1.05;
        } else {
          const scrollDistance = Math.max(1, contactRect.height - viewH);
          const zoomProgress = clamp(-contactRect.top / scrollDistance, 0, 1);

          const swordT = Math.min(zoomProgress / 0.6, 1);
          scale = lerp(mobile ? 0.85 : 1.05, mobile ? 4.5 : 10, Math.pow(swordT, 1.8));

          if (swordT <= 0.35) {
            opacity = 0.26;
          } else {
            // Dissolve gracefully into the glowing crimson flare
            opacity = clamp(lerp(0.26, 0, (swordT - 0.35) / 0.28), 0, 0.26);
          }
        }
      }
      // 8. FOOTER / OFF-SCREEN: COMPLETELY HIDDEN
      else {
        opacity = 0;
        unsheatheProgress = 1;
      }

      if (opacity <= 0.01) {
        container.style.visibility = "hidden";
        container.style.opacity = "0";
      } else {
        container.style.visibility = "visible";
        container.style.opacity = String(opacity);
        container.style.transform =
          `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
      }

      // Unsheathe mechanics
      if (unsheatheProgress <= 0.02) {
        sword.style.transform = "translateX(0%)";
        scabbard.style.transform = "translateX(0%) rotate(0deg) translateY(0px)";
        scabbard.style.opacity = "1";
        glint.style.opacity = "0";
      } else if (unsheatheProgress < 0.92) {
        const u = unsheatheProgress;
        sword.style.transform = `translateX(${-38 * u}%)`;
        const s = Math.min(u * 1.3, 1);
        scabbard.style.transform = `translateX(${38 * s}%) rotate(${10 * s}deg) translateY(${120 * s}px)`;
        scabbard.style.opacity = String(Math.max(0, 1 - s * 1.25));

        const g = clamp((u - 0.15) / 0.55, 0, 1);
        glint.style.opacity = String(g > 0 && g < 1 ? 0.75 : 0);
        glint.style.transform = `translateX(${lerp(-60, 240, g)}%)`;
      } else {
        sword.style.transform = "translateX(-38%)";
        scabbard.style.opacity = "0";
        glint.style.opacity = "0";
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
