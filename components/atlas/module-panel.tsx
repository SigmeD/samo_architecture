import Link from "next/link";
import type { ModuleRef } from "@/content/types";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";
import { NewBadge } from "@/components/atlas/new-badge";

/** Постер-карточка модуля кабинета: статус-бейдж + drilldown (если есть страница модуля). */
export function ModulePanel({ cabinetSlug, module, hasDrilldown }: { cabinetSlug: string; module: ModuleRef; hasDrilldown: boolean }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-[13px] font-extrabold leading-tight text-ink">
          {module.title}
          {module.isNew && <> <NewBadge /></>}
        </h3>
        <ImplStatusBadge status={module.status} title={module.summary} />
      </div>
      <p className="mt-1.5 text-[11.5px] leading-snug text-ink-soft">{module.summary}</p>
    </>
  );
  const base = "block rounded-2xl border border-line bg-white p-3.5 shadow-[0_8px_20px_-16px_rgba(11,44,82,0.4)]";
  return hasDrilldown ? (
    <Link href={`/cabinet/${cabinetSlug}/module/${module.slug}`} className={`${base} transition hover:-translate-y-0.5 hover:shadow-lg`}>
      {inner}
      <span className="mt-1.5 inline-block text-[11px] font-semibold text-samo-blue">подробнее ↗</span>
    </Link>
  ) : (
    <article className={base} aria-disabled="true">{inner}</article>
  );
}
