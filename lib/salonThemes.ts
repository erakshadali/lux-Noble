// Themes for the premium template (components/SalonSite.tsx): salons plus clinics, laundry/cleaning and real estate.
// Prices and services are SAMPLES; the real list comes from the business when they say yes.
import { HOURS, catalogForSub, copyFor, palettes, type Category, type Item, type Palette } from "./salon";

export type ThemeKey = "ladies" | "unisex" | "gents" | "spa" | "dental" | "clinic" | "cleaning" | "estate";

const it = (id: string, name: string, desc: string, mins: number, price: number): Item => ({ id, name, desc, mins, price });

const DENTAL: Category[] = [
  {
    key: "visit",
    label: "Check-ups",
    items: [
      it("consult", "Consultation & check-up", "A friendly first visit and a clear plan.", 30, 100),
      it("xray", "X-ray", "Digital, quick and low dose.", 15, 80),
      it("clean", "Scale & polish", "Professional teeth cleaning.", 45, 250),
      it("kids", "Kids check-up", "Gentle and fun for little ones.", 30, 120),
    ],
  },
  {
    key: "cosmetic",
    label: "Smile",
    items: [
      it("white", "Teeth whitening", "A brighter smile in one visit.", 60, 900),
      it("veneer", "Veneers consultation", "See what is possible for your smile.", 45, 150),
      it("align", "Braces & aligners consult", "Straighter teeth, step by step.", 45, 150),
    ],
  },
  {
    key: "treat",
    label: "Treatments",
    items: [
      it("filling", "Filling", "Tooth-coloured, natural look.", 45, 350),
      it("root", "Root canal", "Relieve pain and save the tooth.", 90, 1200),
      it("crown", "Crown", "Strong and natural-looking.", 60, 1800),
      it("extract", "Extraction", "Gentle and comfortable.", 30, 400),
    ],
  },
];

const CLINIC: Category[] = [
  {
    key: "visit",
    label: "Consultations",
    items: [
      it("gp", "General doctor", "For colds, pain, fever and check-ups.", 30, 150),
      it("peds", "Child doctor", "Gentle care for children.", 30, 180),
      it("gyn", "Women's health", "Private, caring consultation.", 30, 250),
      it("derm", "Skin doctor", "Acne, rashes and skin care.", 30, 250),
    ],
  },
  {
    key: "tests",
    label: "Tests & checks",
    items: [
      it("health", "Full health check", "Blood tests and a doctor review.", 60, 450),
      it("lab", "Blood tests", "Quick sample, results on WhatsApp.", 15, 120),
      it("ecg", "ECG", "Heart check in 10 minutes.", 15, 100),
    ],
  },
  {
    key: "care",
    label: "Care",
    items: [
      it("vacc", "Vaccination", "Adults and children.", 15, 90),
      it("drip", "Vitamin drip", "Feel refreshed.", 45, 300),
      it("physio", "Physiotherapy", "Back, neck and joint pain.", 45, 250),
    ],
  },
];

const CLEANING: Category[] = [
  {
    key: "laundry",
    label: "Laundry",
    items: [
      it("wash", "Wash & fold", "Washed, dried and neatly folded.", 30, 40),
      it("iron", "Wash & iron", "Fresh and ready to wear.", 30, 60),
      it("dry", "Dry cleaning", "Suits, dresses and delicate items.", 30, 70),
      it("express", "Express (same day)", "Back to you within hours.", 30, 90),
    ],
  },
  {
    key: "home",
    label: "Home items",
    items: [
      it("bed", "Bedding & duvets", "Big items, freshly cleaned.", 30, 80),
      it("curtain", "Curtains", "Taken down and cleaned.", 30, 120),
      it("carpet", "Carpet & rugs", "Deep clean and dry.", 30, 150),
    ],
  },
  {
    key: "pickup",
    label: "Pickup",
    items: [
      it("pick", "Free pickup & delivery", "We collect and bring it back.", 30, 0),
      it("sub", "Weekly pickup plan", "Same day every week.", 30, 0),
    ],
  },
];

const ESTATE: Category[] = [
  {
    key: "buy",
    label: "Buy & rent",
    items: [
      it("view", "Property viewing", "See a home with an agent.", 45, 0),
      it("buy", "Buy a home", "Find the right place at the right price.", 45, 0),
      it("rent", "Rent a home", "Apartments and villas for rent.", 45, 0),
    ],
  },
  {
    key: "sell",
    label: "Sell & list",
    items: [
      it("val", "Free valuation", "Know what your property is worth.", 30, 0),
      it("sell", "Sell my property", "Photos, listing and buyers.", 45, 0),
      it("list", "List for rent", "We find reliable tenants.", 45, 0),
    ],
  },
  {
    key: "invest",
    label: "Invest",
    items: [
      it("inv", "Investment advice", "Yields, areas and off-plan options.", 45, 0),
      it("mort", "Mortgage help", "Understand your payments.", 30, 0),
    ],
  },
];

export const catalogForTheme = (t: ThemeKey): Category[] => (t === "dental" ? DENTAL : t === "clinic" ? CLINIC : t === "cleaning" ? CLEANING : t === "estate" ? ESTATE : catalogForSub(t));

const EXTRA_PALETTES: Record<string, Palette> = {
  dental: { bg: "#F2F9FA", surface: "#FFFFFF", ink: "#0F2329", muted: "#5A737A", line: "#D9E9EC", accent: "#0E8FA3", onAccent: "#FFFFFF", accent2: "#9BE3D2", dark: "#06222B", dark2: "#0B4A57" },
  clinic: { bg: "#F4F7FC", surface: "#FFFFFF", ink: "#101A2E", muted: "#5F6E87", line: "#DEE5F1", accent: "#2B6CD9", onAccent: "#FFFFFF", accent2: "#9CC4FF", dark: "#0A1A38", dark2: "#16346E" },
  cleaning: { bg: "#F2F9F5", surface: "#FFFFFF", ink: "#0F2219", muted: "#5B7567", line: "#D9EADF", accent: "#16A36A", onAccent: "#FFFFFF", accent2: "#BDEFD6", dark: "#07261A", dark2: "#0F4B33" },
  estate: { bg: "#F6F4EF", surface: "#FFFFFF", ink: "#121826", muted: "#666B78", line: "#E4E0D6", accent: "#B8893A", onAccent: "#1A1204", accent2: "#E7CC94", dark: "#0C1424", dark2: "#1B2A48" },
};
export const paletteFor = (t: ThemeKey): Palette => EXTRA_PALETTES[t] ?? palettes[t];

type Copy = { tag: string; headline: string; lede: string; why: [string, string][] };
const EXTRA_COPY: Record<string, Copy> = {
  dental: {
    tag: "Dental clinic",
    headline: "A healthier smile, made easy.",
    lede: "Check-ups, cleaning and treatments in a calm, modern clinic. Pick your treatment and book your time in under a minute.",
    why: [["Book in seconds", "Choose a treatment, a day and a time."], ["Gentle care", "Comfortable, patient and clear about every step."], ["Clean and modern", "Careful hygiene in a calm clinic."]],
  },
  clinic: {
    tag: "Medical clinic",
    headline: "Caring for the whole family.",
    lede: "See a doctor without the wait. Pick your service and book your time in under a minute.",
    why: [["Book in seconds", "Choose a service, a day and a time."], ["Experienced doctors", "Friendly, careful and clear."], ["Close to home", "Easy to reach, easy to park."]],
  },
  cleaning: {
    tag: "Laundry & cleaning",
    headline: "Fresh clothes, zero effort.",
    lede: "We pick up, clean and bring it back. Choose what you need and book a pickup in under a minute.",
    why: [["Free pickup", "We collect from your door and return it fresh."], ["Careful cleaning", "Gentle on fabrics, tough on stains."], ["Fast turnaround", "Express same-day option when you are in a rush."]],
  },
  estate: {
    tag: "Real estate",
    headline: "Find the right home in Dubai.",
    lede: "Buy, rent, sell or invest with a local agent. Tell us what you need and book a time to talk or view.",
    why: [["Local knowledge", "We know the areas, prices and buildings."], ["Clear and honest", "No pressure. Real numbers and real options."], ["Easy to start", "Book a call or viewing in under a minute."]],
  },
};
export const copyForTheme = (t: ThemeKey): Copy => EXTRA_COPY[t] ?? copyFor[t];

export type Wording = {
  menuTitle: string;
  menuNote: string;
  bookTitle: string;
  msgIntro: string;
  cta: string;
  hoursShort: string;
  itemNoun: string;
  receives: string;
  hours: { open: number; close: number };
};

const W = (o: Partial<Wording>): Wording => ({
  menuTitle: "Services & prices",
  menuNote: "Tap Add on anything you like. Your list follows you to the booking form.",
  bookTitle: "Book your visit",
  msgIntro: "I'd like to book:",
  cta: "Book now",
  hoursShort: "10–9",
  itemNoun: "Services",
  receives: "What the team receives",
  hours: HOURS,
  ...o,
});

const CLINIC_HOURS = { open: 9 * 60, close: 19 * 60 };
export const wordingFor: Record<ThemeKey, Wording> = {
  ladies: W({}),
  unisex: W({}),
  gents: W({}),
  spa: W({}),
  dental: W({ menuTitle: "Treatments & prices", bookTitle: "Book an appointment", msgIntro: "I'd like to book an appointment:", cta: "Book appointment", hoursShort: "9–7", itemNoun: "Treatments", hours: CLINIC_HOURS }),
  clinic: W({ bookTitle: "Book an appointment", msgIntro: "I'd like to book an appointment:", cta: "Book appointment", hoursShort: "9–7", hours: CLINIC_HOURS }),
  cleaning: W({ menuNote: "Tap Add on what you need. Prices are samples.", bookTitle: "Book a pickup", msgIntro: "I'd like a pickup:", cta: "Book a pickup", hoursShort: "8–10", hours: { open: 8 * 60, close: 22 * 60 } }),
  estate: W({ menuTitle: "How we can help", menuNote: "Tap Add on what you need, then pick a time to talk or view.", bookTitle: "Book a viewing or call", msgIntro: "I'd like to talk to an agent:", cta: "Book a viewing", hoursShort: "10–7", hours: { open: 10 * 60, close: 19 * 60 } }),
};
