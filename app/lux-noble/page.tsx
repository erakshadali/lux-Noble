import Link from "next/link";
import { Suspense } from "react";
import HeroArt from "@/components/estate/HeroArt";
import HeroSearch from "@/components/estate/HeroSearch";
import CountUp from "@/components/estate/CountUp";
import ListingsBrowser from "@/components/estate/ListingsBrowser";
import ProjectCard from "@/components/estate/ProjectCard";
import Reveal from "@/components/estate/Reveal";
import Words from "@/components/estate/Words";
import { tr } from "@/lib/estate/i18n";
import { T } from "@/lib/estate/lang";
import { PROJECTS } from "@/lib/estate/projects";
import { SAMPLE } from "@/lib/estate/sample";
import { business } from "@/lib/estate/types";

const areas = ["Dubai Marina", "Downtown Dubai", "Business Bay", "Palm Jumeirah", "Dubai Hills Estate", "JVC"];
const marquee = ["Dubai Marina", "Downtown Dubai", "Business Bay", "Palm Jumeirah", "Dubai Hills Estate", "Jumeirah Village Circle", "Dubai Creek Harbour", "Al Barsha", "DIFC", "Jumeirah Lake Towers"];
const stats: { n: number; sfx?: [string, string]; en: string; ar: string }[] = [
  { n: SAMPLE.length, en: "Properties listed", ar: "عقار معروض" },
  { n: new Set(SAMPLE.map((l) => l.community)).size, en: "Dubai communities", ar: "منطقة في دبي" },
  { n: PROJECTS.length, en: "Off-plan launches", ar: "مشاريع على الخارطة" },
  { n: 30, sfx: [" sec", " ثانية"], en: "To book a viewing", ar: "لحجز معاينة" },
];
const steps: { en: [string, string]; ar: [string, string] }[] = [
  { en: ["Search", "Filter by area, type, bedrooms and budget, as a list or on the map."], ar: ["ابحث", "صفّ حسب المنطقة والنوع وعدد الغرف والميزانية، كقائمة أو على الخريطة."] },
  { en: ["Book", "Pick a day and time. Your request lands on our WhatsApp straight away."], ar: ["احجز", "اختر اليوم والوقت. يصل طلبك إلى واتساب لدينا مباشرة."] },
  { en: ["View", "An agent meets you at the property with the permit and all the details."], ar: ["عاين", "يقابلك أحد وكلائنا في العقار ومعه التصريح وكل التفاصيل."] },
];

export default function Page() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <HeroArt />
        <div className="mx-auto max-w-6xl px-5 pb-40 pt-24 sm:pb-52 sm:pt-36">
          <Reveal><p className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]"><T en="Dubai real estate" ar="عقارات دبي" /></p></Reveal>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-[1.1] sm:text-7xl">
            <Words en="Find a home" ar="اعثر على منزل" start={150} />
            <br />
            <Words en="worthy of your name." ar="يليق باسمك." start={550} gold />
          </h1>
          <Reveal delay={240}><p className="mt-5 max-w-xl text-lg text-white/75"><T en="Apartments, villas and off-plan projects across Dubai. Book a viewing in 30 seconds and we reply on WhatsApp." ar="شقق وفلل ومشاريع على الخارطة في أنحاء دبي. احجز معاينة في 30 ثانية ونرد عليك عبر واتساب." /></p></Reveal>
          <Reveal delay={360}>
            <HeroSearch />
            <div className="mt-6 flex flex-wrap gap-2">
              {areas.map((a) => <Link key={a} href={`/lux-noble/properties?q=${encodeURIComponent(a)}`} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"><T en={a} ar={tr(a, "ar")} /></Link>)}
            </div>
          </Reveal>
        </div>
      </section>

      <div dir="ltr" className="overflow-hidden border-t border-[var(--gold)]/30 bg-[#0b0f1a] py-4" aria-hidden>
        <div className="ln-marquee font-[family-name:var(--font-cormorant)] text-2xl text-white/60">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {marquee.map((a) => (
                <span key={a} className="flex items-center whitespace-nowrap"><T en={a} ar={tr(a, "ar")} /><span className="mx-8 text-[var(--gold)]">◆</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 text-center sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.en}><p className="font-[family-name:var(--font-cormorant)] text-5xl font-semibold text-[var(--gold)]"><CountUp to={s.n} suffix={s.sfx ? <T en={s.sfx[0]} ar={s.sfx[1]} /> : null} /></p><p className="mt-1 text-sm text-white/60"><T en={s.en} ar={s.ar} /></p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold"><T en="Featured properties" ar="عقارات مميزة" /><span className="ln-line" /></h2>
            <Link href="/lux-noble/properties" className="text-sm text-[var(--gold)] hover:underline"><T en="View all" ar="عرض الكل" /></Link>
          </div>
        </Reveal>
        <Suspense fallback={null}><ListingsBrowser limit={6} /></Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]"><T en="New launches" ar="إطلاقات جديدة" /></p>
              <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold"><T en="Off-plan projects" ar="مشاريع على الخارطة" /><span className="ln-line" /></h2>
            </div>
            <Link href="/lux-noble/off-plan" className="text-sm text-[var(--gold)] hover:underline"><T en="All projects" ar="كل المشاريع" /></Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.slice(0, 3).map((p, i) => <Reveal key={p.id} delay={i * 120}><ProjectCard p={p} /></Reveal>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <Reveal><h2 className="text-center font-[family-name:var(--font-cormorant)] text-4xl font-semibold"><T en="How it works" ar="كيف نعمل" /></h2></Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.en[0]} delay={i * 140}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="font-[family-name:var(--font-cormorant)] text-5xl text-[var(--gold)]/70">0{i + 1}</span>
                <h3 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-semibold"><T en={s.en[0]} ar={s.ar[0]} /></h3>
                <p className="mt-2 text-white/70"><T en={s.en[1]} ar={s.ar[1]} /></p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <Reveal>
          <div className="ln-deco grid items-center gap-6 rounded-3xl border border-[var(--gold)]/40 bg-gradient-to-br from-[var(--gold)]/15 to-transparent p-8 sm:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold"><T en="Own a property in Dubai?" ar="هل تملك عقاراً في دبي؟" /></h2>
              <p className="mt-2 text-white/70"><T en="Get a free valuation and let us sell or rent it out for you." ar="احصل على تقييم مجاني ودعنا نبيعه أو نؤجره لك." /></p>
            </div>
            <Link href="/lux-noble/sell" className="rounded-full bg-[var(--gold)] px-7 py-3 text-center font-semibold text-black transition hover:brightness-110"><T en="Sell or rent with us" ar="بع أو أجّر معنا" /></Link>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="mx-auto mt-20 max-w-6xl px-5">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold"><T en="Talk to us" ar="تحدث إلينا" /></h2>
              <p className="mt-3 text-white/70"><T en={business.address} ar="502، مركز الزروني للأعمال، شارع الشيخ زايد، الخليج التجاري، دبي" /></p>
              <p dir="ltr" className="mt-1 text-start text-white/70">{business.phone}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`https://wa.me/${business.wa}?text=${encodeURIComponent("Hi Lux & Noble, I'd like to discuss a property.")}`} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--gold)] px-6 py-3 font-semibold text-black"><T en="WhatsApp us" ar="راسلنا على واتساب" /></a>
                <a href={`tel:${business.tel}`} className="rounded-full border border-white/25 px-6 py-3 font-semibold hover:border-[var(--gold)]"><T en="Call" ar="اتصال" /></a>
              </div>
            </div>
            <iframe title="Office map" loading="lazy" className="h-56 w-full rounded-2xl border-0" src={`https://www.google.com/maps?q=${business.lat},${business.lon}&output=embed`} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
