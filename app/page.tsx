import { company } from "@/config/company";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#0B0B0F] px-6 py-24 text-center text-white">
      <div className="max-w-xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
          {company.name}
        </p>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{company.tagline}</h1>
        <p className="mt-5 text-white/60">
          Every sample site is shared privately with the business it was made for.
        </p>
      </div>
    </main>
  );
}
