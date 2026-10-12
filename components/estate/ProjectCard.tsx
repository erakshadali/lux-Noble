import { aed } from "@/lib/estate/types";
import type { Project } from "@/lib/estate/projects";
import RegisterInterest from "./RegisterInterest";

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[var(--gold)]/60">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-black">Handover {p.handover}</span>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-white/50">{p.community} · {p.developer}</p>
        <h3 className="mt-1 font-[var(--font-cormorant)] text-2xl font-semibold">{p.name}</h3>
        <p className="mt-3 text-sm text-white/60">Starting from</p>
        <p className="text-2xl font-semibold text-[var(--gold)]">{aed(p.from)}</p>
        <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-sm"><strong>{p.plan} plan</strong> · <span className="text-white/70">{p.planNote}</span></p>
        <p className="mt-3 text-sm text-white/70">{p.types}</p>
        <ul className="mt-3 flex flex-wrap gap-2">{p.highlights.map((h) => <li key={h} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">{h}</li>)}</ul>
        <div className="mt-5"><RegisterInterest project={p.name} /></div>
      </div>
    </article>
  );
}
