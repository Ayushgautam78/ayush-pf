"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  DOORS,
  INTRO,
  clamp,
  damp,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  lerp,
  range,
  stickyProgress,
} from "@/lib/motion";

const SWORD_ASPECT = 209 / 1289;
/** Where the scabbard's throat sits along the sword, from the pommel. */
const THROAT = 0.282;
const MAX_SPARKS = 220;

interface Pose {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
  draw: number;
  fall: number;
  glow: number;
  /** 0-1 amount of ambient float and pointer tilt */
  idle: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
}

/**
 * SingleSwordSystem
 *
 * One sword, always fully opaque, that only appears where the layout makes
 * room for it:
 * - #sword-intro: drawn from the scabbard, then swung to cut the stage open.
 * - #about: hangs tip-down in the reserved right column (desktop only).
 * - #journey: rides the rail, with its tip marking the active phase.
 * - #contact: slams down the door seam, then withdraws as the doors part.
 *
 * Every pose is a pure function of scroll position, so scrolling back up
 * replays the whole thing in reverse.
 */
export function SingleSwordSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);
  const scabbardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const tilt = tiltRef.current;
    const sword = swordRef.current;
    const scabbard = scabbardRef.current;
    const sheen = sheenRef.current;
    const glow = glowRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !root || !tilt || !sword || !scabbard || !sheen || !glow) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const curr: Pose = { x: 0, y: 0, rot: 0, scale: 1, opacity: 0, draw: 0, fall: 0, glow: 0, idle: 0 };
    const sparks: Spark[] = [];
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    let velocity = 0;
    let lastScrollY = window.scrollY;
    let lastDraw = 0;
    let lastContactP = 0;
    let swordW = 0;
    let dpr = 1;
    let canvasDirty = false;

    const sized = () => {
      const vw = window.innerWidth;
      swordW = vw < 768 ? vw * 0.86 : Math.min(vw * 0.72, 1120);
      root.style.width = `${swordW}px`;
      root.style.height = `${swordW * SWORD_ASPECT}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = vw * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    sized();
    window.addEventListener("resize", sized);

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const emit = (x: number, y: number, count: number, angle: number, spread: number, speed: number) => {
      if (reducedMotion) return;
      for (let i = 0; i < count && sparks.length < MAX_SPARKS; i++) {
        const a = angle + (Math.random() - 0.5) * spread;
        const s = speed * (0.35 + Math.random() * 0.9);
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 0,
          ttl: 0.35 + Math.random() * 0.6,
          size: 0.7 + Math.random() * 1.3,
        });
      }
    };

    const drawSparks = (dt: number) => {
      if (!sparks.length && !canvasDirty) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life += dt;
        if (p.life >= p.ttl) {
          sparks.splice(i, 1);
          continue;
        }
        p.vy += 900 * dt;
        p.vx *= 1 - 1.6 * dt;
        p.vy *= 1 - 1.6 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const t = p.life / p.ttl;
        ctx.strokeStyle = `rgba(255, ${Math.round(226 - t * 130)}, ${Math.round(150 - t * 130)}, ${1 - t})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.022, p.y - p.vy * 0.022);
        ctx.stroke();
      }
      canvasDirty = sparks.length > 0;
    };

    const els: Record<string, HTMLElement | null> = {};
    const el = (id: string) => (els[id] ??= document.getElementById(id));

    const introPose = (rect: DOMRect, vw: number, vh: number): Pose => {
      const p = stickyProgress(rect, vh);
      const enter = easeOutCubic(range(rect.top, vh, 0));
      const draw = easeInOutCubic(range(p, INTRO.drawStart, INTRO.drawEnd));
      const fall = range(p, INTRO.drawEnd, INTRO.fallEnd);
      const windup = easeInOutCubic(range(p, INTRO.fallEnd, INTRO.windupEnd));
      const swing = easeInOutCubic(range(p, INTRO.windupEnd, INTRO.swingEnd));
      const exit = easeInCubic(range(p, INTRO.swingEnd, 0.95));

      return {
        x: lerp(0, vw * 0.17, windup) + lerp(0, -vw * 0.38, swing) + -vw * 0.5 * exit,
        y:
          lerp(vh * 0.36, vh * 0.1, enter) +
          lerp(0, -vh * 0.24, windup) +
          lerp(0, vh * 0.34, swing) +
          vh * 0.5 * exit,
        rot: lerp(-16, -4, enter) + 4 * draw + lerp(0, -60, windup) + lerp(0, -155, swing),
        scale: lerp(0.88, 1, enter) * lerp(1, 0.86, windup),
        opacity: range(enter, 0.3, 0.8) * (1 - range(p, 0.86, 0.91)),
        draw,
        fall,
        glow: 0.35 + draw * 0.35 + windup * 0.3,
        idle: 1 - range(p, INTRO.drawEnd, INTRO.fallEnd),
      };
    };

    const aboutPose = (rect: DOMRect, vw: number, vh: number): Pose => {
      const length = Math.min(vh * 0.84, 860);
      const p = range(rect.top, vh, -(rect.height - vh));
      return {
        x: vw * 0.335,
        y: Math.max(0, rect.top) + lerp(vh * 0.05, -vh * 0.05, p),
        rot: 90 + lerp(-2.5, 2.5, p),
        scale: length / swordW,
        opacity: vw >= 1024 ? 1 : 0,
        draw: 1,
        fall: 1,
        glow: 0.3,
        idle: 0.5,
      };
    };

    const railPose = (rail: DOMRect, progress: number, vw: number): Pose => {
      const length = vw < 768 ? vw * 0.62 : Math.min(vw * 0.34, 560);
      const tipX = rail.left + rail.width * progress;
      return {
        x: tipX - length / 2 - vw / 2,
        y: rail.top + rail.height / 2 - window.innerHeight / 2,
        rot: 0,
        scale: length / swordW,
        opacity: 1,
        draw: 1,
        fall: 1,
        glow: 0.35,
        idle: 0,
      };
    };

    const contactPose = (p: number, vh: number): Pose => {
      const length = Math.min(vh * 0.8, 820);
      const above = -vh * 0.5 - length / 2 - 60;
      const planted = -vh * 0.04 - length / 2;
      const drop = easeInCubic(range(p, 0.02, DOORS.impact));
      const withdraw = easeInOutCubic(range(p, DOORS.withdrawStart, DOORS.withdrawEnd));
      return {
        x: 0,
        y: lerp(lerp(above, planted, drop), above, withdraw),
        rot: 90,
        scale: length / swordW,
        opacity: p >= DOORS.withdrawEnd ? 0 : 1,
        draw: 1,
        fall: 1,
        glow: 0.5 + 0.5 * range(p, DOORS.impact - 0.04, DOORS.impact),
        idle: 0,
      };
    };

    const computePose = (vw: number, vh: number): Pose | null => {
      const intro = el("sword-intro")?.getBoundingClientRect();
      const about = el("about")?.getBoundingClientRect();
      const journey = el("journey")?.getBoundingClientRect();
      const rail = el("journey-rail")?.getBoundingClientRect();
      const contact = el("contact")?.getBoundingClientRect();
      if (!intro || !about || !journey || !rail || !contact) return null;

      if (contact.top <= 0 && contact.bottom > vh * 0.5) {
        return contactPose(stickyProgress(contact, vh), vh);
      }

      if (journey.top < vh && journey.bottom > 0) {
        const rp = railPose(rail, stickyProgress(journey, vh), vw);
        if (journey.top > 0) {
          // Fly down out of the About column and lie flat on the rail
          const t = easeInOutCubic(range(journey.top, vh, vh * 0.1));
          const ap = aboutPose(about, vw, vh);
          return {
            ...rp,
            x: lerp(ap.x, rp.x, t),
            y: lerp(ap.y, rp.y, t),
            rot: lerp(ap.rot, rp.rot, t),
            scale: lerp(ap.scale, rp.scale, t),
            opacity: vw >= 1024 ? 1 : t,
          };
        }
        // Stage released: the sword runs off the end of the rail
        const out = easeInCubic(range(journey.bottom, vh, vh * 0.25));
        return { ...rp, x: rp.x + out * vw, opacity: 1 - range(journey.bottom, vh * 0.35, vh * 0.15) };
      }

      if (about.top < vh && about.bottom > 0) return aboutPose(about, vw, vh);
      if (intro.top < vh && stickyProgress(intro, vh) < 1) return introPose(intro, vw, vh);
      return null;
    };

    const worldAlong = (fromCenter: number) => {
      const r = (curr.rot * Math.PI) / 180;
      return {
        x: window.innerWidth / 2 + curr.x + Math.cos(r) * fromCenter * curr.scale,
        y: window.innerHeight / 2 + curr.y + Math.sin(r) * fromCenter * curr.scale,
        angle: r,
      };
    };

    function tick(time: number, deltaTime: number) {
      if (!root || !tilt || !sword || !scabbard || !sheen || !glow) return;
      const dt = Math.min((deltaTime || 16) / 1000, 0.05);
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const scrollY = window.scrollY;
      velocity = damp(velocity, (scrollY - lastScrollY) / dt, 6, dt);
      lastScrollY = scrollY;

      const target = computePose(vw, vh);
      if (!target || target.opacity <= 0.001) {
        curr.opacity = damp(curr.opacity, 0, 18, dt);
      } else {
        // Coming from hidden: appear in place instead of flying across the screen
        const k = curr.opacity < 0.01 || reducedMotion ? 1000 : 18;
        curr.x = damp(curr.x, target.x, k, dt);
        curr.y = damp(curr.y, target.y, k, dt);
        curr.rot = damp(curr.rot, target.rot, k, dt);
        curr.scale = damp(curr.scale, target.scale, k, dt);
        curr.opacity = damp(curr.opacity, target.opacity, 18, dt);
        curr.draw = damp(curr.draw, target.draw, k, dt);
        curr.fall = damp(curr.fall, target.fall, k, dt);
        curr.glow = damp(curr.glow, target.glow, 8, dt);
        curr.idle = damp(curr.idle, target.idle, 6, dt);
      }

      const contactEl = el("contact");
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        const p = rect.top <= 0 ? stickyProgress(rect, vh) : 0;
        if (lastContactP < DOORS.impact && p >= DOORS.impact) {
          const tip = worldAlong(swordW / 2);
          emit(tip.x, tip.y, 90, -Math.PI / 2, Math.PI * 1.1, 760);
        }
        lastContactP = p;
      }

      if (curr.opacity <= 0.01) {
        if (root.style.visibility !== "hidden") root.style.visibility = "hidden";
        drawSparks(dt);
        return;
      }
      root.style.visibility = "visible";

      // Sparks scrape off the scabbard throat while the blade is moving
      const drawSpeed = curr.draw - lastDraw;
      lastDraw = curr.draw;
      if (drawSpeed > 0.0008 && curr.fall < 0.3) {
        const throat = worldAlong((THROAT - 0.5) * swordW + 0.56 * swordW * curr.draw);
        emit(throat.x, throat.y - 2, Math.ceil(drawSpeed * 260), throat.angle + Math.PI, 1.1, 620);
      }

      // The tip throws sparks along the cut
      const introEl = el("sword-intro");
      if (introEl) {
        const p = stickyProgress(introEl.getBoundingClientRect(), vh);
        if (p > INTRO.slashStart && p < INTRO.slashEnd && Math.abs(velocity) > 40) {
          const tip = worldAlong(swordW / 2);
          emit(tip.x, tip.y, 4, tip.angle, 1.6, 520);
        }
      }

      const floatY = reducedMotion ? 0 : Math.sin(time * 1.05) * 7 * curr.idle;
      const floatRot = reducedMotion ? 0 : Math.sin(time * 0.8) * 0.5 * curr.idle;
      const kick = reducedMotion ? 0 : clamp(velocity * 0.0028, -5, 5);

      root.style.opacity = String(clamp(curr.opacity));
      root.style.transform = `translate(-50%, -50%) translate3d(${curr.x}px, ${curr.y + floatY}px, 0) rotate(${curr.rot + floatRot + kick}deg) scale(${curr.scale})`;

      pointer.sx = damp(pointer.sx, reducedMotion ? 0 : pointer.x, 5, dt);
      pointer.sy = damp(pointer.sy, reducedMotion ? 0 : pointer.y, 5, dt);
      tilt.style.transform = `perspective(1400px) rotateX(${-pointer.sy * 22 * curr.idle}deg) rotateY(${pointer.sx * 14 * curr.idle}deg)`;

      sword.style.transform = `translate3d(${-16 * curr.draw * (1 - curr.fall)}%, 0, 0)`;

      if (curr.fall >= 0.995) {
        scabbard.style.visibility = "hidden";
      } else {
        const f = curr.fall;
        scabbard.style.visibility = "visible";
        scabbard.style.opacity = String(1 - range(f, 0.55, 1));
        scabbard.style.transform = `translate3d(${(56 / 0.718) * curr.draw}%, ${f * f * 420}%, 0) rotate(${f * 26}deg)`;
      }

      // Glint is masked to the sword's silhouette and tied to scroll, so it
      // travels the steel as you move instead of looping on a timer
      const sweep = reducedMotion ? 2 : ((scrollY / 900) % 1) * 4 - 1;
      sheen.style.transform = `translate3d(${sweep * 100}%, 0, 0)`;

      glow.style.opacity = String(curr.glow);
      drawSparks(dt);
    }

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", sized);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <>
      <div
        ref={rootRef}
        className="fixed left-1/2 top-1/2 z-40 pointer-events-none select-none will-change-transform"
        style={{ visibility: "hidden", opacity: 0, transform: "translate(-50%, -50%)" }}
        aria-hidden="true"
      >
        <div ref={tiltRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <div
            ref={glowRef}
            className="absolute left-[-20%] right-[-20%] top-[-260%] bottom-[-260%]"
            style={{
              opacity: 0,
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(227,178,92,0.26) 0%, rgba(227,178,92,0.08) 42%, transparent 72%)",
            }}
          />

          {/* Unsheathed blade */}
          <div ref={swordRef} className="absolute inset-0 will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/greek-sword.webp" alt="" draggable={false} className="block w-full h-full" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                WebkitMaskImage: "url(/greek-sword.webp)",
                maskImage: "url(/greek-sword.webp)",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }}
            >
              <div
                ref={sheenRef}
                className="absolute inset-y-0 left-0 w-[34%] will-change-transform"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 0%, rgba(255,246,220,0.95) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Scabbard */}
          <div
            ref={scabbardRef}
            className="absolute right-0 top-0 bottom-0 w-[71.8%] will-change-transform"
            style={{ transformOrigin: "30% 50%" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/greek-scabbard.webp" alt="" draggable={false} className="block w-full h-full" />
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="fixed inset-0 z-[41] w-full h-full pointer-events-none" aria-hidden="true" />
    </>
  );
}
