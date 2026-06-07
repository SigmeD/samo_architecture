import type { MetaChip } from "@/content/overview-types";
import { MetaChips } from "@/components/atlas/meta-chips";

export function PosterHeader({ eyebrow, title, lead, meta }: { eyebrow: string; title: string; lead: string; meta: MetaChip[] }) {
  return (
    <header className="poster-header-tex border-b border-line px-6 pb-5 pt-8 md:px-10">
      <div className="flex items-center gap-2.5 font-display text-[11px] font-bold uppercase tracking-[3px] text-samo-blue">
        <span className="inline-block h-0.5 w-7 rounded bg-samo-orange" aria-hidden="true" />
        {eyebrow}
      </div>
      <h1 className="my-2.5 font-display text-3xl font-extrabold leading-tight text-samo-blue-d md:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm text-ink">{lead}</p>
      <MetaChips items={meta} />
    </header>
  );
}
