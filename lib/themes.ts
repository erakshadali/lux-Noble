export type ThemeKey =
  | "asian"
  | "latin"
  | "italian"
  | "cafe"
  | "diner"
  | "spice"
  | "modern";

export type Theme = {
  key: ThemeKey;
  font: "playfair" | "fraunces" | "oswald";
  uppercase: boolean;
  tagline: string;
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
};

export const themes: Record<ThemeKey, Theme> = {
  asian: {
    key: "asian",
    font: "playfair",
    uppercase: false,
    tagline: "Bold flavors, made with care.",
    colors: {
      bg: "#FBF7F2",
      surface: "#FFFFFF",
      ink: "#1C1917",
      muted: "#6B625B",
      line: "#E8DFD5",
      accent: "#C8322B",
      onAccent: "#FFFFFF",
      accent2: "#E9B44C",
      heroFrom: "#1A0F0E",
      heroTo: "#4A1714",
    },
    pattern: {
      image:
        "radial-gradient(circle at 100% 50%, transparent 20%, rgba(255,255,255,.055) 21%, rgba(255,255,255,.055) 34%, transparent 35%), radial-gradient(circle at 0% 50%, transparent 20%, rgba(255,255,255,.055) 21%, rgba(255,255,255,.055) 34%, transparent 35%)",
      size: "56px 56px",
    },
  },
  latin: {
    key: "latin",
    font: "oswald",
    uppercase: true,
    tagline: "Sabor in every bite.",
    colors: {
      bg: "#FFF6EA",
      surface: "#FFFFFF",
      ink: "#2B1408",
      muted: "#7A5A45",
      line: "#F0DCC5",
      accent: "#C2410C",
      onAccent: "#FFFFFF",
      accent2: "#0F766E",
      heroFrom: "#5C1F08",
      heroTo: "#B4470F",
    },
    pattern: {
      image:
        "repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 10px, transparent 10px 26px)",
      size: "auto",
    },
  },
  italian: {
    key: "italian",
    font: "fraunces",
    uppercase: false,
    tagline: "Good food, good company.",
    colors: {
      bg: "#FAF6EE",
      surface: "#FFFFFF",
      ink: "#1F2A1F",
      muted: "#5F6B5D",
      line: "#E5DECF",
      accent: "#B42318",
      onAccent: "#FFFFFF",
      accent2: "#D4A73A",
      heroFrom: "#0F2E22",
      heroTo: "#25604A",
    },
    pattern: {
      image:
        "conic-gradient(rgba(255,255,255,.05) 25%, transparent 0 50%, rgba(255,255,255,.05) 0 75%, transparent 0)",
      size: "56px 56px",
    },
  },
  cafe: {
    key: "cafe",
    font: "fraunces",
    uppercase: false,
    tagline: "Your neighborhood spot for a good cup.",
    colors: {
      bg: "#FAF3EA",
      surface: "#FFFFFF",
      ink: "#2A1D15",
      muted: "#7B6656",
      line: "#EADBC8",
      accent: "#9A5416",
      onAccent: "#FFFFFF",
      accent2: "#D9A66B",
      heroFrom: "#2B1D15",
      heroTo: "#6B4A36",
    },
    pattern: {
      image: "radial-gradient(rgba(255,255,255,.09) 1.6px, transparent 1.7px)",
      size: "22px 22px",
    },
  },
  diner: {
    key: "diner",
    font: "oswald",
    uppercase: true,
    tagline: "Classic comfort, done right.",
    colors: {
      bg: "#FFF9EC",
      surface: "#FFFFFF",
      ink: "#10233F",
      muted: "#556479",
      line: "#EBE1C8",
      accent: "#C81E1E",
      onAccent: "#FFFFFF",
      accent2: "#F4B41A",
      heroFrom: "#0B1A31",
      heroTo: "#1F4278",
    },
    pattern: {
      image:
        "repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 2px, transparent 2px 16px)",
      size: "auto",
    },
  },
  spice: {
    key: "spice",
    font: "playfair",
    uppercase: false,
    tagline: "Rich flavors, generous plates.",
    colors: {
      bg: "#FBF4EC",
      surface: "#FFFFFF",
      ink: "#2A1533",
      muted: "#75607F",
      line: "#EADCEA",
      accent: "#E0861A",
      onAccent: "#2A1533",
      accent2: "#B8467A",
      heroFrom: "#2A1235",
      heroTo: "#6A2C5A",
    },
    pattern: {
      image:
        "conic-gradient(from 45deg at 50% 50%, rgba(255,255,255,.06) 25%, transparent 0 50%, rgba(255,255,255,.06) 0 75%, transparent 0)",
      size: "40px 40px",
    },
  },
  modern: {
    key: "modern",
    font: "fraunces",
    uppercase: false,
    tagline: "Good food, warmly served.",
    colors: {
      bg: "#F6F5F2",
      surface: "#FFFFFF",
      ink: "#16181D",
      muted: "#666B75",
      line: "#E3E1DB",
      accent: "#B8862B",
      onAccent: "#16181D",
      accent2: "#3E6B5C",
      heroFrom: "#14161B",
      heroTo: "#2C313B",
    },
    pattern: {
      image:
        "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
      size: "48px 48px",
    },
  },
};

// Dark look: near-black pages with bright, glowing accents. Same fonts and patterns.
const dark = (accent: string, onAccent: string, accent2: string, heroFrom: string, heroTo: string): Theme["colors"] => ({
  bg: "#0A0A0F",
  surface: "#14141C",
  ink: "#F4F2EE",
  muted: "#A3A0AE",
  line: "#2A2A38",
  accent,
  onAccent,
  accent2,
  heroFrom,
  heroTo,
});

const darkColors: Record<ThemeKey, Theme["colors"]> = {
  asian: dark("#FF3B5C", "#FFFFFF", "#FFC53D", "#0E0610", "#3A0B24"),
  latin: dark("#FF7A1A", "#140800", "#1EE3C0", "#120604", "#5A1D06"),
  italian: dark("#FF4D4D", "#FFFFFF", "#FFD166", "#050F0B", "#0F3D2C"),
  cafe: dark("#F5A524", "#140C02", "#F2C9A0", "#0F0A06", "#3E2716"),
  diner: dark("#FF3355", "#FFFFFF", "#FFD60A", "#050A16", "#122B57"),
  spice: dark("#FFB020", "#1A0A1F", "#FF4FA3", "#10051A", "#4A1450"),
  modern: dark("#E9C46A", "#111111", "#4ADE80", "#08090C", "#22262F"),
};

export function themeFor(key: ThemeKey, look?: "dark"): Theme {
  const t = themes[key];
  return look === "dark" ? { ...t, colors: darkColors[key] } : t;
}
