import { notFound } from "next/navigation";
import Page from "@/app/lux-noble/admin/page";
import { agentSlugs, getAgent } from "@/lib/estate/agents";

export const dynamicParams = false;
export const generateStaticParams = () => agentSlugs().map((slug) => ({ slug }));
export const metadata = { title: "Add listings", robots: { index: false, follow: false } };

export default async function Admin({ params }: { params: Promise<{ slug: string }> }) {
  if (!getAgent((await params).slug)) notFound();
  return <div className="ln-page"><Page /></div>;
}
