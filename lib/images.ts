import raw from "@/data/images.json";
import type { Business } from "./data";

export type Photo = {
  file: string;
  title: string;
  artist: string;
  license: string;
  page: string;
  source: string;
};

const library = raw as Record<string, Photo[]>;

// First matching rule wins. Matched against the business's cuisine text.
const rules: [string, RegExp][] = [
  ["seafood", /seafood|fish|oyster|lobster|shrimp/],
  ["caribbean", /caribbean|haitian|jamaican|jerk|trinidad/],
  ["chinese", /chinese|noodle|dim sum|hot pot|dumpling|szechuan|sichuan|cantonese|hunan/],
  ["japanese", /japanese|sushi|ramen|korean|izakaya|omakase|teriyaki|hibachi/],
  ["asian", /thai|vietnamese|filipino|burmese|tibetan|asian|malaysian|taiwanese|indonesian|nepali/],
  ["latin", /mexican|dominican|colombian|ecuadorian|peruvian|salvadoran|guatemalan|latin|cuban|honduran|taco|puerto|venezuelan|spanish/],
  ["italian", /pizza|italian|pasta|french|european/],
  ["spice", /kerala|punjabi|iraqi|arabic|indian|middle eastern|mediterranean|kebab|israeli|georgian|halal|pakistani|turkish|afghan|lebanese|greek|bangladeshi|persian/],
  ["bakery", /bagel|bakery|pastry|dessert|cake/],
  ["cafe", /coffee|tea|juice|cafe|smoothie|cafeteria|karak/],
  ["diner", /american|diner|burger|deli|grill|chicken|sandwich|breakfast|bbq|steak|wings/],
];

const byTheme: Record<string, string> = {
  cafe: "cafe",
  asian: "asian",
  latin: "latin",
  italian: "italian",
  diner: "diner",
  spice: "spice",
  modern: "interior",
};

export function groupFor(b: Business): string {
  const text = b.cuisines.join(" ");
  for (const [g, re] of rules) if (re.test(text) && library[g]?.length) return g;
  const g = byTheme[b.theme];
  if (library[g]?.length) return g;
  return "";
}

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export type BusinessPhotos = {
  hero: Photo;
  about: Photo;
  menu: Photo;
  ring: Photo[];
  credits: Photo[];
};

// Same photo set per cuisine, but every business starts at a different photo,
// so neighbouring sites do not look identical.
export function photosFor(b: Business): BusinessPhotos | null {
  const list = library[groupFor(b)];
  if (!list?.length) return null;
  const n = list.length;
  const off = hash(b.slug) % n;
  const at = (i: number) => list[(off + i) % n];
  const ring = Array.from({ length: Math.min(8, n) }, (_, i) => at(3 + i));
  const all = [at(0), at(1), at(2), ...ring];
  const credits = all.filter((p, i) => all.findIndex((q) => q.file === p.file) === i);
  return { hero: at(0), about: at(1), menu: at(2), ring, credits };
}
