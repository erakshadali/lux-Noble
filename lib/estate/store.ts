"use client";

import { useSyncExternalStore } from "react";
import { SAMPLE } from "./sample";
import type { Listing } from "./types";

// Listings the owner adds are kept in this browser (demo). The real site stores them in a database.
const KEY = "ln-custom-listings";
const EMPTY: Listing[] = [];
let cacheRaw: string | null = null;
let cacheVal: Listing[] = EMPTY;
const subs = new Set<() => void>();

function read(): Listing[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw === cacheRaw) return cacheVal;
  cacheRaw = raw;
  try { cacheVal = raw ? (JSON.parse(raw) as Listing[]) : EMPTY; } catch { cacheVal = EMPTY; }
  return cacheVal;
}

function write(list: Listing[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  subs.forEach((f) => f());
}

export const addListings = (items: Listing[]) => write([...items, ...read()]);
export const removeListing = (id: string) => write(read().filter((l) => l.id !== id));
export const clearCustom = () => write([]);

export function useCustomListings(): Listing[] {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); window.addEventListener("storage", cb); return () => { subs.delete(cb); window.removeEventListener("storage", cb); }; },
    read,
    () => EMPTY,
  );
}

// Everything shown on the site: the owner's listings first, then the sample ones.
export function useAllListings(): { all: Listing[]; custom: Listing[] } {
  const custom = useCustomListings();
  return { all: custom.length ? [...custom, ...SAMPLE] : SAMPLE, custom };
}
