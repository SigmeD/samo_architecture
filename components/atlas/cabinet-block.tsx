import Link from "next/link";
import type { CabinetSpec } from "@/content/types";
import { zoneColor } from "@/content/zones";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";

export function CabinetBlock({ cabinet }: { cabinet: CabinetSpec }) {
  return (
    <Link href={`/cabinet/${cabinet.slug}`}
      className="group block rounded-lg border bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTopColor: zoneColor(cabinet.zone), borderTopWidth: 3 }}
      aria-disabled={cabinet.isStub ? "true" : undefined}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-display font-bold text-gray-900"><span aria-hidden="true">{cabinet.role.emoji}</span> {cabinet.role.title}</span>
        <ImplStatusBadge status={cabinet.implStatus} />
      </div>
      <div className="mt-0.5 font-mono text-[11px] text-gray-500">{cabinet.role.code}</div>
      {cabinet.isStub && <div className="mt-1 text-xs text-gray-400">в разработке</div>}
      <span className="mt-1 inline-block text-xs text-samo-blue opacity-0 transition group-hover:opacity-100">↗</span>
    </Link>
  );
}
