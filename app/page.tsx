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
