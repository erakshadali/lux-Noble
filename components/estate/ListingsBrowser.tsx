"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAllListings, useFavs } from "@/lib/estate/store";
import { TYPES } from "@/lib/estate/types";
import ListingCard from "./ListingCard";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-2xl bg-white/5" />,
});

const input = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)] [&>option]:text-black";

export default function ListingsBrowser({ limit, persist = false }: { limit?: number; persist?: boolean }) {
  const sp = useSearchParams();
  const { all } = useAllListings();
  const favs = useFavs();
  const [purpose, setPurpose] = useState(sp.get("purpose") ?? "");
  const [type, setType] = useState(sp.get("type") ?? "");
  const [community, setCommunity] = useState(sp.get("community") ?? "");
  const [beds, setBeds] = useState(sp.get("beds") ?? "");
  const [max, setMax] = useState(sp.get("max") ?? "");
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "new");
  const [view, setView] = useState<"list" | "map">(sp.get("view") === "map" ? "map" : "list");
  const [saved, setSaved] = useState(false);
  const offplan = sp.get("status") === "offplan";

  // Keep the filters in the address bar, and remember them so the back link from a property restores them.
  useEffect(() => {
    if (!persist) return;
    const p = new URLSearchParams();
    const set = (k: string, v: string) => { if (v) p.set(k, v); };
    set("purpose", purpose); set("type", type); set("community", community); set("beds", beds);
    set("max", max); set("q", q); set("sort", sort === "new" ? "" : sort); set("view", view === "map" ? "map" : "");
    if (offplan) p.set("status", "offplan");
    const s = p.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
    try { sessionStorage.setItem("ln-query", s); } catch {}
  }, [persist, purpose, type, community, beds, max, q, sort, view, offplan]);

  const communities = useMemo(() => Array.from(new Set(all.map((l) => l.community).filter(Boolean))).sort(), [all]);

  const list = useMemo(() => {
    const out = all.filter((l) =>
      (!offplan || l.status === "Off-plan") &&
      (!saved || favs.includes(l.id)) &&
      (!purpose || l.purpose === purpose) &&
      (!type || l.type === type) &&
      (!community || l.community === community) &&
      (!beds || (beds === "0" ? l.beds === 0 : beds === "4" ? l.beds >= 4 : l.beds === Number(beds))) &&
      (!max || l.price <= Number(max)) &&
      (!q || `${l.title} ${l.community} ${l.ref}`.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "low") out.sort((a, b) => a.price - b.price);
    if (sort === "high") out.sort((a, b) => b.price - a.price);
    return limit ? out.slice(0, limit) : out;
  }, [all, offplan, saved, favs, purpose, type, community, beds, max, q, sort, limit]);

  function reset() {
    setPurpose(""); setType(""); setCommunity(""); setBeds(""); setMax(""); setQ(""); setSaved(false);
  }

  const tab = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm ${on ? "bg-[var(--gold)] font-semibold text-black" : "text-white/70 hover:text-white"}`;

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-3 lg:grid-cols-7">
        <input className={input + " lg:col-span-2"} placeholder="Search area, title or ref" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={input} value={purpose} onChange={(e) => setPurpose(e.target.value)} aria-label="Buy or rent">
          <option value="">Buy or rent</option><option value="Buy">Buy</option><option value="Rent">Rent</option>
        </select>
        <select className={input} value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
          <option value="">Any type</option>{TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className={input} value={community} onChange={(e) => setCommunity(e.target.value)} aria-label="Area">
          <option value="">Any area</option>{communities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={input} value={beds} onChange={(e) => setBeds(e.target.value)} aria-label="Bedrooms">
          <option value="">Any beds</option><option value="0">Studio</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
        </select>
        <select className={input} value={max} onChange={(e) => setMax(e.target.value)} aria-label="Max price">
          <option value="">Any price</option>
          {[100000, 250000, 1000000, 2500000, 5000000, 10000000].map((p) => <option key={p} value={p}>Up to AED {p.toLocaleString("en-US")}</option>)}
        </select>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
        <p>{list.length} {list.length === 1 ? "property" : "properties"}{offplan ? " (off-plan)" : ""} · <button onClick={reset} className="underline hover:text-white">Reset filters</button></p>
        <div className="flex items-center gap-2">
          <button onClick={() => setSaved((s) => !s)} aria-pressed={saved} className={`rounded-lg border px-3 py-1.5 ${saved ? "border-[var(--gold)] text-[var(--gold)]" : "border-white/15"}`}>♥ Saved ({favs.length})</button>
          <div className="flex rounded-lg border border-white/15 p-0.5">
            <button onClick={() => setView("list")} className={tab(view === "list")}>List</button>
            <button onClick={() => setView("map")} className={tab(view === "map")}>Map</button>
          </div>
          <select className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 [&>option]:text-black" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </div>
      </div>
      {view === "map" ? (
        <div className="mt-5"><MapView list={list} /></div>
      ) : list.length ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((l) => <ListingCard key={l.id} l={l} />)}</div>
      ) : (
        <p className="mt-10 rounded-2xl border border-white/10 p-10 text-center text-white/60">{saved ? "You have not saved any property yet. Tap the heart on a listing." : "No properties match. Try removing a filter."}</p>
      )}
    </div>
  );
}
