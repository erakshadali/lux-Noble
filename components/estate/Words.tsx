"use client";

import { useLang } from "@/lib/estate/lang";

// Headline that rises in word by word, in the visitor's language.
export default function Words({ en, ar, start, gold = false }: { en: string; ar: string; start: number; gold?: boolean }) {
  const text = useLang() === "ar" ? ar : en;
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={text + i} className="ln-word me-[0.25em]">
          <span className={gold ? "ln-gold-text" : ""} style={{ ["--w" as string]: `${start + i * 110}ms` }}>{w}</span>
        </span>
      ))}
    </>
  );
}
