"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "ar";
const KEY = "ln-lang";
const subs = new Set<() => void>();

// The Arabic version is switched off for now: there is no toggle and the site is always English.
// To bring it back, return the saved language here and add <LangToggle /> to the header.
const ARABIC_ENABLED = false;

function read(): Lang {
  if (!ARABIC_ENABLED) return "en";
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "ar" || q === "en") localStorage.setItem(KEY, q);
    return localStorage.getItem(KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function setLang(l: Lang) {
  try { localStorage.setItem(KEY, l); } catch {}
  subs.forEach((f) => f());
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); window.addEventListener("storage", cb); return () => { subs.delete(cb); window.removeEventListener("storage", cb); }; },
    read,
    () => "en" as Lang,
  );
}

// Inline translation: <T en="Buy" ar="شراء" />
export function T({ en, ar }: { en: string; ar: string }) {
  return <>{useLang() === "ar" ? ar : en}</>;
}

// For attributes such as placeholders: const t = useT(); t("Search", "بحث")
export function useT() {
  const l = useLang();
  return (en: string, ar: string) => (l === "ar" ? ar : en);
}

// Wraps the whole site: sets direction, language and the Arabic font.
export function LangShell({ className, children }: { className: string; children: React.ReactNode }) {
  const l = useLang();
  return (
    <div dir={l === "ar" ? "rtl" : "ltr"} lang={l} className={`${className} ${l === "ar" ? "ln-ar" : ""}`}>
      {children}
    </div>
  );
}

export function LangToggle({ className = "" }: { className?: string }) {
  const l = useLang();
  return (
    <button
      onClick={() => setLang(l === "ar" ? "en" : "ar")}
      aria-label={l === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={`inline-flex h-10 items-center gap-1 rounded-full border border-[var(--gold)]/50 px-3 text-sm font-semibold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-black ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
      {l === "ar" ? "EN" : "عربي"}
    </button>
  );
}
