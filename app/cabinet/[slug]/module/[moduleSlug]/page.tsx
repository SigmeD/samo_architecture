import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PosterLayout } from "@/components/atlas/poster-layout";
import { Breadcrumbs } from "@/components/atlas/breadcrumbs";
import { ProcessFlow } from "@/components/atlas/process-flow";
import { CrossLinkBadge } from "@/components/atlas/cross-link-badge";
import { SourceRef } from "@/components/atlas/source-ref";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";
import { getCabinet } from "@/content/cabinets";
import { getModule, getAllModulePairs } from "@/content/modules";

export const dynamic = "force-static";
export function generateStaticParams() {
  return getAllModulePairs().map((p) => ({ slug: p.cabinetSlug, moduleSlug: p.moduleSlug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string; moduleSlug: string }> }): Promise<Metadata> {
  const { slug, moduleSlug } = await params;
  const m = getModule(slug, moduleSlug);
  return { title: m ? `${m.title} — атлас ДНМ` : "Модуль" };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string; moduleSlug: string }> }) {
  const { slug, moduleSlug } = await params;
  const cabinet = getCabinet(slug);
  const mod = getModule(slug, moduleSlug);
  if (!cabinet || !mod) notFound();
  return (
    <PosterLayout zone={cabinet.zone}>
      <Breadcrumbs items={[{ label: "Атлас ДНМ", href: "/" }, { label: cabinet.role.title, href: `/cabinet/${cabinet.slug}` }, { label: mod.title }]} />
      <header className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-gray-900">{mod.title}</h1>
        <ImplStatusBadge status={mod.status} title={mod.summary} />
      </header>
      {mod.purpose && <p className="mt-2 max-w-3xl text-sm text-gray-700">{mod.purpose}</p>}
      {mod.note && <p className="mt-2 max-w-3xl rounded border border-orange-200 bg-orange-50 p-2 text-sm text-samo-orange-d">{mod.note}</p>}
      {mod.process && <ProcessFlow flow={mod.process} />}
      {mod.crossLinks && mod.crossLinks.length > 0 && (
        <ul className="my-4 grid grid-cols-1 gap-2 md:grid-cols-2">{mod.crossLinks.map((l) => <CrossLinkBadge key={l.toCabinet} link={l} />)}</ul>
      )}
      <SourceRef sources={mod.sources} />
    </PosterLayout>
  );
}
