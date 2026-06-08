import type { HandoffColumn, HandoffNode } from "@/content/types";
import { zoneColor } from "@/content/zones";

function Pill({ node }: { node: HandoffNode }) {
  const c = zoneColor(node.zone);
  return (
    <span
      className="whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-bold"
      style={{ background: `color-mix(in srgb, ${c} 12%, white)`, borderColor: `color-mix(in srgb, ${c} 40%, white)`, color: c }}
    >
      {node.label}
    </span>
  );
}

/** Карта передач: 4 колонки-потока «роль → что → роль» (pill-флоу), тематически по зонам ролей. */
export function HandoffFlows({ columns }: { columns: HandoffColumn[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {columns.map((col) => (
        <div key={col.title} className="rounded-2xl border border-line bg-surface-soft p-4">
          <h3 className="mb-3 flex items-center gap-2 font-display text-[12.5px] font-extrabold uppercase tracking-wide text-ink">
            <span aria-hidden="true">{col.emoji}</span>{col.title}
          </h3>
          <div className="flex flex-col gap-2.5">
            {col.flows.map((f, i) => (
              <div key={i} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <Pill node={f.from} />
                <span className="font-display font-extrabold text-muted" aria-hidden="true">→</span>
                <span className="italic text-muted">{f.what}</span>
                <span className="font-display font-extrabold text-muted" aria-hidden="true">→</span>
                <Pill node={f.to} />
                {f.also && (
                  <>
                    <span className="font-display font-extrabold text-muted" aria-hidden="true">+</span>
                    <Pill node={f.also} />
                  </>
                )}
                {f.suffix && <span className="italic text-faint">({f.suffix})</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
