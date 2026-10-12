import type { Lang } from "./lang";
import type { Listing } from "./types";

// Arabic names for the data shown in listings. Anything not listed here (for example text
// typed in by the owner) is shown as entered.
const MAP: Record<string, string> = {
  // types
  Apartment: "شقة", Villa: "فيلا", Townhouse: "تاون هاوس", Penthouse: "بنتهاوس", Studio: "استوديو", Office: "مكتب",
  // status
  Ready: "جاهز", "Off-plan": "على الخارطة", Buy: "شراء", Rent: "إيجار",
  // places
  Dubai: "دبي", "Abu Dhabi": "أبوظبي", Sharjah: "الشارقة",
  "Dubai Marina": "دبي مارينا", "Downtown Dubai": "وسط مدينة دبي", "Business Bay": "الخليج التجاري",
  "Dubai Hills Estate": "دبي هيلز إستيت", JVC: "قرية جميرا الدائرية", "Jumeirah Village Circle": "قرية جميرا الدائرية",
  "Al Barsha South": "البرشاء جنوب", "Al Barsha": "البرشاء", "Al Barsha 1": "البرشاء 1",
  "Palm Jumeirah": "نخلة جميرا", "Dubai Creek Harbour": "ميناء خور دبي", "Jumeirah Lake Towers": "أبراج بحيرات جميرا",
  DIFC: "مركز دبي المالي العالمي", Deira: "ديرة",
  // amenities
  Balcony: "شرفة", "Central A/C": "تكييف مركزي", "Built-in wardrobes": "خزائن مدمجة", Gym: "نادٍ رياضي", Pool: "مسبح",
  "24h security": "أمن على مدار الساعة", "Covered parking": "موقف مغطى", "Private garden": "حديقة خاصة",
  "Maid's room": "غرفة خادمة", "Private pool": "مسبح خاص", "Community park": "حديقة المجمع", "Private lift": "مصعد خاص",
  Concierge: "خدمة الكونسيرج", "Beach access": "وصول إلى الشاطئ", "Waterfront promenade": "واجهة بحرية", Reception: "استقبال",
  // agents and brokerage
  "Sample Agent": "وكيل تجريبي", "Lux & Noble team": "فريق لوكس آند نوبل", "Sample Developer": "مطوّر تجريبي",
};

export const tr = (s: string, lang: Lang) => (lang === "ar" ? MAP[s] ?? s : s);

const SAMPLE_NOTE = " هذا إعلان تجريبي يوضح شكل صفحات عقاراتك. استبدله بإعلاناتك الحقيقية.";
const LISTINGS_AR: Record<string, { title: string; description: string }> = {
  "ln-1001": { title: "شقة من غرفتين بإطلالة على المارينا", description: "شقة في طابق مرتفع بإطلالة كاملة على المارينا، على بعد خطوات من الترام والشاطئ." },
  "ln-1002": { title: "شقة غرفة نوم بجوار البوليفارد", description: "شقة مفروشة بالكامل من غرفة نوم في قلب وسط المدينة، مثالية للمستثمرين والإيجار قصير المدى." },
  "ln-1003": { title: "استوديو عصري في الخليج التجاري", description: "استوديو مفروش صغير بإطلالة على القناة وسهولة الوصول إلى شارع الشيخ زايد." },
  "ln-1004": { title: "فيلا عائلية من 5 غرف على ملعب الغولف", description: "فيلا واسعة بمسبح وحديقة خاصين، قريبة من المول والحديقة." },
  "ln-1005": { title: "شقة غرفتين في قرية جميرا الدائرية", description: "مبنى هادئ بمسبح ونادٍ رياضي، قريب من المدارس والأسواق." },
  "ln-1006": { title: "تاون هاوس من 3 غرف مع حديقة", description: "تاون هاوس زاوية في مجمع مسوّر مع منطقة ألعاب للأطفال." },
  "ln-1007": { title: "فيلا من 3 غرف قرب المدارس", description: "فيلا عائلية بحديقة خاصة، على مسافة قريبة سيراً من مدرستين." },
  "ln-1008": { title: "بنتهاوس سماوي بتراس خاص", description: "بنتهاوس بطابق كامل مع تراس محيط ومصعد خاص." },
  "ln-1009": { title: "شقة غرفة نوم قرب مترو الخليج التجاري", description: "شقة غير مفروشة من غرفة نوم، على بعد 5 دقائق من المترو، في طابق مرتفع." },
  "ln-1010": { title: "شقة غرفتين على الواجهة البحرية، خطة دفع 60/40", description: "شقة على الخارطة بخطة دفع مرنة: 60% أثناء الإنشاء و40% عند التسليم." },
  "ln-1011": { title: "استوديو للمستثمرين، خطة 1% شهرياً", description: "استوديو على الخارطة بسعر دخول منخفض وخطة دفع بعد التسليم." },
  "ln-1012": { title: "مكتب مجهّز على شارع الشيخ زايد", description: "مكتب مجهّز بالكامل مع منطقة استقبال وموقفي سيارات." },
};

export function listingText(l: Listing, lang: Lang): { title: string; description: string } {
  const a = lang === "ar" && !l.custom ? LISTINGS_AR[l.id] : undefined;
  return a ? { title: a.title, description: a.description + SAMPLE_NOTE } : { title: l.title, description: l.description };
}

export const fmtNum = (n: number) => Math.round(n).toLocaleString("en-US");
export const money = (n: number, lang: Lang) => (lang === "ar" ? `${fmtNum(n)} درهم` : `AED ${fmtNum(n)}`);
export const perYear = (lang: Lang) => (lang === "ar" ? "/ سنوياً" : "/ year");
export const perMonth = (lang: Lang) => (lang === "ar" ? "/ شهرياً" : "/ month");
export const beds = (n: number, lang: Lang) =>
  lang === "ar" ? (n === 0 ? "استوديو" : n === 1 ? "غرفة نوم" : n === 2 ? "غرفتا نوم" : `${n} غرف نوم`) : n === 0 ? "Studio" : `${n} bed${n > 1 ? "s" : ""}`;
export const baths = (n: number, lang: Lang) => (lang === "ar" ? `${n} ${n === 1 ? "حمام" : "حمامات"}` : `${n} bath`);
export const sqft = (n: number, lang: Lang) => (lang === "ar" ? `${fmtNum(n)} قدم²` : `${fmtNum(n)} sq ft`);
export const quarter = (s: string, lang: Lang) => (lang === "ar" ? s.replace(/Q(\d) (\d{4})/, "الربع $1 $2") : s);

export type ProjectAr = { name: string; planNote: string; types: string; highlights: string[]; plan?: string };
export const PROJECTS_AR: Record<string, ProjectAr> = {
  "azure-creek": { name: "أزور كريك ريزيدنسز", planNote: "60% أثناء الإنشاء و40% عند التسليم", types: "شقق من غرفة إلى 3 غرف", highlights: ["واجهة بحرية للمشاة", "مسبح لا متناهٍ", "إطلالات على الأفق"] },
  "marina-crest": { name: "برج مارينا كريست", planNote: "ادفع 1% شهرياً والباقي عند التسليم", types: "من استوديو إلى غرفتين", highlights: ["إطلالة على المارينا", "صالة سماوية", "وصول مباشر إلى الترام"] },
  "hills-gardens": { name: "فلل هيلز غاردن", planNote: "خطة دفع بعد التسليم على سنتين", types: "فلل من 4 و5 غرف", highlights: ["مسبح خاص", "على حافة ملعب الغولف", "منزل ذكي"] },
  "canal-edge": { name: "أجنحة كانال إيدج", planNote: "دفعة أولى منخفضة و20% عند التسليم", types: "استوديو وغرفة نوم", highlights: ["واجهة على القناة", "طابق للعمل المشترك", "عائد إيجاري قوي"] },
  "jvc-park": { name: "بارك أفينيو قرية جميرا", planNote: "1% شهرياً و40% عند التسليم", types: "من استوديو إلى غرفتين", highlights: ["بجوار الحديقة", "نادٍ رياضي ومسبح", "المفضل لدى المستثمرين"], plan: "1% شهرياً" },
  "palm-pearl": { name: "بنتهاوسات بالم بيرل", planNote: "خطة مرنة مع وصول خاص إلى الشاطئ", types: "بنتهاوس من 3 و4 غرف", highlights: ["وصول إلى الشاطئ", "مصعد خاص", "خدمة الكونسيرج"] },
};
