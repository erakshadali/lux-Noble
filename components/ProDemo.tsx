import type { CSSProperties, ReactNode } from "react";
import { company, whatsappLink } from "@/config/company";
import Image from "next/image";
import type { Business } from "@/lib/data";
import { proPhotosFor, type ProPhotos } from "@/lib/proImages";
import Tilt from "@/components/Tilt";
import RequestDemo, { type Group, type Schedule } from "@/components/RequestDemo";
import PropertySearch from "@/components/PropertySearch";
import { ICONS, proKinds, subs, type IconKey, type ProKind } from "@/lib/pro";

const fontVar = {
  manrope: "var(--font-manrope)",
  fraunces: "var(--font-fraunces)",
  playfair: "var(--font-playfair)",
  oswald: "var(--font-oswald)",
} as const;

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

function Icon({ k, className = "h-5 w-5", style }: { k: IconKey; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
      <path d={ICONS[k]} />
    </svg>
  );
}

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

const CTA: Record<ProKind, { cta: string; note: string; hero: string }> = {
  clinic: { cta: "Confirm appointment", note: "Anything we should know?", hero: "Book an appointment" },
  home: { cta: "Confirm booking", note: "Address or area, and any details", hero: "Book a visit" },
  salon: { cta: "Confirm booking", note: "Any notes? (e.g. bridal party)", hero: "Book now" },
  estate: { cta: "Confirm viewing", note: "Budget, or anything else", hero: "Search properties" },
};

const range = (fromMin: number, toMin: number, step: number) =>
  Array.from({ length: Math.floor((toMin - fromMin) / step) + 1 }, (_, i) => {
    const m = fromMin + i * step;
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  });

// Opening hours and slot length for the booking demo (sample: the real ones come from the business).
function scheduleFor(kind: ProKind): Schedule {
  if (kind === "clinic") return { mode: "slots", times: range(9 * 60, 19 * 60 + 30, 30), minutes: 30, hint: "Sample availability. Your real calendar and opening hours go here." };
  if (kind === "salon") return { mode: "slots", times: range(10 * 60, 20 * 60 + 30, 30), minutes: 60, hint: "Sample availability. Your real calendar and opening hours go here." };
  if (kind === "estate") return { mode: "slots", times: range(10 * 60, 19 * 60, 60), minutes: 45, hint: "Sample availability. Your agents' real calendars go here." };
  return {
    mode: "windows",
    minutes: 240,
    hint: "Sample availability. Your real working hours and areas go here.",
    windows: [
      { label: "Morning", range: "8 AM to 12 PM", hour: 8 },
      { label: "Afternoon", range: "12 PM to 4 PM", hour: 12 },
      { label: "Evening", range: "4 PM to 8 PM", hour: 16 },
    ],
  };
}

function groupsFor(b: Business): Group[] {
  const kind = b.kind!;
  const sub = subs[b.sub!];
  const names = sub.services.map((x) => x.name);
  if (kind === "estate") {
    return [
      { key: "goal", label: sub.servicesLabel, options: ["Buy", "Rent", "Sell", "List for rent", "Invest", "Valuation"] },
      { key: "area", label: "Which area?", options: ["Downtown", "Marina", "Business Bay", "JVC", "Palm Jumeirah", "Al Barsha", "Other"] },
      { key: "beds", label: "Bedrooms?", options: ["Studio", "1", "2", "3", "4+"] },
    ];
  }
  if (kind === "home") {
    const size = b.sub === "movers" ? { label: "How big?", options: ["Studio / 1 bed", "2 bed", "3 bed / villa", "Office"] } : { label: "Where?", options: ["Apartment", "Villa", "Office", "Shop"] };
    return [
      { key: "service", label: sub.servicesLabel, options: names },
      { key: "place", ...size },
    ];
  }
  return [{ key: "service", label: sub.servicesLabel, options: names, multi: sub.multi }];
}

function HeroArt({ b, photos, phoneLabel, callHref }: { b: Business; photos: ProPhotos | null; phoneLabel: string; callHref: string }) {
  const kind = b.kind!;
  const k = proKinds[kind];
  const c = k.colors;
  const sub = subs[b.sub!];
  const grad = `linear-gradient(150deg, ${c.accent}, ${c.heroTo} 85%)`;
  return (
    <Tilt className="relative mx-auto aspect-[4/5] w-[74%] md:w-[68%]">
      <div className="layer overflow-hidden rounded-[1.75rem] shadow-2xl" style={{ right: "-26%", top: "8%", height: "68%", width: "68%", transform: "translateZ(-110px) rotate(8deg)", background: `linear-gradient(160deg, ${c.accent2}, ${c.heroTo})` }}>
        {photos ? <Image src={photos.back.file} alt="" fill sizes="(min-width:768px) 22vw, 50vw" className="object-cover opacity-90" /> : null}
      </div>

      <div className="layer inset-0 overflow-hidden rounded-[2rem] shadow-[0_45px_90px_-20px_rgba(0,0,0,0.7)]" style={{ transform: "translateZ(0)", background: grad }}>
        {photos ? <Image src={photos.hero.file} alt={`Sample photo for ${b.name}`} fill priority sizes="(min-width:768px) 32vw, 74vw" className="object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">Sample photo</span>

        <div className="absolute inset-x-0 bottom-0 p-5 pb-9 text-white">
          {kind === "clinic" ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Next available · sample</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["9:00", "10:30", "14:00"].map((t, i) => (
                  <span key={t} className={`rounded-xl px-2 py-2 text-center text-sm font-bold ${i === 1 ? "bg-white text-black" : "border border-white/50 bg-black/25 backdrop-blur"}`}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          ) : kind === "home" ? (
            <div className="flex items-center gap-4">
              <span className="pulse-ring relative grid h-14 w-14 shrink-0 place-items-center rounded-full" style={{ background: c.accent, color: c.onAccent }}>
                <Icon k="phone" className="h-6 w-6" />
              </span>
              <p className="display text-2xl font-semibold uppercase leading-none">We come to you</p>
            </div>
          ) : kind === "salon" ? (
            <p className="display flex items-center gap-2 text-2xl font-semibold leading-none">
              <Icon k="sparkle" className="h-6 w-6" style={{ color: c.accent2 }} /> {sub.label}
            </p>
          ) : (
            <p className="display flex items-center gap-2 text-2xl font-semibold leading-none">
              <Icon k="pin" className="h-6 w-6" style={{ color: c.accent2 }} /> Find your home
            </p>
          )}
        </div>
      </div>

      <div className="layer float-a rounded-2xl px-5 py-4 shadow-2xl" style={{ left: "-8%", bottom: "-9%", transform: "translateZ(95px)", background: "rgba(255,255,255,0.96)", color: "#111" }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">Call now</p>
        <a href={callHref} className="display mt-0.5 block text-xl font-semibold">{phoneLabel}</a>
      </div>
      <div className="layer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] shadow-xl" style={{ right: "-8%", top: "-3%", transform: "translateZ(130px)", background: c.accent, color: c.onAccent }}>
        {sub.label}
      </div>
    </Tilt>
  );
}

export default function ProDemo({ b }: { b: Business }) {
  const kind = b.kind!;
  const k = proKinds[kind];
  const sub = subs[b.sub!];
  const c = k.colors;
  const upper = k.uppercase ? "uppercase tracking-tight" : "";
  const city = b.city || "Dubai";
  const place = b.area || city;

  const vars = {
    "--bg": c.bg,
    "--surface": c.surface,
    "--ink": c.ink,
    "--muted": c.muted,
    "--line": c.line,
    "--accent": c.accent,
    "--on-accent": c.onAccent,
    "--accent-2": c.accent2,
    "--display": fontVar[k.font],
  } as CSSProperties;

  const layers = splitLayers(k.pattern.image);
  const heroStyle: CSSProperties = {
    backgroundImage: [...layers, `linear-gradient(135deg, ${c.heroFrom}, ${c.heroTo})`].join(","),
    backgroundSize: [...layers.map(() => k.pattern.size), "cover"].join(","),
  };

  const digits = b.tel.replace(/\D/g, "");
  const callHref = `tel:${b.tel}`;
  const bizWa = b.whatsapp ? `https://wa.me/${digits}?text=${encodeURIComponent("Hi! I found your website and have a question.")}` : null;
  const where = b.mapQuery ? encodeURIComponent(b.mapQuery) : `${b.lat},${b.lon}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${where}`;
  const mapEmbed = `https://maps.google.com/maps?q=${where}&z=15&output=embed`;
  const wa = whatsappLink(`Hi! I saw the demo website you made for ${b.name}. I'm interested.`);

  const marqueeWords = [...sub.services.map((s) => s.name), place];
  const marquee = Array.from({ length: 4 }, () => marqueeWords).flat();
  const cta = CTA[kind];
  const groups = groupsFor(b);
  const photos = proPhotosFor(b);
  const nRing = photos ? photos.ring.length : 0;

  return (
    <div className={k.light ? "demo-root demo-light" : "demo-root demo-dark"} style={vars}>
      {/* Demo banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-[#0B0B0F] px-4 py-2 text-[13px] text-white md:px-8">
        <p className="truncate">
          <span className="font-bold">Free demo</span> made by {company.name} for {b.name}
        </p>
        <a href={wa ?? "#make-it-yours"} className="shrink-0 rounded-full bg-white px-3.5 py-1 text-[12px] font-bold text-black hover:bg-white/90">
          Make it yours →
        </a>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden text-white" style={heroStyle}>
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full border" style={{ borderColor: `${c.accent2}55` }} />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ background: `${c.accent}44` }} />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6 md:px-8">
          <span className={`display truncate text-lg font-semibold md:text-xl ${upper}`}>{b.name}</span>
          <div className="flex shrink-0 items-center gap-7 text-sm font-semibold">
            <a href="#services" className="hidden text-white/80 hover:text-white md:inline">Services</a>
            <a href="#book" className="hidden text-white/80 hover:text-white md:inline">{sub.widgetKicker}</a>
            <a href="#visit" className="hidden text-white/80 hover:text-white md:inline">Visit</a>
            <a href={callHref} className="btn !px-5 !py-2.5 text-sm" style={{ background: c.accent, color: c.onAccent }}>
              <Icon k="phone" className="h-4 w-4" /> Call
            </a>
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:px-8 md:pb-32 md:pt-14">
          <div>
            <div className="fade-up mb-6 flex flex-wrap gap-2">
              {[sub.label, place, city].filter((v, i, a) => a.indexOf(v) === i).map((chip) => (
                <span key={chip} className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur">
                  {chip}
                </span>
              ))}
            </div>
            <h1 className={`display fade-up max-w-4xl text-[clamp(2.4rem,7.4vw,5.6rem)] font-semibold leading-[0.98] ${upper}`} style={{ animationDelay: "0.08s" }}>
              {b.name}
            </h1>
            <p className="display fade-up mt-5 max-w-xl text-2xl leading-snug text-white/95 md:text-3xl" style={{ animationDelay: "0.16s", color: c.accent2 }}>
              {sub.headline.replace("Dubai", city)}
            </p>
            <p className="fade-up mt-4 max-w-xl text-lg text-white/75" style={{ animationDelay: "0.22s" }}>
              {sub.lede}
            </p>
            <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: "0.28s" }}>
              <a href="#book" className="btn" style={{ background: c.accent, color: c.onAccent }}>
                <Icon k={kind === "estate" ? "building" : "calendar"} /> {cta.hero}
              </a>
              {bizWa ? (
                <a href={bizWa} target="_blank" rel="noopener noreferrer" className="btn border border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15">
                  <Icon k="chat" /> WhatsApp
                </a>
              ) : (
                <a href={callHref} className="btn border border-white/40 bg-white/5 text-white backdrop-blur hover:bg-white/15">
                  <Icon k="phone" /> {b.phone}
                </a>
              )}
            </div>
          </div>

          <div className="fade-up relative mx-auto w-full max-w-md md:max-w-none" style={{ animationDelay: "0.2s" }}>
            <HeroArt b={b} photos={photos} phoneLabel={b.phone} callHref={callHref} />
          </div>
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
        {photos ? (
          <section id="about" className="mx-auto max-w-6xl scroll-mt-16 px-5 pt-20 md:px-8 md:pt-28">
            <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
              <div className="reveal" style={{ perspective: "1200px" }}>
                <Tilt className="relative aspect-[4/3] w-full max-w-lg">
                  <div className="layer inset-0 overflow-hidden rounded-3xl shadow-2xl">
                    <Image src={photos.about.file} alt="" fill sizes="(min-width:768px) 40vw, 90vw" className="object-cover" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">Sample photo</span>
                  </div>
                  <div className="layer rounded-2xl border-2" style={{ inset: "-14px -14px 14px 14px", borderColor: c.accent, transform: "translateZ(-40px)" }} />
                </Tilt>
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--accent)" }}>Welcome</p>
                <h2 className={`display text-4xl leading-[1.05] md:text-5xl ${upper}`}>Welcome to {b.name}</h2>
                <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                  {b.name} is a {sub.label.toLowerCase()} in {place}, {city}. Call or message us with any question. We&apos;re happy to help.
                </p>
                <dl className="mt-6 divide-y" style={{ borderColor: "var(--line)" }}>
                  {[
                    ["Type", sub.label],
                    ["Area", `${place}, ${city}`],
                    ["Call us", b.phone],
                  ].map(([k2, v]) => (
                    <div key={k2} className="flex items-baseline justify-between gap-6 py-4" style={{ borderColor: "var(--line)" }}>
                      <dt className="text-sm font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>{k2}</dt>
                      <dd className="display text-xl">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        ) : null}

        {/* Services */}
        <section id="services" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20 md:px-8 md:py-28">
          <SectionTitle eyebrow="Services" title={kind === "estate" ? "How we help" : "What we do"} note={<SampleTag>Sample services · we&apos;ll list yours</SampleTag>} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sub.services.map((s) => (
              <li key={s.name} className="reveal group rounded-3xl border p-6 transition-transform duration-300 hover:-translate-y-1.5" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" style={{ background: "color-mix(in srgb, var(--accent) 18%, transparent)", color: "var(--accent)" }}>
                  <Icon k={s.icon} className="h-6 w-6" />
                </span>
                <h3 className={`display mt-5 text-xl leading-tight md:text-2xl ${upper}`}>{s.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>{s.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Gallery: rotating 3D photo ring */}
        {photos ? (
          <section className="overflow-hidden py-16 text-white md:py-24" style={{ backgroundImage: `linear-gradient(135deg, ${c.heroFrom}, ${c.heroTo})` }}>
            <div className="mx-auto mb-4 flex max-w-6xl flex-col gap-3 px-5 md:flex-row md:items-end md:justify-between md:px-8">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: c.accent2 }}>Look</p>
                <h2 className={`display text-4xl leading-none md:text-6xl ${upper}`}>Gallery</h2>
              </div>
              <span className="inline-flex w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                Sample photos · your own go here
              </span>
            </div>
            <div className="ring-scene">
              <div className="ring" style={{ "--n": nRing, "--k": 1.08 / (2 * Math.tan(Math.PI / nRing)) } as CSSProperties}>
                {photos.ring.map((p, i) => (
                  <figure key={p.file} className="ring-item" style={{ "--i": i } as CSSProperties}>
                    <Image src={p.file} alt="" fill sizes="(min-width:768px) 24vw, 45vw" className="object-cover" />
                  </figure>
                ))}
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-white/50">Hover to pause</p>
          </section>
        ) : null}

        {/* Booking / request / search */}
        <section id="book" className="scroll-mt-16 py-20 md:py-28" style={{ background: kind === "salon" ? undefined : "color-mix(in srgb, var(--surface) 55%, transparent)" }}>
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            {kind === "estate" ? (
              <>
                <SectionTitle eyebrow="Search" title="Find your property" note={<SampleTag>Sample listings · yours go here</SampleTag>} />
                <PropertySearch city={city} upper={upper} photos={photos ? photos.all.map((p) => p.file) : []} />
              </>
            ) : (
              <>
                <SectionTitle eyebrow={sub.widgetKicker} title={sub.widgetTitle} note={<SampleTag>Bookings go straight to your WhatsApp</SampleTag>} />
                <RequestDemo slug={b.slug} name={b.name} place={b.address || `${place}, ${city}`} noun={sub.noun} bubbleTitle={sub.bubbleTitle} groups={groups} schedule={scheduleFor(kind)} cta={cta.cta} upper={upper} askNote={cta.note} />
              </>
            )}
          </div>
        </section>

        {kind === "estate" ? (
          <section id="enquire" className="scroll-mt-16 py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <SectionTitle eyebrow="Enquire" title={sub.widgetTitle} note={<SampleTag>Bookings go straight to your WhatsApp</SampleTag>} />
              <RequestDemo slug={b.slug} name={b.name} place={b.address || `${place}, ${city}`} noun={sub.noun} bubbleTitle={sub.bubbleTitle} groups={groups} schedule={scheduleFor(kind)} cta={cta.cta} upper={upper} askNote={cta.note} />
            </div>
          </section>
        ) : null}

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <SectionTitle eyebrow="Simple" title="How it works" />
          <ol className="grid gap-4 md:grid-cols-3">
            {sub.steps.map(([title, text], i) => (
              <li key={title} className="reveal relative overflow-hidden rounded-3xl border p-7 md:p-9" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
                <span className="display absolute -right-2 -top-6 select-none text-[8rem] font-semibold leading-none opacity-[0.08]" style={{ color: "var(--accent)" }}>{i + 1}</span>
                <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>{i + 1}</span>
                <h3 className={`display mt-5 text-2xl md:text-3xl ${upper}`}>{title}</h3>
                <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Visit */}
        <section id="visit" className="scroll-mt-16 pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionTitle eyebrow="Find us" title={kind === "home" ? "Where we work" : "Come visit"} />
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border p-7 md:p-9" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                <dl className="space-y-6">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Address</dt>
                    <dd className="display mt-1 text-2xl leading-snug">{b.address || `${place}, ${city}`}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Hours</dt>
                    <dd className="mt-1 text-lg">Call to confirm today&apos;s hours</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Phone</dt>
                    <dd className="display mt-1 text-2xl">
                      <a href={callHref} className="underline decoration-2 underline-offset-4" style={{ textDecorationColor: "var(--accent)" }}>{b.phone}</a>
                    </dd>
                  </div>
                  {b.facebook ? (
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Facebook</dt>
                      <dd className="mt-1 text-lg">
                        <a href={b.facebook} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Our Facebook page</a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: c.accent, color: c.onAccent }}>
                    <Icon k="pin" /> Directions
                  </a>
                  <a href={callHref} className="btn border" style={{ borderColor: "var(--ink)" }}>
                    <Icon k="phone" /> Call
                  </a>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--line)" }}>
                <iframe title={`Map of ${b.name}`} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[22rem] w-full md:h-full md:min-h-[26rem]" />
              </div>
            </div>
          </div>
        </section>

        {/* Call band */}
        <section className="px-5 py-16 text-center md:py-24" style={{ background: c.accent, color: c.onAccent }}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] opacity-80">{k.callBand}</p>
          <a href={callHref} className={`display block text-[clamp(2.2rem,8vw,5.5rem)] font-semibold leading-none ${upper}`}>
            {b.phone}
          </a>
        </section>

        {/* Onwebsite pitch */}
        <section id="make-it-yours" className="scroll-mt-16 bg-[#0B0B0F] px-5 py-20 text-white md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50">By {company.name}</p>
              <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">Like this website?</h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
                This is a free sample we made for {b.name} using your public business details. We can make it yours: your own photos,
                real services and prices, and your own web address.
              </p>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {k.features.map((f) => (
                <li key={f.title} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ background: `${c.accent}26`, color: c.accent }}>
                    <Icon k={f.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold">{f.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-white/65">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 text-center">
              {wa ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn bg-white text-black">
                  Message us on WhatsApp <Icon k="arrow" />
                </a>
              ) : (
                <p className="inline-block rounded-full border border-white/25 px-6 py-3 font-semibold">Reply to our WhatsApp message and we&apos;ll get started</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 pb-28 text-center text-xs md:pb-8" style={{ color: "var(--muted)" }}>
        Demo website by {company.name}. This is a design sample, not the official website of {b.name}. Sections marked &ldquo;sample&rdquo; are
        placeholders. Contact details come from public business listings.
        {photos ? (
          <details className="mx-auto mt-3 max-w-3xl">
            <summary className="cursor-pointer font-semibold">Photo credits</summary>
            <ul className="mt-2 space-y-1">
              {photos.all.map((p) => (
                <li key={p.file}>
                  <a href={p.page} target="_blank" rel="noopener noreferrer" className="underline">
                    {p.title}
                  </a>{" "}
                  by {p.artist} ({p.license}, {p.source})
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </footer>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden" style={{ borderColor: "var(--line)", background: "color-mix(in srgb, var(--bg) 92%, transparent)" }}>
        <a href={callHref} className="btn !py-3 text-sm" style={{ background: c.accent, color: c.onAccent }}>
          <Icon k="phone" className="h-4 w-4" /> Call
        </a>
        {bizWa ? (
          <a href={bizWa} target="_blank" rel="noopener noreferrer" className="btn !py-3 text-sm" style={{ background: "#25D366", color: "#062B14" }}>
            <Icon k="chat" className="h-4 w-4" /> WhatsApp
          </a>
        ) : (
          <a href={directions} target="_blank" rel="noopener noreferrer" className="btn border !py-3 text-sm" style={{ borderColor: "var(--ink)", color: "var(--ink)" }}>
            <Icon k="pin" className="h-4 w-4" /> Directions
          </a>
        )}
      </div>
    </div>
  );
}
