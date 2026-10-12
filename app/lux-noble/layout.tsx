import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { business } from "@/lib/estate/types";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Lux & Noble International Real Estate | Dubai",
  description: "Apartments, villas and off-plan homes in Dubai. Book a viewing on WhatsApp.",
  robots: { index: false, follow: false },
};

const nav: [string, string][] = [
  ["Buy", "/lux-noble/properties?purpose=Buy"],
  ["Rent", "/lux-noble/properties?purpose=Rent"],
  ["Off-plan", "/lux-noble/off-plan"],
  ["Sell", "/lux-noble/sell"],
  ["Contact", "/lux-noble#contact"],
];

export default function LuxNobleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} min-h-screen bg-[#0b0f1a] text-white [--gold:#c9a45c]`}>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f1a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/lux-noble" className="font-[family-name:var(--font-cormorant)] text-2xl font-bold tracking-wide">
            Lux <span className="text-[var(--gold)]">&amp;</span> Noble
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            {nav.map(([t, h]) => <Link key={t} href={h} className="hidden text-white/75 hover:text-[var(--gold)] sm:block">{t}</Link>)}
            <Link href="/lux-noble/admin" className="rounded-full border border-[var(--gold)]/60 px-4 py-2 font-semibold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">Add listings</Link>
          </nav>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-5 pb-3 text-sm sm:hidden [scrollbar-width:none]" aria-label="Sections">
          {nav.map(([t, h]) => <Link key={t} href={h} className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-white/80 active:border-[var(--gold)]">{t}</Link>)}
        </nav>
      </header>
      <div className="bg-[var(--gold)]/15 px-5 py-2 text-center text-xs text-[var(--gold)]">Demo with sample properties. Add your own on the <Link href="/lux-noble/admin" className="underline">Add listings</Link> page.</div>
      <main>{children}</main>
      <a href={`https://wa.me/${business.wa}?text=${encodeURIComponent("Hi Lux & Noble, I have a question about a property.")}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="ln-pulse fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-black shadow-lg transition hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" /></svg>
      </a>
      <footer className="mt-20 border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 pt-10 text-sm text-white/65 sm:pb-10 sm:grid-cols-3">
          <div><p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-white">{business.name}</p><p className="mt-2">ORN: add your registration number</p></div>
          <div><p>{business.address}</p><p className="mt-1">{business.phone}</p></div>
          <p className="text-xs">Property photos are free stock images (CC0) used as placeholders. Prices, permits and agents on sample listings are not real.</p>
        </div>
      </footer>
    </div>
  );
}
