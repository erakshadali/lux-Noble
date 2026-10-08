import type { CSSProperties, ReactNode } from "react";
import { company, whatsappLink } from "@/config/company";
import { titleCase, type Business } from "@/lib/data";
import Image from "next/image";
import Tilt from "@/components/Tilt";
import OrderDemo from "@/components/OrderDemo";
import { photosFor } from "@/lib/images";
import { sampleMenu } from "@/lib/menus";
import { themeFor } from "@/lib/themes";

// Split "a(b, c), d(e)" into ["a(b, c)", "d(e)"] without breaking on commas inside parentheses.
function splitLayers(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const fontVar = {
  playfair: "var(--font-playfair)",
  fraunces: "var(--font-fraunces)",
  oswald: "var(--font-oswald)",
} as const;

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}
const PHONE = "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2.1z";
const PIN = "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z";
const ARROW = "M5 12h14M13 6l6 6-6 6";
const MAIL = "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6";

function SectionTitle({ eyebrow, title, note }: { eyebrow: string; title: string; note?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>
          {eyebrow}
        </p>
        <h2 className="display text-4xl leading-none md:text-6xl">{title}</h2>
      </div>
      {note}
    </div>
  );
}

function SampleTag({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
      style={{ borderColor: "var(--line)", color: "var(--muted)", background: "var(--surface)" }}
    >
      {children}
    </span>
  );
}

export default function Demo({ b }: { b: Business }) {
  const t = themeFor(b.theme, b.look);
  const c = t.colors;
  const kind = b.category === "Cafe" ? "Café" : "Restaurant";
  const cuisineChips = b.cuisines.slice(0, 3).map(titleCase);
  const city = b.city ?? "NY";
  const isIN = b.country === "IN";
  const place = b.area || (b.zip ? `NYC ${b.zip}` : b.city ?? "New York City");
  const menu = sampleMenu(b.cuisines, b.theme);
  const photos = photosFor(b);

  const vars = {
    "--bg": c.bg,
    "--surface": c.surface,
    "--ink": c.ink,
    "--muted": c.muted,
    "--line": c.line,
    "--accent": c.accent,
    "--on-accent": c.onAccent,
    "--accent-2": c.accent2,
    "--display": fontVar[t.font],
  } as CSSProperties;

  const layers = splitLayers(t.pattern.image);
  const heroStyle: CSSProperties = {
    backgroundImage: [...layers, `linear-gradient(135deg, ${c.heroFrom}, ${c.heroTo})`].join(","),
    backgroundSize: [...layers.map(() => t.pattern.size), "cover"].join(","),
  };

  // No phone on file: the call buttons open the business's Instagram instead.
  const handle = (b.instagram ?? "").replace(/^.*instagram\.com\//i, "").replace(/[/?].*$/, "").replace(/^@/, "");
  const callHref = b.tel ? `tel:${b.tel}` : handle ? `https://www.instagram.com/${handle}` : "#visit";
  const callLabel = b.phone || (handle ? `@${handle}` : "Visit us");
  // mapQuery (name + area) finds the real place on Google Maps when we have no exact coordinates.
  const where = b.mapQuery ? encodeURIComponent(b.mapQuery) : `${b.lat},${b.lon}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${where}`;
  const mapEmbed = `https://maps.google.com/maps?q=${where}&z=16&output=embed`;
  const wa = whatsappLink(`Hi! I saw the demo website you made for ${b.name}. I'm interested.`);
  const marqueeWords = [...cuisineChips, place, kind].filter(Boolean);
  const marquee = Array.from({ length: 8 }, () => marqueeWords).flat();
  const upper = t.uppercase ? "uppercase tracking-tight" : "";

  return (
    <div className={b.look === "dark" ? "demo-root demo-dark" : "demo-root"} style={vars}>
      {/* Demo banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-[#0B0B0F] px-4 py-2 text-[13px] text-white md:px-8">
        <p className="truncate">
          <span className="font-bold">Free demo</span> made by {company.name} for {b.name}
        </p>
        <a
          href={wa ?? "#make-it-yours"}
          className="shrink-0 rounded-full bg-white px-3.5 py-1 text-[12px] font-bold text-black hover:bg-white/90"
        >
          Make it yours →
        </a>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden text-white" style={heroStyle}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full border"
          style={{ borderColor: `${c.accent2}55` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{ background: `${c.accent}55` }}
        />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
          <span className={`display text-xl font-semibold ${upper}`}>{b.name}</span>
          <div className="flex items-center gap-7 text-sm font-semibold">
            <a href="#about" className="hidden text-white/80 hover:text-white md:inline">About</a>
            <a href="#menu" className="hidden text-white/80 hover:text-white md:inline">Menu</a>
            <a href="#order" className="hidden text-white/80 hover:text-white md:inline">Order</a>
            <a href="#visit" className="hidden text-white/80 hover:text-white md:inline">Visit</a>
            <a href={callHref} className="btn !px-5 !py-2.5 text-sm" style={{ background: c.accent, color: c.onAccent }}>
              <Icon d={PHONE} className="h-4 w-4" /> Call
            </a>
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-10 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:px-8 md:pb-32 md:pt-16">
          <div>
            <div className="fade-up mb-7 flex flex-wrap gap-2">
              {[...cuisineChips, place, kind].map((chip) => (
                <span key={chip} className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur">
                  {chip}
                </span>
              ))}
            </div>
            <h1
              className={`display fade-up max-w-4xl text-[clamp(2.7rem,8vw,6.2rem)] font-semibold leading-[0.95] ${upper}`}
              style={{ animationDelay: "0.08s" }}
            >
              {b.name}
            </h1>
            <p className="fade-up mt-6 max-w-xl text-lg text-white/80 md:text-xl" style={{ animationDelay: "0.18s" }}>
              {t.tagline}
            </p>
            {isIN ? (
              <p className="fade-up mt-2 max-w-xl text-base text-white/70" style={{ animationDelay: "0.2s" }}>
                स्वाद जो दिल जीत ले · ऑर्डर करें सीधे WhatsApp पर
              </p>
            ) : null}
            {b.rating ? (
              <p className="fade-up mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur" style={{ animationDelay: "0.22s" }}>
                <span style={{ color: c.accent2 }}>★ {b.rating.toFixed(1)}</span>
                <span className="text-white/75">{b.reviews?.toLocaleString("en-US")} Google reviews</span>
              </p>
            ) : null}
            <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.28s" }}>
              <a href={callHref} className="btn" style={{ background: c.accent, color: c.onAccent }}>
                <Icon d={PHONE} /> {callLabel}
              </a>
              <a href={directions} target="_blank" rel="noopener noreferrer" className="btn border border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15">
                <Icon d={PIN} /> Get directions
              </a>
            </div>
          </div>

          {(
            <div className="fade-up relative mx-auto w-full max-w-md md:max-w-none" style={{ animationDelay: "0.2s" }}>
              <Tilt className="relative mx-auto aspect-[4/5] w-[74%] md:w-[68%]">
                <div className="layer overflow-hidden rounded-[1.75rem] shadow-2xl" style={{ right: "-26%", top: "8%", height: "68%", width: "68%", transform: "translateZ(-110px) rotate(8deg)" }}>
                  {photos ? (
                    <Image src={photos.ring[0].file} alt="" fill sizes="(min-width:768px) 22vw, 50vw" className="object-cover opacity-90" />
                  ) : (
                    <div className="h-full w-full" style={{ background: c.accent2, opacity: 0.4 }} />
                  )}
                </div>
                <div className="layer inset-0 overflow-hidden rounded-[2rem] shadow-[0_45px_90px_-20px_rgba(0,0,0,0.7)]" style={{ transform: "translateZ(0)" }}>
                  {photos ? (
                    <Image src={photos.hero.file} alt={`Sample photo for ${b.name}`} fill priority sizes="(min-width:768px) 32vw, 74vw" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(150deg, ${c.accent}, ${c.heroTo})` }}>
                      <span className="display select-none text-[9rem] font-semibold leading-none text-white/30">{b.name.trim().charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">{photos ? "Sample photo" : "Your photo here"}</span>
                </div>
                <div className="layer float-a rounded-2xl px-5 py-4 shadow-2xl" style={{ left: "-16%", bottom: "9%", transform: "translateZ(95px)", background: "rgba(255,255,255,0.96)", color: "#111" }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">Call now</p>
                  <a href={callHref} className="display mt-0.5 block text-xl font-semibold">{callLabel}</a>
                </div>
                <div className="layer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-xl" style={{ right: "-8%", top: "-3%", transform: "translateZ(130px)", background: c.accent, color: c.onAccent }}>
                  {cuisineChips[0] ?? place}
                </div>
              </Tilt>
            </div>
          )}
        </div>
      </header>

      {/* Marquee */}
      <div className="overflow-hidden py-5 text-lg" style={{ background: c.accent, color: c.onAccent }} aria-hidden>
        <div className="marquee">
          {[...marquee, ...marquee].map((w, i) => (
            <span key={i} className={`display mx-6 whitespace-nowrap font-semibold ${upper}`}>
              {w} <span className="mx-6 opacity-50">✦</span>
            </span>
          ))}
        </div>
      </div>

      <main>
        {/* About */}
        <section id="about" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 md:px-8 md:py-32">
          <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>Welcome</p>
              <h2 className={`display text-4xl leading-[1.05] md:text-6xl ${upper}`}>
                A place made for good food and good company.
              </h2>
              {photos ? (
                <div className="reveal mt-10" style={{ perspective: "1200px" }}>
                  <Tilt className="relative aspect-[4/3] w-full max-w-lg">
                    <div className="layer inset-0 overflow-hidden rounded-3xl shadow-2xl">
                      <Image src={photos.about.file} alt="" fill sizes="(min-width:768px) 40vw, 90vw" className="object-cover" />
                    </div>
                    <div className="layer rounded-2xl border-2" style={{ inset: "-14px -14px 14px 14px", borderColor: c.accent, transform: "translateZ(-40px)" }} />
                  </Tilt>
                </div>
              ) : null}
            </div>
            <div className="space-y-8 md:pt-10">
              <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                Welcome to {b.name}. Whether you&apos;re stopping in for a quick bite or settling in for a while,
                we&apos;re glad you&apos;re here. Come say hello.
              </p>
              <dl className="divide-y" style={{ borderColor: "var(--line)" }}>
                {[
                  ["Type", kind],
                  ...(cuisineChips.length ? [["Cuisine", cuisineChips.join(" · ")]] : []),
                  ["Neighborhood", place],
                  [b.tel ? "Call us" : "Instagram", callLabel],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 py-4" style={{ borderColor: "var(--line)" }}>
                    <dt className="text-sm font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>{k}</dt>
                    <dd className="display text-xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="scroll-mt-16 py-20 md:py-28" style={{ background: "var(--surface)" }}>
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionTitle
              eyebrow="Eat"
              title="The menu"
              note={<SampleTag>Sample menu · we&apos;ll add your real one</SampleTag>}
            />
            <div className={`grid items-start gap-12 md:gap-16 ${photos ? "md:grid-cols-[0.8fr_1.2fr]" : ""}`}>
              {photos ? (
                <div className="reveal md:sticky md:top-24" style={{ perspective: "1200px" }}>
                  <Tilt className="relative mx-auto aspect-[4/5] w-full max-w-sm">
                    <div className="layer inset-0 overflow-hidden rounded-3xl shadow-2xl">
                      <Image src={photos.menu.file} alt="" fill sizes="(min-width:768px) 30vw, 80vw" className="object-cover" />
                      <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">Sample photo</span>
                    </div>
                  </Tilt>
                </div>
              ) : null}
              <ol>
                {menu.map((item, i) => (
                  <li key={item} className="reveal flex items-baseline gap-5 border-b py-6" style={{ borderColor: "var(--line)" }}>
                    <span className="display text-lg font-semibold" style={{ color: "var(--accent)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`display text-2xl md:text-3xl ${upper}`}>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Online ordering */}
        <section id="order" className="scroll-mt-16 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionTitle
              eyebrow="Order online"
              title="Order in a few taps"
              note={<SampleTag>{isIN ? "Orders seedhe aapke WhatsApp par · 0% commission (Zomato/Swiggy jaisi fees nahi)" : "Orders go straight to your WhatsApp · 0% commission"}</SampleTag>}
            />
            <OrderDemo name={b.name} items={menu} upper={upper} />
          </div>
        </section>

        {/* Gallery: rotating 3D ring */}
        {photos ? (
        <section
          className="overflow-hidden py-20 text-white md:py-28"
          style={{ backgroundImage: `linear-gradient(135deg, ${c.heroFrom}, ${c.heroTo})` }}
        >
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: c.accent2 }}>Look</p>
                <h2 className={`display text-4xl leading-none md:text-6xl ${upper}`}>Gallery</h2>
              </div>
              <span className="inline-flex w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                Sample photos · your own go here
              </span>
            </div>
          </div>
          {photos ? (
            <div className="ring-scene">
              <div className="ring" style={{ "--n": photos.ring.length, "--k": 1.08 / (2 * Math.tan(Math.PI / photos.ring.length)) } as CSSProperties}>
                {photos.ring.map((p, i) => (
                  <figure key={p.file} className="ring-item" style={{ "--i": i } as CSSProperties}>
                    <Image src={p.file} alt="" fill sizes="(min-width:768px) 24vw, 45vw" className="object-cover" />
                  </figure>
                ))}
              </div>
            </div>
          ) : null}
          <p className="mt-2 text-center text-xs text-white/50">Hover to pause</p>
        </section>
        ) : null}

        {/* Visit */}
        <section id="visit" className="scroll-mt-16 pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionTitle eyebrow="Find us" title="Come visit" />
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border p-7 md:p-9" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                <dl className="space-y-6">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Address</dt>
                    <dd className="display mt-1 text-2xl leading-snug">
                      {b.address || `${place}, ${city}`}
                      {b.address ? "" : <span className="block text-base" style={{ color: "var(--muted)" }}>See the map for the exact spot</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Hours</dt>
                    <dd className="mt-1 text-lg">Call for today&apos;s hours</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Phone</dt>
                    <dd className="display mt-1 text-2xl">
                      <a href={callHref} className="underline decoration-2 underline-offset-4" style={{ textDecorationColor: "var(--accent)" }}>{callLabel}</a>
                    </dd>
                  </div>
                  {b.email ? (
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Email</dt>
                      <dd className="mt-1 break-all text-lg">
                        <a href={`mailto:${b.email}`} className="underline underline-offset-4">{b.email}</a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: c.accent, color: c.onAccent }}>
                    <Icon d={PIN} /> Directions
                  </a>
                  <a href={callHref} className="btn border" style={{ borderColor: "var(--ink)" }}>
                    <Icon d={PHONE} /> Call
                  </a>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--line)" }}>
                <iframe
                  title={`Map of ${b.name}`}
                  src={mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[22rem] w-full md:h-full md:min-h-[28rem]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call band */}
        <section className="px-5 py-16 text-center md:py-24" style={{ background: c.accent, color: c.onAccent }}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] opacity-80">Hungry?</p>
          <a href={callHref} className={`display block text-[clamp(2.2rem,8vw,5.5rem)] font-semibold leading-none ${upper}`}>
            {callLabel}
          </a>
          {b.email ? (
            <p className="mt-5 inline-flex items-center gap-2 opacity-90">
              <Icon d={MAIL} className="h-4 w-4" /> {b.email}
            </p>
          ) : null}
        </section>

        {/* Onwebsite pitch */}
        <section id="make-it-yours" className="scroll-mt-16 bg-[#0B0B0F] px-5 py-20 text-white md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50">By {company.name}</p>
            <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">Like this website?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              This is a free sample we made for {b.name} using your public business details. We can make it yours:
              your own photos, real menu and hours, online ordering, and your own web address.
            </p>
            {isIN ? (
              <p className="mx-auto mt-3 max-w-xl text-base text-white/60">
                यह आपके बिज़नेस के लिए हमारा फ्री सैंपल है। इसे अपना बनाएं: आपकी फोटो, असली मेन्यू, ऑनलाइन ऑर्डरिंग और आपका अपना वेब एड्रेस।
              </p>
            ) : null}
            <div className="mt-9">
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn bg-white text-black">
                  Message us on WhatsApp <Icon d={ARROW} />
                </a>
              ) : (
                <p className="inline-block rounded-full border border-white/25 px-6 py-3 font-semibold">
                  Reply to our WhatsApp message and we&apos;ll get started
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 pb-28 text-center text-xs md:pb-8" style={{ color: "var(--muted)" }}>
        Demo website by {company.name}. This is a design sample, not the official website of {b.name}. Sections marked
        &ldquo;sample&rdquo; are placeholders.
        {photos ? (
          <details className="mx-auto mt-3 max-w-3xl">
            <summary className="cursor-pointer font-semibold">Photo credits</summary>
            <ul className="mt-2 space-y-1">
              {photos.credits.map((p) => (
                <li key={p.file}>
                  <a href={p.page} target="_blank" rel="noopener noreferrer" className="underline">
                    {p.title.replace(/\.[a-z]+$/i, "").slice(0, 60)}
                  </a>{" "}
                  by {p.artist} ({p.license}, {p.source})
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </footer>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t p-3 backdrop-blur md:hidden" style={{ borderColor: "var(--line)", background: "color-mix(in srgb, var(--bg) 94%, transparent)" }}>
        <a href={callHref} className="btn !py-3 text-sm" style={{ background: c.accent, color: c.onAccent }}>
          <Icon d={PHONE} className="h-4 w-4" /> Call
        </a>
        <a href={directions} target="_blank" rel="noopener noreferrer" className="btn border !py-3 text-sm" style={{ borderColor: "var(--ink)", color: "var(--ink)" }}>
          <Icon d={PIN} className="h-4 w-4" /> Directions
        </a>
      </div>
    </div>
  );
}
