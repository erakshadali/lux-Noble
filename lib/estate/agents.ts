import raw from "@/data/businesses.json";
import { LUX, type Biz } from "./types";
import type { Business } from "@/lib/data";

// The real estate agents of Dubai batch 12 get the full property site at /<slug>.
const all = raw as Business[];
const isAgent = (b: Business) => b.batch === 12 && b.kind === "estate";

export const agentSlugs = () => all.filter(isAgent).map((b) => b.slug);

export function getAgent(slug: string): Biz | null {
  const b = all.find((x) => x.slug === slug && isAgent(x));
  if (!b) return null;
  const digits = b.tel.replace(/D/g, "");
  return {
    name: b.name,
    short: b.name,
    phone: b.phone,
    tel: "+" + digits,
    wa: digits,
    address: b.address || [b.area, b.city].filter(Boolean).join(", "),
    lat: b.lat ?? LUX.lat,
    lon: b.lon ?? LUX.lon,
    base: "/" + b.slug,
    ns: b.slug,
  };
}
