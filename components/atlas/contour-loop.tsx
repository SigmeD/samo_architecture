import { Fragment } from "react";
import type { ZoneKey } from "@/content/types";
import { zoneColor } from "@/content/zones";

/**
 * Стратегический контур (цикл) — компактная лента-петля: короткие пилюли стадий, соединённые стрелками,
 * с замыкающим бейджем «↩ повтор цикла». Тематически по зоне. Рендерится над детальной лентой ядра.
 */
export function ContourLoop({ stages, zone }: { stages: string[]; zone: ZoneKey }) {
  const c = zoneColor(zone);
  return (
    <div
      className="mb-3 rounded-2xl border p-4"
      style={{ borderColor: `color-mix(in srgb, ${c} 40%, white)`, background: `color-mix(in srgb, ${c} 6%, white)` }}
    >
      <div className="mb-2.5 flex items-center gap-2 font-display text-[11px] font-extrabold uppercase tracking-wide" style={{ color: c }}>
        <span aria-hidden="true">🔄</span> Стратегический контур · цикл
      </div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {stages.map((s, i) => (
          <Fragment key={i}>
            <span
              className="rounded-full border bg-white px-3 py-1.5 text-[11.5px] font-bold text-ink"
              style={{ borderColor: `color-mix(in srgb, ${c} 35%, white)` }}
            >
              {s}
            </span>
            {i < stages.length - 1 && (
              <span aria-hidden="true" className="font-display text-sm font-extrabold" style={{ color: c }}>→</span>
            )}
          </Fragment>
        ))}
        <span
          className="ml-0.5 flex items-center gap-1 rounded-full border border-dashed px-3 py-1.5 text-[11px] font-bold"
          style={{ borderColor: `color-mix(in srgb, ${c} 50%, white)`, color: c }}
        >
          ↩ повтор цикла
        </span>
      </div>
    </div>
  );
}
