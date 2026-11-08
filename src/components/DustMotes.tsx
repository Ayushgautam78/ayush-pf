"use client";

import { useEffect, useRef } from "react";

/** Slow rising motes of light. Only runs while on screen. */
export function DustMotes({ count = 46 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let animId = 0;
    let last = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.008 + Math.random() * 0.022,
      drift: Math.random() * Math.PI * 2,
      size: 0.5 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.55,
    }));

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.y -= m.speed * dt;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        const x = (m.x + Math.sin(now * 0.00025 + m.drift) * 0.012) * width;
        const twinkle = 0.65 + 0.35 * Math.sin(now * 0.0012 + m.drift * 3);
        ctx.fillStyle = `rgba(242, 238, 230, ${m.alpha * twinkle * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, m.y * height, m.size, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(animId);
      if (entry.isIntersecting) {
        last = performance.now();
        animId = requestAnimationFrame(frame);
      }
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}
