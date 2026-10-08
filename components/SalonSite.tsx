"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ICONS, type IconKey } from "@/lib/pro";
import { FAQ, REVIEWS, type Item } from "@/lib/salon";
import { catalogForTheme, copyForTheme, paletteFor, wordingFor, type ThemeKey } from "@/lib/salonThemes";
import type { Photo } from "@/lib/images";

export type SalonProps = {
  slug: string;
  name: string;
  sub: ThemeKey;
  place: string;
  city: string;
  address: string;
  phone: string;
  tel: string;
  whatsapp: boolean;
  facebook: string;
  mapQuery: string;
  lat: number;
  lon: number;
  photos: Photo[]; // at least 8
  pitchHref: string;
  company: string;
};

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmtTime = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
};
const fmtDur = (min: number) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ""}`);
const longDate = (s: string) => parseDay(s).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
const hash = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
};

// "Today" and "now" come from the visitor's own clock, so the static page always shows the right days and open status.
const noopSub = () => () => {};
function subMinute(cb: () => void) {
  const t = setInterval(cb, 30000);
  return () => clearInterval(t);
}
const todaySnap = () => iso(new Date());
const minuteSnap = () => Math.floor(Date.now() / 60000);
const newRef = () => `ON-${1000 + (hash(String(Date.now())) % 9000)}`;
const serverEmpty = () => "";
const serverZero = () => 0;

function Icon({ k, className = "h-5 w-5" }: { k: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={ICONS[k]} />
    </svg>
  );
}

function Eyebrow({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em]" style={{ color: light ? "var(--accent2)" : "var(--accent)" }}>
      <span className="h-px w-8" style={{ background: "currentColor" }} />
      {children}
    </p>
  );
}

function Tag({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
      style={dark ? { borderColor: "rgba(255,255,255,.25)", color: "rgba(255,255,255,.75)", background: "rgba(255,255,255,.08)" } : { borderColor: "var(--line)", color: "var(--muted)", background: "var(--surface)" }}
    >
      {children}
    </span>
  );
}

export default function SalonSite(p: SalonProps) {
  const pal = paletteFor(p.sub);
  const copy = copyForTheme(p.sub);
  const W = wordingFor[p.sub];
  const HOURS = W.hours;
  const catalog = useMemo(() => catalogForTheme(p.sub), [p.sub]);
  const allItems = useMemo(() => catalog.flatMap((c) => c.items), [catalog]);

  const today = useSyncExternalStore(noopSub, todaySnap, serverEmpty);
  const minuteNow = useSyncExternalStore(subMinute, minuteSnap, serverZero);

  const [cart, setCart] = useState<string[]>([]);
  const [cat, setCat] = useState(catalog[0].key);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(-1);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<{ ref: string; text: string; start: string; mins: number } | null>(null);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(-1); // lightbox index
  const [review, setReview] = useState(0);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (light < 0) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLight(-1);
      if (e.key === "ArrowRight") setLight((i) => (i + 1) % p.photos.length);
      if (e.key === "ArrowLeft") setLight((i) => (i - 1 + p.photos.length) % p.photos.length);
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [light, p.photos.length]);

  useEffect(() => {
    const t = setInterval(() => setReview((r) => (r + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const picked = cart.map((id) => allItems.find((x) => x.id === id)).filter(Boolean) as Item[];
  const totalMins = picked.reduce((a, x) => a + x.mins, 0);
  const totalPrice = picked.reduce((a, x) => a + x.price, 0);
  const priced = allItems.some((x) => x.price > 0);
  const toggle = (id: string) => {
    setDone(null);
    setTime(-1);
    setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };

  const nowDate = minuteNow ? new Date(minuteNow * 60000) : null;
  const nowMin = nowDate ? nowDate.getHours() * 60 + nowDate.getMinutes() : 0;
  const isOpen = !!nowDate && nowMin >= HOURS.open && nowMin < HOURS.close;
  const status = !nowDate ? "" : isOpen ? `Open now · until ${fmtTime(HOURS.close)}` : nowMin < HOURS.open ? `Opens today at ${fmtTime(HOURS.open)}` : `Closed · opens tomorrow at ${fmtTime(HOURS.open)}`;

  const days = useMemo(() => {
    if (!today) return [];
    const base = parseDay(today);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return { iso: iso(d), wd: d.toLocaleDateString("en-GB", { weekday: "short" }), day: d.getDate(), mon: d.toLocaleDateString("en-GB", { month: "short" }) };
    });
  }, [today]);

  const need = Math.max(totalMins, 30);
  const slotsFor = (day: string) => {
    const out: { t: number; off: boolean }[] = [];
    for (let t = HOURS.open; t + need <= HOURS.close; t += 30) {
      const busy = hash(`${p.slug}|${day}|${t}`) % 100 < 26;
      const passed = day === today && t <= nowMin + 45;
      out.push({ t, off: busy || passed });
    }
    return out;
  };
  const slots = date ? slotsFor(date) : [];
  const nextFew = (() => {
    if (!days.length) return [] as { day: string; t: number }[];
    const res: { day: string; t: number }[] = [];
    for (const d of days.slice(0, 3)) {
      for (const s of slotsFor(d.iso)) if (!s.off && res.length < 3) res.push({ day: d.iso, t: s.t });
      if (res.length >= 3) break;
    }
    return res;
  })();

  const phoneOk = phone.replace(/\D/g, "").length >= 7;
  const ready = picked.length > 0 && !!date && time >= 0 && customer.trim().length > 1 && phoneOk;
  const missing = picked.length === 0 ? "Pick at least one service." : !date ? "Choose a day." : time < 0 ? "Choose a time." : customer.trim().length < 2 ? "Add your name." : !phoneOk ? "Add your phone number." : "";

  function confirm() {
    if (!ready) return;
    const ref = newRef();
    const lines = [
      `Hello ${p.name}! ${W.msgIntro}`,
      ...picked.map((x) => `• ${x.name} (${fmtDur(x.mins)})`),
      "",
      `📅 ${longDate(date)}, ${fmtTime(time)}`,
      `⏱ About ${fmtDur(totalMins)}${priced && totalPrice ? ` · AED ${totalPrice}` : ""}`,
      `👤 ${customer.trim()} · ${phone.trim()}`,
      ...(note.trim() ? [`📝 ${note.trim()}`] : []),
      "",
      `Booking ${ref}`,
    ];
    const h = Math.floor(time / 60);
    setDone({ ref, text: lines.join("\n"), start: `${date}T${pad(h)}:${pad(time % 60)}`, mins: totalMins });
  }

  function downloadIcs() {
    if (!done) return;
    const [d, t] = done.start.split("T");
    const start = new Date(`${d}T${t}:00`);
    const end = new Date(start.getTime() + done.mins * 60000);
    const f = (x: Date) => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Onwebsite//Salon//EN", "BEGIN:VEVENT", `UID:${done.ref}@onwebsite`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:${p.name.replace(/[,;\n]/g, " ")} booking`, `LOCATION:${p.address.replace(/[,;\n]/g, " ")}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const digits = p.tel.replace(/\D/g, "");
  const callHref = `tel:${p.tel}`;
  const bizWa = `https://wa.me/${digits}`;
  const where = p.mapQuery ? encodeURIComponent(p.mapQuery) : `${p.lat},${p.lon}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${where}`;
  const mapEmbed = `https://maps.google.com/maps?q=${where}&z=15&output=embed`;
  const goBook = () => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });

  const vars = {
    "--bg": pal.bg,
    "--surface": pal.surface,
    "--ink": pal.ink,
    "--muted": pal.muted,
    "--line": pal.line,
    "--accent": pal.accent,
    "--on-accent": pal.onAccent,
    "--accent2": pal.accent2,
    "--dark": pal.dark,
    "--dark2": pal.dark2,
    "--display": "var(--font-playfair)",
    background: pal.bg,
    color: pal.ink,
  } as CSSProperties;

  const nav = [
    ["Services", "#services"],
    ["Gallery", "#gallery"],
    ["Reviews", "#reviews"],
    ["Book", "#book"],
    ["Visit", "#visit"],
  ];

  const accentBtn: CSSProperties = { background: "var(--accent)", color: "var(--on-accent)", boxShadow: "0 14px 34px -12px var(--accent)" };

  return (
    <div className="salon-root" style={vars}>
      {/* Demo banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-2 text-[13px] text-white md:px-8" style={{ background: "#0B0B0F" }}>
        <p className="truncate">
          <span className="font-bold">Free demo</span> made by {p.company} for {p.name}
        </p>
        <a href={p.pitchHref} className="shrink-0 rounded-full bg-white px-3.5 py-1 text-[12px] font-bold text-black hover:bg-white/90">
          Make it yours →
        </a>
      </div>

      {/* Glass nav */}
      <nav className="fixed inset-x-0 top-[37px] z-40 transition-all duration-300" style={{ background: scrolled || menu ? "color-mix(in srgb, var(--dark) 88%, transparent)" : "transparent", backdropFilter: scrolled || menu ? "blur(14px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,.08)" : "1px solid transparent" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 text-white md:px-8">
          <a href="#top" className="salon-display truncate text-xl font-semibold md:text-2xl">{p.name}</a>
          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="text-white/75 transition hover:text-white">{l}</a>
            ))}
            <button onClick={goBook} className="salon-btn !px-5 !py-2.5 text-sm" style={accentBtn}>{W.cta}</button>
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-white/25 md:hidden" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <span className="relative block h-3.5 w-5">
              <span className="absolute left-0 h-0.5 w-5 bg-white transition-all" style={{ top: menu ? 6 : 0, transform: menu ? "rotate(45deg)" : "none" }} />
              <span className="absolute left-0 top-1.5 h-0.5 w-5 bg-white transition-opacity" style={{ opacity: menu ? 0 : 1 }} />
              <span className="absolute left-0 h-0.5 w-5 bg-white transition-all" style={{ top: menu ? 6 : 12, transform: menu ? "rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
        {menu ? (
          <div className="border-t border-white/10 px-5 pb-6 pt-2 md:hidden">
            {nav.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setMenu(false)} className="block border-b border-white/10 py-3.5 text-lg font-semibold text-white/90">{l}</a>
            ))}
            <button onClick={() => { setMenu(false); goBook(); }} className="salon-btn mt-5 w-full" style={accentBtn}>{W.cta}</button>
          </div>
        ) : null}
      </nav>

      {/* Hero */}
      <header id="top" className="relative -mt-[1px] flex min-h-[100svh] items-end overflow-hidden text-white md:items-center" style={{ background: "var(--dark)" }}>
        <Image src={p.photos[0].file} alt="" fill priority sizes="100vw" className="salon-kenburns object-cover opacity-70" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, color-mix(in srgb, var(--dark) 96%, transparent) 8%, color-mix(in srgb, var(--dark2) 72%, transparent) 48%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />
        <div aria-hidden className="salon-orb absolute -left-24 top-1/3 h-80 w-80 rounded-full blur-3xl" style={{ background: "var(--accent)", opacity: 0.35 }} />

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-5 pb-28 pt-36 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:px-8 md:pb-24">
          <div>
            <div className="salon-rise mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: isOpen ? "#34D399" : "#FBBF24" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: isOpen ? "#34D399" : "#FBBF24" }} />
                </span>
                {status || copy.tag}
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur">{p.place}, {p.city}</span>
            </div>
            <h1 className="salon-display salon-rise text-[clamp(2.7rem,8.4vw,6.2rem)] font-medium leading-[0.98]" style={{ animationDelay: ".08s" }}>
              {p.name}
            </h1>
            <p className="salon-display salon-rise mt-5 text-2xl italic leading-snug md:text-4xl" style={{ animationDelay: ".16s", color: "var(--accent2)" }}>
              {copy.headline}
            </p>
            <p className="salon-rise mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg" style={{ animationDelay: ".24s" }}>
              {copy.lede}
            </p>
            <div className="salon-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".32s" }}>
              <button onClick={goBook} className="salon-btn" style={accentBtn}>
                <Icon k="calendar" /> {W.cta}
              </button>
              <a href={p.whatsapp ? bizWa : callHref} target={p.whatsapp ? "_blank" : undefined} rel="noopener noreferrer" className="salon-btn border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                <Icon k={p.whatsapp ? "chat" : "phone"} /> {p.whatsapp ? "WhatsApp us" : p.phone}
              </a>
            </div>
            <dl className="salon-rise mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-6" style={{ animationDelay: ".4s" }}>
              {[
                [String(allItems.length), W.itemNoun],
                ["30 sec", "To book"],
                [W.hoursShort, "Open daily"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="salon-display text-3xl font-medium md:text-4xl">{v}</dt>
                  <dd className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Next available */}
          <aside className="salon-rise hidden md:block" style={{ animationDelay: ".3s" }}>
            <div className="salon-float rounded-[2rem] border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">Next available</p>
              <ul className="mt-4 space-y-3">
                {(nextFew.length ? nextFew : [null, null, null]).map((s, i) => (
                  <li key={i}>
                    {s ? (
                      <button
                        onClick={() => { setDate(s.day); setTime(s.t); setDone(null); goBook(); }}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/20 bg-black/20 px-5 py-4 text-left transition hover:bg-white hover:text-black"
                      >
                        <span className="salon-display text-xl">{fmtTime(s.t)}</span>
                        <span className="text-sm font-semibold opacity-80">{s.day === today ? "Today" : longDate(s.day).split(" ").slice(0, 2).join(" ")}</span>
                      </button>
                    ) : (
                      <div className="h-[3.6rem] rounded-2xl border border-white/10 bg-white/5" />
                    )}
                  </li>
                ))}
              </ul>
              <button onClick={goBook} className="salon-btn mt-6 w-full" style={accentBtn}>Pick my time <Icon k="arrow" className="h-4 w-4" /></button>
            </div>
          </aside>
        </div>
      </header>

      {/* Marquee */}
      <div className="overflow-hidden py-5 text-lg" style={{ background: "var(--accent)", color: "var(--on-accent)" }} aria-hidden>
        <div className="salon-marquee flex w-max">
          {[0, 1].map((n) => (
            <div key={n} className="flex">
              {[...allItems.map((x) => x.name), p.place].slice(0, 12).map((w, i) => (
                <span key={i} className="salon-display mx-6 whitespace-nowrap font-medium italic">{w}<span className="mx-6 not-italic opacity-50">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main>
        {/* Why */}
        <section className="mx-auto max-w-6xl px-5 pt-20 md:px-8 md:pt-28">
          <div className="grid gap-5 md:grid-cols-3">
            {copy.why.map(([t, d], i) => (
              <div key={t} className="reveal rounded-[1.75rem] border p-7" style={{ background: "var(--surface)", borderColor: "var(--line)", boxShadow: "0 24px 50px -34px rgba(40,10,30,.35)" }}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)", color: "var(--accent)" }}>
                  <Icon k={(["calendar", "sparkle", "heart"] as IconKey[])[i]} className="h-6 w-6" />
                </span>
                <h3 className="salon-display mt-5 text-2xl">{t}</h3>
                <p className="mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>{priced ? "Menu" : "What we do"}</Eyebrow>
              <h2 className="salon-display text-4xl leading-none md:text-6xl">{W.menuTitle}</h2>
              <p className="mt-4 max-w-md" style={{ color: "var(--muted)" }}>{W.menuNote}</p>
            </div>
            <Tag>{priced ? "Sample prices · yours go here" : "Sample services · yours go here"}</Tag>
          </div>

          <div role="tablist" className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
            {catalog.map((c) => {
              const n = c.items.filter((x) => cart.includes(x.id)).length;
              return (
                <button key={c.key} role="tab" aria-selected={cat === c.key} onClick={() => setCat(c.key)} className="shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition" style={cat === c.key ? { background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)" } : { background: "var(--surface)", borderColor: "var(--line)" }}>
                  {c.label}{n ? <span className="ml-2 rounded-full px-2 py-0.5 text-[11px]" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>{n}</span> : null}
                </button>
              );
            })}
          </div>

          <ul className="grid gap-3 md:grid-cols-2">
            {catalog.find((c) => c.key === cat)!.items.map((x) => {
              const on = cart.includes(x.id);
              return (
                <li key={x.id} className="salon-pop flex items-center gap-4 rounded-3xl border p-5 transition-all" style={{ background: "var(--surface)", borderColor: on ? "var(--accent)" : "var(--line)", boxShadow: on ? "0 18px 40px -26px var(--accent)" : "none" }}>
                  <div className="min-w-0 flex-1">
                    <h3 className="salon-display text-xl leading-tight">{x.name}</h3>
                    <p className="mt-1 text-sm leading-snug" style={{ color: "var(--muted)" }}>{x.desc}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
                      <Icon k="clock" className="h-3.5 w-3.5" /> {fmtDur(x.mins)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    {x.price > 0 ? <p className="salon-display text-2xl" style={{ color: "var(--accent)" }}><span className="mr-1 text-xs font-sans font-bold opacity-70">AED</span>{x.price}</p> : priced ? <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>Free</p> : null}
                    <button onClick={() => toggle(x.id)} aria-pressed={on} className="rounded-full px-5 py-2 text-sm font-bold transition active:scale-95" style={on ? { background: "var(--accent)", color: "var(--on-accent)" } : { border: "1.5px solid var(--ink)" }}>
                      {on ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Gallery */}
        <section id="gallery" className="scroll-mt-24 py-20 text-white md:py-28" style={{ background: "linear-gradient(140deg, var(--dark), var(--dark2))" }}>
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow light>Gallery</Eyebrow>
                <h2 className="salon-display text-4xl leading-none md:text-6xl">The look</h2>
              </div>
              <Tag dark>Sample photos · your own go here</Tag>
            </div>
            <div className="grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[13rem] md:grid-cols-4">
              {p.photos.slice(0, 7).map((ph, i) => {
                const span = i === 0 ? "col-span-2 row-span-2" : i === 3 ? "row-span-2" : i === 5 ? "md:col-span-2" : "";
                return (
                  <button key={ph.file} onClick={() => setLight(i)} aria-label={`Open photo ${i + 1}`} className={`salon-zoom reveal group relative overflow-hidden rounded-3xl ${span}`}>
                    <Image src={ph.file} alt="" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-black opacity-0 transition-opacity group-hover:opacity-100">
                      <Icon k="plus" className="h-5 w-5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 text-center md:px-8 md:py-28">
          <Eyebrow>Kind words</Eyebrow>
          <h2 className="salon-display text-4xl leading-none md:text-6xl">Happy clients</h2>
          <div className="mt-4 flex justify-center"><Tag>Sample reviews · your real ones go here</Tag></div>
          <div className="relative mt-10 min-h-[15rem] md:min-h-[13rem]">
            {REVIEWS.map((r, i) => (
              <figure key={i} className="absolute inset-0 transition-all duration-700" style={{ opacity: review === i ? 1 : 0, transform: review === i ? "none" : "translateY(14px)", pointerEvents: review === i ? "auto" : "none" }} aria-hidden={review !== i}>
                <div className="flex justify-center gap-1" style={{ color: "var(--accent2)" }}>
                  {[0, 1, 2, 3, 4].map((s) => <Icon key={s} k="star" className="h-6 w-6 fill-current" />)}
                </div>
                <blockquote className="salon-display mx-auto mt-6 max-w-2xl text-2xl italic leading-snug md:text-4xl">“{r.text}”</blockquote>
                <figcaption className="mt-5 text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>{r.who}{["ladies", "unisex", "gents", "spa"].includes(p.sub) ? ` · ${r.tag}` : ""}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setReview(i)} aria-label={`Review ${i + 1}`} className="h-2.5 rounded-full transition-all" style={{ width: review === i ? 32 : 10, background: review === i ? "var(--accent)" : "var(--line)" }} />
            ))}
          </div>
        </section>

        {/* Booking */}
        <section id="book" className="scroll-mt-20 py-20 md:py-28" style={{ background: "color-mix(in srgb, var(--accent) 7%, var(--bg))" }}>
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>Book online</Eyebrow>
                <h2 className="salon-display text-4xl leading-none md:text-6xl">{W.bookTitle}</h2>
              </div>
              <Tag>Your booking is sent on WhatsApp</Tag>
            </div>

            {done ? (
              <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-[2rem] border p-7 md:p-10" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                  <span className="grid h-14 w-14 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--on-accent)" }}><Icon k="check" className="h-7 w-7" /></span>
                  <h3 className="salon-display mt-5 text-4xl">Almost done!</h3>
                  <p className="mt-3 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                    Tap <b>Send on WhatsApp</b> to send this request to {p.name}. They reply to confirm your time.
                  </p>
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>Booking {done.ref}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={`https://wa.me/${digits}?text=${encodeURIComponent(done.text)}`} target="_blank" rel="noopener noreferrer" className="salon-btn" style={{ background: "#25D366", color: "#062B14" }}>
                      <Icon k="chat" /> Send on WhatsApp
                    </a>
                    <button onClick={downloadIcs} className="salon-btn border" style={{ borderColor: "var(--ink)" }}><Icon k="calendar" /> Add to calendar</button>
                    <button onClick={() => { setDone(null); setCart([]); setDate(""); setTime(-1); setNote(""); }} className="salon-btn" style={{ color: "var(--muted)" }}>New booking</button>
                  </div>
                  <p className="mt-6 text-sm" style={{ color: "var(--muted)" }}>Demo note: on the real website this message reaches {p.name} on WhatsApp automatically.</p>
                </div>
                <div className="rounded-[2rem] p-6 md:p-8" style={{ background: "#0B141A" }}>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">{W.receives}</p>
                  <div className="whitespace-pre-line rounded-2xl rounded-tr-sm p-4 text-[15px] leading-relaxed text-white" style={{ background: "#005C4B" }}>{done.text}</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
                <div className="space-y-6">
                  {/* 1 services */}
                  <div className="rounded-[2rem] border p-6 md:p-8" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                    <StepHead n={1} title="Your services" ok={picked.length > 0} />
                    {catalog.map((c) => (
                      <div key={c.key} className="mt-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>{c.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {c.items.map((x) => {
                            const on = cart.includes(x.id);
                            return (
                              <button key={x.id} onClick={() => toggle(x.id)} aria-pressed={on} className="rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95" style={on ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" } : { borderColor: "var(--line)" }}>
                                {on ? "✓ " : ""}{x.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2 date & time */}
                  <div className="rounded-[2rem] border p-6 md:p-8" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                    <StepHead n={2} title="Day and time" ok={!!date && time >= 0} />
                    <div className="no-scrollbar -mx-2 mt-4 flex gap-2 overflow-x-auto px-2 pb-2">
                      {days.map((d) => {
                        const on = date === d.iso;
                        return (
                          <button key={d.iso} onClick={() => { setDate(d.iso); setTime(-1); }} aria-pressed={on} className="w-[4.4rem] shrink-0 rounded-2xl border py-3 text-center transition active:scale-95" style={on ? { background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)" } : { borderColor: "var(--line)" }}>
                            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">{d.iso === today ? "Today" : d.wd}</span>
                            <span className="salon-display block text-2xl">{d.day}</span>
                            <span className="block text-[11px] font-semibold uppercase opacity-60">{d.mon}</span>
                          </button>
                        );
                      })}
                    </div>
                    {date ? (
                      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {slots.map((s) => (
                          <button key={s.t} disabled={s.off} onClick={() => setTime(s.t)} aria-pressed={time === s.t} className="rounded-xl border py-3 text-sm font-bold transition enabled:active:scale-95 disabled:cursor-not-allowed" style={s.off ? { borderColor: "var(--line)", opacity: 0.35, textDecoration: "line-through" } : time === s.t ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" } : { borderColor: "var(--line)" }}>
                            {fmtTime(s.t)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-5 rounded-2xl border border-dashed p-5 text-center text-sm" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>Choose a day to see the free times.</p>
                    )}
                    <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>Sample availability. Your real calendar goes here.</p>
                  </div>

                  {/* 3 details */}
                  <div className="rounded-[2rem] border p-6 md:p-8" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                    <StepHead n={3} title="Your details" ok={customer.trim().length > 1 && phoneOk} />
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <label className="block text-sm font-bold">Name
                        <input value={customer} onChange={(e) => setCustomer(e.target.value)} autoComplete="name" className="salon-input" placeholder="Your name" />
                      </label>
                      <label className="block text-sm font-bold">Phone / WhatsApp
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" className="salon-input" placeholder="+971 50 000 0000" />
                      </label>
                      <label className="block text-sm font-bold md:col-span-2">Note (optional)
                        <input value={note} onChange={(e) => setNote(e.target.value)} className="salon-input" placeholder="Anything we should know?" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* summary */}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                  <div className="rounded-[2rem] p-6 text-white md:p-8" style={{ background: "linear-gradient(150deg, var(--dark), var(--dark2))", boxShadow: "0 30px 60px -30px var(--dark)" }}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">Your booking</p>
                    {picked.length ? (
                      <ul className="mt-4 space-y-2.5">
                        {picked.map((x) => (
                          <li key={x.id} className="flex items-start justify-between gap-3 text-[15px]">
                            <span>{x.name}<span className="block text-xs text-white/50">{fmtDur(x.mins)}</span></span>
                            {priced && x.price > 0 ? <span className="shrink-0 font-semibold">AED {x.price}</span> : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-white/60">No services yet. Pick some on the left.</p>
                    )}
                    <div className="my-5 h-px bg-white/15" />
                    <dl className="space-y-2 text-[15px]">
                      <div className="flex justify-between"><dt className="text-white/60">When</dt><dd className="text-right font-semibold">{date && time >= 0 ? `${longDate(date).split(" ").slice(0, 3).join(" ")}, ${fmtTime(time)}` : "Not chosen"}</dd></div>
                      <div className="flex justify-between"><dt className="text-white/60">Time needed</dt><dd className="font-semibold">{totalMins ? fmtDur(totalMins) : "–"}</dd></div>
                      {priced && totalPrice > 0 ? <div className="flex items-baseline justify-between pt-2"><dt className="text-white/60">Total</dt><dd className="salon-display text-3xl" style={{ color: "var(--accent2)" }}>AED {totalPrice}</dd></div> : null}
                    </dl>
                    <button onClick={confirm} disabled={!ready} className="salon-btn mt-6 w-full disabled:opacity-40" style={accentBtn}>Confirm booking</button>
                    {missing ? <p className="mt-3 text-center text-sm text-white/60">{missing}</p> : null}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
          <Eyebrow>Good to know</Eyebrow>
          <h2 className="salon-display mb-8 text-4xl leading-none md:text-5xl">Questions</h2>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="salon-faq group rounded-3xl border px-6 py-5" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                  {q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl transition-transform group-open:rotate-45" style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)", color: "var(--accent)" }}>+</span>
                </summary>
                <p className="mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="scroll-mt-20 pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-10"><Eyebrow>Find us</Eyebrow><h2 className="salon-display text-4xl leading-none md:text-6xl">Come visit</h2></div>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-[2rem] border p-7 md:p-9" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Address</p>
                <p className="salon-display mt-1 text-2xl leading-snug">{p.address}</p>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Opening hours <span className="normal-case tracking-normal opacity-70">(sample)</span></p>
                <ul className="mt-2 divide-y" style={{ borderColor: "var(--line)" }}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
                    const isToday = nowDate ? ((nowDate.getDay() + 6) % 7) === i : false;
                    return (
                      <li key={d} className="flex justify-between py-2.5 text-[15px]" style={{ borderColor: "var(--line)", fontWeight: isToday ? 800 : 500, color: isToday ? "var(--accent)" : undefined }}>
                        <span>{d}{isToday ? " · today" : ""}</span><span>{fmtTime(HOURS.open)} – {fmtTime(HOURS.close)}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="salon-btn" style={accentBtn}><Icon k="pin" /> Directions</a>
                  <a href={callHref} className="salon-btn border" style={{ borderColor: "var(--ink)" }}><Icon k="phone" /> {p.phone}</a>
                </div>
                {p.facebook ? <p className="mt-5 text-sm"><a href={p.facebook} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Find us on Facebook</a></p> : null}
              </div>
              <div className="overflow-hidden rounded-[2rem] border" style={{ borderColor: "var(--line)" }}>
                <iframe title={`Map of ${p.name}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[22rem] w-full md:h-full md:min-h-[28rem]" />
              </div>
            </div>
          </div>
        </section>

        {/* Pitch */}
        <section id="make-it-yours" className="scroll-mt-16 px-5 py-20 text-white md:py-28" style={{ background: "#0B0B0F" }}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50">By {p.company}</p>
            <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">Like this website?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              This is a free sample for {p.name}. We can make it yours: your own photos, real services and prices, your calendar, and your own web address. Ready in 2 to 3 days.
            </p>
            <a href={p.pitchHref} target="_blank" rel="noopener noreferrer" className="salon-btn mt-9 bg-white text-black">Message us on WhatsApp <Icon k="arrow" /></a>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 pb-32 text-center text-xs md:pb-8" style={{ color: "var(--muted)" }}>
        Demo website by {p.company}. A design sample, not the official website of {p.name}. Sections marked &ldquo;sample&rdquo; are placeholders. Contact details come from public business listings.
        <details className="mx-auto mt-3 max-w-3xl">
          <summary className="cursor-pointer font-semibold">Photo credits</summary>
          <ul className="mt-2 space-y-1">
            {p.photos.map((ph) => (
              <li key={ph.file}><a href={ph.page} target="_blank" rel="noopener noreferrer" className="underline">{ph.title}</a> by {ph.artist} ({ph.license}, {ph.source})</li>
            ))}
          </ul>
        </details>
      </footer>

      {/* Floating cart bar */}
      {picked.length && !done ? (
        <div className="fixed inset-x-3 bottom-[4.9rem] z-40 md:inset-x-auto md:bottom-6 md:right-6 md:w-[24rem]">
          <button onClick={goBook} className="salon-rise flex w-full items-center justify-between gap-4 rounded-full px-6 py-4 text-left shadow-2xl" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            <span className="text-sm font-bold">{picked.length} {picked.length === 1 ? "service" : "services"} · {fmtDur(totalMins)}</span>
            <span className="flex items-center gap-2 text-sm font-extrabold">{priced && totalPrice > 0 ? `AED ${totalPrice} · ` : ""}Book <Icon k="arrow" className="h-4 w-4" /></span>
          </button>
        </div>
      ) : null}

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden" style={{ borderColor: "var(--line)", background: "color-mix(in srgb, var(--bg) 92%, transparent)" }}>
        <a href={callHref} className="salon-btn !py-3 text-sm" style={accentBtn}><Icon k="phone" className="h-4 w-4" /> Call</a>
        <a href={p.whatsapp ? bizWa : directions} target="_blank" rel="noopener noreferrer" className="salon-btn !py-3 text-sm" style={p.whatsapp ? { background: "#25D366", color: "#062B14" } : { border: "1px solid var(--ink)" }}>
          <Icon k={p.whatsapp ? "chat" : "pin"} className="h-4 w-4" /> {p.whatsapp ? "WhatsApp" : "Directions"}
        </a>
      </div>

      {/* Lightbox */}
      {light >= 0 ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" onClick={() => setLight(-1)}>
          <div className="relative h-[78vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={p.photos[light].file} alt="" fill sizes="100vw" className="rounded-2xl object-contain" />
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">Sample photo</span>
          </div>
          <button className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-2xl text-white" aria-label="Close" onClick={() => setLight(-1)}>×</button>
          <button className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setLight((i) => (i - 1 + p.photos.length) % p.photos.length); }}>‹</button>
          <button className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white" aria-label="Next" onClick={(e) => { e.stopPropagation(); setLight((i) => (i + 1) % p.photos.length); }}>›</button>
        </div>
      ) : null}
    </div>
  );
}

function StepHead({ n, title, ok }: { n: number; title: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold transition-colors" style={{ background: ok ? "var(--accent)" : "var(--ink)", color: ok ? "var(--on-accent)" : "var(--bg)" }}>{ok ? "✓" : n}</span>
      <h3 className="salon-display text-2xl md:text-3xl">{title}</h3>
    </div>
  );
}
