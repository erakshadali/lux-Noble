import { notFound } from "next/navigation";
import PropertyView from "@/components/estate/PropertyView";
import { agentSlugs, getAgent } from "@/lib/estate/agents";
import { SAMPLE } from "@/lib/estate/sample";

export const metadata = { title: "Property", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return agentSlugs().flatMap((slug) => SAMPLE.map((l) => ({ slug, id: l.id })));
}

// Listings added by the agent are not known at build time; they are looked up in the browser.
export default async function Property({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  if (!getAgent(slug)) notFound();
  return <div className="ln-page"><PropertyView id={id} /></div>;
}
