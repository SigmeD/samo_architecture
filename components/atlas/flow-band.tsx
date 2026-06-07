import type { FlowBand as FlowBandT, FlowStep } from "@/content/overview-types";

function Step({ s }: { s: FlowStep }) {
  const tone =
    s.variant === "alt" ? "bg-samo-orange-l border-samo-orange-b"
    : s.variant === "end" ? "bg-samo-green-l border-samo-green-b"
    : "bg-white border-line";
  const ktone =
    s.variant === "alt" ? "text-samo-orange-d"
    : s.variant === "end" ? "text-samo-green-d"
    : "text-samo-blue";
  return (
    <div className={`flex flex-1 flex-col gap-0.5 rounded-xl border p-2.5 ${tone}`}>
      <span className={`text-[8.5px] font-extrabold uppercase tracking-wide ${ktone}`}>{s.k}</span>
      <span className="text-[10.5px] font-medium leading-tight text-ink">{s.v}</span>
    </div>
  );
}

export function FlowBand({ band }: { band: FlowBandT }) {
  return (
    <div className="mb-3 rounded-2xl border border-line bg-surface-soft p-4">
      <div className="mb-3 flex items-center gap-2 font-display text-sm font-extrabold text-samo-blue-d">
        <span aria-hidden="true">{band.emoji}</span>
        {band.title}
        {band.note && (
          <span className="ml-auto rounded-lg border border-samo-orange-b bg-samo-orange-l px-2.5 py-1 text-[10px] font-bold text-samo-orange-d">{band.note}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {band.steps.map((s, i) => <Step key={i} s={s} />)}
        {band.branch && (
          <div className="flex flex-[1.4] flex-col gap-2 sm:flex-row">
            {band.branch.map((s, i) => <Step key={i} s={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
