"use client";

import { useEffect, useRef } from "react";

// Soft drifting specks of light for hero sections. Uses the page's `--accent2` colour when it has one.
export default function Dust({ count = 36, className = "" }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hex = getComputedStyle(cv).getPropertyValue("--accent2").trim();
    const m = /^#?([0-9a-f]{6})$/i.exec(hex);
    const [r, g, b] = m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : [232, 200, 130];
    const dust = Array.from({ length: count }, (_, i) => {
      const k = (i * 9301 + 49297) % 233280 / 233280;
      return { x: k, y: ((i * 7919) % 1000) / 1000, s: 0.6 + (k * 1.9), v: 0.015 + (k * 0.05), p: k * 6.28 };
    });
    let w = 0, h = 0, raf = 0, on = true;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) raf = requestAnimationFrame(tick); });
    io.observe(cv);
    function tick(t: number) {
      if (!on || !ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const d of dust) {
        d.y -= d.v / 60;
        if (d.y < -0.02) d.y = 1.02;
        const a = 0.25 + 0.55 * Math.abs(Math.sin(t / 1400 + d.p));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
        ctx.shadowBlur = 8;
        ctx.arc(d.x * w + Math.sin(t / 3000 + d.p) * 10, d.y * h, d.s, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
