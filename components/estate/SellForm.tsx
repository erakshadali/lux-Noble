"use client";

import { useState } from "react";
import { business, TYPES } from "@/lib/estate/types";

export default function SellForm() {
  const [done, setDone] = useState(false);
  const field = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)] [&>option]:text-black";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = `Hi Lux & Noble, I want to ${String(f.get("goal")).toLowerCase()} my property.\nType: ${f.get("type")}\nLocation: ${f.get("location")}\nBedrooms: ${f.get("beds")}\nExpected price: ${f.get("price") || "-"}\nName: ${f.get("name")}\nPhone: ${f.get("phone")}`;
    setDone(true);
    window.open(`https://wa.me/${business.wa}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="font-[var(--font-cormorant)] text-2xl font-semibold">Get a free valuation</h2>
      <div className="grid grid-cols-2 gap-3">
        <select name="goal" className={field}><option>Sell</option><option>Rent out</option></select>
        <select name="type" className={field}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input name="location" required placeholder="Area / building" className={field} />
        <input name="beds" type="number" min={0} placeholder="Bedrooms" className={field} />
      </div>
      <input name="price" placeholder="Expected price in AED (optional)" className={field} />
      <input name="name" required placeholder="Your name" className={field} />
      <input name="phone" required placeholder="Phone / WhatsApp" className={field} />
      <button className="w-full rounded-full bg-[var(--gold)] py-3 font-semibold text-black">Send on WhatsApp</button>
      {done ? <p className="text-sm text-emerald-400">WhatsApp opened with your details. An agent will call you.</p> : null}
    </form>
  );
}
