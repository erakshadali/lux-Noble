import { getAgent } from "@/lib/estate/agents";

// Real estate agents of batch 12 get the full property site, so their pages share the brokerage header and footer.
// Every other demo passes straight through.
export default async function SlugLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const biz = getAgent(slug);
  if (!biz) return children;
  const { default: EstateShell } = await import("@/components/estate/EstateShell");
  return <EstateShell biz={biz}>{children}</EstateShell>;
}
