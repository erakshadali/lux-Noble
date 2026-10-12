export type Listing = {
  id: string;
  ref: string;
  purpose: "Buy" | "Rent";
  status: "Ready" | "Off-plan";
  type: "Apartment" | "Villa" | "Townhouse" | "Penthouse" | "Studio" | "Office";
  title: string;
  community: string;
  city: string;
  price: number; // AED. Rent is per year.
  beds: number; // 0 = studio
  baths: number;
  size: number; // sq ft
  furnished: boolean;
  description: string;
  amenities: string[];
  photos: string[];
  permit: string; // Dubai Trakheesi permit number
  agent: string;
  handover?: string; // off-plan only
  custom?: boolean; // added by the owner, not sample data
};

export const TYPES: Listing["type"][] = ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio", "Office"];

// One brokerage the site is shown for. `base` is the URL prefix of its pages, `ns` keeps its saved data apart.
export type Biz = {
  name: string;
  short: string;
  phone: string;
  tel: string;
  wa: string;
  address: string;
  lat: number;
  lon: number;
  base: string;
  ns: string;
};

export const LUX: Biz = {
  name: "Lux & Noble International Real Estate LLC",
  short: "Lux & Noble",
  phone: "+971 54 566 0141",
  tel: "+971545660141",
  wa: "971545660141",
  address: "502, Al Zarouni Business Center, Sheikh Zayed Road, Business Bay, Dubai",
  lat: 25.183189,
  lon: 55.272049,
  base: "/lux-noble",
  ns: "lux-noble",
};

export const aed = (n: number) => "AED " + Math.round(n).toLocaleString("en-US");
export const bedsLabel = (n: number) => (n === 0 ? "Studio" : `${n} bed${n > 1 ? "s" : ""}`);
