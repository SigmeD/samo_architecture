import { Fragment } from "react";
import type { ProcessFlow, ZoneKey } from "@/content/types";
import { zoneColor } from "@/content/zones";
import { splitIcon } from "@/components/atlas/split-icon";
import { NewBadge } from "@/components/atlas/new-badge";

/** Постер-лента ядра кабинета: нумерованные шаги-цепочка со стрелками (последний — end-акцент зоны). */
export function CoreProcessBand({ flow, zone }: { flow: ProcessFlow; zone: ZoneKey }) {
  const c = zoneColor(zone);
  return (
    <div
      className="mb-3 overflow-hidden rounded-2xl border p-4"
      style={{ borderColor: `color-mix(in srgb, ${c} 45%, white)`, background: `color-mix(in srgb, ${c} 6%, white)` }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2 font-display text-sm font-extrabold" style={{ color: c }}>
        <span>{flow.title}</span>
        {flow.badge && (
          <span className="rounded-lg border border-samo-orange-b bg-samo-orange-l px-2.5 py-1 text-[10px] font-bold text-samo-orange-d">{flow.badge}</span>
        )}
      </div>
      <ol className="flex flex-col gap-1 md:flex-row md:items-stretch md:gap-0">
        {flow.steps.map((s, i) => {
          const isEnd = i === flow.steps.length - 1;
          const { icon, text } = splitIcon(s.title);
          return (
            <Fragment key={s.n}>
              <li
                className="flex flex-1 flex-col gap-1 rounded-xl border bg-white p-2.5"
                style={isEnd
                  ? { borderColor: `color-mix(in srgb, ${c} 55%, white)`, background: `color-mix(in srgb, ${c} 10%, white)` }
                  : { borderColor: "var(--color-line)" }}
              >
                <span className="flex items-center gap-1.5">
                  {icon && <span className="text-lg leading-none" aria-hidden="true">{icon}</span>}
                  <span className="font-display text-[11px] font-extrabold leading-tight" style={{ color: c }}>{s.n}. {text}</span>
                  {s.isNew && <NewBadge />}
                </span>
                <span className="text-[11px] leading-snug text-ink-soft">{s.desc}</span>
                {s.gamification && <span className="text-[10px] font-semibold text-samo-orange-d">⇒ {s.gamification}</span>}
                {s.source && <span className="mt-0.5 font-mono text-[9px] text-faint">{s.source}</span>}
              </li>
              {!isEnd && (
                <span className="flex shrink-0 items-center justify-center px-1 font-display text-base font-extrabold" style={{ color: c }} aria-hidden="true">
                  <span className="md:hidden">↓</span><span className="hidden md:inline">→</span>
                </span>
              )}
            </Fragment>
          );
        })}
      </ol>
      {flow.note && (
        <p className="mt-3 rounded-r-lg border-l-[3px] bg-surface-soft px-3 py-2 text-[11px] leading-relaxed text-muted" style={{ borderColor: c }}>{flow.note}</p>
      )}
    </div>
  );
}
