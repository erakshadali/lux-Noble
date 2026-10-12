"use client";

import Link from "next/link";
import { useState } from "react";
import { addListings, clearCustom, removeListing, useCustomListings } from "@/lib/estate/store";
import { CSV_TEMPLATE, parseAny } from "@/lib/estate/import";
import { aed, TYPES, type Listing } from "@/lib/estate/types";

const field = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)] [&>option]:text-black";
const label = "block text-xs uppercase tracking-wide text-white/55";

export default function AdminPanel() {
  const custom = useCustomListings();
  const [note, setNote] = useState("");

  function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    const photos = s("photos").split(/[\s,|]+/).filter((u) => /^https?:\/\//.test(u));
    const l: Listing = {
      id: `c-${Date.now().toString(36)}`,
      ref: s("ref") || `LN-${Math.floor(Math.random() * 9000 + 1000)}`,
      purpose: s("purpose") === "Rent" ? "Rent" : "Buy",
      status: s("status") === "Off-plan" ? "Off-plan" : "Ready",
      type: (TYPES.find((t) => t === s("type")) ?? "Apartment"),
      title: s("title"),
      community: s("community"),
      city: s("city") || "Dubai",
      price: Number(s("price")) || 0,
      beds: Number(s("beds")) || 0,
      baths: Number(s("baths")) || 1,
      size: Number(s("size")) || 0,
      furnished: s("furnished") === "yes",
      description: s("description"),
      amenities: s("amenities").split(",").map((a) => a.trim()).filter(Boolean),
      photos: photos.length ? photos : ["/img/pro/estate/1.jpg"],
      permit: s("permit"),
      agent: s("agent") || "Lux & Noble team",
      handover: s("handover") || undefined,
      custom: true,
    };
    addListings([l]);
    setNote(`Added "${l.title}". It is now live on the site.`);
    e.currentTarget.reset();
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const items = parseAny(await file.text());
    if (items.length) {
      addListings(items);
      setNote(`Imported ${items.length} ${items.length === 1 ? "listing" : "listings"} from ${file.name}.`);
    } else setNote("No listings found. Each row needs at least a title and a price. Download the template to see the format.");
    e.target.value = "";
  }

  function template() {
    const url = URL.createObjectURL(new Blob([CSV_TEMPLATE], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "listings-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="font-[var(--font-cormorant)] text-4xl font-semibold">Manage your listings</h1>
      <p className="mt-2 max-w-2xl text-white/70">Add a property below, or upload a CSV or XML export from your CRM or Property Finder / Bayut feed. It shows on the site straight away. In this demo your listings are saved in this browser only. On the real site they go to a database and sync automatically.</p>
      {note ? <p className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-3 text-sm text-emerald-300">{note} <Link href="/lux-noble/properties" className="underline">View the site</Link></p> : null}

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold">Upload a feed</h2>
        <p className="mt-1 text-sm text-white/60">CSV or XML. Columns such as title, price, purpose, type, community, beds, baths, size, permit, photos.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full bg-[var(--gold)] px-5 py-2.5 text-sm font-semibold text-black">
            Choose file
            <input type="file" accept=".csv,.xml,.txt,text/csv,text/xml,application/xml" onChange={upload} className="hidden" />
          </label>
          <button onClick={template} className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold hover:border-[var(--gold)]">Download CSV template</button>
        </div>
      </section>

      <form onSubmit={add} className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold">Add one property</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2"><label className={label}>Title *</label><input name="title" required className={field} placeholder="2 bed apartment with sea view" /></div>
          <div><label className={label}>Price (AED) *</label><input name="price" type="number" required min={1} className={field} placeholder="1850000" /></div>
          <div><label className={label}>For</label><select name="purpose" className={field}><option>Buy</option><option>Rent</option></select></div>
          <div><label className={label}>Type</label><select name="type" className={field}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label className={label}>Status</label><select name="status" className={field}><option>Ready</option><option>Off-plan</option></select></div>
          <div><label className={label}>Area</label><input name="community" className={field} placeholder="Dubai Marina" /></div>
          <div><label className={label}>City</label><input name="city" className={field} defaultValue="Dubai" /></div>
          <div><label className={label}>Reference</label><input name="ref" className={field} placeholder="LN-2001" /></div>
          <div><label className={label}>Bedrooms (0 = studio)</label><input name="beds" type="number" min={0} className={field} defaultValue={1} /></div>
          <div><label className={label}>Bathrooms</label><input name="baths" type="number" min={1} className={field} defaultValue={1} /></div>
          <div><label className={label}>Size (sq ft)</label><input name="size" type="number" min={0} className={field} /></div>
          <div><label className={label}>Furnished</label><select name="furnished" className={field}><option value="no">No</option><option value="yes">Yes</option></select></div>
          <div><label className={label}>Handover (off-plan)</label><input name="handover" className={field} placeholder="Q4 2028" /></div>
          <div><label className={label}>Permit number (Trakheesi)</label><input name="permit" className={field} /></div>
          <div><label className={label}>Agent</label><input name="agent" className={field} /></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className={label}>Photo links (one per line or comma separated)</label><textarea name="photos" rows={2} className={field} placeholder="https://..." /></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className={label}>Amenities (comma separated)</label><input name="amenities" className={field} placeholder="Balcony, Pool, Gym" /></div>
          <div className="sm:col-span-2 lg:col-span-3"><label className={label}>Description</label><textarea name="description" rows={3} className={field} /></div>
        </div>
        <button className="mt-5 rounded-full bg-[var(--gold)] px-7 py-3 font-semibold text-black">Add property</button>
      </form>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your listings ({custom.length})</h2>
          {custom.length ? <button onClick={() => { clearCustom(); setNote("All your listings were removed."); }} className="text-sm text-white/60 underline hover:text-white">Remove all</button> : null}
        </div>
        {custom.length ? (
          <ul className="mt-3 divide-y divide-white/10 rounded-2xl border border-white/10">
            {custom.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <Link href={`/lux-noble/property/${l.id}`} className="min-w-0 truncate hover:text-[var(--gold)]">{l.title} · {aed(l.price)}</Link>
                <button onClick={() => removeListing(l.id)} className="shrink-0 text-white/60 hover:text-red-400">Remove</button>
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-sm text-white/50">Nothing added yet. The 12 sample properties are showing on the site.</p>}
      </section>
    </div>
  );
}
