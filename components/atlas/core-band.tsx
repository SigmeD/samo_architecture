import type { CoreEngine } from "@/content/overview-types";

export function CoreBand({ core }: { core: CoreEngine }) {
  return (
    <div className="core-band-bg relative grid grid-cols-[auto_1fr] items-center gap-5 overflow-hidden rounded-2xl px-6 py-5 text-white shadow-[0_16px_34px_-16px_rgba(0,60,120,0.7)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-3xl" aria-hidden="true">{core.emoji}</div>
      <div>
        <div className="font-display text-lg font-extrabold">{core.title}</div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {core.feats.map((f, i) => (
            <span key={i} className="rounded-lg border border-white/25 bg-white/15 px-2.5 py-1 text-xs">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
