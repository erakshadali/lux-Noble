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
  ["Off-plan", "/lux-noble/properties?status=offplan"],
  ["Contact", "/lux-noble#contact"],
];

export default function LuxNobleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} min-h-screen bg-[#0b0f1a] text-white [--gold:#c9a45c]`}>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f1a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/lux-noble" className="font-[var(--font-cormorant)] text-2xl font-bold tracking-wide">
            Lux <span className="text-[var(--gold)]">&amp;</span> Noble
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            {nav.map(([t, h]) => <Link key={t} href={h} className="hidden text-white/75 hover:text-[var(--gold)] sm:block">{t}</Link>)}
            <Link href="/lux-noble/admin" className="rounded-full border border-[var(--gold)]/60 px-4 py-2 font-semibold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black">Add listings</Link>
          </nav>
        </div>
      </header>
      <div className="bg-[var(--gold)]/15 px-5 py-2 text-center text-xs text-[var(--gold)]">Demo with sample properties. Add your own on the <Link href="/lux-noble/admin" className="underline">Add listings</Link> page.</div>
      <main>{children}</main>
      <footer className="mt-20 border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-sm text-white/65 sm:grid-cols-3">
          <div><p className="font-[var(--font-cormorant)] text-xl font-semibold text-white">{business.name}</p><p className="mt-2">ORN: add your registration number</p></div>
          <div><p>{business.address}</p><p className="mt-1">{business.phone}</p></div>
          <p className="text-xs">Property photos are free stock images (CC0) used as placeholders. Prices, permits and agents on sample listings are not real.</p>
        </div>
      </footer>
    </div>
  );
}
