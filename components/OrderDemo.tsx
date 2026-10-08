"use client";

import { useState } from "react";

// Online ordering demo: customers build an order from the sample menu, choose
// pickup or delivery, and place it. Because this is a demo, nothing is sent:
// we show the order exactly as it would arrive on the owner's WhatsApp.
export default function OrderDemo({ name, items, upper }: { name: string; items: string[]; upper: string }) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"Pickup" | "Delivery">("Pickup");
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [placed, setPlaced] = useState<{ id: number; time: string } | null>(null);

  const lines = items.filter((i) => qty[i]).map((i) => ({ item: i, n: qty[i] }));
  const count = lines.reduce((s, l) => s + l.n, 0);
  const change = (item: string, d: number) => {
    setPlaced(null);
    setQty((q) => ({ ...q, [item]: Math.max(0, Math.min(20, (q[item] ?? 0) + d)) }));
  };

  function place() {
    if (!count) return;
    setPlaced({
      id: 1000 + Math.floor(Math.random() * 9000),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    });
  }

  const input = "w-full rounded-xl border bg-transparent px-4 py-3 text-base outline-none focus:ring-2";
  const inputStyle = { borderColor: "var(--line)", color: "var(--ink)", ["--tw-ring-color" as string]: "var(--accent)" };

  return (
    <div className="grid items-start gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
      {/* Pick items */}
      <ul className="rounded-3xl border p-2 md:p-3" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        {items.map((item) => {
          const n = qty[item] ?? 0;
          return (
            <li key={item} className="flex items-center justify-between gap-4 rounded-2xl px-4 py-4" style={n ? { background: "color-mix(in srgb, var(--accent) 12%, transparent)" } : undefined}>
              <span className={`display text-xl md:text-2xl ${upper}`}>{item}</span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={`Remove one ${item}`}
                  onClick={() => change(item, -1)}
                  disabled={!n}
                  className="grid h-10 w-10 place-items-center rounded-full border text-xl font-bold disabled:opacity-30"
                  style={{ borderColor: "var(--line)" }}
                >
                  −
                </button>
                <span className="w-6 text-center text-lg font-bold tabular-nums" aria-live="polite">{n}</span>
                <button
                  type="button"
                  aria-label={`Add one ${item}`}
                  onClick={() => change(item, 1)}
                  className="grid h-10 w-10 place-items-center rounded-full text-xl font-bold"
                  style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Checkout / order received */}
      <div className="rounded-3xl border p-6 md:sticky md:top-24 md:p-8" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        {!placed ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Your order</p>
            {lines.length ? (
              <ul className="mt-3 space-y-1.5">
                {lines.map((l) => (
                  <li key={l.item} className="flex justify-between gap-4 text-base">
                    <span>{l.item}</span>
                    <span className="font-bold tabular-nums">× {l.n}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>Tap + to add dishes.</p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-full border p-1" style={{ borderColor: "var(--line)" }} role="radiogroup" aria-label="Pickup or delivery">
              {(["Pickup", "Delivery"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className="rounded-full py-2.5 text-sm font-bold"
                  style={mode === m ? { background: "var(--ink)", color: "var(--bg)" } : undefined}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <input className={input} style={inputStyle} placeholder="Your name" value={customer} onChange={(e) => setCustomer(e.target.value)} />
              {mode === "Delivery" ? (
                <input className={input} style={inputStyle} placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
              ) : null}
              <input className={input} style={inputStyle} placeholder="Note (e.g. less spicy)" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <button
              type="button"
              onClick={place}
              disabled={!count}
              className="btn mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Place order{count ? ` · ${count} item${count > 1 ? "s" : ""}` : ""}
            </button>
            <p className="mt-3 text-center text-xs" style={{ color: "var(--muted)" }}>Demo only: no real order is sent.</p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Order placed ✓</p>
            <p className="mt-2 text-base" style={{ color: "var(--muted)" }}>On your real website, {name} gets this on WhatsApp right away:</p>
            <div className="mt-4 rounded-2xl rounded-tl-sm p-4 text-[15px] leading-relaxed shadow-lg" style={{ background: "#DCF8C6", color: "#111" }}>
              <p className="font-bold">🛎️ New order #{placed.id}</p>
              <p>{mode}{customer ? ` · ${customer}` : ""}</p>
              {mode === "Delivery" && address ? <p>📍 {address}</p> : null}
              <ul className="mt-2">
                {lines.map((l) => (
                  <li key={l.item}>• {l.n} × {l.item}</li>
                ))}
              </ul>
              {note ? <p className="mt-2">📝 {note}</p> : null}
              <p className="mt-2 text-right text-xs text-black/50">{placed.time} ✓✓</p>
            </div>
            <button type="button" onClick={() => setPlaced(null)} className="btn mt-6 w-full border" style={{ borderColor: "var(--line)" }}>
              Change order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
