"use client";

import Link from "next/link";
import type { Listing } from "@/lib/estate/types";
import { baths, beds, listingText, money, perYear, sqft, tr } from "@/lib/estate/i18n";
import { useBiz } from "@/lib/estate/biz";
import { useLang } from "@/lib/estate/lang";
import FavButton from "./FavButton";

export default function ListingCard({ l }: { l: Listing }) {
  const lang = useLang();
  const { base } = useBiz();
  const ar = lang === "ar";
  const { title } = listingText(l, lang);
  const badge = l.status === "Off-plan" ? tr("Off-plan", lang) : ar ? (l.purpose === "Buy" ? "للبيع" : "للإيجار") : `For ${l.purpose === "Buy" ? "sale" : "rent"}`;
  return (
    <div className="ln-glow group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/60 hover:shadow-[0_18px_40px_-18px_rgba(201,164,92,0.45)]">
      <FavButton id={l.id} className="absolute end-3 top-3 z-10" />
      <Link href={`${base}/property/${l.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={l.photos[0]} alt={title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute start-3 top-3 flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-black">{badge}</span>
            {l.custom ? <span className="rounded-full bg-emerald-400 px-3 py-1 text-black">{ar ? "جديد" : "New"}</span> : null}
          </div>
        </div>
        <div className="p-5">
          <p className="text-xl font-semibold text-[var(--gold)]">
            {money(l.price, lang)}
            {l.purpose === "Rent" ? <span className="text-sm font-normal text-white/60"> {perYear(lang)}</span> : null}
          </p>
          <h3 className="mt-1 line-clamp-1 font-medium">{title}</h3>
          <p className="mt-0.5 text-sm text-white/60">{[tr(l.community, lang), tr(l.city, lang)].filter(Boolean).join(ar ? "، " : ", ")}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-sm text-white/75">
            <span>{beds(l.beds, lang)}</span>
            <span>{baths(l.baths, lang)}</span>
            {l.size ? <span>{sqft(l.size, lang)}</span> : null}
            <span>{tr(l.type, lang)}</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
