"use client";

import { useT } from "@/lib/estate/lang";

export default function HeroSearch() {
  const t = useT();
  const sel = "rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm [&>option]:text-black";
  return (
    <form action="/lux-noble/properties" className="mt-10 grid max-w-3xl gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur sm:grid-cols-[1fr_1fr_1.3fr_auto]">
      <select name="purpose" className={sel} aria-label={t("Buy or rent", "شراء أو إيجار")}><option value="Buy">{t("Buy", "شراء")}</option><option value="Rent">{t("Rent", "إيجار")}</option></select>
      <select name="type" className={sel} aria-label={t("Type", "النوع")}>
        <option value="">{t("Any type", "أي نوع")}</option><option value="Apartment">{t("Apartment", "شقة")}</option><option value="Villa">{t("Villa", "فيلا")}</option><option value="Townhouse">{t("Townhouse", "تاون هاوس")}</option><option value="Penthouse">{t("Penthouse", "بنتهاوس")}</option>
      </select>
      <input name="q" placeholder={t("Area or project", "المنطقة أو المشروع")} className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm placeholder:text-white/40" />
      <button className="ln-btn-shine rounded-xl bg-[var(--gold)] px-6 py-3 font-semibold text-black transition hover:brightness-110">{t("Search", "بحث")}</button>
    </form>
  );
}
