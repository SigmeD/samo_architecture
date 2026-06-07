import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PosterFrame } from "@/components/atlas/poster-frame";
import { CabinetHeader } from "@/components/atlas/cabinet-header";
import { SectionHeader } from "@/components/atlas/section-header";
import { CoreProcessBand } from "@/components/atlas/core-process-band";
import { DomainPanel } from "@/components/atlas/domain-panel";
import { CrossLinkPanel } from "@/components/atlas/cross-link-panel";
import { ModulePanel } from "@/components/atlas/module-panel";
import { SourceRef } from "@/components/atlas/source-ref";
import { Legend } from "@/components/atlas/legend";
import { getCabinet, getAllCabinetSlugs } from "@/content/cabinets";
import { getModuleSlugs } from "@/content/modules";
import type { ZoneKey } from "@/content/types";

/** Циклическая палитра акцентов карточек-доменов (разноцветные блоки, как на эталонных постерах). */
const DOMAIN_PALETTE: ZoneKey[] = ["blue", "purple", "orange", "green", "teal", "gold"];

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
  const nav = cabinet.domains.map((d) => d.title);

  return (
    <PosterFrame>
      <CabinetHeader cabinet={cabinet} nav={nav} />
      <div className="px-6 pt-5 md:px-10">
        <SectionHeader no="01" title="Ядро кабинета" caption={cabinet.coreProcess.title} />
        <CoreProcessBand flow={cabinet.coreProcess} zone={cabinet.zone} />

        {cabinet.domains.length > 0 && (
          <>
            <SectionHeader no="02" title="Домены и функции" caption={`${cabinet.domains.length} разделов`} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cabinet.domains.map((d, i) => <DomainPanel key={d.title} domain={d} accent={DOMAIN_PALETTE[i % DOMAIN_PALETTE.length]!} />)}
            </div>
          </>
        )}

        {cabinet.crossLinks.length > 0 && (
          <>
            <SectionHeader no="03" title="Связи с кабинетами" caption="потоки ценности" />
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {cabinet.crossLinks.map((l) => <CrossLinkPanel key={l.toCabinet} link={l} />)}
            </ul>
          </>
        )}

        {cabinet.modules.length > 0 && (
          <>
            <SectionHeader no="04" title="Модули" caption="подсистемы кабинета" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {cabinet.modules.map((m) => <ModulePanel key={m.slug} cabinetSlug={cabinet.slug} module={m} hasDrilldown={drill.has(m.slug)} />)}
            </div>
          </>
        )}

        <div className="mt-6">
          <SourceRef sources={cabinet.sources} />
          <Legend />
        </div>
      </div>
    </PosterFrame>
  );
}
