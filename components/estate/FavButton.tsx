"use client";

import { toggleFav, useFavs } from "@/lib/estate/store";

export default function FavButton({ id, className = "" }: { id: string; className?: string }) {
  const on = useFavs().includes(id);
  return (
    <button
      type="button"
      onClick={() => toggleFav(id)}
      aria-label={on ? "Remove from saved" : "Save property"}
      aria-pressed={on}
      className={`grid h-9 w-9 place-items-center rounded-full bg-black/55 backdrop-blur transition hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${on ? "fill-[var(--gold)] stroke-[var(--gold)]" : "fill-none stroke-white"}`} strokeWidth="2" strokeLinejoin="round"><path d="M12 21s-7-4.6-9.3-9.1C1.2 8.8 3 5 6.6 5c2 0 3.6 1.1 5.4 3.2C13.8 6.1 15.4 5 17.4 5 21 5 22.8 8.8 21.3 11.9 19 16.4 12 21 12 21z" /></svg>
    </button>
  );
}
