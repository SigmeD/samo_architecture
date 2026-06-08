import Link from "next/link";
import type { CrossLink, ZoneKey } from "@/content/types";
import { getCabinet } from "@/content/cabinets";
import { zoneColor } from "@/content/zones";
import { NewBadge } from "@/components/atlas/new-badge";

const GLYPH: Record<CrossLink["direction"], string> = { in: "←", out: "→", both: "⇄" };

/** Постер-карточка связи кабинета: направление, целевой кабинет (кликабелен), поток, источник. */
export function CrossLinkPanel({ link }: { link: CrossLink }) {
  const target = getCabinet(link.toCabinet);
  const zone = (target?.zone ?? "blue") as ZoneKey;
  const name = target?.role.title ?? link.toCabinet;
  const accent = zoneColor(zone);
  return (
    <li className="list-none">
      <Link
        href={`/cabinet/${link.toCabinet}`}
        className="group flex h-full flex-col gap-1.5 rounded-2xl border border-line bg-white p-3.5 shadow-[0_8px_20px_-16px_rgba(11,44,82,0.4)] transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <span className="flex items-center gap-2 font-display text-[13px] font-extrabold" style={{ color: accent }}>
          <span aria-hidden="true" className="text-muted">{GLYPH[link.direction]}</span>{name}
          {link.isNew && <NewBadge />}
        </span>
        <span className="text-[11.5px] leading-snug text-ink-soft">{link.label}</span>
        {link.source && <span className="mt-auto pt-1 font-mono text-[9.5px] text-faint">{link.source}</span>}
      </Link>
    </li>
  );
}
