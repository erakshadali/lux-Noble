import Reveal from "@/components/estate/Reveal";
import ProjectCard from "@/components/estate/ProjectCard";
import { T } from "@/lib/estate/lang";
import { PROJECTS } from "@/lib/estate/projects";

export const metadata = { title: "Off-plan projects in Dubai | Lux & Noble" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]"><T en="New launches" ar="إطلاقات جديدة" /></p>
      <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-5xl font-semibold"><T en="Off-plan projects" ar="مشاريع على الخارطة" /></h1>
      <p className="mt-3 max-w-2xl text-white/70"><T en="Entry prices, payment plans and handover dates for new developments. Register your interest to receive the brochure and the floor plans on WhatsApp." ar="أسعار الدخول وخطط الدفع وتواريخ التسليم للمشاريع الجديدة. سجّل اهتمامك لتصلك الكتيّبات والمخططات عبر واتساب." /></p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 120}><ProjectCard p={p} /></Reveal>)}
      </div>
      <p className="mt-8 text-xs text-white/40"><T en="Sample projects. The real site shows the projects you sell, with the developer, price list and brochure for each." ar="مشاريع تجريبية. يعرض الموقع الحقيقي المشاريع التي تبيعها، مع المطوّر وقائمة الأسعار والكتيّب لكل مشروع." /></p>
    </div>
  );
}
