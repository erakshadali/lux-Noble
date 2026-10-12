"use client";

import { useRef, useState } from "react";
import { business } from "@/lib/estate/types";

// "Register interest" button that opens a small form and sends it to WhatsApp.
export default function RegisterInterest({ project, label = "Register interest" }: { project: string; label?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [done, setDone] = useState(false);
  const field = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)]";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = `Hi Lux & Noble, please send me the brochure and payment plan for ${project}.\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nBudget: ${f.get("budget") || "-"}`;
    setDone(true);
    window.open(`https://wa.me/${business.wa}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <>
      <button onClick={() => { setDone(false); dlg.current?.showModal(); }} className="rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110">{label}</button>
      <dialog ref={dlg} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }} className="m-auto w-[92vw] max-w-md rounded-2xl border border-white/15 bg-[#0b0f1a] p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm">
        <form onSubmit={submit} className="space-y-3 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-[var(--font-cormorant)] text-2xl font-semibold">Get early access<br /><span className="text-[var(--gold)]">{project}</span></h2>
            <button type="button" onClick={() => dlg.current?.close()} aria-label="Close" className="text-2xl leading-none text-white/60 hover:text-white">×</button>
          </div>
          <input name="name" required placeholder="Your name" className={field} />
          <input name="phone" required placeholder="Phone / WhatsApp" className={field} />
          <input name="budget" placeholder="Budget (optional)" className={field} />
          <button className="w-full rounded-full bg-[var(--gold)] py-3 font-semibold text-black">Send on WhatsApp</button>
          {done ? <p className="text-sm text-emerald-400">WhatsApp opened with your request.</p> : null}
        </form>
      </dialog>
    </>
  );
}
