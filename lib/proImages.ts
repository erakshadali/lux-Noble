import raw from "@/data/pro-images.json";
import type { Photo } from "./images";
import type { Business } from "./data";
import type { ProSub } from "./pro";

const library = raw as Record<string, Photo[]>;

// Which photo set each business type uses (CC0 stock photos, credited in the page footer).
const groupBySub: Record<ProSub, string> = {
  dental: "dental",
  clinic: "medical",
  cleaning: "cleaning",
  movers: "moving",
  ac: "technician",
  maintenance: "technician",
  pest: "technician",
  ladies: "beauty",
  unisex: "beauty",
  kids: "beauty",
  gents: "barber",
  spa: "spa",
  estate: "estate",
};

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export type ProPhotos = {
  hero: Photo;
  back: Photo;
  about: Photo;
  ring: Photo[];
  all: Photo[]; // whole set, rotated so every business starts at a different photo
};

export function proPhotosFor(b: Business): ProPhotos | null {
  const list = library[groupBySub[b.sub ?? "estate"]];
  if (!list?.length) return null;
  const n = list.length;
  const off = hash(b.slug) % n;
  const all = Array.from({ length: n }, (_, i) => list[(off + i) % n]);
  return { hero: all[0], back: all[1], about: all[2], ring: all.slice(0, Math.min(8, n)), all };
}
