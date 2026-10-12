import Link from "next/link";
import { Suspense } from "react";
import CountUp from "@/components/estate/CountUp";
import ListingsBrowser from "@/components/estate/ListingsBrowser";
import ProjectCard from "@/components/estate/ProjectCard";
import Reveal from "@/components/estate/Reveal";
import { PROJECTS } from "@/lib/estate/projects";
import { SAMPLE } from "@/lib/estate/sample";
import { business } from "@/lib/estate/types";

const areas = ["Dubai Marina", "Downtown Dubai", "Business Bay", "Palm Jumeirah", "Dubai Hills Estate", "JVC"];
const stats: [number, string, string][] = [
  [SAMPLE.length, "", "Properties listed"],
  [new Set(SAMPLE.map((l) => l.community)).size, "", "Dubai communities"],
  [PROJECTS.length, "", "Off-plan launches"],
  [30, " sec", "To book a viewing"],
];
const steps: [string, string][] = [
  ["Search", "Filter by area, type, bedrooms and budget, as a list or on the map."],
  ["Book", "Pick a day and time. Your request lands on our WhatsApp straight away."],
  ["View", "An agent meets you at the property with the permit and all the details."],
];

export default function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/pro/estate/2.jpg" alt="" className="ln-zoom absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b0f1a]/30 via-[#0b0f1a]/70 to-[#0b0f1a]" />
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-36">
          <Reveal><p className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">Dubai real estate</p></Reveal>
          <Reveal delay={120}><h1 className="mt-4 max-w-3xl font-[var(--font-cormorant)] text-5xl font-semibold leading-[1.05] sm:text-7xl">Find a home <span className="ln-gold-text">worthy of your name.</span></h1></Reveal>
          <Reveal delay={240}><p className="mt-5 max-w-xl text-lg text-white/75">Apartments, villas and off-plan projects across Dubai. Book a viewing in 30 seconds and we reply on WhatsApp.</p></Reveal>
          <Reveal delay={360}>
            <form action="/lux-noble/properties" className="mt-10 grid max-w-3xl gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur sm:grid-cols-[1fr_1fr_1.3fr_auto]">
              <select name="purpose" className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm [&>option]:text-black" aria-label="Buy or rent"><option value="Buy">Buy</option><option value="Rent">Rent</option></select>
              <select name="type" className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm [&>option]:text-black" aria-label="Type"><option value="">Any type</option><option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option></select>
              <input name="q" placeholder="Area or project" className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm placeholder:text-white/40" />
              <button className="rounded-xl bg-[var(--gold)] px-6 py-3 font-semibold text-black transition hover:brightness-110">Search</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {areas.map((a) => <Link key={a} href={`/lux-noble/properties?q=${encodeURIComponent(a)}`} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 transition hover:border-[var(--gold)] hover:text-[var(--gold)]">{a}</Link>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 text-center sm:grid-cols-4">
          {stats.map(([n, s, t]) => (
            <div key={t}><p className="font-[var(--font-cormorant)] text-5xl font-semibold text-[var(--gold)]"><CountUp to={n} suffix={s} /></p><p className="mt-1 text-sm text-white/60">{t}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-[var(--font-cormorant)] text-4xl font-semibold">Featured properties</h2>
            <Link href="/lux-noble/properties" className="text-sm text-[var(--gold)] hover:underline">View all</Link>
          </div>
        </Reveal>
        <Suspense fallback={null}><ListingsBrowser limit={6} /></Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]">New launches</p>
              <h2 className="font-[var(--font-cormorant)] text-4xl font-semibold">Off-plan projects</h2>
            </div>
            <Link href="/lux-noble/off-plan" className="text-sm text-[var(--gold)] hover:underline">All projects</Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * 120}><ProjectCard p={p} /></Reveal>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <Reveal><h2 className="text-center font-[var(--font-cormorant)] text-4xl font-semibold">How it works</h2></Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 140}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="font-[var(--font-cormorant)] text-5xl text-[var(--gold)]/70">0{i + 1}</span>
                <h3 className="mt-2 font-[var(--font-cormorant)] text-2xl font-semibold">{t}</h3>
                <p className="mt-2 text-white/70">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <Reveal>
          <div className="grid items-center gap-6 rounded-3xl border border-[var(--gold)]/40 bg-gradient-to-br from-[var(--gold)]/15 to-transparent p-8 sm:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-[var(--font-cormorant)] text-4xl font-semibold">Own a property in Dubai?</h2>
              <p className="mt-2 text-white/70">Get a free valuation and let us sell or rent it out for you.</p>
            </div>
            <Link href="/lux-noble/sell" className="rounded-full bg-[var(--gold)] px-7 py-3 text-center font-semibold text-black transition hover:brightness-110">Sell or rent with us</Link>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="mx-auto mt-20 max-w-6xl px-5">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:grid-cols-2">
            <div>
              <h2 className="font-[var(--font-cormorant)] text-4xl font-semibold">Talk to us</h2>
              <p className="mt-3 text-white/70">{business.address}</p>
              <p className="mt-1 text-white/70">{business.phone}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`https://wa.me/${business.wa}?text=${encodeURIComponent("Hi Lux & Noble, I'd like to discuss a property.")}`} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--gold)] px-6 py-3 font-semibold text-black">WhatsApp us</a>
                <a href={`tel:${business.tel}`} className="rounded-full border border-white/25 px-6 py-3 font-semibold hover:border-[var(--gold)]">Call</a>
              </div>
            </div>
            <iframe title="Office map" loading="lazy" className="h-56 w-full rounded-2xl border-0" src={`https://www.google.com/maps?q=${business.lat},${business.lon}&output=embed`} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
