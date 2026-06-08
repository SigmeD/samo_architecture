import type { DomainSpec, ZoneKey } from "@/content/types";
import { zoneColor } from "@/content/zones";
import { splitIcon } from "@/components/atlas/split-icon";
import { NewBadge } from "@/components/atlas/new-badge";

/** Постер-карточка домена: цветной акцент (tinted фон + border), икон-тайл, заголовок, буллеты с маркером. */
export function DomainPanel({ domain, accent }: { domain: DomainSpec; accent: ZoneKey }) {
  const c = zoneColor(accent);
  const { icon, text } = splitIcon(domain.title);
  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-2xl border p-4 shadow-[0_8px_20px_-16px_rgba(11,44,82,0.4)]"
      style={{ borderColor: `color-mix(in srgb, ${c} 40%, white)`, background: `color-mix(in srgb, ${c} 5%, white)` }}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white text-lg"
          style={{ borderColor: `color-mix(in srgb, ${c} 35%, white)` }}
          aria-hidden="true"
        >
          {icon ?? "•"}
        </span>
        <h3 className="flex flex-wrap items-center gap-1.5 font-display text-[12.5px] font-extrabold uppercase leading-tight tracking-wide" style={{ color: c }}>
          <span>{text}</span>
          {domain.toggleable && <span title="feature-toggle" aria-label="feature-toggle">⚙</span>}
          {domain.readOnly && <span title="только просмотр" aria-label="только просмотр">🔒</span>}
          {domain.isNew && <NewBadge />}
        </h3>
      </div>
      <ul className="flex flex-col gap-1.5">
        {domain.items.map((it, i) => (
          <li
            key={i}
            className="flex items-start gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-[11.5px] leading-snug text-ink-soft"
            style={{ borderColor: `color-mix(in srgb, ${c} 22%, white)` }}
          >
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-[2px]" style={{ background: c }} aria-hidden="true" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      {domain.source && <p className="mt-2 truncate font-mono text-[9px] text-faint" title={domain.source}>{domain.source}</p>}
    </article>
  );
}
