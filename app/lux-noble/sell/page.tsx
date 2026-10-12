import SellForm from "@/components/estate/SellForm";
import { T } from "@/lib/estate/lang";

export const metadata = { title: "Sell or rent out your property | Lux & Noble" };

const points: [string, string][] = [
  ["Free market valuation", "تقييم مجاني للسوق"],
  ["Professional photos and listing on the main portals", "تصوير احترافي ونشر الإعلان على أهم المنصات"],
  ["Viewings handled for you", "نتولى ترتيب المعاينات عنك"],
  ["Tenant screening and contracts for rentals", "فحص المستأجرين وعقود الإيجار"],
];

export default function Page() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-2">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]"><T en="Owners" ar="الملّاك" /></p>
        <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-tight"><T en="Sell or rent out your property with us." ar="بع عقارك أو أجّره معنا." /></h1>
        <p className="mt-4 text-white/70"><T en="Tell us about your property. An agent calls you with a free valuation, usually the same day." ar="أخبرنا عن عقارك. يتصل بك أحد وكلائنا بتقييم مجاني، غالباً في اليوم نفسه." /></p>
        <ul className="mt-6 space-y-3 text-white/80">
          {points.map(([en, ar]) => (
            <li key={en} className="flex gap-3"><span className="text-[var(--gold)]">✓</span><T en={en} ar={ar} /></li>
          ))}
        </ul>
      </div>
      <SellForm />
    </div>
  );
}
