import Link from "next/link";
import { zoneColor } from "@/content/zones";
import type { OverviewCabinet } from "@/content/overview-types";

export function OverviewCabinetCard({ cab }: { cab: OverviewCabinet }) {
  const accent = zoneColor(cab.zone);
  return (
    <Link
      href={`/cabinet/${cab.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-[0_8px_20px_-14px_rgba(11,44,82,0.4)] transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className="absolute inset-y-0 left-0 w-[5px]" style={{ background: accent }} aria-hidden="true" />
      <div className="mb-2.5 flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xl"
          style={{ background: `color-mix(in srgb, ${accent} 12%, white)`, borderColor: `color-mix(in srgb, ${accent} 35%, white)` }}
          aria-hidden="true"
        >
          {cab.emoji}
        </span>
        <div>
          <div className="font-display text-base font-extrabold leading-tight" style={{ color: accent }}>{cab.name}</div>
          <span className="mt-0.5 block text-[11px] font-semibold text-muted">{cab.roleCaption}</span>
        </div>
      </div>
      <ul className={`flex flex-col gap-1.5 ${cab.hero ? "sm:grid sm:grid-cols-2 sm:gap-x-5" : ""}`}>
        {cab.highlights.map((h, i) => (
          <li key={i} className="relative pl-3.5 text-[11.7px] leading-snug text-ink-soft">
            <span className="absolute left-0.5 top-1.5 h-1.5 w-1.5 rounded-[2px]" style={{ background: accent }} aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>
    </Link>
  );
}
