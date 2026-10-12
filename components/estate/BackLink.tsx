"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBiz } from "@/lib/estate/biz";
import { useT } from "@/lib/estate/lang";

// Returns to the property list with the filters the visitor had set.
export default function BackLink() {
  const router = useRouter();
  const t = useT();
  const { base } = useBiz();
  return (
    <Link
      href={`${base}/properties`}
      onClick={(e) => {
        e.preventDefault();
        let q = "";
        try { q = sessionStorage.getItem("ln-query") ?? ""; } catch {}
        router.push(`${base}/properties${q ? `?${q}` : ""}`);
      }}
      className="text-sm text-white/60 hover:text-[var(--gold)]"
    >
      {t("← All properties", "→ كل العقارات")}
    </Link>
  );
}
