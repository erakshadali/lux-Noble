import Link from "next/link";
import { Suspense } from "react";
import ListingsBrowser from "@/components/estate/ListingsBrowser";
import { business } from "@/lib/estate/types";

const areas = ["Dubai Marina", "Downtown Dubai", "Business Bay", "Palm Jumeirah", "Dubai Hills Estate", "JVC"];

export default function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/pro/estate/2.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b0f1a]/40 via-[#0b0f1a]/70 to-[#0b0f1a]" />
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]">Dubai real estate</p>
          <h1 className="mt-4 max-w-3xl font-[var(--font-cormorant)] text-5xl font-semibold leading-tight sm:text-7xl">Find a home worthy of your name.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">Apartments, villas and off-plan projects across Dubai. Book a viewing in 30 seconds and we reply on WhatsApp.</p>
          <form action="/lux-noble/properties" className="mt-10 grid max-w-3xl gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur sm:grid-cols-[1fr_1fr_1fr_auto]">
            <select name="purpose" className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm [&>option]:text-black" aria-label="Buy or rent"><option value="Buy">Buy</option><option value="Rent">Rent</option></select>
            <select name="type" className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm [&>option]:text-black" aria-label="Type"><option value="">Any type</option><option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option></select>
            <input name="q" placeholder="Area or project" className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm placeholder:text-white/40" />
            <button className="rounded-xl bg-[var(--gold)] px-6 py-3 font-semibold text-black">Search</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-2">
            {areas.map((a) => <Link key={a} href={`/lux-noble/properties?q=${encodeURIComponent(a)}`} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:border-[var(--gold)] hover:text-[var(--gold)]">{a}</Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-[var(--font-cormorant)] text-4xl font-semibold">Featured properties</h2>
          <Link href="/lux-noble/properties" className="text-sm text-[var(--gold)] hover:underline">View all</Link>
        </div>
        <Suspense fallback={null}><ListingsBrowser limit={6} /></Suspense>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-6 px-5 sm:grid-cols-3">
        {[["Book online", "Pick a property, a day and a time. The request arrives on our WhatsApp."], ["Verified listings", "Every listing carries its permit number, agent and reference."], ["Buy, rent or off-plan", "Ready homes, rentals and new launches with payment plans."]].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 className="font-[var(--font-cormorant)] text-2xl font-semibold text-[var(--gold)]">{t}</h3><p className="mt-2 text-white/70">{d}</p></div>
        ))}
      </section>

      <section id="contact" className="mx-auto mt-20 max-w-6xl px-5">
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
      </section>
    </>
  );
}
