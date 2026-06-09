import Link from "next/link";
import type { Metadata } from "next";
import { PosterFrame } from "@/components/atlas/poster-frame";
import { SectionHeader } from "@/components/atlas/section-header";
import { HierarchyBands } from "@/components/atlas/hierarchy-bands";
import { AccessMatrix } from "@/components/atlas/access-matrix";
import { HandoffFlows } from "@/components/atlas/handoff-flows";
import { SourceRef } from "@/components/atlas/source-ref";
import { systemMap } from "@/content/system-map";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Сводная карта системы — атлас ДНМ" };

const NOTE = "rounded-r-lg border-l-[3px] border-zone-teal bg-surface-soft px-3 py-2 text-[11px] leading-relaxed text-muted";

export default function MapPage() {
  return (
    <PosterFrame>
      <header className="poster-header-tex border-b border-line px-6 pb-5 pt-7 md:px-10">
        <nav aria-label="Хлебные крошки" className="mb-3 flex items-center gap-1.5 text-xs">
          <Link href="/" className="font-semibold text-samo-blue hover:underline">← Атлас ДНМ</Link>
          <span aria-hidden="true" className="text-faint">/</span>
          <span aria-current="page" className="font-semibold text-ink">Сводная карта системы</span>
        </nav>
        <div className="flex items-start gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-samo-blue-b bg-samo-blue-l text-2xl" aria-hidden="true">🗺️</span>
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-samo-blue-d md:text-3xl">Сводная карта системы</h1>
            <p className="mt-1.5 text-xs font-semibold text-muted">Роли · иерархия · матрица доступа · карта передач — сверено с каноном RBAC v1.4</p>
          </div>
        </div>
      </header>

      <div className="px-6 pt-5 md:px-10">
        <SectionHeader no="01" title="Иерархия ролей" caption="сверху вниз · подчинение и зоны" />
        <HierarchyBands tiers={systemMap.hierarchy} />
        <p className={`mt-3 ${NOTE}`}>{systemMap.hierarchyNote}</p>

        <SectionHeader no="02" title="Матрица «роль × раздел × право»" caption="кто что видит и может" />
        <AccessMatrix matrix={systemMap.matrix} />
        <p className={`mt-3 ${NOTE}`}>{systemMap.matrixNote}</p>
        {systemMap.divergences.length > 0 && (
          <div className="mt-4 rounded-2xl border border-samo-orange-b bg-samo-orange-l p-4">
            <h3 className="mb-2 flex items-center gap-2 font-display text-[12px] font-extrabold uppercase tracking-wide text-samo-orange-d">
              <span aria-hidden="true">⚠</span>Вскрытые нестыковки · намерение ↔ канон
            </h3>
            <ul className="flex flex-col gap-2">
              {systemMap.divergences.map((d) => (
                <li key={d.title} className="text-[12px] leading-relaxed text-ink-soft">
                  <b className="text-ink">{d.title}.</b> {d.detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        <SectionHeader no="03" title="Карта передач" caption="кто кому что передаёт" />
        <HandoffFlows columns={systemMap.handoffs} />

        <div className="mt-6">
          <SourceRef sources={systemMap.sources} />
        </div>
      </div>
    </PosterFrame>
  );
}
