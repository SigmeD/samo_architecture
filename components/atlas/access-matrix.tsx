import type { AccessMatrix as AccessMatrixType, AccessLevel, MatrixCell } from "@/content/types";

const SYM: Record<AccessLevel, { ch: string; cls: string }> = {
  full: { ch: "●", cls: "text-samo-green-d" },
  partial: { ch: "◐", cls: "text-zone-teal" },
  view: { ch: "👁", cls: "text-samo-blue" },
  toggle: { ch: "⚙", cls: "text-samo-orange-d" },
  none: { ch: "—", cls: "text-faint" },
};

const LEGEND: { lvl: AccessLevel; label: string }[] = [
  { lvl: "full", label: "полный (создаёт/редактирует)" },
  { lvl: "partial", label: "частичный (в своей зоне)" },
  { lvl: "view", label: "просмотр (read-only)" },
  { lvl: "toggle", label: "под feature-toggle" },
  { lvl: "none", label: "нет доступа" },
];

const toCell = (c: AccessLevel | MatrixCell): MatrixCell => (typeof c === "string" ? { level: c } : c);

/** Матрица «роль × раздел × право»: символы доступа (канон RBAC v1.4), ⚠ — расхождение с намерением. Sticky-колонка ролей. */
export function AccessMatrix({ matrix }: { matrix: AccessMatrixType }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[1000px] border-collapse text-[11.5px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border border-line bg-samo-blue-l px-2.5 py-2 text-left text-[10.5px] font-bold text-samo-blue-d">Роль \ Раздел</th>
              {matrix.sections.map((s) => (
                <th key={s} className="border border-line bg-samo-blue-l px-1 py-2 text-center align-bottom text-[10px] font-bold leading-tight text-samo-blue-d">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row.role} className="even:bg-surface-tint">
                <th className="sticky left-0 z-10 whitespace-nowrap border border-line bg-white px-2.5 py-1.5 text-left text-[11.5px] font-bold text-ink">
                  {row.role}
                  {row.offCanon && <span className="ml-1.5 align-middle text-[9px] font-semibold text-faint" title="роль спроектирована, но в RBAC v1.4 не внесена">вне канона</span>}
                </th>
                {row.cells.map((raw, i) => {
                  const cell = toCell(raw);
                  const s = SYM[cell.level];
                  return (
                    <td key={i} className="border border-line px-1 py-1 text-center align-middle" title={cell.note}>
                      <span className={`text-[13px] font-extrabold ${s.cls}`}>{s.ch}</span>
                      {cell.divergent && <sup className="ml-0.5 text-[10px] font-bold text-samo-orange-d">⚠</sup>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-soft">
        {LEGEND.map(({ lvl, label }) => (
          <span key={lvl} className="flex items-center gap-1.5">
            <span className={`text-[13px] font-extrabold ${SYM[lvl].cls}`}>{SYM[lvl].ch}</span>{label}
          </span>
        ))}
        <span className="flex items-center gap-1.5"><span className="font-bold text-samo-orange-d">⚠</span>расхождение с каноном</span>
      </div>
    </div>
  );
}
