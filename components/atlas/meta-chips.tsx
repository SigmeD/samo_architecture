import type { MetaChip } from "@/content/overview-types";

export function MetaChips({ items }: { items: MetaChip[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((m, i) => (
        <span key={i} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-samo-green" aria-hidden="true" />
          {m.value && <b className="font-display font-extrabold text-samo-blue">{m.value}</b>} {m.label}
          {m.unverified && (
            <span className="ml-1 rounded bg-samo-orange-l px-1 text-[8px] font-extrabold uppercase tracking-wide text-samo-orange-d" title="требует подтверждения канона">
              на подтверждении
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
