import { Suspense } from "react";
import ListingsBrowser from "@/components/estate/ListingsBrowser";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-6 font-[var(--font-cormorant)] text-4xl font-semibold">Properties in Dubai</h1>
      <Suspense fallback={null}><ListingsBrowser persist /></Suspense>
    </div>
  );
}
