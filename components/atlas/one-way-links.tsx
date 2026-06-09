import type { CrossLink, ZoneKey } from "@/content/types";
import { getCabinet } from "@/content/cabinets";
import { zoneColor } from "@/content/zones";

const GLYPH: Record<CrossLink["direction"], string> = { in: "←", out: "→", both: "⇄" };

/** Односторонние связи (in/out) — некликабельный текстовый список под карточками обоюдных. */
export function OneWayLinks({ links }: { links: CrossLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-3 rounded-2xl border border-line bg-surface-soft p-4">
      <h3 className="mb-2 font-display text-[11px] font-extrabold uppercase tracking-wide text-muted">Односторонние связи · информационно (без перехода)</h3>
      <ul className="flex flex-col gap-1.5">
        {links.map((l) => {
          const target = getCabinet(l.toCabinet);
          const name = target?.role.title ?? l.toCabinet;
          const accent = zoneColor((target?.zone ?? "blue") as ZoneKey);
          return (
            <li key={l.toCabinet} className="text-[11.5px] leading-snug text-ink-soft">
              <span aria-hidden="true" className="text-muted">{GLYPH[l.direction]}</span>{" "}
              <b style={{ color: accent }}>{name}</b> — {l.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
