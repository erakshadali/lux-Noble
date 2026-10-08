"use client";

import { useEffect, useState } from "react";
import rows from "@/data/emaillist.json";

const KEY = "onwebsite-mail-address-v1";

export default function MailList() {
  const [address, setAddress] = useState("");

  useEffect(() => {
    try {
      setAddress(localStorage.getItem(KEY) || "");
    } catch {}
  }, []);

  function save(v: string) {
    setAddress(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {}
  }

  const ready = address.trim().length > 8;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 14px 80px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      <header style={{ padding: "14px 0 10px", borderBottom: "1px solid #e5e5e5" }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Onwebsite: send emails</h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#555" }}>
          Type your postal address once. US law requires it at the bottom of business emails. Then tap a button: your email opens with everything filled in, and you press Send.
        </p>
      </header>

      <label style={{ display: "block", margin: "14px 0 4px", fontWeight: 700, fontSize: 14 }}>Your postal address (street, city, country)</label>
      <textarea
        value={address}
        onChange={(e) => save(e.target.value)}
        rows={2}
        placeholder="Example: House 12, Street name, City, State, PIN, India"
        style={{ width: "100%", boxSizing: "border-box", padding: 10, fontSize: 15, borderRadius: 8, border: "1px solid #ccc" }}
      />

      {rows.map((r) => {
        const subject = `A free sample website for ${r.name}`;
        const body = [
          "Hi,",
          "",
          `We're Onwebsite. We made a free sample website for ${r.name}: ${r.url}`,
          "",
          'Like it? Just reply to this email. Not interested? Reply "no" and we won\'t email again.',
          "",
          "Onwebsite",
          address.trim(),
        ].join("\n");
        const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(r.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const mailto = `mailto:${r.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const off: React.CSSProperties = ready ? {} : { opacity: 0.4, pointerEvents: "none" };
        return (
          <section key={r.email} style={{ padding: "14px 0", borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{r.name}</div>
            <div style={{ fontSize: 13, color: "#666", margin: "2px 0 8px" }}>{r.email}</div>
            {r.note ? <div style={{ fontSize: 13, background: "#fff4d6", padding: "6px 8px", borderRadius: 6, marginBottom: 8 }}>{r.note}</div> : null}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", ...off }}>
              <a href={gmail} target="_blank" rel="noopener noreferrer" style={{ background: "#1B7F3B", color: "#fff", padding: "12px 18px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>
                Open in Gmail
              </a>
              <a href={mailto} style={{ background: "#f2f2f2", color: "#111", padding: "12px 14px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                Open in mail app
              </a>
            </div>
          </section>
        );
      })}
      {!ready ? <p style={{ fontSize: 13, color: "#a33", marginTop: 12 }}>Type your address above to turn the buttons on.</p> : null}
    </main>
  );
}
