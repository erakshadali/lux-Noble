"use client";

import { useEffect, useState } from "react";
import rows from "@/data/calllist.json";

type Outcome = "interested" | "noanswer" | "no" | "callback";
const CALL_KEY = "onwebsite-call-list-v1";
const TAP_KEY = "onwebsite-tap-list-v1"; // marks made on the tap-to-send page

const LABEL: Record<Outcome, string> = {
  interested: "Interested",
  noanswer: "No answer",
  no: "Not interested",
  callback: "Call back",
};

export default function CallList() {
  const [out, setOut] = useState<Record<number, Outcome>>({});
  const [tap, setTap] = useState<Record<number, string>>({});
  const [showAll, setShowAll] = useState(false);
  const [hideDone, setHideDone] = useState(true);

  useEffect(() => {
    try {
      setOut(JSON.parse(localStorage.getItem(CALL_KEY) || "{}"));
      setTap(JSON.parse(localStorage.getItem(TAP_KEY) || "{}"));
    } catch {}
  }, []);

  function set(n: number, o: Outcome | null) {
    const next = { ...out };
    if (o) next[n] = o;
    else delete next[n];
    setOut(next);
    try {
      localStorage.setItem(CALL_KEY, JSON.stringify(next));
    } catch {}
  }

  // Show: numbers known to have no WhatsApp + ones you marked "No WhatsApp" on the tap page (or everyone).
  const list = rows.filter((r) => (showAll || r.known || tap[r.n] === "none") && !(hideDone && out[r.n] && out[r.n] !== "callback" && out[r.n] !== "noanswer"));
  const done = Object.keys(out).length;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 14px 80px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      <header style={{ position: "sticky", top: 0, background: "#fff", padding: "14px 0 10px", borderBottom: "1px solid #e5e5e5", zIndex: 5 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Onwebsite: call list</h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#555" }}>
          {list.length} shown &middot; {done} called. Best time to call New York restaurants: <b>2:30 to 4:30 PM New York time</b> (between lunch and dinner).
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8, fontSize: 14 }}>
          <label><input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} /> Hide finished</label>
          <label><input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> Show all businesses</label>
        </div>
      </header>

      <details open style={{ background: "#f6f6f6", borderRadius: 10, padding: "10px 12px", margin: "12px 0", fontSize: 15, lineHeight: 1.5 }}>
        <summary style={{ fontWeight: 700, cursor: "pointer" }}>Call script (short)</summary>
        <p><b>Say:</b> &ldquo;Hello, is this [Business]? I&apos;m [your name] from Onwebsite. We build websites for restaurants and cafes. I noticed you don&apos;t have a website, so I made a <b>free sample</b> for you. Can I send you the link? WhatsApp, text, or email?&rdquo;</p>
        <p><b>If yes:</b> get the best WhatsApp number, text number or email, then send the link from the button below. Say thank you.</p>
        <p><b>If no:</b> &ldquo;No problem, thank you, have a nice day.&rdquo; Tap <b>Not interested</b>. Do not call again.</p>
        <p><b>Only text or email people who said yes on the call.</b> Texting strangers with no permission is against US law.</p>
      </details>

      {list.map((r) => {
        const msg = `Hi! We're Onwebsite. Here is the free sample website we made for ${r.name}: ${r.url}\nThank you for talking with us.`;
        return (
          <section key={r.n} style={{ padding: "14px 0", borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{r.name}</div>
            <div style={{ fontSize: 13, color: "#666", margin: "2px 0 8px" }}>
              {r.display} &middot; <a href={r.url} target="_blank" rel="noopener noreferrer">their demo site</a>
              {out[r.n] ? <b style={{ marginLeft: 8, color: "#1B7F3B" }}>{LABEL[out[r.n]]}</b> : null}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={`tel:+${r.phone}`} style={{ background: "#1B7F3B", color: "#fff", padding: "12px 18px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>Call</a>
              <a href={`sms:+${r.phone}?&body=${encodeURIComponent(msg)}`} style={pill}>Text the link</a>
              {(Object.keys(LABEL) as Outcome[]).map((o) => (
                <button key={o} onClick={() => set(r.n, out[r.n] === o ? null : o)} style={btn(out[r.n] === o)}>{LABEL[o]}</button>
              ))}
            </div>
          </section>
        );
      })}

      {list.length === 0 ? <p style={{ padding: 24, textAlign: "center" }}>Nothing to call right now. Tick &ldquo;Show all businesses&rdquo; or finish the tap-to-send list first.</p> : null}
    </main>
  );
}

const pill: React.CSSProperties = { background: "#f2f2f2", color: "#111", padding: "12px 14px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" };

function btn(active: boolean): React.CSSProperties {
  return { background: active ? "#111" : "#f2f2f2", color: active ? "#fff" : "#111", border: "none", padding: "12px 14px", borderRadius: 10, fontWeight: 600, fontSize: 14 };
}
