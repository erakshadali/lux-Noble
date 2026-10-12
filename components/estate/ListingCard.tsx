import Link from "next/link";
import { aed, bedsLabel, type Listing } from "@/lib/estate/types";

export default function ListingCard({ l }: { l: Listing }) {
  return (
    <Link href={`/lux-noble/property/${l.id}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-[var(--gold)]/60">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.photos[0]} alt={l.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2 text-xs font-semibold">
          <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-black">{l.status === "Off-plan" ? "Off-plan" : `For ${l.purpose === "Buy" ? "sale" : "rent"}`}</span>
          {l.custom ? <span className="rounded-full bg-emerald-400 px-3 py-1 text-black">New</span> : null}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xl font-semibold text-[var(--gold)]">
          {aed(l.price)}
          {l.purpose === "Rent" ? <span className="text-sm font-normal text-white/60"> / year</span> : null}
        </p>
        <h3 className="mt-1 line-clamp-1 font-medium">{l.title}</h3>
        <p className="mt-0.5 text-sm text-white/60">{[l.community, l.city].filter(Boolean).join(", ")}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-sm text-white/75">
          <span>{bedsLabel(l.beds)}</span>
          <span>{l.baths} bath</span>
          {l.size ? <span>{l.size.toLocaleString("en-US")} sq ft</span> : null}
          <span>{l.type}</span>
        </p>
      </div>
    </Link>
  );
}
