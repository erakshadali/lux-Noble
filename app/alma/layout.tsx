import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";

const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700", "800"] });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "ALMA Beauty Center | ألما لمركز التجميل",
  description: "خصم أكتوبر الوردي 15% وباقة الهالوين 615 ريال. احجزي موعدك الآن. · Pink October 15% off and the Halloween package, 615 SAR. Book now.",
  robots: { index: false, follow: false },
};

export default function AlmaLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${cairo.variable} ${cormorant.variable}`}>{children}</div>;
}
