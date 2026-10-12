import type { Metadata } from "next";
import Link from "next/link";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import { business } from "@/lib/estate/types";
import { LangShell, T } from "@/lib/estate/lang";
import HeaderArt from "@/components/estate/HeaderArt";
import MobileMenu from "@/components/estate/MobileMenu";
import Effects from "@/components/estate/Effects";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"] });
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Lux & Noble International Real Estate | Dubai",
  description: "Apartments, villas and off-plan homes in Dubai. Book a viewing on WhatsApp.",
  robots: { index: false, follow: false },
};

const nav: [string, string, string][] = [
  ["Buy", "/lux-noble/properties?purpose=Buy", "شراء"],
  ["Rent", "/lux-noble/properties?purpose=Rent", "إيجار"],
  ["Off-plan", "/lux-noble/off-plan", "على الخارطة"],
  ["Sell", "/lux-noble/sell", "بيع"],
  ["Contact", "/lux-noble#contact", "اتصل بنا"],
];

export default function LuxNobleLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangShell className={`${cormorant.variable} ${cairo.variable} min-h-screen bg-[#0b0f1a] text-white [--gold:#c9a45c]`}>
      <Effects />
      <header className="sticky top-0 z-30 border-b border-[var(--gold)]/25 bg-[#0b0f1a]/95 backdrop-blur">
        <HeaderArt />
        <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pb-5 pt-3 sm:pb-8 sm:pt-4">
          <Link href="/lux-noble" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-[family-name:var(--font-cormorant)] text-xl font-bold tracking-wide sm:gap-2.5 sm:text-2xl">
            <svg viewBox="0 0 24 24" className="ln-mark h-7 w-7" aria-hidden><rect x="2" y="10" width="6" height="12" rx="0.5" fill="#c9a45c" /><rect x="9" y="3" width="6" height="19" rx="0.5" fill="#f3d58a" /><rect x="16" y="7" width="6" height="15" rx="0.5" fill="#c9a45c" /></svg>
            <span><T en="Lux" ar="لوكس" /> <span className="text-[var(--gold)]"><T en="&" ar="آند" /></span> <T en="Noble" ar="نوبل" /></span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            {nav.map(([t, h, a]) => <Link key={t} href={h} className="ln-navlink hidden text-white/75 transition hover:text-[var(--gold)] sm:block"><T en={t} ar={a} /></Link>)}
            <Link href="/lux-noble/admin" className="hidden rounded-full border border-[var(--gold)]/60 px-4 py-2 font-semibold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black sm:block"><T en="Add listings" ar="إضافة عقارات" /></Link>
            <MobileMenu items={nav} />
          </nav>
        </div>
      </header>
      <div className="bg-[var(--gold)]/15 px-5 py-2 text-center text-xs text-[var(--gold)]"><T en="Demo with sample properties. Add your own on the" ar="نسخة تجريبية بعقارات تجريبية. أضف عقاراتك من صفحة" /> <Link href="/lux-noble/admin" className="underline"><T en="Add listings" ar="إضافة عقارات" /></Link> <T en="page." ar="." /></div>
      <main>{children}</main>
      <a href={`https://wa.me/${business.wa}?text=${encodeURIComponent("Hi Lux & Noble, I have a question about a property.")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="ln-pulse fixed bottom-5 end-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-black shadow-lg transition hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.8-.1 1.4z" /></svg>
      </a>
      <footer className="mt-20 border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 pt-10 text-sm text-white/65 sm:pb-10 sm:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-white"><T en={business.name} ar="لوكس آند نوبل الدولية للعقارات ذ.م.م" /></p>
            <p className="mt-2"><T en="ORN: add your registration number" ar="رقم تسجيل الوسيط (ORN): أضف رقمك" /></p>
          </div>
          <div><p><T en={business.address} ar="502، مركز الزروني للأعمال، شارع الشيخ زايد، الخليج التجاري، دبي" /></p><p dir="ltr" className="mt-1 text-start">{business.phone}</p></div>
          <p className="text-xs"><T en="Property photos are free stock images (CC0) used as placeholders. Prices, permits and agents on sample listings are not real." ar="صور العقارات صور مجانية (CC0) مستخدمة كبدائل مؤقتة. الأسعار والتصاريح والوكلاء في الإعلانات التجريبية غير حقيقية." /></p>
        </div>
      </footer>
    </LangShell>
  );
}
