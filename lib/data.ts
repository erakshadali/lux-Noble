import raw from "@/data/businesses.json";
import type { ThemeKey } from "./themes";
import type { ProKind, ProSub } from "./pro";

export type Business = {
  slug: string;
  name: string;
  category: string;
  cuisines: string[];
  theme: ThemeKey;
  phone: string;
  tel: string;
  address: string;
  area: string;
  zip: string;
  lat: number;
  lon: number;
  email: string;
  social: string;
  look?: "dark";
  instagram?: string;
  city?: string;
  country?: string;
  rating?: number;
  reviews?: number;
  mapQuery?: string;
  // Professional-services batch (clinics, home services, salons, real estate): uses ProDemo instead of Demo.
  kind?: ProKind;
  sub?: ProSub;
  whatsapp?: boolean;
  facebook?: string;
  // Premium salon template (SalonSite). Pilot flag: set per business while the design is reviewed.
  premium?: boolean;
  batch?: number;
};

export const businesses = raw as Business[];

export function getBusiness(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug);
}

export function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
