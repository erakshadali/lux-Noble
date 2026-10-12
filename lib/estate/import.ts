import type { Listing } from "./types";
import { TYPES } from "./types";

const FALLBACK_PHOTOS = ["/img/pro/estate/1.jpg"];
const num = (v: unknown) => Number(String(v ?? "").replace(/[^0-9.]/g, "")) || 0;
let seq = 0;
const newId = () => `c-${Date.now().toString(36)}${(seq++).toString(36)}`;

// Maps one loose record (CSV row or XML <property>) to a Listing. Header names follow the
// common Property Finder / Bayut export names, so a real CRM export mostly works as it is.
export function toListing(r: Record<string, string>): Listing | null {
  const g = (...keys: string[]) => {
    for (const k of keys) { const v = r[k.toLowerCase()]; if (v) return v.trim(); }
    return "";
  };
  const title = g("title", "title_en", "name");
  const price = num(g("price", "price_aed"));
  if (!title || !price) return null;
  const offering = g("purpose", "offering_type", "listing_type", "category").toLowerCase();
  const purpose = /rent|^r[sc]?$/.test(offering) ? "Rent" : "Buy";
  const typeRaw = g("type", "property_type", "unit_type").toLowerCase();
  const type = TYPES.find((t) => typeRaw.includes(t.toLowerCase())) ?? "Apartment";
  const bedsRaw = g("beds", "bedrooms", "bedroom");
  const photos = g("photos", "photo", "photo_url", "image", "images").split(/[|,;\s]+/).filter((u) => /^https?:\/\//.test(u));
  const status = /off.?plan|under.?construction/i.test(g("status", "completion_status")) ? "Off-plan" : "Ready";
  const ref = g("ref", "reference_number", "reference") || `LN-${Math.floor(Math.random() * 9000 + 1000)}`;
  return {
    id: newId(),
    ref,
    purpose,
    status,
    type,
    title,
    community: g("community", "sub_community", "area", "location"),
    city: g("city", "emirate") || "Dubai",
    price,
    beds: /studio/i.test(bedsRaw) ? 0 : num(bedsRaw),
    baths: num(g("baths", "bathrooms", "bathroom")),
    size: num(g("size", "area_sqft", "sqft", "builtup_area")),
    furnished: /^(yes|y|true|1|furnished)$/i.test(g("furnished", "furnishing")),
    description: g("description", "description_en", "desc"),
    amenities: g("amenities", "features").split(/[|;,]+/).map((s) => s.trim()).filter(Boolean),
    photos: photos.length ? photos : FALLBACK_PHOTOS,
    permit: g("permit", "permit_number", "trakheesi", "rera_permit"),
    agent: g("agent", "agent_name", "listing_agent") || "Sales team",
    handover: g("handover", "completion_date") || undefined,
    custom: true,
  };
}

function splitCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === "," || c === "\t") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}

export function parseCsv(text: string): Listing[] {
  const rows = splitCsv(text);
  if (rows.length < 2) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).flatMap((cells) => {
    const rec: Record<string, string> = {};
    head.forEach((h, i) => { rec[h] = cells[i] ?? ""; });
    const l = toListing(rec);
    return l ? [l] : [];
  });
}

export function parseXml(text: string): Listing[] {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.querySelector("parsererror")) return [];
  const nodes = Array.from(doc.querySelectorAll("property, listing, Property, Listing"));
  return nodes.flatMap((n) => {
    const rec: Record<string, string> = {};
    for (const child of Array.from(n.children)) {
      const key = child.tagName.toLowerCase();
      if (key === "photo" || key === "images" || key === "photos") {
        const urls = Array.from(child.querySelectorAll("url, image")).map((u) => u.textContent?.trim() ?? "");
        rec.photos = (urls.length ? urls : [child.textContent?.trim() ?? ""]).join("|");
      } else rec[key] = child.textContent?.trim() ?? "";
    }
    const l = toListing(rec);
    return l ? [l] : [];
  });
}

export function parseAny(text: string): Listing[] {
  return text.trimStart().startsWith("<") ? parseXml(text) : parseCsv(text);
}

export const CSV_TEMPLATE =
  "title,purpose,type,community,city,price,beds,baths,size,furnished,status,permit,agent,description,photos\n" +
  '"2 bed in Business Bay",Buy,Apartment,Business Bay,Dubai,1750000,2,2,1200,no,Ready,1234567890,Your Agent,"Lovely canal view apartment.",https://example.com/photo1.jpg|https://example.com/photo2.jpg\n';
