import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Demo from "@/components/Demo";
import ProDemo from "@/components/ProDemo";
import SalonSite from "@/components/SalonSite";
import type { ThemeKey } from "@/lib/salonThemes";
import { proPhotosFor } from "@/lib/proImages";
import { company, whatsappLink } from "@/config/company";
import { businesses, getBusiness } from "@/lib/data";
import { getAgent } from "@/lib/estate/agents";

export const dynamicParams = false;

// Business types that use the premium template (components/SalonSite.tsx).
function themeOf(sub: string | undefined): ThemeKey | null {
  if (sub === "ladies" || sub === "unisex" || sub === "gents" || sub === "spa" || sub === "dental" || sub === "clinic" || sub === "cleaning" || sub === "estate") return sub;
  if (sub === "kids") return "ladies";
  return null;
}

export function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return {};
  return {
    title: `${b.name} — demo website by ${company.name}`,
    description: `A free sample website for ${b.name}, made by ${company.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) notFound();
  const agent = getAgent(slug);
  if (agent) {
    const { default: EstateHome } = await import("@/components/estate/EstateHome");
    return <EstateHome biz={agent} />;
  }
  const theme = b.premium || b.batch === 11 ? themeOf(b.sub) : null;
  if (theme) {
    const photos = proPhotosFor(b);
    if (photos && photos.all.length >= 7) {
      return (
        <SalonSite
          slug={b.slug}
          name={b.name}
          sub={theme}
          place={b.area || b.city || "Dubai"}
          city={b.city || "Dubai"}
          address={b.address || `${b.area}, ${b.city || "Dubai"}`}
          phone={b.phone}
          tel={b.tel}
          whatsapp={!!b.whatsapp}
          facebook={b.facebook ?? ""}
          mapQuery={b.mapQuery ?? ""}
          lat={b.lat}
          lon={b.lon}
          photos={photos.all}
          pitchHref={whatsappLink(`Hi! I saw the demo website you made for ${b.name}. I'm interested.`) ?? "#make-it-yours"}
          company={company.name}
        />
      );
    }
  }
  return b.kind ? <ProDemo b={b} /> : <Demo b={b} />;
}
