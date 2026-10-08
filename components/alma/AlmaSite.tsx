"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ICONS, type IconKey } from "@/lib/pro";
import { PHONE_E164, PHONE_SHOW, SERVICES, T, type L, type Lang } from "@/lib/alma";

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// "Today" comes from the visitor's clock so the page always shows the right days and the October countdown.
const noopSub = () => () => {};
const todaySnap = () => iso(new Date());
const serverEmpty = () => "";

function Icon({ k, className = "h-5 w-5" }: { k: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={ICONS[k]} />
    </svg>
  );
}

// A simple autumn leaf sprig used as decoration (pure SVG, no image).
function Sprig({ className = "", style, tone = "rose" }: { className?: string; style?: CSSProperties; tone?: "rose" | "autumn" | "mauve" }) {
  const c = tone === "rose" ? ["#E9A9B8", "#D98BA0", "#F4C9D2"] : tone === "autumn" ? ["#E08A4B", "#C8643F", "#E9B06B"] : ["#B7A3C4", "#9C86AD", "#D6C8DE"];
  return (
    <svg viewBox="0 0 200 400" className={className} style={style} aria-hidden>
      <path d="M100 400 C100 300 96 200 104 20" stroke={c[1]} strokeWidth="3" fill="none" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 360 - i * 38;
        const left = i % 2 === 0;
        const x = left ? 100 - 4 : 100 + 4;
        const dx = left ? -62 : 62;
        return (
          <path key={i} d={`M${x} ${y} q${dx * 0.5} -34 ${dx} -14 q${-dx * 0.5} 34 ${-dx} 14z`} fill={c[i % 3]} opacity={0.85 - i * 0.04} />
        );
      })}
      <circle cx="104" cy="22" r="9" fill={c[0]} />
    </svg>
  );
}

function Title({ kicker, title, center }: { kicker: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className={`mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] ${center ? "justify-center" : ""}`} style={{ color: "var(--terra)" }}>
        <span className="h-px w-8" style={{ background: "currentColor" }} />
        {kicker}
        {center ? <span className="h-px w-8" style={{ background: "currentColor" }} /> : null}
      </p>
      <h2 className="alma-display text-4xl leading-[1.1] md:text-6xl" style={{ color: "var(--mauve)" }}>{title}</h2>
    </div>
  );
}

export default function AlmaSite() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = (l: L) => l[lang];
  const today = useSyncExternalStore(noopSub, todaySnap, serverEmpty);

  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [poster, setPoster] = useState<"" | "pink" | "halloween">("");

  const [picked, setPicked] = useState<string[]>([]);
  const [place, setPlace] = useState<"salon" | "home">("salon");
  const [date, setDate] = useState("");
  const [part, setPart] = useState<"" | "morning" | "afternoon" | "evening">("");
  const [exact, setExact] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!poster) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setPoster("");
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [poster]);

  const days = useMemo(() => {
    if (!today) return [];
    const base = parseDay(today);
    return Array.from({ length: 21 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const inOct = d.getMonth() === 9;
      return {
        iso: iso(d),
        dow: d.getDay(),
        day: d.getDate(),
        wd: d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", { weekday: "short" }),
        mon: d.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", { month: "short" }),
        pink: inOct && d.getDay() <= 2,
      };
    });
  }, [today, lang]);

  // October countdown (visitor's clock).
  const daysLeft = useMemo(() => {
    if (!today) return null;
    const d = parseDay(today);
    if (d.getMonth() !== 9) return null;
    return new Date(d.getFullYear(), 9, 31).getDate() - d.getDate() + 1;
  }, [today]);

  const chosenDay = days.find((d) => d.iso === date);
  const hasPackage = picked.includes("halloween");
  const others = picked.filter((x) => x !== "halloween");
  const discountApplies = !!chosenDay?.pink && others.length > 0;
  const nameOk = name.trim().length > 1;
  const phoneOk = phone.replace(/\D/g, "").length >= 7;
  const ready = picked.length > 0 && !!date && !!part && nameOk && phoneOk;
  const missing = picked.length === 0 ? T.book.pick : !date ? T.book.pickDay : !part ? T.book.pickTime : !nameOk ? T.book.addName : !phoneOk ? T.book.addPhone : null;

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const goBook = (id?: string) => {
    if (id) setPicked((p) => (p.includes(id) ? p : [...p, id]));
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  function message() {
    const ar = lang === "ar";
    const svc = picked.map((id) => SERVICES.find((s) => s.id === id)!);
    const dateLabel = chosenDay ? parseDay(chosenDay.iso).toLocaleDateString(ar ? "ar-SA" : "en-GB", { weekday: "long", day: "numeric", month: "long" }) : "";
    const partLabel = part ? t(T.book[part]) : "";
    const lines = [
      ar ? "مرحباً ألما! أرغب في حجز موعد:" : "Hello ALMA! I'd like to book an appointment:",
      ...svc.map((s) => `• ${t(s.name)}${s.price ? ` (${s.price} ${t(T.hero.sar)})` : ""}`),
      "",
      `📅 ${dateLabel} · ${partLabel}${exact ? ` · ${exact}` : ""}`,
      `📍 ${place === "home" ? t(T.book.home) : t(T.book.salon)}`,
      ...(discountApplies ? [ar ? "🌸 خصم أكتوبر الوردي 15% (حسب الشروط)" : "🌸 Pink October 15% discount (per terms)"] : []),
      `👤 ${name.trim()} · ${phone.trim()}`,
      ...(note.trim() ? [`📝 ${note.trim()}`] : []),
    ];
    return lines.join("\n");
  }
  const waHref = ready ? `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(message())}` : "";
  const waPlain = `https://wa.me/${PHONE_E164}`;

  const nav: [L, string][] = [
    [T.nav.offers, "#offers"],
    [T.nav.package, "#package"],
    [T.nav.book, "#book"],
    [T.nav.terms, "#terms"],
    [T.nav.contact, "#contact"],
  ];

  const vars = {
    "--bg": "#F8F1F1",
    "--surface": "#FFFFFF",
    "--ink": "#3E3344",
    "--mauve": "#5E5062",
    "--mauve2": "#7A6B7E",
    "--rose": "#E9A9B8",
    "--rose-d": "#C9647F",
    "--line": "#EBDCE0",
    "--terra": "#C0603E",
    "--gold": "#C9A36A",
    background: "#F8F1F1",
    color: "#3E3344",
  } as CSSProperties;

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} className="alma-root" style={vars}>
      {/* announcement */}
      <div className="alma-bar relative z-50 overflow-hidden px-4 py-2 text-center text-[13px] font-semibold text-white" style={{ background: "linear-gradient(90deg, var(--mauve), #8B6C8E, var(--rose-d))" }}>
        <span className="mx-2">🌸</span>{t(T.bar)}<span className="mx-2">🌸</span>
      </div>

      {/* nav */}
      <nav className="sticky top-0 z-40 transition-all duration-300" style={{ background: scrolled || menu ? "rgba(248,241,241,.9)" : "rgba(248,241,241,.55)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:px-8">
          <a href="#top" aria-label="ALMA Beauty Center" className="block w-32 shrink-0 md:w-40">
            <Image src="/alma/logo-plain.png" alt="ALMA Beauty Center" width={800} height={296} priority unoptimized className="h-auto w-full" />
          </a>
          <div className="hidden items-center gap-7 text-sm font-bold md:flex" style={{ color: "var(--mauve)" }}>
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="transition hover:opacity-60">{t(l)}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="rounded-full border px-4 py-2 text-sm font-bold transition hover:bg-white" style={{ borderColor: "var(--line)", color: "var(--mauve)" }} aria-label="Language">
              {t(T.lang)}
            </button>
            <div className="hidden md:block"><button onClick={() => goBook()} className="alma-btn !px-5 !py-2.5 text-sm">{t(T.hero.cta)}</button></div>
            <button className="grid h-10 w-10 place-items-center rounded-full border md:hidden" style={{ borderColor: "var(--line)" }} aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              <span className="relative block h-3.5 w-5">
                <span className="absolute left-0 h-0.5 w-5 transition-all" style={{ background: "var(--mauve)", top: menu ? 6 : 0, transform: menu ? "rotate(45deg)" : "none" }} />
                <span className="absolute left-0 top-1.5 h-0.5 w-5 transition-opacity" style={{ background: "var(--mauve)", opacity: menu ? 0 : 1 }} />
                <span className="absolute left-0 h-0.5 w-5 transition-all" style={{ background: "var(--mauve)", top: menu ? 6 : 12, transform: menu ? "rotate(-45deg)" : "none" }} />
              </span>
            </button>
          </div>
        </div>
        {menu ? (
          <div className="border-t px-5 pb-5 pt-1 md:hidden" style={{ borderColor: "var(--line)" }}>
            {nav.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setMenu(false)} className="block border-b py-3.5 text-lg font-bold" style={{ borderColor: "var(--line)", color: "var(--mauve)" }}>{t(l)}</a>
            ))}
            <button onClick={() => { setMenu(false); goBook(); }} className="alma-btn mt-4 w-full">{t(T.hero.cta)}</button>
          </div>
        ) : null}
      </nav>

      {/* hero */}
      <header id="top" className="relative overflow-hidden">
        <div aria-hidden className="alma-blob absolute -top-24 h-96 w-96 rounded-full blur-3xl" style={{ insetInlineStart: "-6rem", background: "#F3C3CD", opacity: 0.7 }} />
        <div aria-hidden className="alma-blob absolute bottom-0 h-96 w-96 rounded-full blur-3xl" style={{ insetInlineEnd: "-5rem", background: "#F6C79E", opacity: 0.5, animationDelay: "-4s" }} />
        <Sprig className="pointer-events-none absolute bottom-0 hidden h-[28rem] w-40 opacity-70 md:block" style={{ insetInlineStart: 0, transform: "rotate(-8deg)" }} tone="rose" />
        <Sprig className="pointer-events-none absolute right-0 top-10 hidden h-[26rem] w-36 opacity-70 md:block" style={{ transform: "rotate(10deg) scaleX(-1)" }} tone="autumn" />
        <div className="alma-petals" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{ left: `${8 + i * 12}%`, animationDelay: `${i * -2.3}s`, animationDuration: `${14 + (i % 4) * 3}s` }} />
          ))}
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 pb-20 pt-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-6 md:px-8 md:pb-28 md:pt-16">
          <div>
            <p className="alma-rise mb-5 inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur" style={{ borderColor: "var(--line)", color: "var(--terra)" }}>
              🎃 {t(T.hero.kicker)}
            </p>
            <h1 className="alma-display alma-rise text-[clamp(2.6rem,7.6vw,5.4rem)] leading-[1.08]" style={{ animationDelay: ".08s", color: "var(--mauve)" }}>
              {t(T.hero.title)}
            </h1>
            <p className="alma-rise mt-6 max-w-xl text-lg leading-relaxed md:text-xl" style={{ animationDelay: ".16s", color: "var(--mauve2)" }}>{t(T.hero.lede)}</p>
            <div className="alma-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".24s" }}>
              <button onClick={() => goBook("halloween")} className="alma-btn"><Icon k="calendar" /> {t(T.hero.cta)}</button>
              <a href="#offers" className="alma-btn alma-btn-ghost">{t(T.hero.cta2)}</a>
            </div>
            <div className="alma-rise mt-10 flex flex-wrap items-center gap-5" style={{ animationDelay: ".32s" }}>
              <div className="grid h-28 w-28 place-items-center rounded-full text-center text-white shadow-xl" style={{ background: "radial-gradient(circle at 30% 25%, #8F7E94, var(--mauve))" }}>
                <div>
                  <p className="text-[10px] font-semibold opacity-80">{t(T.hero.only)}</p>
                  <p className="alma-display text-4xl leading-none">615</p>
                  <p className="text-xs opacity-80">{t(T.hero.sar)}</p>
                </div>
              </div>
              <div className="grid h-28 w-28 place-items-center rounded-full text-center text-white shadow-xl" style={{ background: "radial-gradient(circle at 30% 25%, #F0B7C4, var(--rose-d))" }}>
                <div>
                  <p className="alma-display text-4xl leading-none">15%</p>
                  <p className="mt-1 text-[11px] font-bold leading-tight">{t(T.offers.pinkTitle)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="alma-rise relative mx-auto w-full max-w-sm md:max-w-md" style={{ animationDelay: ".2s" }}>
            <div aria-hidden className="absolute -inset-4 rounded-[50%_50%_2rem_2rem/38%_38%_2rem_2rem] border" style={{ borderColor: "var(--gold)", opacity: 0.6 }} />
            <div className="alma-float relative aspect-[4/5] overflow-hidden rounded-[50%_50%_2rem_2rem/38%_38%_2rem_2rem] shadow-2xl" style={{ boxShadow: "0 40px 80px -30px rgba(94,80,98,.55)" }}>
              <Image src="/alma/model.jpg" alt="ALMA Halloween makeup look" fill priority sizes="(min-width:768px) 36vw, 90vw" className="object-cover" style={{ objectPosition: "50% 30%" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(94,80,98,.55), transparent 45%)" }} />
              <p className="alma-display absolute inset-x-0 bottom-6 px-6 text-center text-2xl text-white md:text-3xl">{t(T.pkg.tagline)}</p>
            </div>
            <span className="alma-float absolute -top-3 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg" style={{ insetInlineEnd: "-0.5rem", background: "var(--terra)", animationDelay: "-2s" }}>🎃 {t(T.offers.halTitle)}</span>
          </div>
        </div>
      </header>

      {/* offers */}
      <section id="offers" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Title kicker={t(T.offers.kicker)} title={t(T.offers.title)} center />
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
            {/* pink */}
            <article className="alma-card relative overflow-hidden rounded-[2rem] p-7 md:p-10" style={{ background: "linear-gradient(160deg, #FFF6F8, #F7DCE3)" }}>
              <Sprig className="pointer-events-none absolute -bottom-10 h-72 w-28 opacity-60" style={{ insetInlineEnd: "-0.5rem" }} tone="rose" />
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full text-3xl" style={{ background: "#fff" }}>🎀</span>
                <h3 className="alma-display text-3xl md:text-4xl" style={{ color: "var(--mauve)" }}>{t(T.offers.pinkTitle)}</h3>
              </div>
              <p className="alma-display mt-6 text-[7rem] leading-none md:text-[9rem]" style={{ color: "var(--mauve)" }}>15<span className="text-[0.55em]">%</span></p>
              <p className="-mt-1 text-2xl font-bold" style={{ color: "var(--mauve)" }}>{t(T.offers.pinkOn)}</p>
              <div className="mt-6 rounded-3xl p-5 text-center text-white" style={{ background: "var(--mauve)" }}>
                <p className="text-sm opacity-80">{t(T.offers.pinkDays)}</p>
                <p className="mt-1 text-xl font-extrabold md:text-2xl">{t(T.offers.pinkDaysList)}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={() => goBook("other")} className="alma-btn">{t(T.offers.pinkCta)}</button>
                <button onClick={() => setPoster("pink")} className="alma-btn alma-btn-ghost">{t(T.offers.posters)}</button>
              </div>
              <p className="mt-5 text-sm font-semibold" style={{ color: "var(--terra)" }}>
                {daysLeft ? `⏳ ${daysLeft} ${t(T.offers.left)}` : t(T.offers.ended)}
              </p>
            </article>

            {/* halloween */}
            <article className="alma-card relative overflow-hidden rounded-[2rem] p-7 md:p-10" style={{ background: "linear-gradient(160deg, #FFF4EA, #F6D9BE)" }}>
              <Sprig className="pointer-events-none absolute -bottom-10 h-72 w-28 opacity-70" style={{ insetInlineEnd: "-0.5rem" }} tone="autumn" />
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full text-3xl" style={{ background: "#fff" }}>🎃</span>
                <div>
                  <h3 className="alma-display text-3xl md:text-4xl" style={{ color: "var(--mauve)" }}>{t(T.offers.halTitle)}</h3>
                  <p className="text-sm" style={{ color: "var(--mauve2)" }}>{t(T.offers.halSub)}</p>
                </div>
              </div>
              <div className="mt-6 flex items-end gap-3">
                <p className="alma-display text-[6.5rem] leading-none md:text-[8rem]" style={{ color: "var(--mauve)" }}>615</p>
                <p className="mb-4 text-2xl font-bold" style={{ color: "var(--mauve2)" }}>{t(T.hero.sar)}</p>
              </div>
              <ul className="mt-2 space-y-2 text-lg font-semibold" style={{ color: "var(--mauve)" }}>
                {T.pkg.items.map((x) => (
                  <li key={x.t.en} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: "var(--terra)" }}><Icon k="check" className="h-3.5 w-3.5" /></span>{t(x.t)}</li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button onClick={() => goBook("halloween")} className="alma-btn" style={{ background: "var(--terra)" }}>{t(T.offers.halCta)}</button>
                <button onClick={() => setPoster("halloween")} className="alma-btn alma-btn-ghost">{t(T.offers.posters)}</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* package */}
      <section id="package" className="scroll-mt-20 overflow-hidden px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <Title kicker={t(T.pkg.kicker)} title={t(T.pkg.title)} center />
          <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 sm:grid-cols-3">
            {T.pkg.items.map((x, i) => (
              <figure key={x.t.en} className="alma-reveal text-center" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="alma-ring relative mx-auto aspect-square w-48 md:w-56">
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <Image src={x.img} alt={x.t.en} fill sizes="224px" className="scale-[1.18] object-cover transition-transform duration-700 hover:scale-[1.3]" />
                  </div>
                </div>
                <figcaption className="mt-5">
                  <p className="alma-display text-2xl" style={{ color: "var(--mauve)" }}>{t(x.t)}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--terra)" }}>{t(x.d)}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
            <div className="alma-card flex items-center gap-5 rounded-3xl p-6" style={{ background: "#fff" }}>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl" style={{ background: "#F3E7EC", color: "var(--mauve)" }}><Icon k="home" className="h-8 w-8" /></span>
              <div><p className="alma-display text-2xl" style={{ color: "var(--mauve)" }}>{t(T.pkg.home)}</p><p style={{ color: "var(--mauve2)" }}>{t(T.pkg.homeD)}</p></div>
            </div>
            <div className="alma-card flex items-center gap-5 rounded-3xl p-6" style={{ background: "#fff" }}>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-lg font-black tracking-tight" style={{ background: "#3BFFC1", color: "#0B2B22" }}>tabby</span>
              <div><p className="alma-display text-2xl" style={{ color: "var(--mauve)" }}>{t(T.pkg.tabby)}</p><p style={{ color: "var(--mauve2)" }}>{t(T.pkg.tabbyD)}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* booking */}
      <section id="book" className="relative scroll-mt-16 px-5 py-20 md:px-8 md:py-28" style={{ background: "linear-gradient(180deg, #F3E3E8, #F8F1F1)" }}>
        <div className="mx-auto max-w-6xl">
          <Title kicker={t(T.book.kicker)} title={t(T.book.title)} />
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
            <div className="space-y-5">
              <Step n={1} title={t(T.book.s1)} ok={picked.length > 0}>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => {
                    const on = picked.includes(s.id);
                    return (
                      <button key={s.id} onClick={() => toggle(s.id)} aria-pressed={on} className="flex items-center gap-4 rounded-2xl border p-4 text-start transition active:scale-[0.98]" style={on ? { background: "var(--mauve)", color: "#fff", borderColor: "var(--mauve)", boxShadow: "0 18px 34px -22px var(--mauve)" } : { background: "#fff", borderColor: "var(--line)" }}>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl" style={{ background: on ? "rgba(255,255,255,.18)" : "#F6E8EC" }}>{s.icon === "pkg" ? "🎃" : s.icon === "hair" ? "💇‍♀️" : s.icon === "nails" ? "💅" : s.icon === "makeup" ? "💄" : "✨"}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-extrabold leading-tight">{t(s.name)}</span>
                          <span className="mt-0.5 block text-xs opacity-75">{t(s.note)}</span>
                        </span>
                        {s.price ? <span className="alma-display text-xl">{s.price}</span> : null}
                      </button>
                    );
                  })}
                </div>
              </Step>

              <Step n={2} title={t(T.book.s2)} ok>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {(["salon", "home"] as const).map((k) => (
                    <button key={k} onClick={() => setPlace(k)} aria-pressed={place === k} className="flex items-center justify-center gap-2 rounded-2xl border py-4 font-bold transition active:scale-[0.98]" style={place === k ? { background: "var(--mauve)", color: "#fff", borderColor: "var(--mauve)" } : { background: "#fff", borderColor: "var(--line)" }}>
                      <Icon k={k === "home" ? "home" : "pin"} /> {t(T.book[k])}
                    </button>
                  ))}
                </div>
              </Step>

              <Step n={3} title={t(T.book.s3)} ok={!!date && !!part}>
                <div className="alma-scroll -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
                  {days.map((d, i) => {
                    const on = date === d.iso;
                    return (
                      <button key={d.iso} onClick={() => setDate(d.iso)} aria-pressed={on} className="relative w-[4.6rem] shrink-0 rounded-2xl border py-3 text-center transition active:scale-95" style={on ? { background: "var(--mauve)", color: "#fff", borderColor: "var(--mauve)" } : d.pink ? { background: "#FCE8EE", borderColor: "#F0B7C4" } : { background: "#fff", borderColor: "var(--line)" }}>
                        <span className="block text-[11px] font-bold opacity-70">{i === 0 ? t(T.book.today) : d.wd}</span>
                        <span className="alma-display block text-2xl">{d.day}</span>
                        <span className="block text-[11px] font-semibold opacity-60">{d.mon}</span>
                        {d.pink ? <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-extrabold text-white" style={{ background: "var(--rose-d)" }}>{t(T.book.pinkDay)}</span> : null}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {(["morning", "afternoon", "evening"] as const).map((k) => (
                    <button key={k} onClick={() => setPart(k)} aria-pressed={part === k} className="rounded-2xl border py-3.5 font-bold transition active:scale-95" style={part === k ? { background: "var(--terra)", color: "#fff", borderColor: "var(--terra)" } : { background: "#fff", borderColor: "var(--line)" }}>
                      {t(T.book[k])}
                    </button>
                  ))}
                </div>
                <label className="mt-4 block text-sm font-bold" style={{ color: "var(--mauve2)" }}>
                  {lang === "ar" ? "وقت مفضّل (اختياري)" : "Preferred time (optional)"}
                  <input type="time" value={exact} onChange={(e) => setExact(e.target.value)} className="alma-input" />
                </label>
              </Step>

              <Step n={4} title={t(T.book.s4)} ok={nameOk && phoneOk}>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="block text-sm font-bold">{t(T.book.name)}
                    <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="alma-input" />
                  </label>
                  <label className="block text-sm font-bold">{t(T.book.phone)}
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" dir="ltr" className="alma-input" placeholder="+966 5X XXX XXXX" />
                  </label>
                  <label className="block text-sm font-bold md:col-span-2">{t(T.book.note)}
                    <input value={note} onChange={(e) => setNote(e.target.value)} className="alma-input" placeholder={t(T.book.notePh)} />
                  </label>
                </div>
              </Step>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[2rem] p-6 text-white md:p-8" style={{ background: "linear-gradient(155deg, var(--mauve), #3F3345)", boxShadow: "0 36px 70px -34px #3F3345" }}>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">{t(T.book.summary)}</p>
                {picked.length ? (
                  <ul className="mt-4 space-y-2.5">
                    {picked.map((id) => {
                      const s = SERVICES.find((x) => x.id === id)!;
                      return (
                        <li key={id} className="flex items-start justify-between gap-3">
                          <span className="font-semibold">{t(s.name)}</span>
                          {s.price ? <span className="shrink-0 font-bold">{s.price} {t(T.hero.sar)}</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 text-white/60">{t(T.book.pick)}</p>
                )}
                <div className="my-5 h-px bg-white/15" />
                <dl className="space-y-2 text-[15px]">
                  <div className="flex justify-between gap-3"><dt className="text-white/60">{t(T.book.when)}</dt><dd className="text-end font-semibold">{chosenDay ? parseDay(chosenDay.iso).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-GB", { weekday: "short", day: "numeric", month: "short" }) : "–"}{part ? ` · ${t(T.book[part])}` : ""}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-white/60">{t(T.book.where)}</dt><dd className="font-semibold">{place === "home" ? t(T.book.home) : t(T.book.salon)}</dd></div>
                  <div className="flex items-baseline justify-between gap-3 pt-2">
                    <dt className="text-white/60">{t(T.book.total)}</dt>
                    <dd className="alma-display text-3xl" style={{ color: "#F6C79E" }}>{hasPackage && others.length === 0 ? `${615} ${t(T.hero.sar)}` : picked.length ? "—" : "–"}</dd>
                  </div>
                </dl>
                {picked.length && !(hasPackage && others.length === 0) ? <p className="mt-1 text-xs text-white/60">{t(T.book.priceLater)}{hasPackage ? ` (+615 ${t(T.hero.sar)})` : ""}</p> : null}
                <p className="mt-4 rounded-2xl p-3 text-xs leading-relaxed" style={{ background: "rgba(255,255,255,.1)" }}>
                  {discountApplies ? `🌸 ${t(T.book.disc)}` : hasPackage && others.length === 0 ? t(T.book.pkgNoDisc) : t(T.book.noDisc)}
                </p>
                {ready ? (
                  <a href={waHref} target="_blank" rel="noopener noreferrer" className="alma-btn mt-5 w-full" style={{ background: "#25D366", color: "#062B14" }}><Icon k="chat" /> {t(T.book.send)}</a>
                ) : (
                  <button disabled className="alma-btn mt-5 w-full opacity-40" style={{ background: "#25D366", color: "#062B14" }}><Icon k="chat" /> {t(T.book.send)}</button>
                )}
                <p className="mt-3 text-center text-sm text-white/70">{missing ? t(missing) : t(T.book.done)}</p>
                <p className="mt-2 text-center text-xs text-white/45">{t(T.book.note2)}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* terms */}
      <section id="terms" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Title kicker={t(T.terms.kicker)} title={t(T.terms.title)} center />
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
            {[
              { h: t(T.terms.pink), list: T.terms.pinkList, e: "🎀" },
              { h: t(T.terms.hal), list: T.terms.halList, e: "🎃" },
            ].map((b) => (
              <div key={b.h} className="alma-card rounded-[2rem] p-7 md:p-9" style={{ background: "#fff" }}>
                <p className="alma-display flex items-center gap-3 text-2xl md:text-3xl" style={{ color: "var(--mauve)" }}><span className="text-3xl">{b.e}</span>{b.h}</p>
                <ul className="mt-5 space-y-3">
                  {b.list.map((x) => (
                    <li key={x.en} className="flex gap-3 leading-relaxed" style={{ color: "var(--mauve2)" }}>
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--rose-d)" }} />
                      {t(x)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="relative scroll-mt-16 overflow-hidden px-5 py-20 text-center text-white md:px-8 md:py-28" style={{ background: "linear-gradient(150deg, var(--mauve), #3F3345)" }}>
        <Sprig className="pointer-events-none absolute -bottom-6 h-80 w-32 opacity-40" style={{ insetInlineStart: "1rem" }} tone="rose" />
        <Sprig className="pointer-events-none absolute -bottom-6 h-80 w-32 opacity-40" style={{ insetInlineEnd: "1rem", transform: "scaleX(-1)" }} tone="autumn" />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#F6C79E" }}>{t(T.contact.kicker)}</p>
          <h2 className="alma-display text-5xl md:text-7xl">{t(T.contact.title)}</h2>
          <a href={`tel:+${PHONE_E164}`} dir="ltr" className="alma-display mt-8 block text-[clamp(2.2rem,8vw,4.6rem)] leading-none">{PHONE_SHOW}</a>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={`tel:+${PHONE_E164}`} className="alma-btn" style={{ background: "#fff", color: "var(--mauve)" }}><Icon k="phone" /> {t(T.contact.call)}</a>
            <a href={waPlain} target="_blank" rel="noopener noreferrer" className="alma-btn" style={{ background: "#25D366", color: "#062B14" }}><Icon k="chat" /> {t(T.contact.wa)}</a>
          </div>
        </div>
      </section>

      <footer className="px-5 py-8 pb-28 text-center text-sm md:pb-8" style={{ color: "var(--mauve2)" }}>
        <p>© {t(T.contact.rights)}</p>
        <p className="mt-1 text-xs opacity-70">{t(T.contact.by)}</p>
      </footer>

      {/* mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden" style={{ borderColor: "var(--line)", background: "rgba(248,241,241,.92)" }}>
        <button onClick={() => goBook()} className="alma-btn !py-3 text-sm"><Icon k="calendar" className="h-4 w-4" /> {t(T.hero.cta)}</button>
        <a href={waPlain} target="_blank" rel="noopener noreferrer" className="alma-btn !py-3 text-sm" style={{ background: "#25D366", color: "#062B14" }}><Icon k="chat" className="h-4 w-4" /> WhatsApp</a>
      </div>

      {/* poster viewer */}
      {poster ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" onClick={() => setPoster("")}>
          <div className="relative h-[88vh] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Image src={poster === "pink" ? "/alma/poster-pink.jpg" : "/alma/poster-halloween.jpg"} alt="ALMA offer poster" fill sizes="100vw" className="rounded-2xl object-contain" />
          </div>
          <button className="absolute end-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/20 text-2xl text-white" aria-label="Close" onClick={() => setPoster("")}>×</button>
        </div>
      ) : null}
    </div>
  );
}

function Step({ n, title, ok, children }: { n: number; title: string; ok: boolean; children: ReactNode }) {
  return (
    <div className="rounded-[2rem] border p-6 md:p-8" style={{ background: "rgba(255,255,255,.8)", borderColor: "var(--line)" }}>
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold text-white transition-colors" style={{ background: ok ? "var(--terra)" : "var(--mauve)" }}>{ok ? "✓" : n}</span>
        <h3 className="alma-display text-2xl md:text-3xl" style={{ color: "var(--mauve)" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
