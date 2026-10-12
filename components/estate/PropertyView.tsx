"use client";

import Link from "next/link";
import { useState } from "react";
import { useAllListings } from "@/lib/estate/store";
import { aed, bedsLabel, business } from "@/lib/estate/types";
import ListingCard from "./ListingCard";

export default function PropertyView({ id }: { id: string }) {
  const { all } = useAllListings();
  const [i, setI] = useState(0);
  const [sent, setSent] = useState(false);
  const l = all.find((x) => x.id === id);
  if (!l) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-[var(--font-cormorant)] text-4xl">Property not found</h1>
        <p className="mt-3 text-white/60">It may have been removed, or it was added in another browser.</p>
        <Link href="/lux-noble/properties" className="mt-6 inline-block rounded-full bg-[var(--gold)] px-6 py-3 font-semibold text-black">Browse properties</Link>
      </div>
    );
  }
  const similar = all.filter((x) => x.id !== l.id && x.purpose === l.purpose).slice(0, 3);
  const msg = `Hi Lux & Noble, I'm interested in ${l.title} (${l.ref}), ${aed(l.price)}${l.purpose === "Rent" ? " / year" : ""}.`;
  const wa = `https://wa.me/${business.wa}?text=${encodeURIComponent(msg)}`;

  function book(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = `${msg}\nI'd like a viewing on ${f.get("date")} at ${f.get("time")}.\nName: ${f.get("name")}\nPhone: ${f.get("phone")}`;
    setSent(true);
    window.open(`https://wa.me/${business.wa}?text=${encodeURIComponent(text)}`, "_blank");
  }

  const field = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)] [&>option]:text-black";
  const facts: [string, string][] = [
    ["Type", l.type], ["Bedrooms", bedsLabel(l.beds)], ["Bathrooms", String(l.baths)],
    ["Size", l.size ? `${l.size.toLocaleString("en-US")} sq ft` : "-"], ["Status", l.status],
    ["Furnished", l.furnished ? "Yes" : "No"], ["Reference", l.ref],
  ];
  if (l.handover) facts.push(["Handover", l.handover]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Link href="/lux-noble/properties" className="text-sm text-white/60 hover:text-[var(--gold)]">← All properties</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.photos[i] ?? l.photos[0]} alt={l.title} className="h-full w-full object-cover" />
          </div>
          {l.photos.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {l.photos.map((p, n) => (
                <button key={p + n} onClick={() => setI(n)} aria-label={`Photo ${n + 1}`} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${n === i ? "border-[var(--gold)]" : "border-transparent opacity-70"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
          <h1 className="mt-6 font-[var(--font-cormorant)] text-4xl font-semibold">{l.title}</h1>
          <p className="mt-1 text-white/60">{[l.community, l.city].filter(Boolean).join(", ")}</p>
          <p className="mt-4 text-3xl font-semibold text-[var(--gold)]">{aed(l.price)}{l.purpose === "Rent" ? <span className="text-base font-normal text-white/60"> / year</span> : null}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><dt className="text-xs uppercase tracking-wide text-white/50">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>
            ))}
          </dl>
          {l.description ? <p className="mt-6 leading-relaxed text-white/80">{l.description}</p> : null}
          {l.amenities.length ? (
            <div className="mt-6"><h2 className="font-semibold">Amenities</h2><ul className="mt-2 flex flex-wrap gap-2">{l.amenities.map((a) => <li key={a} className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80">{a}</li>)}</ul></div>
          ) : null}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
            <p><strong className="text-white">Agent:</strong> {l.agent}</p>
            <p><strong className="text-white">Permit (Trakheesi):</strong> {l.permit === "SAMPLE" ? "Sample listing. The real permit number and QR code show here." : l.permit || "Add the permit number"}</p>
            <p><strong className="text-white">Brokerage:</strong> {business.name}</p>
          </div>
          <iframe title="Map" loading="lazy" className="mt-6 h-64 w-full rounded-2xl border-0" src={`https://www.google.com/maps?q=${encodeURIComponent(`${l.community} ${l.city}`)}&output=embed`} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="font-[var(--font-cormorant)] text-2xl font-semibold">Book a viewing</h2>
            <form onSubmit={book} className="mt-4 space-y-3">
              <input name="name" required placeholder="Your name" className={field} />
              <input name="phone" required placeholder="Phone / WhatsApp" className={field} />
              <div className="grid grid-cols-2 gap-3">
                <input name="date" type="date" required className={field} />
                <select name="time" className={field} defaultValue="11:00">{["10:00", "11:00", "12:00", "14:00", "16:00", "18:00"].map((t) => <option key={t}>{t}</option>)}</select>
              </div>
              <button className="w-full rounded-full bg-[var(--gold)] py-3 font-semibold text-black">Request viewing on WhatsApp</button>
              {sent ? <p className="text-sm text-emerald-400">WhatsApp opened with your request.</p> : null}
            </form>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center text-sm font-semibold">
              <a href={wa} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 py-2.5 hover:border-[var(--gold)]">WhatsApp</a>
              <a href={`tel:${business.tel}`} className="rounded-full border border-white/20 py-2.5 hover:border-[var(--gold)]">Call</a>
            </div>
          </div>
          {l.purpose === "Buy" ? <Mortgage price={l.price} /> : null}
        </aside>
      </div>
      {similar.length ? (
        <section className="mt-14"><h2 className="font-[var(--font-cormorant)] text-3xl font-semibold">Similar properties</h2><div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <ListingCard key={s.id} l={s} />)}</div></section>
      ) : null}
    </div>
  );
}

function Mortgage({ price }: { price: number }) {
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.5);
  const loan = price * (1 - down / 100);
  const r = rate / 100 / 12, n = years * 12;
  const monthly = r ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  const dld = price * 0.04;
  const f = "w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-sm";
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="font-semibold">Mortgage and fees estimate</h2>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/60">
        <label>Down %<input type="number" min={20} max={80} value={down} onChange={(e) => setDown(Number(e.target.value) || 20)} className={f} /></label>
        <label>Years<input type="number" min={5} max={25} value={years} onChange={(e) => setYears(Number(e.target.value) || 25)} className={f} /></label>
        <label>Rate %<input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} className={f} /></label>
      </div>
      <p className="mt-4 text-2xl font-semibold text-[var(--gold)]">AED {Math.round(monthly).toLocaleString("en-US")}<span className="text-sm font-normal text-white/60"> / month</span></p>
      <p className="mt-1 text-xs text-white/50">Plus about AED {Math.round(dld).toLocaleString("en-US")} DLD transfer fee (4%). Estimate only.</p>
    </div>
  );
}
