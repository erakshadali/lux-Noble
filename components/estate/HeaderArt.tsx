"use client";

import { useEffect, useRef } from "react";

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Small skyline drawn along the bottom edge of the header.
const R = rng(5);
const BUILDINGS = (() => {
  const out: { x: number; w: number; h: number; spire: boolean }[] = [];
  let x = 0;
  while (x < 1500) {
    const w = 14 + R() * 26;
    out.push({ x, w, h: 8 + R() * 22, spire: R() > 0.86 });
    x += w + 2 + R() * 6;
  }
  return out;
})();
const WINDOWS = BUILDINGS.flatMap((b, i) =>
  Array.from({ length: Math.floor(b.w / 8) }, (_, c) => ({ k: `${i}-${c}`, x: b.x + 3 + c * 7, y: 38 - b.h + 3 + Math.floor(R() * Math.max(1, b.h / 8 - 1)) * 6, d: R() * 6, s: 2.5 + R() * 4, on: R() > 0.45 })),
).filter((w) => w.on);

// Header background: a drifting "web" of gold nodes and lines, a mini skyline, and a travelling light.
export default function HeaderArt() {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = cv.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = rng(42);
    let w = 0, h = 0, raf = 0;
    type N = { x: number; y: number; vx: number; vy: number; p: number };
    let nodes: N[] = [];
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(14, Math.round(w / 38));
      nodes = Array.from({ length: n }, () => ({ x: r() * w, y: r() * h, vx: (r() - 0.5) * 0.25, vy: (r() - 0.5) * 0.12, p: r() * 6.28 }));
    };
    size();
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(0); });
    ro.observe(c);
    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const link = 130;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(201,164,92,${(1 - d / link) * 0.28})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(232,200,130,${0.35 + 0.4 * Math.abs(Math.sin(t / 1200 + n.p))})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, 6.283); ctx.fill();
      }
    }
    function tick(t: number) {
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      draw(t);
      raf = requestAnimationFrame(tick);
    }
    if (reduce) draw(0); else raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="ln-aurora absolute -left-24 -top-24 h-64 w-64 rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(201,164,92,0.22), transparent)" }} />
      <canvas ref={cv} className="absolute inset-0 h-full w-full" />
      <svg viewBox="0 0 1500 40" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-7 w-full sm:h-9">
        <defs><linearGradient id="ln-hb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d2845" /><stop offset="1" stopColor="#0b0f1a" /></linearGradient></defs>
        {BUILDINGS.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={40 - b.h} width={b.w} height={b.h} fill="url(#ln-hb)" stroke="#c9a45c" strokeOpacity="0.22" strokeWidth="0.5" />
            {b.spire ? <rect x={b.x + b.w / 2 - 0.6} y={40 - b.h - 7} width="1.2" height="7" fill="#c9a45c" fillOpacity="0.6" /> : null}
          </g>
        ))}
        {WINDOWS.map((wd) => <rect key={wd.k} x={wd.x} y={wd.y} width="2.4" height="3" fill="#f3d58a" className="ln-twinkle" style={{ animationDelay: `${wd.d.toFixed(2)}s`, animationDuration: `${wd.s.toFixed(2)}s` }} />)}
      </svg>
      <div className="ln-travel absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[#f3d58a] to-transparent" />
    </div>
  );
}
