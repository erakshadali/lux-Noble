"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ICONS } from "@/lib/pro";

type Listing = { purpose: "Rent" | "Buy"; type: "Apartment" | "Villa" | "Townhouse" | "Studio"; beds: number; baths: number; area: string };

// Sample listings only: they show how search and filters work on the real site.
const SAMPLE: Listing[] = [
  { purpose: "Rent", type: "Apartment", beds: 1, baths: 2, area: "Dubai Marina" },
  { purpose: "Buy", type: "Apartment", beds: 2, baths: 3, area: "Downtown Dubai" },
  { purpose: "Rent", type: "Studio", beds: 0, baths: 1, area: "Business Bay" },
  { purpose: "Buy", type: "Villa", beds: 4, baths: 5, area: "Dubai Hills" },
  { purpose: "Rent", type: "Apartment", beds: 2, baths: 2, area: "JVC" },
  { purpose: "Buy", type: "Townhouse", beds: 3, baths: 4, area: "Al Barsha" },
  { purpose: "Rent", type: "Villa", beds: 3, baths: 4, area: "Al Barsha" },
  { purpose: "Buy", type: "Apartment", beds: 1, baths: 2, area: "Business Bay" },
  { purpose: "Rent", type: "Apartment", beds: 3, baths: 3, area: "Palm Jumeirah" },
  { purpose: "Buy", type: "Studio", beds: 0, baths: 1, area: "JVC" },
  { purpose: "Rent", type: "Apartment", beds: 1, baths: 1, area: "Deira" },
  { purpose: "Buy", type: "Apartment", beds: 2, baths: 2, area: "Dubai Marina" },
  { purpose: "Rent", type: "Townhouse", beds: 3, baths: 3, area: "Dubai Hills" },
  { purpose: "Buy", type: "Villa", beds: 5, baths: 6, area: "Palm Jumeirah" },
];
const RIYADH_AREAS: Record<string, string> = { "Dubai Marina": "Al Olaya", "Downtown Dubai": "Al Malqa", "Business Bay": "Al Yasmin", "Dubai Hills": "Hittin", JVC: "Al Narjis", "Al Barsha": "Al Nakheel", "Palm Jumeirah": "Diplomatic Quarter", Deira: "Al Sulimaniyah" };
const listingsFor = (city: string) => (city === "Riyadh" ? SAMPLE.map((l) => ({ ...l, area: RIYADH_AREAS[l.area] ?? l.area })) : SAMPLE);
const areasOf = (list: Listing[]) => ["Any area", ...Array.from(new Set(list.map((l) => l.area)))];
const TYPES = ["Any type", "Apartment", "Villa", "Townhouse", "Studio"];
const BEDS = ["Any beds", "Studio", "1", "2", "3+"];


function Svg({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}

const field = "w-full rounded-xl border bg-transparent px-4 py-3 text-base outline-none focus:ring-2";
const fieldStyle = { borderColor: "var(--line)", color: "var(--ink)", ["--tw-ring-color" as string]: "var(--accent)" };

export default function PropertySearch({ upper, photos, city = "Dubai" }: { upper: string; photos: string[]; city?: string }) {
  const SAMPLE = useMemo(() => listingsFor(city), [city]);
  const AREAS = useMemo(() => areasOf(SAMPLE), [SAMPLE]);
  const aed = (n: number) => (city === "Riyadh" ? "SAR " : "AED ") + Math.round(n).toLocaleString("en-US");
  const [purpose, setPurpose] = useState<"Rent" | "Buy">("Buy");
  const [type, setType] = useState(TYPES[0]);
  const [beds, setBeds] = useState(BEDS[0]);
  const [area, setArea] = useState(AREAS[0]);

  const results = useMemo(
    () =>
      SAMPLE.map((l, i) => ({ ...l, i })).filter(
        (l) =>
          l.purpose === purpose &&
          (type === TYPES[0] || l.type === type) &&
          (area === AREAS[0] || l.area === area) &&
          (beds === BEDS[0] || (beds === "Studio" ? l.beds === 0 : beds === "3+" ? l.beds >= 3 : l.beds === Number(beds))),
      ),
    [purpose, type, beds, area],
  );

  // Payment calculator
  const [price, setPrice] = useState(1500000);
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(4.5);
  const loan = price * (1 - down / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));

  const range = "w-full cursor-pointer";

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Search */}
      <div>
        <div className="rounded-3xl border p-5 md:p-7" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
          <div className="grid gap-4 md:grid-cols-[auto_1fr_1fr_1fr] md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>I want to</p>
              <div className="grid grid-cols-2 gap-1 rounded-full border p-1" style={{ borderColor: "var(--line)" }} role="radiogroup" aria-label="Buy or rent">
                {(["Buy", "Rent"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={purpose === p}
                    onClick={() => setPurpose(p)}
                    className="rounded-full px-7 py-2.5 text-sm font-bold"
                    style={purpose === p ? { background: "var(--accent)", color: "var(--on-accent)" } : undefined}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {[
              { label: "Area", value: area, set: setArea, opts: AREAS },
              { label: "Type", value: type, set: setType, opts: TYPES },
              { label: "Bedrooms", value: beds, set: setBeds, opts: BEDS },
            ].map((f) => (
              <label key={f.label} className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>{f.label}</span>
                <select className={field} style={{ ...fieldStyle, background: "var(--surface)" }} value={f.value} onChange={(e) => f.set(e.target.value)}>
                  {f.opts.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold" style={{ color: "var(--muted)" }} aria-live="polite">
          {results.length} sample {results.length === 1 ? "listing" : "listings"}
        </p>

        {results.length ? (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => {
              const h = (l.i * 47 + 200) % 360;
              return (
                <li key={l.i} className="group overflow-hidden rounded-3xl border transition-transform duration-300 hover:-translate-y-1.5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
                  <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${h} 45% 18%), hsl(${(h + 40) % 360} 55% 38%))` }}>
                    {photos.length ? (
                      <Image src={photos[l.i % photos.length]} alt="" fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <Svg d={l.type === "Villa" || l.type === "Townhouse" ? ICONS.home : ICONS.building} className="absolute bottom-4 right-4 h-20 w-20 text-white/25" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">Sample listing</span>
                    <span className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>For {l.purpose === "Buy" ? "sale" : "rent"}</span>
                  </div>
                  <div className="p-5">
                    <h3 className={`display text-2xl ${upper}`}>{l.beds === 0 ? "Studio apartment" : `${l.beds} bed ${l.type.toLowerCase()}`}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
                      <Svg d={ICONS.pin} className="h-4 w-4" /> {l.area}, {city}
                    </p>
                    <p className="mt-4 flex items-center gap-4 text-sm font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Svg d={ICONS.bed} className="h-4 w-4" /> {l.beds === 0 ? "Studio" : `${l.beds} beds`}</span>
                      <span>{l.baths} baths</span>
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: "var(--line)" }}>
                      <span className="text-sm font-bold" style={{ color: "var(--muted)" }}>Price on request</span>
                      <a href="#enquire" className="inline-flex items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4" style={{ textDecorationColor: "var(--accent)" }}>
                        Enquire <Svg d={ICONS.arrow} className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-3xl border p-8 text-center" style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--muted)" }}>
            No sample listings match. Try another area or type.
          </p>
        )}
      </div>

      {/* Calculator */}
      <div className="grid items-start gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div className="rounded-3xl border p-6 md:p-9" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
          <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            <Svg d={ICONS.calc} className="h-4 w-4" /> Monthly payment calculator
          </p>
          {[
            { id: "price", label: "Property price", value: aed(price), min: 300000, max: 20000000, step: 50000, val: price, set: setPrice },
            { id: "down", label: "Down payment", value: `${down}%  ·  ${aed(price * (down / 100))}`, min: 10, max: 60, step: 1, val: down, set: setDown },
            { id: "years", label: "Loan term", value: `${years} years`, min: 5, max: 25, step: 1, val: years, set: setYears },
            { id: "rate", label: "Interest rate", value: `${rate.toFixed(1)}%`, min: 2, max: 8, step: 0.1, val: rate, set: setRate },
          ].map((f) => (
            <div key={f.id} className="mb-6 last:mb-0">
              <label htmlFor={f.id} className="flex items-baseline justify-between gap-4 text-sm font-bold">
                <span>{f.label}</span>
                <span className="display text-lg" style={{ color: "var(--accent)" }}>{f.value}</span>
              </label>
              <input
                id={f.id}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={f.val}
                onChange={(e) => f.set(Number(e.target.value))}
                className={`${range} mt-3`}
                style={{ accentColor: "#D9B45F" }}
              />
            </div>
          ))}
        </div>
        <div className="rounded-3xl border p-7 text-center md:sticky md:top-24 md:p-10" style={{ borderColor: "var(--line)", background: "linear-gradient(160deg, color-mix(in srgb, var(--accent) 22%, var(--surface)), var(--surface))" }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Estimated monthly payment</p>
          <p className="display mt-3 text-5xl font-semibold leading-none md:text-6xl" style={{ color: "var(--accent)" }} aria-live="polite">{aed(monthly)}</p>
          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>Loan amount {aed(loan)} over {years} years</p>
          <a href="#enquire" className="btn mt-7 w-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
            Talk to an advisor <Svg d={ICONS.arrow} className="h-5 w-5" />
          </a>
          <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>Estimate only. Your bank sets the real rate and terms.</p>
        </div>
      </div>
    </div>
  );
}
