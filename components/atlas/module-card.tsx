import Link from "next/link";
import type { ModuleRef } from "@/content/types";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";

export function ModuleCard({ cabinetSlug, module, hasDrilldown }: { cabinetSlug: string; module: ModuleRef; hasDrilldown: boolean }) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-semibold text-gray-900">{module.title}</h3>
        <ImplStatusBadge status={module.status} title={module.summary} />
      </div>
      <p className="mt-1 text-sm text-gray-700">{module.summary}</p>
    </>
  );
  const base = "block rounded-lg border p-3";
  return hasDrilldown
    ? <Link href={`/cabinet/${cabinetSlug}/module/${module.slug}`} className={`${base} border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition`}>{inner}<span className="mt-1 inline-block text-xs text-samo-blue">подробнее ↗</span></Link>
    : <article className={`${base} border-gray-200`} aria-disabled="true">{inner}</article>;
}
