import type { Listing } from "./types";

// Approximate centres of the main Dubai communities, used to place pins on the map.
const CENTRES: Record<string, [number, number]> = {
  "dubai marina": [25.0805, 55.1403],
  "downtown dubai": [25.1972, 55.2744],
  "business bay": [25.1852, 55.2686],
  "dubai hills estate": [25.1093, 55.2428],
  jvc: [25.0657, 55.2093],
  "al barsha south": [25.075, 55.238],
  "al barsha": [25.113, 55.2],
  "al barsha 1": [25.106, 55.198],
  "palm jumeirah": [25.1124, 55.139],
  "dubai creek harbour": [25.2, 55.345],
  "jumeirah lake towers": [25.0693, 55.1444],
  difc: [25.2144, 55.2796],
  deira: [25.2697, 55.3095],
};
const DUBAI: [number, number] = [25.2048, 55.2708];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function coordsOf(l: Listing): [number, number] {
  const base = CENTRES[l.community.trim().toLowerCase()] ?? DUBAI;
  const h = hash(l.id);
  // Small offset so listings in the same community do not sit on top of each other.
  return [base[0] + ((h % 100) - 50) / 12000, base[1] + (((h >> 7) % 100) - 50) / 12000];
}
