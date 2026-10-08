// Content for the premium salon template (components/SalonSite.tsx). Prices and services are SAMPLES:
// the real list comes from the salon when they say yes.
import type { ProSub } from "./pro";

export type Item = { id: string; name: string; desc: string; mins: number; price: number };
export type Category = { key: string; label: string; items: Item[] };

export type Palette = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  onAccent: string;
  accent2: string;
  dark: string; // hero + dark sections
  dark2: string;
};

const it = (id: string, name: string, desc: string, mins: number, price: number): Item => ({ id, name, desc, mins, price });

const LADIES: Category[] = [
  {
    key: "hair",
    label: "Hair",
    items: [
      it("cut", "Cut & blow-dry", "Consultation, wash, cut and a salon finish.", 60, 120),
      it("blow", "Blow-dry & styling", "Smooth, curls or waves for any day.", 45, 70),
      it("colour", "Full colour", "Root to tip, with a gloss finish.", 120, 280),
      it("highlights", "Highlights & balayage", "Soft, natural sun-kissed colour.", 180, 450),
      it("keratin", "Keratin smoothing", "Frizz-free, shiny hair for weeks.", 150, 400),
      it("treatment", "Deep hair treatment", "Repair and shine for tired hair.", 45, 110),
    ],
  },
  {
    key: "nails",
    label: "Nails",
    items: [
      it("mani", "Classic manicure", "Shape, cuticle care and polish.", 40, 60),
      it("pedi", "Classic pedicure", "Soak, scrub, massage and polish.", 50, 80),
      it("gel", "Gel polish", "Chip-free colour that lasts.", 45, 90),
      it("combo", "Mani + pedi", "The full treat for hands and feet.", 90, 130),
    ],
  },
  {
    key: "skin",
    label: "Skin & brows",
    items: [
      it("facial", "Glow facial", "Deep cleanse, mask and massage.", 60, 180),
      it("brow", "Brow shaping", "Threading or wax, shaped to your face.", 20, 30),
      it("threading", "Face threading", "Quick, gentle and clean.", 20, 40),
      it("wax", "Full body wax", "Smooth skin, gentle products.", 75, 220),
    ],
  },
  {
    key: "bridal",
    label: "Bridal & party",
    items: [
      it("makeup", "Party makeup", "Full face for dinners and events.", 60, 250),
      it("bridal", "Bridal makeup & hair", "Trial included. The full look.", 180, 900),
      it("henna", "Henna design", "Simple to detailed, hands or feet.", 60, 120),
    ],
  },
];

const GENTS: Category[] = [
  {
    key: "hair",
    label: "Hair",
    items: [
      it("cut", "Haircut", "Clean cut, finished with styling.", 30, 40),
      it("fade", "Skin fade", "Sharp fade, lined up.", 40, 55),
      it("kids", "Kids cut", "Patient and quick, under 12.", 25, 30),
      it("colour", "Hair colour", "Grey cover or a fresh colour.", 60, 120),
    ],
  },
  {
    key: "beard",
    label: "Beard & shave",
    items: [
      it("beard", "Beard trim & shape", "Lined up with a hot towel.", 20, 30),
      it("shave", "Hot towel shave", "The classic straight-razor shave.", 30, 50),
      it("combo", "Haircut + beard", "The full grooming package.", 50, 65),
    ],
  },
  {
    key: "care",
    label: "Care",
    items: [
      it("facial", "Cleansing facial", "Deep clean and mask for men.", 40, 90),
      it("threading", "Face threading", "Brows and face, quick and clean.", 15, 25),
      it("massage", "Head & shoulder massage", "Ten minutes to switch off.", 20, 40),
    ],
  },
];

const SPA: Category[] = [
  {
    key: "massage",
    label: "Massage",
    items: [
      it("relax", "Relaxing massage", "Slow, flowing pressure to unwind.", 60, 220),
      it("deep", "Deep tissue", "Targeted work on tight muscles.", 60, 250),
      it("hot", "Hot stone massage", "Warm stones for deep calm.", 75, 300),
      it("foot", "Foot reflexology", "Pressure points for tired feet.", 30, 110),
    ],
  },
  {
    key: "skin",
    label: "Skin",
    items: [
      it("facial", "Glow facial", "Cleanse, exfoliate, mask and massage.", 60, 200),
      it("hydra", "Hydrating facial", "Moisture boost for dry skin.", 75, 280),
      it("scrub", "Body scrub", "Soft, smooth skin all over.", 45, 180),
    ],
  },
  {
    key: "nails",
    label: "Nails & hands",
    items: [
      it("mani", "Spa manicure", "Soak, scrub, mask and polish.", 45, 80),
      it("pedi", "Spa pedicure", "A real treat for your feet.", 60, 100),
      it("gel", "Gel polish", "Chip-free colour.", 45, 90),
    ],
  },
  {
    key: "packages",
    label: "Packages",
    items: [
      it("pamper", "Pamper package", "Massage, facial and mani-pedi.", 180, 520),
      it("couple", "Couple's retreat", "Side-by-side massage for two.", 90, 480),
    ],
  },
];

export const catalogFor = (sub: ProSub | undefined): Category[] => (sub === "gents" ? GENTS : sub === "spa" ? SPA : LADIES);

// unisex gets the ladies menu plus the gents grooming cut so both audiences are covered.
export const catalogForSub = (sub: ProSub | undefined): Category[] => {
  if (sub === "unisex") {
    return [
      { key: "hair", label: "Hair", items: [...LADIES[0].items.slice(0, 3), GENTS[0].items[0], GENTS[0].items[1]] },
      GENTS[1],
      LADIES[1],
      LADIES[2],
    ];
  }
  return catalogFor(sub);
};

export const palettes: Record<string, Palette> = {
  ladies: { bg: "#FBF6F2", surface: "#FFFFFF", ink: "#22151B", muted: "#76656D", line: "#EADFD8", accent: "#B8325F", onAccent: "#FFFFFF", accent2: "#E9B872", dark: "#1D0F18", dark2: "#3A1230" },
  unisex: { bg: "#F8F4FA", surface: "#FFFFFF", ink: "#1E1426", muted: "#6E6378", line: "#E5DDEC", accent: "#7A3DB5", onAccent: "#FFFFFF", accent2: "#F0C77A", dark: "#150C20", dark2: "#2E1450" },
  gents: { bg: "#F5F3EE", surface: "#FFFFFF", ink: "#16181B", muted: "#686B70", line: "#E1DED6", accent: "#C99A3B", onAccent: "#17130A", accent2: "#E8CB8A", dark: "#101214", dark2: "#242A30" },
  spa: { bg: "#F3F7F3", surface: "#FFFFFF", ink: "#14231F", muted: "#5F726C", line: "#DCE7E1", accent: "#2F8F7E", onAccent: "#FFFFFF", accent2: "#E3C58C", dark: "#0D1F1C", dark2: "#17443B" },
};

export const copyFor: Record<string, { tag: string; headline: string; lede: string; why: [string, string][] }> = {
  ladies: {
    tag: "Ladies salon",
    headline: "Look good. Feel even better.",
    lede: "Hair, nails, skin and bridal in one calm, friendly place. Pick your treatments and book your time in under a minute.",
    why: [
      ["Book in seconds", "Choose services, a day and a time. No long chats."],
      ["Premium products", "Gentle, salon-grade colour and care."],
      ["Relaxed and clean", "A calm space where you can switch off."],
    ],
  },
  unisex: {
    tag: "Hair & beauty salon",
    headline: "One salon for the whole family.",
    lede: "Cuts, colour, grooming and beauty for everyone. Pick your treatments and book your time in under a minute.",
    why: [
      ["Book in seconds", "Choose services, a day and a time. No long chats."],
      ["For everyone", "Ladies, gents and kids all welcome."],
      ["Skilled stylists", "Sharp cuts and clean finishes, every time."],
    ],
  },
  gents: {
    tag: "Gents salon",
    headline: "Sharp cuts. Clean shaves.",
    lede: "Walk in a regular, walk out sharp. Pick your cut and book your time in under a minute.",
    why: [
      ["Book in seconds", "Choose your cut, a day and a time. No waiting around."],
      ["Precision work", "Fades, lines and beards done right."],
      ["Hot towel finish", "The proper old-school touch."],
    ],
  },
  spa: {
    tag: "Spa & wellness",
    headline: "Slow down. You deserve it.",
    lede: "Massage, skin and nail treatments in a quiet space. Pick your treatments and book your time in under a minute.",
    why: [
      ["Book in seconds", "Choose a treatment, a day and a time."],
      ["Calm and private", "A quiet room, soft light, no rush."],
      ["Trained therapists", "Gentle hands and the right pressure."],
    ],
  },
};

export const FAQ: [string, string][] = [
  ["Do I need to book?", "Booking is the easiest way to get your time. Use the booking form below and the team confirms on WhatsApp."],
  ["How do I change or cancel?", "Just reply to the WhatsApp confirmation and the team will move your time."],
  ["How long does a visit take?", "Each treatment shows its time. The booking form adds them up for you."],
  ["Can I bring a friend or family?", "Of course. Book the same time slot and mention it in the note."],
];

export const REVIEWS: { text: string; who: string; tag: string }[] = [
  { text: "Easy to book, on time, and I loved the result. I will be back.", who: "Sample client", tag: "Hair" },
  { text: "Clean, calm and really friendly team. Exactly what I wanted.", who: "Sample client", tag: "Nails" },
  { text: "Booked on my phone in one minute. So simple.", who: "Sample client", tag: "Facial" },
  { text: "Great service and fair prices. Highly recommended.", who: "Sample client", tag: "Bridal" },
];

export const HOURS = { open: 10 * 60, close: 21 * 60 }; // 10:00 to 21:00, every day (sample)
