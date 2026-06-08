import type { CabinetSpec } from "@/content/types";
import { zoneColor } from "@/content/zones";

/**
 * Панель «Роль, границы и инварианты» — внизу страницы кабинета (перенесена из шапки, решение владельца).
 * Рендерит `purpose` читаемо: разбивает на предложения, обычные сводит в абзацы, а сегменты «⚠️ …»
 * (поправки к постеру / расхождения) и «ГРАНИЦЫ …» выносит в выделенные callout-блоки. Тематически по зоне.
 */
type Block = { kind: "p" | "warn" | "bound"; text: string };

function toBlocks(purpose: string): Block[] {
  const sentences = purpose
    .split(/(?<=[.;])\s+(?=[«"“A-ZА-ЯЁ⚠])/)
    .map((s) => s.trim())
    .filter(Boolean);
  const blocks: Block[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) blocks.push({ kind: "p", text: buf.join(" ") });
    buf = [];
  };
  for (const s of sentences) {
    if (s.includes("⚠️")) {
      flush();
      blocks.push({ kind: "warn", text: s.replace(/⚠️\s*/g, "").replace(/^Поправк[аи][^:]*:\s*/i, "") });
    } else if (/^границ[аы]/i.test(s)) {
      flush();
      blocks.push({ kind: "bound", text: s.replace(/^границ[аы]:?\s*/i, "") });
    } else {
      buf.push(s);
    }
  }
  flush();
  return blocks;
}

export function RoleSummary({ cabinet }: { cabinet: CabinetSpec }) {
  const c = zoneColor(cabinet.zone);
  const blocks = toBlocks(cabinet.purpose);
  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl border p-5 md:p-6"
      style={{ borderColor: `color-mix(in srgb, ${c} 35%, white)`, background: `color-mix(in srgb, ${c} 4%, white)` }}
    >
      <div className="mb-3.5 flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white text-base"
          style={{ borderColor: `color-mix(in srgb, ${c} 35%, white)` }}
          aria-hidden="true"
        >
          📋
        </span>
        <h2 className="font-display text-sm font-extrabold uppercase tracking-wide" style={{ color: c }}>
          Роль, границы и инварианты
        </h2>
      </div>
      <div className="flex max-w-3xl flex-col gap-2.5">
        {blocks.map((b, i) =>
          b.kind === "p" ? (
            <p key={i} className="text-[13px] leading-relaxed text-ink-soft">{b.text}</p>
          ) : b.kind === "warn" ? (
            <p
              key={i}
              className="rounded-r-lg border-l-[3px] border-samo-orange bg-samo-orange-l px-3 py-2 text-[12.5px] leading-relaxed text-samo-orange-d"
            >
              <b>⚠️ Поправка к постеру.</b> {b.text}
            </p>
          ) : (
            <p
              key={i}
              className="rounded-r-lg border-l-[3px] bg-surface-tint px-3 py-2 text-[12.5px] leading-relaxed text-ink-soft"
              style={{ borderColor: c }}
            >
              <b className="text-ink">Границы роли.</b> {b.text}
            </p>
          ),
        )}
      </div>
    </section>
  );
}
