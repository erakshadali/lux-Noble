"use client";

import type { Project } from "@/lib/estate/projects";
import { PROJECTS_AR, money, quarter, tr } from "@/lib/estate/i18n";
import { useLang } from "@/lib/estate/lang";
import RegisterInterest from "./RegisterInterest";

export default function ProjectCard({ p }: { p: Project }) {
  const lang = useLang();
  const ar = lang === "ar";
  const a = ar ? PROJECTS_AR[p.id] : undefined;
  const name = a?.name ?? p.name;
  const plan = a?.plan ?? (ar ? `خطة ${p.plan}` : `${p.plan} plan`);
  return (
    <article className="ln-glow group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[var(--gold)]/60">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.photo} alt={name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute start-3 top-3 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-black">{ar ? "التسليم" : "Handover"} {quarter(p.handover, lang)}</span>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-white/50">{tr(p.community, lang)} · {tr(p.developer, lang)}</p>
        <h3 className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl font-semibold">{name}</h3>
        <p className="mt-3 text-sm text-white/60">{ar ? "ابتداءً من" : "Starting from"}</p>
        <p className="text-2xl font-semibold text-[var(--gold)]">{money(p.from, lang)}</p>
        <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-sm"><strong>{plan}</strong> · <span className="text-white/70">{a?.planNote ?? p.planNote}</span></p>
        <p className="mt-3 text-sm text-white/70">{a?.types ?? p.types}</p>
        <ul className="mt-3 flex flex-wrap gap-2">{(a?.highlights ?? p.highlights).map((h) => <li key={h} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">{h}</li>)}</ul>
        <div className="mt-5"><RegisterInterest project={p.name} projectLabel={name} /></div>
      </div>
    </article>
  );
}
