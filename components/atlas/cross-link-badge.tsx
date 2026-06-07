import Link from "next/link";
import type { CrossLink, ZoneKey } from "@/content/types";
import { getCabinet } from "@/content/cabinets";
import { zoneColor } from "@/content/zones";

const GLYPH: Record<CrossLink["direction"], string> = { in: "←", out: "→", both: "⇄" };

export function CrossLinkBadge({ link }: { link: CrossLink }) {
  const target = getCabinet(link.toCabinet);
  const zone = (target?.zone ?? "blue") as ZoneKey;
  const name = target?.role.title ?? link.toCabinet;
  return (
    <li className="rounded border border-gray-200 p-2 text-sm">
      <Link href={`/cabinet/${link.toCabinet}`} className="font-medium hover:underline" style={{ color: zoneColor(zone) }}>
        <span aria-hidden="true" className="mr-1 text-gray-500">{GLYPH[link.direction]}</span>{name}
      </Link>
      <p className="mt-1 text-gray-700">{link.label}</p>
    </li>
  );
}
