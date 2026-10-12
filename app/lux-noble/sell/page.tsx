import SellForm from "@/components/estate/SellForm";

export const metadata = { title: "Sell or rent out your property | Lux & Noble" };

export default function Page() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-2">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]">Owners</p>
        <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-tight">Sell or rent out your property with us.</h1>
        <p className="mt-4 text-white/70">Tell us about your property. An agent calls you with a free valuation, usually the same day.</p>
        <ul className="mt-6 space-y-3 text-white/80">
          {["Free market valuation", "Professional photos and listing on the main portals", "Viewings handled for you", "Tenant screening and contracts for rentals"].map((t) => (
            <li key={t} className="flex gap-3"><span className="text-[var(--gold)]">✓</span>{t}</li>
          ))}
        </ul>
      </div>
      <SellForm />
    </div>
  );
}
