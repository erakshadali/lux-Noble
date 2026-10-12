"use client";

import Link from "next/link";
import { useState } from "react";

// Hamburger menu for phones. The panel slides down under the header.
export default function MobileMenu({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState(false);
  const bar = "absolute left-0 h-0.5 w-5 rounded bg-current transition duration-300";
  return (
    <div className="sm:hidden">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--gold)]/50 text-[var(--gold)]">
        <span className="relative block h-3.5 w-5">
          <span className={`${bar} top-0 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`${bar} top-[6px] ${open ? "opacity-0" : ""}`} />
          <span className={`${bar} top-3 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </span>
      </button>
      <div className={`absolute left-0 right-0 top-full origin-top border-b border-[var(--gold)]/30 bg-[#0b0f1a]/98 px-5 pb-5 pt-2 shadow-2xl backdrop-blur transition duration-300 ${open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"}`}>
        <ul>
          {items.map(([t, h], i) => (
            <li key={t} className="border-b border-white/10 last:border-0" style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}>
              <Link href={h} onClick={() => setOpen(false)} className="flex items-center justify-between py-3.5 font-[family-name:var(--font-cormorant)] text-2xl text-white/90">
                {t}<span className="text-sm text-[var(--gold)]">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/lux-noble/admin" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-[var(--gold)] py-3 text-center font-semibold text-black">Add listings</Link>
      </div>
    </div>
  );
}
