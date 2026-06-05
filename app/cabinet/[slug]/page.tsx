import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PosterLayout } from "@/components/atlas/poster-layout";
import { Breadcrumbs } from "@/components/atlas/breadcrumbs";
import { ProcessFlow } from "@/components/atlas/process-flow";
import { DomainCard } from "@/components/atlas/domain-card";
import { ModuleCard } from "@/components/atlas/module-card";
import { CrossLinkBadge } from "@/components/atlas/cross-link-badge";
import { SourceRef } from "@/components/atlas/source-ref";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";
import { Legend } from "@/components/atlas/legend";
import { getCabinet, getAllCabinetSlugs } from "@/content/cabinets";
import { getModuleSlugs } from "@/content/modules";

export const dynamic = "force-static";
export function generateStaticParams() { return getAllCabinetSlugs().map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCabinet(slug);
  return { title: c ? `${c.role.title} — атлас ДНМ` : "Кабинет" };
}

export default async function CabinetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cabinet = getCabinet(slug);
  if (!cabinet) notFound();
  const drill = new Set(getModuleSlugs(cabinet.slug));
  return (
    <PosterLayout zone={cabinet.zone}>
      <Breadcrumbs items={[{ label: "Атлас ДНМ", href: "/" }, { label: cabinet.role.title }]} />
      <header className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-gray-900"><span aria-hidden="true">{cabinet.role.emoji}</span> {cabinet.role.title}</h1>
        <ImplStatusBadge status={cabinet.implStatus} />
      </header>
      <p className="mt-2 max-w-3xl text-sm text-gray-700">{cabinet.purpose}</p>

      <ProcessFlow flow={cabinet.coreProcess} />

      {cabinet.modules.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-lg font-bold text-samo-blue">Модули</h2>
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {cabinet.modules.map((m) => <ModuleCard key={m.slug} cabinetSlug={cabinet.slug} module={m} hasDrilldown={drill.has(m.slug)} />)}
          </div>
        </section>
      )}

      {cabinet.domains.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-lg font-bold text-samo-blue">Домены и функции</h2>
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {cabinet.domains.map((d) => <DomainCard key={d.title} domain={d} />)}
          </div>
        </section>
      )}

      {cabinet.crossLinks.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-lg font-bold text-samo-blue">Связи с другими кабинетами</h2>
          <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {cabinet.crossLinks.map((l) => <CrossLinkBadge key={l.toCabinet} link={l} />)}
          </ul>
        </section>
      )}

      <SourceRef sources={cabinet.sources} />
      <Legend />
    </PosterLayout>
  );
}
