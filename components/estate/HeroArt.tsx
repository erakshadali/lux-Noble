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

type Tower = { x: number; w: number; h: number };

// Stylised Dubai skyline: [x, width, height] per tower, plus one tall spire.
function towers(seed: number, count: number, minH: number, maxH: number): Tower[] {
  const r = rng(seed);
  const out: Tower[] = [];
  let x = -20;
  for (let i = 0; i < count; i++) {
    const w = 38 + r() * 46;
    out.push({ x, w, h: minH + r() * (maxH - minH) });
    x += w + 4 + r() * 10;
  }
  return out;
}

const BACK = towers(7, 22, 60, 150);
const FRONT = towers(21, 17, 40, 120);

function Windows({ list, seed, base }: { list: Tower[]; seed: number; base: number }) {
  const r = rng(seed);
  const rects: React.ReactElement[] = [];
  list.forEach((t, ti) => {
    const cols = Math.max(2, Math.floor(t.w / 12));
    const rows = Math.floor(t.h / 14);
    for (let c = 0; c < cols; c++) for (let rw = 0; rw < rows; rw++) {
      if (r() > 0.2) continue;
      rects.push(
        <rect key={`${ti}-${c}-${rw}`} x={t.x + 6 + c * 11} y={base - t.h + 8 + rw * 14} width="3.5" height="5" rx="0.6" fill="#f3d58a" className="ln-twinkle" style={{ animationDelay: `${(r() * 6).toFixed(2)}s`, animationDuration: `${(3 + r() * 5).toFixed(2)}s` }} />,
      );
    }
  });
  return <>{rects}</>;
}

export default function HeroArt() {
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const back = useRef<SVGSVGElement>(null);
  const front = useRef<SVGSVGElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // Parallax on scroll and a soft glow that follows the pointer.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        if (photo.current) photo.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
        if (back.current) back.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        if (front.current) front.current.style.transform = `translate3d(0, ${y * 0.04}px, 0)`;
      });
    };
    const el = root.current?.parentElement;
    const onMove = (e: PointerEvent) => {
      if (!el || !glow.current) return;
      const b = el.getBoundingClientRect();
      glow.current.style.transform = `translate3d(${e.clientX - b.left - 300}px, ${e.clientY - b.top - 300}px, 0)`;
      glow.current.style.opacity = "1";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    el?.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("scroll", onScroll); el?.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Floating gold dust.
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const r = rng(99);
    const dust = Array.from({ length: 46 }, () => ({ x: r(), y: r(), s: 0.6 + r() * 1.8, v: 0.015 + r() * 0.05, p: r() * 6.28 }));
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
        if (d.y < -0.02) { d.y = 1.02; d.x = r(); }
        const a = 0.25 + 0.55 * Math.abs(Math.sin(t / 1400 + d.p));
        ctx.beginPath();
        ctx.fillStyle = `rgba(232, 200, 130, ${a})`;
        ctx.shadowColor = "rgba(232, 200, 130, 0.9)";
        ctx.shadowBlur = 8;
        ctx.arc(d.x * w + Math.sin(t / 3000 + d.p) * 10, d.y * h, d.s, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  const spire = "M0,0 L0,-150 L6,-150 L6,-215 L12,-215 L12,-270 L17,-270 L17,-315 L20,-315 L21,-370 L22,-315 L25,-315 L25,-270 L30,-270 L30,-215 L36,-215 L36,-150 L42,-150 L42,0 Z";

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div ref={photo} className="absolute -inset-x-4 -top-10 bottom-0 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/pro/estate/2.jpg" alt="" className="ln-zoom h-full w-full object-cover opacity-40" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a]/30 via-[#0b0f1a]/65 to-[#0b0f1a]" />
      <div ref={glow} className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-700" style={{ background: "radial-gradient(closest-side, rgba(201,164,92,0.22), transparent)" }} />
      <div className="ln-aurora absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(201,164,92,0.28), transparent)" }} />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />

      <svg ref={back} viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[46%] min-h-[180px] w-full will-change-transform">
        <defs>
          <linearGradient id="ln-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2540" /><stop offset="1" stopColor="#0b0f1a" /></linearGradient>
          <linearGradient id="ln-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#111830" /><stop offset="1" stopColor="#0b0f1a" /></linearGradient>
        </defs>
        {BACK.map((t, i) => <rect key={i} x={t.x} y={300 - t.h} width={t.w} height={t.h} fill="url(#ln-back)" opacity="0.85" />)}
        <g transform="translate(985 300) scale(1.1)"><path d={spire} fill="url(#ln-back)" stroke="#c9a45c" strokeOpacity="0.55" strokeWidth="0.8" /></g>
        <Windows list={BACK} seed={3} base={300} />
      </svg>
      <svg ref={front} viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[34%] min-h-[130px] w-full will-change-transform">
        {FRONT.map((t, i) => <rect key={i} x={t.x + 20} y={300 - t.h} width={t.w} height={t.h} fill="url(#ln-front)" stroke="#c9a45c" strokeOpacity="0.18" strokeWidth="0.6" />)}
        <Windows list={FRONT.map((t) => ({ ...t, x: t.x + 20 }))} seed={11} base={300} />
      </svg>
    </div>
  );
}
