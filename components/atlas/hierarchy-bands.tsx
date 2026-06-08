import Link from "next/link";
import type { HierarchyTier, HierarchyRole, ZoneKey } from "@/content/types";
import { zoneColor } from "@/content/zones";

/** Карточка роли в полосе иерархии: заголовок (+ тег), подпись; пунктир — модель-зависимая; кликабельна при slug. */
function RoleCard({ role, zone }: { role: HierarchyRole; zone: ZoneKey }) {
  const c = zoneColor(zone);
  const inner = (
    <>
      <span className="flex flex-wrap items-center gap-1.5 text-[13px] font-bold text-ink">
        {role.title}
        {role.tag && <span className="rounded border border-line bg-surface-tint px-1.5 py-0.5 text-[9px] font-semibold text-muted">{role.tag}</span>}
      </span>
      <small className="text-[10.5px] font-medium text-muted">{role.caption}</small>
    </>
  );
  const cls = `flex flex-col gap-0.5 rounded-xl border bg-white px-3.5 py-2 ${role.dashed ? "border-dashed" : ""}`;
  const style = { borderColor: `color-mix(in srgb, ${c} ${role.dashed ? 45 : 55}%, white)` };
  return role.slug ? (
    <Link href={`/cabinet/${role.slug}`} className={`${cls} transition hover:-translate-y-0.5 hover:shadow-md`} style={style}>{inner}</Link>
  ) : (
    <div className={cls} style={style}>{inner}</div>
  );
}

/** Иерархия ролей: вертикальные полосы-уровни (label + карточки ролей) со стрелками-коннекторами вниз. */
export function HierarchyBands({ tiers }: { tiers: HierarchyTier[] }) {
  return (
    <div className="flex flex-col gap-0">
      {tiers.map((t, i) => {
        const c = zoneColor(t.zone);
        return (
          <div key={i}>
            <div className="flex flex-col gap-2.5 md:flex-row md:items-stretch md:gap-3.5">
              <div
                className="flex w-full shrink-0 flex-col justify-center rounded-xl border px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-wide md:w-[152px]"
                style={{ background: `color-mix(in srgb, ${c} 12%, white)`, borderColor: `color-mix(in srgb, ${c} 35%, white)`, color: c }}
              >
                {t.label}
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-2.5 py-1">
                {t.roles.map((r, j) => <RoleCard key={j} role={r} zone={t.zone} />)}
              </div>
            </div>
            {t.connector === "down" && <div className="flex justify-center py-1 font-display text-base text-muted" aria-hidden="true">↓</div>}
          </div>
        );
      })}
    </div>
  );
}
