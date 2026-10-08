// Fetches free-license photos per cuisine group into public/img/<group>/N.jpg and
// records credits in data/images.json.
//   node scripts/fetch-images.mjs                 -> all groups (Pexels if PEXELS_API_KEY is set, else Wikimedia Commons)
//   node scripts/fetch-images.mjs cafe italian    -> only those groups
// Never scrapes Google. Every image is CC0 / public domain / CC BY / CC BY-SA (Commons) or Pexels-licensed.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "img");
const META = path.join(ROOT, "data", "images.json");
const PER_GROUP = 10;
const UA = "onwebsite-demos/1.0 (demo website builder)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const GROUPS = {
  chinese: ["dumplings", "fried rice", "lo mein noodles", "hot pot", "chinese cuisine dish"],
  japanese: ["sushi", "ramen", "sashimi", "tempura"],
  asian: ["pad thai", "pho noodle soup", "thai curry", "banh mi", "bibimbap"],
  latin: ["tacos", "empanadas", "ceviche", "arepas", "quesadilla", "mexican food"],
  italian: ["pizza", "spaghetti pasta", "lasagna", "bruschetta"],
  cafe: ["latte art", "espresso", "cappuccino", "cold brew iced coffee", "coffee cup cafe"],
  bakery: ["croissant", "bagel cream cheese", "pastry", "muffin", "cake slice"],
  diner: ["hamburger", "pancakes", "club sandwich", "french fries", "breakfast plate eggs"],
  spice: ["kebab", "hummus", "falafel", "biryani", "shawarma", "naan bread"],
  seafood: ["fried shrimp", "grilled fish", "lobster roll", "oysters"],
  caribbean: ["jerk chicken", "fried plantains", "oxtail stew", "rice and beans"],
  interior: ["restaurant interior", "cafe interior", "dining room restaurant"],
};

const BAD_TITLE = /menu|sign\b|logo|map\b|flag|poster|drawing|painting|illustration|stamp|book|cover|diagram|scan|street|market|stall|truck|vending|festival|crowd|portrait|recipe|package|packaging|label|shop front|storefront|tourist|museum|statue/i;
const BAD_TITLE_INTERIOR = /menu|sign\b|logo|map\b|flag|poster|drawing|painting|illustration|stamp|book|cover|diagram|scan|plan\b|floor plan|exterior|facade|crowd|portrait/i;
const OK_LIC = /^(CC0|Public domain|PD|CC BY(?!-NC)(?!-ND)|CC BY-SA)/i;

async function json(url, headers = {}) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
    const t = await r.text();
    if (r.ok && !/^You are making too many requests/i.test(t)) return JSON.parse(t);
    await sleep(3000 * (attempt + 1));
  }
  throw new Error("request failed: " + url);
}

async function commonsSearch(term, group) {
  const q = `${term} filetype:bitmap`;
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}` +
    `&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1920&format=json&origin=*`;
  const j = await json(url);
  const bad = group === "interior" ? BAD_TITLE_INTERIOR : BAD_TITLE;
  return Object.values(j.query?.pages ?? {})
    .sort((a, b) => a.index - b.index)
    .map((p) => {
      const ii = p.imageinfo?.[0];
      const md = ii?.extmetadata ?? {};
      return {
        title: p.title.replace(/^File:/, ""),
        w: ii?.width,
        h: ii?.height,
        mime: ii?.mime,
        license: md.LicenseShortName?.value ?? "",
        thumb: ii?.thumburl,
        page: ii?.descriptionurl,
        artist: (md.Artist?.value ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 60) || "Wikimedia Commons contributor",
        source: "Wikimedia Commons",
      };
    })
    .filter((c) => c.mime === "image/jpeg" && c.w >= 1800 && c.h >= 1100 && c.w / c.h >= 1.15 && c.w / c.h <= 2.1 && OK_LIC.test(c.license) && !bad.test(c.title));
}

async function pexelsSearch(term, key) {
  const j = await json(`https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&orientation=landscape&size=large&per_page=20`, { Authorization: key });
  return (j.photos ?? []).map((p) => ({
    title: p.alt || term, w: p.width, h: p.height, license: "Pexels License", thumb: p.src.large2x, page: p.url,
    artist: p.photographer, source: "Pexels",
  }));
}

const wanted = process.argv.slice(2);
const groups = Object.keys(GROUPS).filter((g) => !wanted.length || wanted.includes(g));
const key = process.env.PEXELS_API_KEY;
const meta = fs.existsSync(META) ? JSON.parse(fs.readFileSync(META, "utf8")) : {};

for (const group of groups) {
  const seen = new Set();
  const picked = [];
  // round-robin across the group's search terms so a group is not ten pictures of one dish
  const lists = [];
  for (const term of GROUPS[group]) {
    lists.push(key ? await pexelsSearch(term, key) : await commonsSearch(term, group));
    await sleep(1500);
  }
  for (let i = 0; picked.length < PER_GROUP && lists.some((l) => l.length > i); i++) {
    for (const l of lists) {
      const c = l[i];
      if (c && !seen.has(c.title) && picked.length < PER_GROUP) { seen.add(c.title); picked.push(c); }
    }
  }
  fs.rmSync(path.join(OUT, group), { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, group), { recursive: true });
  meta[group] = [];
  for (const [i, c] of picked.entries()) {
    try {
      let buf;
      for (let a = 0; a < 4 && !buf; a++) {
        const r = await fetch(c.thumb, { headers: { "User-Agent": UA } });
        if (r.ok) buf = Buffer.from(await r.arrayBuffer()); else await sleep(2500 * (a + 1));
      }
      if (!buf) throw new Error("download failed");
      const file = `${i + 1}.jpg`;
      await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(OUT, group, file));
      meta[group].push({ file: `/img/${group}/${file}`, title: c.title, artist: c.artist, license: c.license, page: c.page, source: c.source });
      await sleep(600);
    } catch (e) {
      console.log(`  skip ${c.title}: ${e.message}`);
    }
  }
  console.log(`${group}: ${meta[group].length}/${PER_GROUP} images`);
  fs.mkdirSync(path.dirname(META), { recursive: true });
  fs.writeFileSync(META, JSON.stringify(meta, null, 1));
}
