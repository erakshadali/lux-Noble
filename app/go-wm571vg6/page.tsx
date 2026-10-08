"use client";

import { useEffect, useState } from "react";
import rows from "@/data/outreach.json";

type Mark = "sent" | "none";
const KEY = "onwebsite-tap-list-v2";

// Always open the WhatsApp Business account, not the personal one:
// Android: force the Business app; computer: WhatsApp Web (logged in as Business).
function sendLink(device: string, phone: string, text: string) {
  const t = encodeURIComponent(text);
  if (device === "android") return `intent://send?phone=${phone}&text=${t}#Intent;scheme=whatsapp;package=com.whatsapp.w4b;end`;
  if (device === "ios") return `https://wa.me/${phone}?text=${t}`;
  return `https://web.whatsapp.com/send?phone=${phone}&text=${t}`;
}

export default function TapList() {
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const [hideDone, setHideDone] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);
  const [device, setDevice] = useState<"android" | "ios" | "computer">("computer");

  useEffect(() => {
    const ua = navigator.userAgent;
    setDevice(/Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : "computer");
    try {
      setMarks(JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch {}
  }, []);

  function mark(n: number, m: Mark | null) {
    const next = { ...marks };
    if (m) next[n] = m;
    else delete next[n];
    setMarks(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }

  async function copy(n: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(n);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  const done = Object.keys(marks).length;
  const sent = Object.values(marks).filter((m) => m === "sent").length;
  const list = rows.filter((r) => !(hideDone && marks[r.n]));

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 14px 60px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      <header style={{ position: "sticky", top: 0, background: "#fff", padding: "14px 0 10px", borderBottom: "1px solid #e5e5e5", zIndex: 5 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Onwebsite: tap to send</h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#555" }}>
          {done} of {rows.length} done &middot; {sent} sent. Tap <b>Send</b>, press send in WhatsApp, come back, tap <b>Sent</b>. If WhatsApp says the number
          isn&apos;t on WhatsApp, tap <b>No WhatsApp</b>.
        </p>
        <label style={{ fontSize: 14, display: "inline-flex", gap: 8, marginTop: 8 }}>
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} /> Hide finished
        </label>
      </header>

      {list.map((r) => (
        <section key={r.n} style={{ padding: "14px 0", borderBottom: "1px solid #eee", opacity: marks[r.n] ? 0.55 : 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{r.name}</div>
          <div style={{ fontSize: 13, color: "#666", margin: "2px 0 8px" }}>{r.display}</div>
          {r.check ? (
            <div style={{ fontSize: 13, background: "#fff4d6", padding: "6px 8px", borderRadius: 6, marginBottom: 8 }}>
              Maybe already sent. Open the chat first and check.
            </div>
          ) : null}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={sendLink(device, r.phone, r.text)}
              target={device === "computer" ? "onwebsite-wa" : "_blank"}
              rel="noopener noreferrer"
              style={{ background: "#1B7F3B", color: "#fff", padding: "12px 18px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}
            >
              Send on WhatsApp
            </a>
            <button onClick={() => mark(r.n, "sent")} style={btn(marks[r.n] === "sent")}>Sent</button>
            <button onClick={() => mark(r.n, "none")} style={btn(marks[r.n] === "none")}>No WhatsApp</button>
            {marks[r.n] ? <button onClick={() => mark(r.n, null)} style={btn(false)}>Undo</button> : null}
            <button onClick={() => copy(r.n, r.text)} style={btn(false)}>{copied === r.n ? "Copied" : "Copy message"}</button>
          </div>
        </section>
      ))}

      {list.length === 0 ? <p style={{ padding: 24, textAlign: "center" }}>All done. Nice work.</p> : null}
    </main>
  );
}

function btn(active: boolean): React.CSSProperties {
  return {
    background: active ? "#111" : "#f2f2f2",
    color: active ? "#fff" : "#111",
    border: "none",
    padding: "12px 14px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
  };
}
