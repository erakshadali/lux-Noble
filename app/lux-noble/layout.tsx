import type { Metadata } from "next";
import EstateShell from "@/components/estate/EstateShell";
import { LUX } from "@/lib/estate/types";

export const metadata: Metadata = {
  title: "Lux & Noble International Real Estate | Dubai",
  description: "Apartments, villas and off-plan homes in Dubai. Book a viewing on WhatsApp.",
  robots: { index: false, follow: false },
};

export default function LuxNobleLayout({ children }: { children: React.ReactNode }) {
  return <EstateShell biz={LUX}>{children}</EstateShell>;
}
