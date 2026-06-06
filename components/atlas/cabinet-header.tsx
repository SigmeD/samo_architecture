import Link from "next/link";
import type { CabinetSpec } from "@/content/types";
import { zoneColor } from "@/content/zones";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";
import { splitIcon } from "@/components/atlas/split-icon";

/** Постер-шапка кабинета L1: крошки, икон-тайл (зона), роль, статус, назначение, навигация-чипы. */
export function CabinetHeader({ cabinet, nav }: { cabinet: CabinetSpec; nav?: string[] }) {
  const accent = zoneColor(cabinet.zone);
  return (
    <header className="poster-header-tex border-b border-line px-6 pb-5 pt-7 md:px-10">
      <nav aria-label="Хлебные крошки" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
        <Link href="/" className="font-semibold text-samo-blue hover:underline">← Атлас ДНМ</Link>
        <span aria-hidden="true" className="text-faint">/</span>
        <span aria-current="page" className="font-semibold text-ink">{cabinet.role.title}</span>
      </nav>
      <div className="flex items-start gap-3.5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl"
          style={{ background: `color-mix(in srgb, ${accent} 12%, white)`, borderColor: `color-mix(in srgb, ${accent} 35%, white)` }}
          aria-hidden="true"
        >
          {cabinet.role.emoji}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-extrabold leading-tight md:text-3xl" style={{ color: accent }}>{cabinet.role.title}</h1>
            <ImplStatusBadge status={cabinet.implStatus} />
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink">{cabinet.purpose}</p>
        </div>
      </div>
      {nav && nav.length > 0 && (
        <div
          className="mt-4 rounded-xl border p-2.5"
          style={{ borderColor: `color-mix(in srgb, ${accent} 30%, white)`, background: `color-mix(in srgb, ${accent} 6%, white)` }}
        >
          <div className="mb-1.5 font-display text-[10px] font-extrabold uppercase tracking-[1.5px]" style={{ color: accent }}>Разделы кабинета</div>
          <div className="flex flex-wrap gap-1.5">
            {nav.map((t) => {
              const { icon, text } = splitIcon(t);
              return (
                <span key={t} className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-2 py-1 text-[10.5px] font-semibold text-ink-soft">
                  {icon && <span aria-hidden="true">{icon}</span>}
                  <span>{text}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
