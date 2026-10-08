"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

// Wraps children in a 3D scene that tilts toward the pointer (desktop) and
// sways gently on its own (touch / no pointer). Children can use translateZ()
// to sit at different depths.
export default function Tilt({
  children,
  className = "",
  style,
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${px * max * 2}deg`);
    el.style.setProperty("--rx", `${-py * max * 2}deg`);
    el.dataset.active = "1";
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
    delete el.dataset.active;
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt ${className}`} style={style}>
      {children}
    </div>
  );
}
