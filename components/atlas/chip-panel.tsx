import { zoneColor } from "@/content/zones";
import type { CrossModule, DataGroup } from "@/content/overview-types";

export function CrossModulesPanel({ modules }: { modules: CrossModule[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_8px_20px_-16px_rgba(11,44,82,0.4)]">
      <div className="mb-3 font-display text-[12.5px] font-extrabold uppercase tracking-wider text-samo-blue-d">
        <span aria-hidden="true">⚙️</span> Сквозные модули
      </div>
      <div className="flex flex-wrap gap-2">
        {modules.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-tint px-2.5 py-1.5 text-[10.5px] font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: zoneColor(m.zone) }} aria-hidden="true" />
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DataPanel({ groups }: { groups: DataGroup[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_8px_20px_-16px_rgba(11,44,82,0.4)]">
      <div className="mb-3 font-display text-[12.5px] font-extrabold uppercase tracking-wider text-samo-blue-d">
        <span aria-hidden="true">🗄️</span> Данные и интеграции
      </div>
      <ul className="flex flex-col gap-2">
        {groups.map((g, i) => (
          <li key={i} className="rounded-lg border border-line bg-surface-tint px-3 py-2 text-[10.5px] text-ink-soft">
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-faint">{g.label}</span>
            <div>{g.items.join(" · ")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
