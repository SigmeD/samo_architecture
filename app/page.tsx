import Link from "next/link";
import { PosterFrame } from "@/components/atlas/poster-frame";
import { PosterHeader } from "@/components/atlas/poster-header";
import { SectionHeader } from "@/components/atlas/section-header";
import { CoreBand } from "@/components/atlas/core-band";
import { TierLabel } from "@/components/atlas/tier-label";
import { OverviewCabinetCard } from "@/components/atlas/overview-cabinet-card";
import { FlowBand } from "@/components/atlas/flow-band";
import { CrossModulesPanel, DataPanel } from "@/components/atlas/chip-panel";
import { ResultBanner } from "@/components/atlas/result-banner";
import { overview } from "@/content/overview";

export default function Home() {
  const o = overview;
  return (
    <PosterFrame>
      <PosterHeader {...o.header} />
      <div className="px-6 pt-5 md:px-10">
        <Link
          href="/map"
          className="group mb-2 flex flex-wrap items-center gap-3 rounded-2xl border border-samo-blue-b bg-samo-blue-l px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-samo-blue-b bg-white text-lg" aria-hidden="true">🗺️</span>
          <span className="font-display text-sm font-extrabold text-samo-blue-d">Сводная карта системы</span>
          <span className="text-xs text-muted">иерархия ролей · матрица доступа · карта передач — сверено с каноном</span>
          <span className="ml-auto font-display text-sm font-extrabold text-samo-blue" aria-hidden="true">→</span>
        </Link>

        <SectionHeader no="01" title="Ядро модуля" caption="общий движок всех кабинетов" />
        <CoreBand core={o.core} />

        <SectionHeader no="02" title="Роли и кабинеты" caption="три контура · карточки кликабельны" />
        {o.tiers.map((t) => (
          <div key={t.title}>
            <TierLabel>{t.title}</TierLabel>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {t.cabinets.map((c) => (
                <OverviewCabinetCard key={c.slug} cab={c} />
              ))}
            </div>
          </div>
        ))}

        <SectionHeader no="03" title="Ключевые процессы" caption="сквозные бизнес-сценарии" />
        {o.processes.map((p, i) => (
          <FlowBand key={i} band={p} />
        ))}

        <SectionHeader no="04" title="Сквозные модули и платформа" caption="общие сервисы, данные, интеграции" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]">
          <CrossModulesPanel modules={o.crossModules} />
          <DataPanel groups={o.dataLayer} />
        </div>

        <ResultBanner banner={o.result} />
      </div>
    </PosterFrame>
  );
}
