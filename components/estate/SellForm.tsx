"use client";

import { useState } from "react";
import { tr } from "@/lib/estate/i18n";
import { useLang, useT } from "@/lib/estate/lang";
import { business, TYPES } from "@/lib/estate/types";

export default function SellForm() {
  const t = useT();
  const lang = useLang();
  const [done, setDone] = useState(false);
  const field = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)] [&>option]:text-black";

  // The WhatsApp message stays in English so the sales team reads it the same way every time.
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = `Hi Lux & Noble, I want to ${String(f.get("goal")).toLowerCase()} my property.\nType: ${f.get("type")}\nLocation: ${f.get("location")}\nBedrooms: ${f.get("beds")}\nExpected price: ${f.get("price") || "-"}\nName: ${f.get("name")}\nPhone: ${f.get("phone")}`;
    setDone(true);
    window.open(`https://wa.me/${business.wa}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">{t("Get a free valuation", "احصل على تقييم مجاني")}</h2>
      <div className="grid grid-cols-2 gap-3">
        <select name="goal" className={field}><option value="Sell">{t("Sell", "بيع")}</option><option value="Rent out">{t("Rent out", "تأجير")}</option></select>
        <select name="type" className={field}>{TYPES.map((x) => <option key={x} value={x}>{tr(x, lang)}</option>)}</select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="location" required placeholder={t("Area / building", "المنطقة / المبنى")} className={field} />
        <input name="beds" type="number" min={0} placeholder={t("Bedrooms", "غرف النوم")} className={field} />
      </div>
      <input name="price" placeholder={t("Expected price in AED (optional)", "السعر المتوقع بالدرهم (اختياري)")} className={field} />
      <input name="name" required placeholder={t("Your name", "اسمك")} className={field} />
      <input name="phone" required placeholder={t("Phone / WhatsApp", "الهاتف / واتساب")} className={field} />
      <button className="w-full rounded-full bg-[var(--gold)] py-3 font-semibold text-black">{t("Send on WhatsApp", "أرسل عبر واتساب")}</button>
      {done ? <p className="text-sm text-emerald-400">{t("WhatsApp opened with your details. An agent will call you.", "تم فتح واتساب مع بياناتك. سيتصل بك أحد وكلائنا.")}</p> : null}
    </form>
  );
}
