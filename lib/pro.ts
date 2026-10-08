// Config for the professional-services demo template (clinics, home services, salons, real estate).
// Everything here is sample content written in the business's voice: no ratings, prices, reviews or
// claims about the real business. ProDemo marks these sections "sample".

export type ProKind = "clinic" | "home" | "salon" | "estate";
export type ProSub =
  | "dental"
  | "clinic"
  | "cleaning"
  | "movers"
  | "ac"
  | "pest"
  | "maintenance"
  | "ladies"
  | "gents"
  | "kids"
  | "spa"
  | "unisex"
  | "estate";

// Single-path 24x24 stroke icons.
export const ICONS = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2.1z",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  chat: "M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l1.9-5.4A8.4 8.4 0 1 1 21 11.5z",
  check: "M20 6 9 17l-5-5",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  clock: "M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z",
  home: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6",
  scissors: "M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12",
  smile: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  plus: "M12 8v8M8 12h8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  snow: "M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1",
  drop: "M12 2.7s7 6.2 7 11.3a7 7 0 0 1-14 0C5 8.9 12 2.7 12 2.7z",
  bug: "M8 2l1.9 1.9M16 2l-1.9 1.9M9 7.1V6a3 3 0 0 1 6 0v1.1M12 20a6 6 0 0 1-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3a6 6 0 0 1-6 6zM12 20v-9M6.5 13H2M17.5 13H22M6.7 18.5 3.5 20M17.3 18.5l3.2 1.5M6.7 8.5 3.5 7M17.3 8.5l3.2-1.5",
  bed: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 17h20M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4",
  building: "M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z",
  calc: "M4 2h16v20H4zM8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h8",
  globe: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  bolt: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  key: "M21 2l-2 2M15.5 7.5l3 3L22 7l-3-3M11.4 11.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zM11.4 11.6 15.5 7.5",
} as const;
export type IconKey = keyof typeof ICONS;

export type ProService = { name: string; blurb: string; icon: IconKey };

export type ProSubConfig = {
  label: string; // shown as the business type chip
  headline: string;
  lede: string;
  services: ProService[];
  // request/booking widget
  widgetTitle: string;
  widgetKicker: string;
  noun: string; // "appointment", "booking", "request"
  bubbleTitle: string; // title of the WhatsApp-style message
  servicesLabel: string;
  multi: boolean; // pick several services
  steps: [string, string][];
};

const s = (name: string, blurb: string, icon: IconKey): ProService => ({ name, blurb, icon });

export const subs: Record<ProSub, ProSubConfig> = {
  dental: {
    label: "Dental clinic",
    headline: "A healthier smile starts with an easy booking.",
    lede: "Check-ups, cleaning and treatments. Pick a time in a few taps and we confirm on WhatsApp.",
    services: [
      s("Check-up & consultation", "A friendly first visit and a clear plan.", "smile"),
      s("Teeth cleaning", "Routine scale and polish.", "sparkle"),
      s("Teeth whitening", "A brighter smile for special days.", "star"),
      s("Fillings & repairs", "Fix chips, cracks and cavities.", "wrench"),
      s("Braces & aligners", "Straighter teeth, step by step.", "shield"),
      s("Dental implants", "Replace missing teeth.", "plus"),
      s("Kids dentistry", "Gentle care for little patients.", "heart"),
      s("Emergency visit", "Tooth pain? Call us first.", "bolt"),
    ],
    widgetTitle: "Book an appointment",
    widgetKicker: "Book",
    noun: "appointment",
    bubbleTitle: "New appointment",
    servicesLabel: "What do you need?",
    multi: false,
    steps: [
      ["Choose", "Pick the service, day and time that suit you."],
      ["We confirm", "The clinic replies on WhatsApp to confirm."],
      ["Visit", "Come in, relax and leave smiling."],
    ],
  },
  clinic: {
    label: "Medical clinic",
    headline: "Caring for the whole family, close to home.",
    lede: "See our services, choose a time and request your appointment online.",
    services: [
      s("General practitioner", "Everyday health concerns.", "plus"),
      s("Family medicine", "One team for every age.", "heart"),
      s("Pediatrics", "Care for babies and children.", "smile"),
      s("Women's health", "Private, caring consultations.", "shield"),
      s("Dermatology", "Skin, hair and nail care.", "sparkle"),
      s("Lab tests", "Simple sample collection.", "drop"),
      s("Vaccinations", "Stay up to date.", "check"),
      s("Health check-ups", "A full review, start to finish.", "star"),
    ],
    widgetTitle: "Book an appointment",
    widgetKicker: "Book",
    noun: "appointment",
    bubbleTitle: "New appointment",
    servicesLabel: "What do you need?",
    multi: false,
    steps: [
      ["Choose", "Pick the service, day and time that suit you."],
      ["We confirm", "The clinic replies on WhatsApp to confirm."],
      ["Visit", "Walk in on time and be seen without stress."],
    ],
  },
  cleaning: {
    label: "Cleaning service",
    headline: "A spotless home, without the stress.",
    lede: "Tell us what needs cleaning. We confirm the time on WhatsApp.",
    services: [
      s("Deep cleaning", "Top to bottom, every corner.", "sparkle"),
      s("Sofa & carpet", "Fresh fabric and floors.", "drop"),
      s("Kitchen & bathroom", "Grease and limescale gone.", "wrench"),
      s("Move-in / move-out", "Ready for the next chapter.", "key"),
      s("Villa & apartment", "Regular or one-time visits.", "home"),
      s("Windows & glass", "Streak-free shine.", "star"),
      s("Office cleaning", "A clean place to work.", "building"),
      s("Post-renovation", "Dust and debris cleared.", "shield"),
    ],
    widgetTitle: "Book a cleaning",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "What should we clean?",
    multi: false,
    steps: [
      ["Tell us", "Choose the service, place and time."],
      ["We confirm", "We reply on WhatsApp with the time."],
      ["We arrive", "The team comes to you, ready to work."],
    ],
  },
  movers: {
    label: "Movers & packers",
    headline: "Moving day, made easy.",
    lede: "Packing, loading and moving. Send your request in a minute.",
    services: [
      s("Home moving", "Apartment or villa, door to door.", "truck"),
      s("Packing & wrapping", "Careful packing for fragile items.", "shield"),
      s("Furniture assembly", "Taken apart and put back together.", "wrench"),
      s("Storage", "Short or long-term space.", "building"),
      s("Office relocation", "Move with minimal downtime.", "building"),
      s("Single items", "One sofa or a whole room.", "home"),
      s("Loading & unloading", "Extra hands when you need them.", "bolt"),
      s("Disposal", "We take away what you don't need.", "check"),
    ],
    widgetTitle: "Book a move",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New moving booking",
    servicesLabel: "What do you need?",
    multi: false,
    steps: [
      ["Tell us", "Share what you're moving and when."],
      ["We confirm", "We reply on WhatsApp to agree the plan."],
      ["We move", "The team packs, loads and delivers."],
    ],
  },
  ac: {
    label: "AC repair & service",
    headline: "Cool again. Fast AC repair and service.",
    lede: "Tell us the problem and your area. We reply on WhatsApp.",
    services: [
      s("AC repair", "Not cooling? Leaking? We fix it.", "wrench"),
      s("AC servicing", "Regular cleaning and checks.", "sparkle"),
      s("Gas refilling", "Top up and leak checks.", "drop"),
      s("Installation", "New split and window units.", "snow"),
      s("Duct cleaning", "Cleaner, fresher air.", "shield"),
      s("Annual contracts", "Planned visits all year.", "calendar"),
      s("Emergency call-out", "Urgent breakdowns.", "bolt"),
      s("Spare parts", "Common parts on hand.", "check"),
    ],
    widgetTitle: "Book an AC visit",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "What do you need?",
    multi: false,
    steps: [
      ["Tell us", "Describe the problem, place and time."],
      ["We confirm", "We reply on WhatsApp with a visit time."],
      ["We fix it", "The technician arrives and gets it done."],
    ],
  },
  pest: {
    label: "Pest control",
    headline: "Pest-free homes, handled properly.",
    lede: "Tell us what you're seeing. We reply on WhatsApp with the next step.",
    services: [
      s("General pest control", "Whole-home treatment.", "bug"),
      s("Cockroaches", "Kitchen and bathroom treatment.", "shield"),
      s("Bed bugs", "Thorough room treatment.", "bed"),
      s("Ants & insects", "Stop them at the source.", "bug"),
      s("Rodents", "Safe and discreet.", "home"),
      s("Termites", "Protect wood and furniture.", "wrench"),
      s("Annual contracts", "Planned visits all year.", "calendar"),
      s("Commercial sites", "Shops, offices and kitchens.", "building"),
    ],
    widgetTitle: "Book a treatment",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "What's the problem?",
    multi: false,
    steps: [
      ["Tell us", "Say what you're seeing and where."],
      ["We confirm", "We reply on WhatsApp with a time."],
      ["We treat", "The team treats the place and advises you."],
    ],
  },
  maintenance: {
    label: "Home maintenance",
    headline: "One call for every repair at home.",
    lede: "Plumbing, electrical, painting and more. Send your request and we reply on WhatsApp.",
    services: [
      s("Plumbing", "Leaks, taps and drains.", "drop"),
      s("Electrical", "Lights, sockets and switches.", "bolt"),
      s("Painting", "Fresh walls and ceilings.", "sparkle"),
      s("AC maintenance", "Service and repair.", "snow"),
      s("Carpentry", "Doors, shelves and fixes.", "wrench"),
      s("Handyman", "The small jobs that add up.", "check"),
      s("Tiling", "Floors and walls.", "home"),
      s("Renovation", "Bigger projects, planned.", "building"),
    ],
    widgetTitle: "Book a repair",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "What needs fixing?",
    multi: false,
    steps: [
      ["Tell us", "Say what needs fixing, where and when."],
      ["We confirm", "We reply on WhatsApp with a time."],
      ["We fix it", "A technician arrives with the right tools."],
    ],
  },
  ladies: {
    label: "Ladies salon",
    headline: "Look and feel your best.",
    lede: "Hair, beauty and care in a calm, friendly salon. Book in a few taps.",
    services: [
      s("Haircut & styling", "Cut, blow-dry and finish.", "scissors"),
      s("Hair colour", "From subtle to bold.", "sparkle"),
      s("Hair treatments", "Smooth, shiny, healthy.", "heart"),
      s("Manicure & pedicure", "Neat nails, every time.", "star"),
      s("Threading & waxing", "Quick and gentle.", "check"),
      s("Facials", "Fresh, glowing skin.", "smile"),
      s("Bridal & party makeup", "For your big day.", "sparkle"),
      s("Henna", "Simple to detailed designs.", "heart"),
    ],
    widgetTitle: "Book your visit",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "Pick your services",
    multi: true,
    steps: [
      ["Pick", "Choose your services, day and time."],
      ["We confirm", "The salon replies on WhatsApp."],
      ["Relax", "Arrive, sit back and enjoy."],
    ],
  },
  gents: {
    label: "Gents salon",
    headline: "Sharp cuts. Clean shaves.",
    lede: "Walk out looking your best. Pick your time and book.",
    services: [
      s("Haircut", "Classic or modern, done right.", "scissors"),
      s("Beard trim & shape", "Clean lines and edges.", "sparkle"),
      s("Shave", "A smooth, comfortable finish.", "check"),
      s("Hair colour", "Grey cover or a new look.", "star"),
      s("Head & face massage", "Unwind in the chair.", "heart"),
      s("Facial & cleanup", "Clear, fresh skin.", "smile"),
      s("Grooming packages", "Cut, beard and more.", "shield"),
      s("Kids haircut", "Patient with little ones.", "smile"),
    ],
    widgetTitle: "Book your chair",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "Pick your services",
    multi: true,
    steps: [
      ["Pick", "Choose your services, day and time."],
      ["We confirm", "The barber replies on WhatsApp."],
      ["Sit down", "Arrive and we get to work."],
    ],
  },
  kids: {
    label: "Kids salon",
    headline: "Happy haircuts for little ones.",
    lede: "A friendly, fun place for kids. Book a time in a few taps.",
    services: [
      s("Kids haircut", "Patient, gentle and quick.", "scissors"),
      s("First haircut", "A memory to keep.", "heart"),
      s("Styling & braids", "Neat for school or parties.", "sparkle"),
      s("Party packages", "Fun for groups of friends.", "star"),
      s("Nails", "Colourful and gentle.", "smile"),
      s("Hair care", "Wash and treat.", "drop"),
      s("Gents haircut", "For dads too.", "check"),
      s("Ladies styling", "For mums too.", "sparkle"),
    ],
    widgetTitle: "Book a visit",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "Pick your services",
    multi: true,
    steps: [
      ["Pick", "Choose services, day and time."],
      ["We confirm", "The salon replies on WhatsApp."],
      ["Enjoy", "Arrive and let the fun begin."],
    ],
  },
  spa: {
    label: "Spa & wellness",
    headline: "Slow down. Recharge.",
    lede: "Massage, facials and care. Choose a treatment and a time that suits you.",
    services: [
      s("Massage", "Relax tired muscles.", "heart"),
      s("Facials", "Fresh, glowing skin.", "smile"),
      s("Body scrubs", "Smooth, refreshed skin.", "sparkle"),
      s("Moroccan bath", "A traditional deep clean.", "drop"),
      s("Aromatherapy", "Calming scents and touch.", "star"),
      s("Hot stone", "Warmth that melts tension.", "bolt"),
      s("Couples' packages", "Time together.", "heart"),
      s("Nails & beauty", "The finishing touches.", "check"),
    ],
    widgetTitle: "Book a treatment",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "Pick your treatments",
    multi: true,
    steps: [
      ["Pick", "Choose your treatments, day and time."],
      ["We confirm", "The spa replies on WhatsApp."],
      ["Unwind", "Arrive and leave the rest to us."],
    ],
  },
  unisex: {
    label: "Hair & beauty salon",
    headline: "Hair and beauty for everyone.",
    lede: "Cuts, colour and care in one friendly place. Book in a few taps.",
    services: [
      s("Haircut & style", "Ladies, gents and kids.", "scissors"),
      s("Hair colour", "From subtle to bold.", "sparkle"),
      s("Hair treatments", "Smooth, shiny, healthy.", "heart"),
      s("Beard grooming", "Trim, shape, shave.", "check"),
      s("Manicure & pedicure", "Neat nails.", "star"),
      s("Facials", "Fresh, glowing skin.", "smile"),
      s("Waxing & threading", "Quick and gentle.", "check"),
      s("Party styling", "Ready for the occasion.", "sparkle"),
    ],
    widgetTitle: "Book your visit",
    widgetKicker: "Book",
    noun: "booking",
    bubbleTitle: "New booking",
    servicesLabel: "Pick your services",
    multi: true,
    steps: [
      ["Pick", "Choose your services, day and time."],
      ["We confirm", "The salon replies on WhatsApp."],
      ["Relax", "Arrive, sit back and enjoy."],
    ],
  },
  estate: {
    label: "Real estate",
    headline: "Find the right home in Dubai.",
    lede: "Browse listings, work out your payments and talk to an advisor on WhatsApp.",
    services: [
      s("Buy a property", "Apartments, villas and townhouses.", "home"),
      s("Rent a property", "Long and short-term options.", "key"),
      s("Sell with us", "Reach serious buyers.", "building"),
      s("List for rent", "Find the right tenant.", "check"),
      s("Off-plan projects", "New launches and payment plans.", "star"),
      s("Investment advice", "Yields, areas and timing.", "calc"),
      s("Property valuation", "Know what it's worth.", "shield"),
      s("Property management", "We look after it for you.", "heart"),
    ],
    widgetTitle: "Book a viewing",
    widgetKicker: "Book",
    noun: "viewing",
    bubbleTitle: "New viewing request",
    servicesLabel: "How can we help?",
    multi: false,
    steps: [
      ["Search", "Browse listings and use the calculator."],
      ["Enquire", "Send us what you're looking for."],
      ["View", "We reply on WhatsApp and arrange viewings."],
    ],
  },
};

export type ProKindConfig = {
  label: string;
  font: "manrope" | "fraunces" | "playfair" | "oswald";
  uppercase: boolean;
  light?: boolean; // light page body (the hero stays dark and colourful)
  colors: {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    line: string;
    accent: string;
    onAccent: string;
    accent2: string;
    heroFrom: string;
    heroTo: string;
  };
  pattern: { image: string; size: string };
  features: { icon: IconKey; title: string; text: string }[];
  callBand: string;
};

export const proKinds: Record<ProKind, ProKindConfig> = {
  clinic: {
    label: "Clinic",
    light: true,
    font: "manrope",
    uppercase: false,
    colors: {
      bg: "#F4F9F9",
      surface: "#FFFFFF",
      ink: "#0C1F24",
      muted: "#566B70",
      line: "#D5E5E6",
      accent: "#08877A",
      onAccent: "#FFFFFF",
      accent2: "#7CC8FF",
      heroFrom: "#031412",
      heroTo: "#0E4A46",
    },
    pattern: {
      image:
        "linear-gradient(rgba(255,255,255,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.05) 2px, transparent 2px)",
      size: "44px 44px",
    },
    features: [
      { icon: "calendar", title: "Book any time", text: "Patients request a slot day or night. You see it on WhatsApp." },
      { icon: "shield", title: "Looks trustworthy", text: "A clean, professional site that builds confidence before the first visit." },
      { icon: "pin", title: "Easy to find", text: "Your services, address, phone and map in one link." },
      { icon: "globe", title: "Your own address", text: "Your name as a web address, on your cards and your Google page." },
    ],
    callBand: "Book your visit",
  },
  home: {
    label: "Home services",
    font: "oswald",
    uppercase: true,
    colors: {
      bg: "#090C13",
      surface: "#121826",
      ink: "#F3F5F9",
      muted: "#98A2B8",
      line: "#232B3E",
      accent: "#FFB61E",
      onAccent: "#1A1200",
      accent2: "#4DA3FF",
      heroFrom: "#060A14",
      heroTo: "#123363",
    },
    pattern: {
      image: "repeating-linear-gradient(135deg, rgba(255,255,255,.055) 0 10px, transparent 10px 28px)",
      size: "auto",
    },
    features: [
      { icon: "phone", title: "One tap to call", text: "Customers call or WhatsApp you straight from Google, with no searching around." },
      { icon: "chat", title: "Requests on WhatsApp", text: "Service, place and time arrive as a clear message, ready to reply to." },
      { icon: "clock", title: "Always open online", text: "People send jobs at night; you answer in the morning." },
      { icon: "globe", title: "Your own address", text: "A real web address that makes you look established." },
    ],
    callBand: "Need help now?",
  },
  salon: {
    label: "Salon",
    font: "playfair",
    uppercase: false,
    colors: {
      bg: "#0F0910",
      surface: "#1A101B",
      ink: "#F8EEF2",
      muted: "#B39BA6",
      line: "#35202F",
      accent: "#FF8FB8",
      onAccent: "#2A0716",
      accent2: "#F5C77E",
      heroFrom: "#1A0A19",
      heroTo: "#5B1748",
    },
    pattern: {
      image: "radial-gradient(rgba(255,255,255,.09) 1.6px, transparent 1.7px)",
      size: "24px 24px",
    },
    features: [
      { icon: "calendar", title: "Bookings on WhatsApp", text: "Clients pick services and a time. You confirm with one reply." },
      { icon: "sparkle", title: "Shows your best work", text: "Your services, prices and photos, beautifully laid out on a phone." },
      { icon: "star", title: "Ready for Instagram", text: "One link for your bio, cards and Google page." },
      { icon: "globe", title: "Your own address", text: "Your salon name as a web address." },
    ],
    callBand: "Ready for a fresh look?",
  },
  estate: {
    label: "Real estate",
    light: true,
    font: "fraunces",
    uppercase: false,
    colors: {
      bg: "#F7F5EF",
      surface: "#FFFFFF",
      ink: "#14161C",
      muted: "#5F6370",
      line: "#E3DFD3",
      accent: "#8A6410",
      onAccent: "#FFFFFF",
      accent2: "#6FE3C1",
      heroFrom: "#060A14",
      heroTo: "#1B2B50",
    },
    pattern: {
      image:
        "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
      size: "48px 48px",
    },
    features: [
      { icon: "building", title: "Your listings, online", text: "Search by area, type and bedrooms. Clients find the right one fast." },
      { icon: "calc", title: "Payment calculator", text: "Buyers work out monthly payments, then enquire with a plan in mind." },
      { icon: "chat", title: "Enquiries on WhatsApp", text: "Every lead arrives as a clear message with their needs." },
      { icon: "globe", title: "Your own address", text: "A brand that looks as serious as your deals." },
    ],
    callBand: "Talk to an advisor",
  },
};

// Pick the subtype from what we know about the business (Overture category + name).
export function pickSub(kind: ProKind, category: string, name: string): ProSub {
  const n = name.toLowerCase();
  if (kind === "clinic") {
    const dentalName = /dental|dentist|dentalia|smile|veneer|orthodont|teeth/.test(n);
    const medicalName = /medical|poly ?clinic|health|center|centre/.test(n) && !/dental/.test(n);
    if (dentalName) return "dental";
    if (medicalName) return "clinic";
    return /dent/.test(category) ? "dental" : "clinic";
  }
  if (kind === "home") {
    if (/mover|moving|packer/.test(n) || category === "mover") return "movers";
    if (/pest/.test(n) || category === "pest_control_service") return "pest";
    if (/technical|maintenance|renovation|handyman|plumb|electric|paint/.test(n) || /plumbing|painting|handyman|electrician/.test(category)) return "maintenance";
    if (/\bac\b|a\/c|air ?con|hvac|cool/.test(n) || category === "hvac_service") return "ac";
    return "cleaning";
  }
  if (kind === "salon") {
    if (/spa|wellness|massage/.test(n) || /spa/.test(category)) return "spa";
    if (/kids|children/.test(n) && !/gents|men/.test(n)) return "kids";
    if (/ladies|women|beauty|bridal|nail|brow/.test(n) && !/gents|men's|mens|barber/.test(n)) return "ladies";
    if (/gents|men's|mens|barber|clipper/.test(n)) return "gents";
    return category === "barber" ? "gents" : category === "hair_salon" ? "unisex" : "ladies";
  }
  return "estate";
}

// WhatsApp-style message texts used on the send page (English, short, one per field).
export const proAudience: Record<ProKind, { who: string; benefit: string }> = {
  clinic: { who: "patients", benefit: "online appointment requests straight to your WhatsApp" },
  home: { who: "customers", benefit: "job requests straight to your WhatsApp" },
  salon: { who: "clients", benefit: "online bookings straight to your WhatsApp" },
  estate: { who: "buyers and tenants", benefit: "property enquiries straight to your WhatsApp" },
};
