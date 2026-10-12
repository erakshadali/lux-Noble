"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Returns to the property list with the filters the visitor had set.
export default function BackLink() {
  const router = useRouter();
  return (
    <Link
      href="/lux-noble/properties"
      onClick={(e) => {
        e.preventDefault();
        let q = "";
        try { q = sessionStorage.getItem("ln-query") ?? ""; } catch {}
        router.push(`/lux-noble/properties${q ? `?${q}` : ""}`);
      }}
      className="text-sm text-white/60 hover:text-[var(--gold)]"
    >
      ← All properties
    </Link>
  );
}
