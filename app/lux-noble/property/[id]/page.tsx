import PropertyView from "@/components/estate/PropertyView";
import { SAMPLE } from "@/lib/estate/sample";

export function generateStaticParams() {
  return SAMPLE.map((l) => ({ id: l.id }));
}

// Listings added by the owner are not known at build time; they are looked up in the browser.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyView id={id} />;
}
