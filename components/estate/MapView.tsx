"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { coordsOf } from "@/lib/estate/geo";
import type { Listing } from "@/lib/estate/types";
import { listingText, money } from "@/lib/estate/i18n";
import { useBiz } from "@/lib/estate/biz";
import { useLang } from "@/lib/estate/lang";

const short = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(n % 1e6 ? 1 : 0)}M` : `${Math.round(n / 1e3)}K`);

export default function MapView({ list }: { list: Listing[] }) {
  const lang = useLang();
  const { base } = useBiz();
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { scrollWheelZoom: false }).setView([25.15, 55.22], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
      maxZoom: 19,
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const g = layer.current, m = map.current;
    if (!g || !m) return;
    g.clearLayers();
    const pts: [number, number][] = [];
    for (const l of list) {
      const c = coordsOf(l);
      pts.push(c);
      const icon = L.divIcon({ className: "", html: `<div class="ln-pin">${short(l.price)}</div>`, iconSize: [0, 0] });
      const a = document.createElement("a");
      a.href = `${base}/property/${l.id}`;
      a.style.cssText = "color:#111;font:600 13px sans-serif;text-decoration:none";
      a.textContent = `${listingText(l, lang).title} · ${money(l.price, lang)}`;
      L.marker(c, { icon }).bindPopup(a).addTo(g);
    }
    if (pts.length) m.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 14 });
  }, [list, lang, base]);

  return <div ref={el} dir="ltr" className="h-[520px] w-full overflow-hidden rounded-2xl border border-white/10" role="region" aria-label="Map of properties" />;
}
