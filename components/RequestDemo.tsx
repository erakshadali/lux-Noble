"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

export type Group = { key: string; label: string; options: string[]; multi?: boolean };
export type Schedule =
  | { mode: "slots"; times: string[]; minutes: number; hint: string }
  | { mode: "windows"; windows: { label: string; range: string; hour: number }[]; minutes: number; hint: string };

type Booking = { id: string; ref: string; date: string; timeLabel: string; start: string; minutes: number; service: string; name: string; title: string };

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDay = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const time12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
};
const longDate = (s: string) => parseDay(s).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
const hash = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
};
const minutesOf = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// "Today" and "now" come from the visitor's browser, so a static page shows the right dates.
const noopSubscribe = () => () => {};
const todaySnap = () => iso(new Date());
const nowSnap = () => Math.floor(Date.now() / 900000); // 15-minute buckets
const serverEmpty = () => "";
const serverZero = () => 0;

const storeKey = (slug: string) => `onwebsite-bookings-${slug}`;
function subscribeBookings(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("onw-bookings", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("onw-bookings", cb);
  };
}
const readBookings = (slug: string) => {
  try {
    return localStorage.getItem(storeKey(slug)) ?? "";
  } catch {
    return "";
  }
};
function writeBookings(slug: string, list: Booking[]) {
  try {
    localStorage.setItem(storeKey(slug), JSON.stringify(list.slice(0, 6)));
  } catch {}
  window.dispatchEvent(new Event("onw-bookings"));
}

const newIdentity = () => ({ id: String(Date.now()), ref: `ON-${1000 + Math.floor(Math.random() * 9000)}` });

function downloadIcs(b: Booking, place: string) {
  const [d, t] = b.start.split("T");
  const start = new Date(`${d}T${t}:00`);
  const end = new Date(start.getTime() + b.minutes * 60000);
  const f = (x: Date) => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Onwebsite//Booking demo//EN",
    "BEGIN:VEVENT",
    `UID:${b.id}@onwebsite`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${b.title.replace(/[,;\n]/g, " ")}`,
    `LOCATION:${place.replace(/[,;\n]/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "booking.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Booking system demo: the visitor picks options, a real date and a time slot, adds their details and confirms.
// Because this is a demo, nothing is sent: we show the booking confirmation and the message exactly as it would
// arrive on the owner's WhatsApp. Bookings are kept in this browser only, so the visitor can cancel them.
export default function RequestDemo({
  slug,
  name,
  place,
  noun,
  bubbleTitle,
  groups,
  schedule,
  cta,
  upper,
  askNote,
}: {
  slug: string;
  name: string;
  place: string;
  noun: string;
  bubbleTitle: string;
  groups: Group[];
  schedule: Schedule;
  cta: string;
  upper: string;
  askNote: string;
}) {
  const today = useSyncExternalStore(noopSubscribe, todaySnap, serverEmpty);
  const nowBucket = useSyncExternalStore(noopSubscribe, nowSnap, serverZero);
  const raw = useSyncExternalStore(subscribeBookings, () => readBookings(slug), serverEmpty);
  const bookings = useMemo<Booking[]>(() => {
    try {
      return raw ? (JSON.parse(raw) as Booking[]) : [];
    } catch {
      return [];
    }
  }, [raw]);

  const [sel, setSel] = useState<Record<string, string[]>>({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<Booking | null>(null);

  const days = useMemo(() => {
    if (!today) return [];
    const base = parseDay(today);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return { iso: iso(d), wd: d.toLocaleDateString("en-GB", { weekday: "short" }), day: d.getDate(), mon: d.toLocaleDateString("en-GB", { month: "short" }) };
    });
  }, [today]);

  const nowMin = (() => {
    const d = new Date(nowBucket * 900000);
    return nowBucket ? d.getHours() * 60 + d.getMinutes() : 0;
  })();

  // Sample availability: some slots show as taken so the picker feels real. Slots that have passed today are off too.
  const busy = (t: string) => hash(`${slug}|${date}|${t}`) % 100 < 24;
  const passed = (start: number) => date === today && start <= nowMin + 60;

  const options: { key: string; label: string; sub?: string; off: boolean; group: string }[] =
    schedule.mode === "slots"
      ? schedule.times.map((t) => {
          const m = minutesOf(t);
          return { key: t, label: time12(t), off: !date || busy(t) || passed(m), group: m < 720 ? "Morning" : m < 1020 ? "Afternoon" : "Evening" };
        })
      : schedule.windows.map((w) => ({ key: w.label, label: w.label, sub: w.range, off: !date || busy(w.label) || passed(w.hour * 60 + schedule.minutes), group: "" }));

  const groupsReady = groups.every((g) => (sel[g.key]?.length ?? 0) > 0);
  const phoneOk = phone.replace(/\D/g, "").length >= 7;
  const ready = groupsReady && !!date && !!time && customer.trim().length > 1 && phoneOk;
  const missing = !groupsReady ? "Choose an option in each step." : !date ? "Pick a date." : !time ? "Pick a time." : customer.trim().length < 2 ? "Add your name." : !phoneOk ? "Add your phone number." : "";

  function toggle(g: Group, opt: string) {
    setDone(null);
    setSel((s) => {
      const cur = s[g.key] ?? [];
      if (g.multi) return { ...s, [g.key]: cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt] };
      return { ...s, [g.key]: cur[0] === opt ? [] : [opt] };
    });
  }

  function confirm() {
    if (!ready) return;
    const opt = options.find((o) => o.key === time);
    const timeLabel = schedule.mode === "slots" ? time12(time) : `${time} · ${opt?.sub ?? ""}`;
    const startHm = schedule.mode === "slots" ? time : `${pad(schedule.windows.find((w) => w.label === time)?.hour ?? 9)}:00`;
    const service = (sel[groups[0].key] ?? []).join(", ");
    const b: Booking = {
      ...newIdentity(),
      date,
      timeLabel,
      start: `${date}T${startHm}`,
      minutes: schedule.minutes,
      service,
      name: customer.trim(),
      title: `${noun.charAt(0).toUpperCase() + noun.slice(1)}: ${service} · ${name}`,
    };
    setDone(b);
    writeBookings(slug, [b, ...bookings]);
  }

  function cancel(id: string) {
    writeBookings(slug, bookings.filter((x) => x.id !== id));
    if (done?.id === id) setDone(null);
  }

  const input = "w-full rounded-xl border bg-transparent px-4 py-3 text-base outline-none focus:ring-2";
  const inputStyle = { borderColor: "var(--line)", color: "var(--ink)", ["--tw-ring-color" as string]: "var(--accent)" };
  const stepNo = (n: number) => (
    <span className="grid h-6 w-6 place-items-center rounded-full text-[11px]" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>{n}</span>
  );
  const legend = "mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]";
  const groupsOf = schedule.mode === "slots" ? ["Morning", "Afternoon", "Evening"] : [""];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
      {/* Steps */}
      <div className="min-w-0 space-y-9 rounded-3xl border p-6 md:p-9" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        {groups.map((g, gi) => (
          <fieldset key={g.key}>
            <legend className={legend} style={{ color: "var(--muted)" }}>
              {stepNo(gi + 1)}
              {g.label}
              {g.multi ? <span className="normal-case tracking-normal opacity-70">(pick one or more)</span> : null}
            </legend>
            <div className="flex flex-wrap gap-2">
              {g.options.map((o) => {
                const on = sel[g.key]?.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={!!on}
                    onClick={() => toggle(g, o)}
                    className="rounded-full border px-4 py-2.5 text-[15px] font-semibold transition-transform active:scale-95"
                    style={on ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" } : { borderColor: "var(--line)", color: "var(--ink)" }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        {/* Date */}
        <fieldset className="min-w-0">
          <legend className={legend} style={{ color: "var(--muted)" }}>
            {stepNo(groups.length + 1)}
            Pick a date
          </legend>
          <div className="-mx-2 flex snap-x gap-2 overflow-x-auto px-2 pb-3" role="group" aria-label="Appointment date">
            {days.length
              ? days.map((d, i) => {
                  const on = date === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setDate(d.iso);
                        setTime("");
                        setDone(null);
                      }}
                      className="w-[4.4rem] shrink-0 snap-start rounded-2xl border px-2 py-3 text-center transition-transform active:scale-95"
                      style={on ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" } : { borderColor: "var(--line)", color: "var(--ink)" }}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">{i === 0 ? "Today" : d.wd}</span>
                      <span className="display block text-2xl font-semibold leading-tight">{d.day}</span>
                      <span className="block text-[11px] font-semibold uppercase opacity-70">{d.mon}</span>
                    </button>
                  );
                })
              : Array.from({ length: 7 }, (_, i) => <span key={i} className="h-[5.6rem] w-[4.4rem] shrink-0 rounded-2xl border" style={{ borderColor: "var(--line)" }} aria-hidden />)}
          </div>
          {date ? <p className="mt-1 text-sm font-semibold" style={{ color: "var(--accent)" }}>{longDate(date)}</p> : null}
        </fieldset>

        {/* Time */}
        <fieldset>
          <legend className={legend} style={{ color: "var(--muted)" }}>
            {stepNo(groups.length + 2)}
            {schedule.mode === "slots" ? "Pick a time" : "Pick a time window"}
          </legend>
          {!date ? (
            <p className="text-base" style={{ color: "var(--muted)" }}>Choose a date first.</p>
          ) : (
            <div className="space-y-5">
              {groupsOf.map((gname) => {
                const list = options.filter((o) => o.group === gname);
                if (!list.length) return null;
                return (
                  <div key={gname || "all"}>
                    {gname ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>{gname}</p> : null}
                    <div className={schedule.mode === "slots" ? "grid grid-cols-3 gap-2 sm:grid-cols-4" : "grid gap-2 sm:grid-cols-3"}>
                      {list.map((o) => {
                        const on = time === o.key;
                        return (
                          <button
                            key={o.key}
                            type="button"
                            disabled={o.off}
                            aria-pressed={on}
                            onClick={() => {
                              setTime(o.key);
                              setDone(null);
                            }}
                            className="rounded-xl border px-2 py-2.5 text-center text-[15px] font-semibold transition-transform active:scale-95 disabled:cursor-not-allowed disabled:line-through disabled:opacity-30"
                            style={on ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" } : { borderColor: "var(--line)", color: "var(--ink)" }}
                          >
                            {o.label}
                            {o.sub ? <span className="block text-xs font-medium opacity-75">{o.sub}</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <p className="text-xs" style={{ color: "var(--muted)" }}>{schedule.hint}</p>
            </div>
          )}
        </fieldset>
      </div>

      {/* Details / confirmation */}
      <div className="min-w-0 space-y-6 md:sticky md:top-24">
        <div className="rounded-3xl border p-6 md:p-8" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
          {!done ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Your {noun}</p>
              <ul className="mt-3 space-y-1.5 text-base">
                {groups.map((g) => (
                  <li key={g.key} className="flex justify-between gap-4">
                    <span style={{ color: "var(--muted)" }}>{g.label.replace(/\?$/, "")}</span>
                    <span className="text-right font-bold">{sel[g.key]?.length ? sel[g.key].join(", ") : "—"}</span>
                  </li>
                ))}
                <li className="flex justify-between gap-4">
                  <span style={{ color: "var(--muted)" }}>Date</span>
                  <span className="text-right font-bold">{date ? longDate(date) : "—"}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span style={{ color: "var(--muted)" }}>Time</span>
                  <span className="text-right font-bold">{time ? (schedule.mode === "slots" ? time12(time) : time) : "—"}</span>
                </li>
              </ul>
              <div className="mt-6 space-y-3">
                <input className={input} style={inputStyle} placeholder="Your name" value={customer} onChange={(e) => setCustomer(e.target.value)} autoComplete="off" />
                <input className={input} style={inputStyle} placeholder="Your phone number" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="off" />
                <input className={input} style={inputStyle} placeholder={askNote} value={note} onChange={(e) => setNote(e.target.value)} autoComplete="off" />
              </div>
              <button
                type="button"
                onClick={confirm}
                disabled={!ready}
                className={`btn mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40 ${upper}`}
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              >
                {cta}
              </button>
              <p className="mt-3 text-center text-xs" style={{ color: "var(--muted)" }}>{ready ? "Demo only: nothing is really sent." : missing}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Booking confirmed ✓</p>
              <p className="display mt-2 text-3xl font-semibold leading-tight">{longDate(done.date)}</p>
              <p className="display text-2xl" style={{ color: "var(--accent)" }}>{done.timeLabel}</p>
              <dl className="mt-4 space-y-1.5 text-base">
                <div className="flex justify-between gap-4"><dt style={{ color: "var(--muted)" }}>Booking no.</dt><dd className="font-bold">{done.ref}</dd></div>
                <div className="flex justify-between gap-4"><dt style={{ color: "var(--muted)" }}>For</dt><dd className="text-right font-bold">{done.name}</dd></div>
                <div className="flex justify-between gap-4"><dt style={{ color: "var(--muted)" }}>Service</dt><dd className="text-right font-bold">{done.service}</dd></div>
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => downloadIcs(done, place)} className="btn border !px-3 !py-3 text-sm" style={{ borderColor: "var(--ink)" }}>Add to calendar</button>
                <button type="button" onClick={() => cancel(done.id)} className="btn border !px-3 !py-3 text-sm" style={{ borderColor: "var(--line)" }}>Cancel booking</button>
              </div>

              <p className="mt-6 text-sm" style={{ color: "var(--muted)" }}>On your real website, {name} gets this on WhatsApp right away:</p>
              <div className="mt-3 rounded-2xl rounded-tl-sm p-4 text-[15px] leading-relaxed shadow-lg" style={{ background: "#DCF8C6", color: "#111" }}>
                <p className="font-bold">🔔 {bubbleTitle} {done.ref}</p>
                <p>👤 {done.name}{phone ? ` · ${phone}` : ""}</p>
                <p>📅 {longDate(done.date)} · {done.timeLabel}</p>
                <p>• {done.service}</p>
                {groups.slice(1).map((g) => (
                  <p key={g.key}>• {g.label.replace(/\?$/, "")}: {sel[g.key]?.join(", ")}</p>
                ))}
                {note ? <p className="mt-1">📝 {note}</p> : null}
                <p className="mt-2 text-right text-xs text-black/50">Now ✓✓</p>
              </div>
              <button type="button" onClick={() => setDone(null)} className="btn mt-5 w-full border" style={{ borderColor: "var(--line)" }}>
                Book another {noun}
              </button>
            </>
          )}
        </div>

        {bookings.length ? (
          <div className="rounded-3xl border p-6" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Your bookings on this device</p>
            <ul className="mt-3 divide-y" style={{ borderColor: "var(--line)" }}>
              {bookings.map((x) => (
                <li key={x.id} className="flex items-center justify-between gap-3 py-3" style={{ borderColor: "var(--line)" }}>
                  <span className="min-w-0 text-sm">
                    <span className="block font-bold">{parseDay(x.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} · {x.timeLabel}</span>
                    <span className="block truncate" style={{ color: "var(--muted)" }}>{x.service} · {x.ref}</span>
                  </span>
                  <button type="button" onClick={() => cancel(x.id)} className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold" style={{ borderColor: "var(--line)" }}>
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
