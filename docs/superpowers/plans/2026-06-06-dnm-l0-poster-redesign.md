# L0 Poster Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить L0 обзорный постер (`app/page.tsx`) в полированную «постер-стилистику» эталона `docs/architecture/dnm-architecture-poster.html`, с богатым контентом по канону.

**Architecture:** Контент-как-данные: расширяем `OverviewSpec` (типизированные TS + Zod), рендерим дженерик-RSC из `components/atlas/*`. Все цвета — токены `styles/brand.css` `@theme` (0 hex в компонентах). Сложные градиенты/текстуры — утилити-классы в `brand.css`. Поэтапно по этажам кабинетов (спека §7а); незаполненные кабинеты остаются стабами.

**Tech Stack:** Next.js 15 (App Router, RSC, SSG), TS strict, Tailwind v4 (`@theme`), Vitest + @testing-library/react, Playwright (screenshot-diff), Zod.

**Спека:** `docs/superpowers/specs/2026-06-06-dnm-poster-style-redesign-design.md`
**Референс стилистики/контента:** `docs/architecture/dnm-architecture-poster.html` (+ `.png`)

---

## File Structure

**Создаём:**
- `components/atlas/poster-frame.tsx` — каркас: top-bar + градиент-фон + frame (заменяет использование `PosterLayout` на L0).
- `components/atlas/poster-header.tsx` — шапка: eyebrow + H1 + lead + meta-чипы.
- `components/atlas/meta-chips.tsx` — строка счётчиков с бейджем «на подтверждении».
- `components/atlas/section-header.tsx` — нумерованный заголовок секции (01/02…).
- `components/atlas/core-band.tsx` — синяя градиент-лента ядра с feature-чипами.
- `components/atlas/tier-label.tsx` — лейбл этажа (uppercase + линия).
- `components/atlas/overview-cabinet-card.tsx` — карточка кабинета L0 (left-stripe + икон-тайл + буллеты), hero-вариант.
- `components/atlas/flow-band.tsx` — process-flow L0 (цепочка step + alt/end + branch).
- `components/atlas/chip-panel.tsx` — панель сквозных модулей (чипы) и панель данных (список).
- `components/atlas/result-banner.tsx` — итоговый градиент-баннер.
- `content/overview-types.ts` — типы расширенной `OverviewSpec`.

**Модифицируем:**
- `styles/brand.css` — добавить полный набор цветовых токенов + утилити-классы градиентов.
- `content/schema.ts` — Zod-схема `OverviewSchema`.
- `content/overview.ts` — новые данные L0 (по этажам + ядро + процессы + модули + result).
- `app/page.tsx` — сборка из новых компонентов.
- `tests/content/overview.test.ts` — под новую модель.
- `e2e/atlas.spec.ts` — новый golden-снимок L0.

**Принцип именования токенов brand.css:** `--color-samo-<hue>` (бренд) и зональные `--color-zone-<key>[-l|-b|-d]` где `l`=light-фон, `b`=border, `d`=dark-текст. Нейтральные — `--color-ink/-muted/-faint/-line`.

---

## Phase 0 — Pre-flight

### Task 0: Базовая линия зелёная + ветка

- [ ] **Step 1: Убедиться, что текущий код собирается и тесты зелёные**

Run:
```bash
npm run typecheck && npm run test && npm run build
```
Expected: всё PASS (срез Куратора уже собран). Если падает — STOP, чинить до начала.

- [ ] **Step 2: Завести ветку редизайна**

Run:
```bash
git checkout -b feature/poster-style-redesign
```
Expected: переключение на новую ветку (изоляция от `feature/curator-vertical-slice`).

- [ ] **Step 3: Проверить доступность канона MCP**

Через MCP `project-docs` вызвать `list_index` (фильтр по `apps` = ДНМ). Expected: индекс возвращается. Если MCP недоступен → STOP, сообщить владельцу (CLAUDE.md правило 2/5: не галлюцинировать контракты). Канон-верификация (Task 9) от этого зависит.

---

## Phase 1 — Design tokens

### Task 1: Полный набор цветовых токенов в `brand.css`

**Files:** Modify `styles/brand.css`

- [ ] **Step 1: Расширить `@theme` токенами палитры постера**

Заменить блок `@theme {…}` на (значения hex взяты из `dnm-architecture-poster.html` `:root`, это ЕДИНСТВЕННОЕ легальное место hex):
```css
@theme {
  /* brand */
  --color-samo-blue: #0055A7;
  --color-samo-blue-d: #013a72;
  --color-samo-blue-2: #1f72c4;
  --color-samo-blue-l: #e9f1fb;
  --color-samo-blue-b: #bcd5ef;
  --color-samo-orange: #F7933C;
  --color-samo-orange-d: #a55c16;
  --color-samo-orange-l: #fdefdf;
  --color-samo-orange-b: #f1c894;
  --color-samo-green: #00A550;
  --color-samo-green-d: #0a6c3c;
  --color-samo-green-l: #e6f6ec;
  --color-samo-green-b: #aee0c1;
  /* zonal */
  --color-zone-blue: #0055A7;
  --color-zone-teal: #0E8E8E;
  --color-zone-teal-d: #0a5d5d; --color-zone-teal-l: #e2f4f4; --color-zone-teal-b: #a3d8d8;
  --color-zone-purple: #6f54be;
  --color-zone-purple-d: #4a3683; --color-zone-purple-l: #eee9fa; --color-zone-purple-b: #c9bbeb;
  --color-zone-gold: #B7791F;
  --color-zone-gold-d: #7f5512; --color-zone-gold-l: #fbf1da; --color-zone-gold-b: #e7cd92;
  --color-zone-slate: #566778;
  --color-zone-slate-d: #36434f; --color-zone-slate-l: #eef2f7; --color-zone-slate-b: #cdd9e5;
  --color-status-divergent: #9c2b2b;
  /* neutrals */
  --color-ink: #14212e;
  --color-muted: #62748a;
  --color-faint: #8497a8;
  --color-line: #d8e2ee;
  /* fonts */
  --font-sans: "Roboto", system-ui, sans-serif;
  --font-display: "Fira Sans", system-ui, sans-serif;
}
```

- [ ] **Step 2: Добавить утилити-классы градиентов/текстур** (после `@theme`)

```css
/* poster surfaces — держат сложные фоны вне TSX, чтобы в компонентах не было hex */
.poster-page-bg {
  background:
    radial-gradient(1100px 520px at 82% -8%, color-mix(in srgb, var(--color-samo-orange) 10%, transparent), transparent 60%),
    radial-gradient(1300px 680px at 8% 4%, color-mix(in srgb, var(--color-samo-blue) 12%, transparent), transparent 58%),
    linear-gradient(160deg, #e8eef6, #f4f8fc);
}
.poster-top-bar {
  background: linear-gradient(90deg, var(--color-samo-blue) 0%, var(--color-samo-blue-2) 45%, var(--color-zone-teal) 70%, var(--color-samo-green) 100%);
}
.poster-header-tex {
  background:
    radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-samo-blue) 7%, transparent) 1px, transparent 0) 0 0/22px 22px,
    linear-gradient(180deg, #f7fafd, #ffffff);
}
.core-band-bg { background: linear-gradient(120deg, var(--color-samo-blue) 0%, var(--color-samo-blue-d) 100%); }
.result-band-bg { background: linear-gradient(120deg, var(--color-samo-green-l), #d4eede 55%, var(--color-samo-blue-l)); }
```

- [ ] **Step 3: Проверить сборку стилей**

Run: `npm run build`
Expected: PASS (Tailwind v4 принимает токены; классы доступны как `bg-samo-blue-l`, `text-ink`, `border-line` и т.д.).

- [ ] **Step 4: Commit**

```bash
git add styles/brand.css
git commit -m "feat(tokens): полная палитра постера + утилити-классы градиентов"
```

---

## Phase 2 — Content model

### Task 2: Типы расширенной `OverviewSpec`

**Files:** Create `content/overview-types.ts`; Test `tests/content/overview.test.ts`

- [ ] **Step 1: Написать типы**

```ts
import type { ZoneKey } from "@/content/types";

export interface MetaChip { label: string; value?: string; unverified?: boolean }
export interface CoreEngine { emoji: string; title: string; feats: string[] }

export interface OverviewCabinet {
  slug: string; emoji: string; name: string; roleCaption: string;
  zone: ZoneKey; hero?: boolean; highlights: string[];
}
export interface OverviewTier { title: string; cabinets: OverviewCabinet[] }

export interface FlowStep { k: string; v: string; variant?: "alt" | "end" }
export interface FlowBand { emoji: string; title: string; note?: string; steps: FlowStep[]; branch?: FlowStep[] }

export interface CrossModule { label: string; zone: ZoneKey }
export interface DataGroup { label: string; items: string[] }
export interface ResultBanner { emoji: string; title: string; sub: string }

export interface OverviewSpec {
  header: { eyebrow: string; title: string; lead: string; meta: MetaChip[] };
  core: CoreEngine;
  tiers: OverviewTier[];
  processes: FlowBand[];
  crossModules: CrossModule[];
  dataLayer: DataGroup[];
  result: ResultBanner;
}
```

- [ ] **Step 2: Commit (типы первыми, данные — позже)**

```bash
git add content/overview-types.ts
git commit -m "feat(content): типы расширенной OverviewSpec (L0)"
```

### Task 3: Zod-схема `OverviewSchema`

**Files:** Modify `content/schema.ts`; Test `tests/content/schema.test.ts`

- [ ] **Step 1: Добавить failing-тест в `tests/content/schema.test.ts`**

```ts
import { OverviewSchema } from "@/content/schema";
import { overview } from "@/content/overview";

it("overview проходит OverviewSchema", () => {
  expect(() => OverviewSchema.parse(overview)).not.toThrow();
});
it("каждый кабинет L0 несёт ≥1 highlight", () => {
  const cabs = overview.tiers.flatMap((t) => t.cabinets);
  for (const c of cabs) expect(c.highlights.length, c.slug).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Запустить — упадёт (нет OverviewSchema)**

Run: `npm run test -- schema`
Expected: FAIL — `OverviewSchema` не экспортирован.

- [ ] **Step 3: Добавить схему в `content/schema.ts`**

```ts
const MetaChip = z.object({ label: z.string(), value: z.string().optional(), unverified: z.boolean().optional() });
const OverviewCabinet = z.object({
  slug: z.string(), emoji: z.string(), name: z.string(), roleCaption: z.string(),
  zone: ZoneKey, hero: z.boolean().optional(), highlights: z.array(z.string()).min(1),
});
const FlowStep = z.object({ k: z.string(), v: z.string(), variant: z.enum(["alt", "end"]).optional() });
const FlowBand = z.object({ emoji: z.string(), title: z.string(), note: z.string().optional(), steps: z.array(FlowStep).min(1), branch: z.array(FlowStep).optional() });

export const OverviewSchema = z.object({
  header: z.object({
    eyebrow: z.string(), title: z.string(), lead: z.string(),
    meta: z.array(MetaChip),
  }),
  core: z.object({ emoji: z.string(), title: z.string(), feats: z.array(z.string()).min(1) }),
  tiers: z.array(z.object({ title: z.string(), cabinets: z.array(OverviewCabinet).min(1) })).min(1),
  processes: z.array(FlowBand),
  crossModules: z.array(z.object({ label: z.string(), zone: ZoneKey })),
  dataLayer: z.array(z.object({ label: z.string(), items: z.array(z.string()) })),
  result: z.object({ emoji: z.string(), title: z.string(), sub: z.string() }),
});
export function validateOverview(x: unknown) { return OverviewSchema.parse(x); }
```

- [ ] **Step 4: Тест пока падает на parse (старый overview.ts не соответствует)** — это ожидаемо; данные приведём в Task 8. Зафиксировать только схему.

Run: `npm run test -- schema` → FAIL на parse — нормально, продолжаем (зелёным станет после Task 8).

- [ ] **Step 5: Commit**

```bash
git add content/schema.ts tests/content/schema.test.ts
git commit -m "feat(content): Zod OverviewSchema (данные приведём в Task 8)"
```

---

## Phase 3 — Poster-style components (TDD)

> Все компоненты — RSC (без `"use client"`), цвета только через токен-классы/`var()`, шрифты через `font-display`/`font-sans`. Зональный акцент берём через инлайн `style={{ ... var(--color-zone-…) }}` ТОЛЬКО для динамического цвета по `zone` (не hex).

### Task 4: `MetaChips`

**Files:** Create `components/atlas/meta-chips.tsx`; Test `tests/components/meta-chips.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaChips } from "@/components/atlas/meta-chips";

describe("MetaChips", () => {
  it("рендерит значение и подпись", () => {
    render(<MetaChips items={[{ label: "кабинетов", value: "11" }]} />);
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("кабинетов")).toBeInTheDocument();
  });
  it("unverified → метка «на подтверждении»", () => {
    render(<MetaChips items={[{ label: "модулей", value: "73", unverified: true }]} />);
    expect(screen.getByText(/на подтверждении/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL** (`npm run test -- meta-chips`) — компонент не найден.

- [ ] **Step 3: Реализация**

```tsx
import type { MetaChip } from "@/content/overview-types";

export function MetaChips({ items }: { items: MetaChip[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((m, i) => (
        <span key={i} className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-zone-slate-d">
          <span className="h-1.5 w-1.5 rounded-full bg-samo-green" aria-hidden="true" />
          {m.value && <b className="font-display font-extrabold text-samo-blue">{m.value}</b>} {m.label}
          {m.unverified && <span className="ml-1 rounded bg-samo-orange-l px-1 text-[8px] font-extrabold uppercase text-samo-orange-d" title="требует подтверждения канона">на подтверждении</span>}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS** (`npm run test -- meta-chips`).

- [ ] **Step 5: Commit** — `git add components/atlas/meta-chips.tsx tests/components/meta-chips.test.tsx && git commit -m "feat(atlas): MetaChips (TDD)"`

### Task 5: `SectionHeader`, `TierLabel`

**Files:** Create `components/atlas/section-header.tsx`, `components/atlas/tier-label.tsx`; Test `tests/components/section-header.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/atlas/section-header";

describe("SectionHeader", () => {
  it("рендерит номер, заголовок (h2) и caption", () => {
    render(<SectionHeader no="02" title="Роли и кабинеты" caption="11 кабинетов" />);
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Роли и кабинеты" })).toBeInTheDocument();
    expect(screen.getByText("11 кабинетов")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Реализация `section-header.tsx`**

```tsx
export function SectionHeader({ no, title, caption }: { no: string; title: string; caption?: string }) {
  return (
    <div className="mt-7 mb-4 flex items-center gap-3.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-samo-blue font-display text-sm font-extrabold text-white">{no}</span>
      <h2 className="whitespace-nowrap font-display text-xl font-extrabold text-samo-blue-d">{title}</h2>
      {caption && <span className="text-xs text-muted">{caption}</span>}
      <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
    </div>
  );
}
```

- [ ] **Step 4: Реализация `tier-label.tsx`**

```tsx
export function TierLabel({ children }: { children: string }) {
  return (
    <div className="mt-4 mb-2.5 flex items-center gap-2.5 font-display text-xs font-extrabold uppercase tracking-[2px] text-faint">
      {children}<span className="h-px flex-1 bg-line" />
    </div>
  );
}
```

- [ ] **Step 5: Run → PASS. Commit** — `git add components/atlas/section-header.tsx components/atlas/tier-label.tsx tests/components/section-header.test.tsx && git commit -m "feat(atlas): SectionHeader + TierLabel (TDD)"`

### Task 6: `OverviewCabinetCard`

**Files:** Create `components/atlas/overview-cabinet-card.tsx`; Test `tests/components/overview-cabinet-card.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverviewCabinetCard } from "@/components/atlas/overview-cabinet-card";

const cab = { slug: "child", emoji: "🎓", name: "Кабинет ученика", roleCaption: "ребёнок 10–17", zone: "green" as const, hero: true, highlights: ["Уроки заранее", "СУ + Бизнес-проект"] };

describe("OverviewCabinetCard", () => {
  it("рендерит имя, роль и все highlights", () => {
    render(<OverviewCabinetCard cab={cab} />);
    expect(screen.getByText("Кабинет ученика")).toBeInTheDocument();
    expect(screen.getByText("ребёнок 10–17")).toBeInTheDocument();
    expect(screen.getByText("Уроки заранее")).toBeInTheDocument();
    expect(screen.getByText("СУ + Бизнес-проект")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Реализация** (left-stripe и икон-тайл красятся динамически по `zone` через `var()` — не hex)

```tsx
import { zoneColor } from "@/content/zones";
import type { OverviewCabinet } from "@/content/overview-types";

export function OverviewCabinetCard({ cab }: { cab: OverviewCabinet }) {
  const accent = zoneColor(cab.zone);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-[0_8px_20px_-14px_rgba(11,44,82,0.4)]">
      <span className="absolute inset-y-0 left-0 w-[5px]" style={{ background: accent }} aria-hidden="true" />
      <div className="mb-2.5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xl"
          style={{ background: `color-mix(in srgb, ${accent} 12%, white)`, borderColor: `color-mix(in srgb, ${accent} 35%, white)` }} aria-hidden="true">{cab.emoji}</span>
        <div>
          <div className="font-display text-base font-extrabold leading-tight" style={{ color: accent }}>{cab.name}</div>
          <span className="mt-0.5 block text-[11px] font-semibold text-muted">{cab.roleCaption}</span>
        </div>
      </div>
      <ul className={`flex flex-col gap-1.5 ${cab.hero ? "sm:grid sm:grid-cols-2 sm:gap-x-5" : ""}`}>
        {cab.highlights.map((h, i) => (
          <li key={i} className="relative pl-3.5 text-[11.7px] leading-snug text-[#33485c]">
            <span className="absolute left-0.5 top-1.5 h-1.5 w-1.5 rounded-[2px]" style={{ background: accent }} aria-hidden="true" />{h}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
> Примечание: `#33485c` — приглушённый текст карточки; вынести в токен `--color-ink-soft` в Task 1, если линт запрещает любой hex в TSX. Добавить `--color-ink-soft: #33485c;` в `@theme` и заменить класс на `text-ink-soft`.

- [ ] **Step 4: Скорректировать Task 1** — добавить `--color-ink-soft: #33485c;` в `@theme`, в карточке использовать `className="… text-ink-soft"` вместо инлайн-hex. Перезапустить `npm run build`.

- [ ] **Step 5: Run → PASS. Commit** — `git add components/atlas/overview-cabinet-card.tsx tests/components/overview-cabinet-card.test.tsx styles/brand.css && git commit -m "feat(atlas): OverviewCabinetCard (TDD)"`

### Task 7: `CoreBand`, `FlowBand`, `ChipPanel`, `ResultBanner`, `PosterFrame`, `PosterHeader`

**Files:** Create соответствующие файлы; Test `tests/components/flow-band.test.tsx`, `tests/components/result-banner.test.tsx`

- [ ] **Step 1: Failing tests (ключевые)**

```tsx
// tests/components/flow-band.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FlowBand } from "@/components/atlas/flow-band";

describe("FlowBand", () => {
  it("рендерит заголовок и все шаги (вкл. branch)", () => {
    render(<FlowBand band={{ emoji: "💼", title: "Воронка", steps: [{ k: "Маркетинг", v: "лид" }], branch: [{ k: "Пролонгация", v: "новый период", variant: "end" }] }} />);
    expect(screen.getByText("Воронка")).toBeInTheDocument();
    expect(screen.getByText("Маркетинг")).toBeInTheDocument();
    expect(screen.getByText("Пролонгация")).toBeInTheDocument();
  });
});
```
```tsx
// tests/components/result-banner.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultBanner } from "@/components/atlas/result-banner";
it("ResultBanner рендерит заголовок и подпись", () => {
  render(<ResultBanner banner={{ emoji: "🏆", title: "Итог", sub: "путь" }} />);
  expect(screen.getByText("Итог")).toBeInTheDocument();
  expect(screen.getByText("путь")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Реализации**

`components/atlas/core-band.tsx`:
```tsx
import type { CoreEngine } from "@/content/overview-types";
export function CoreBand({ core }: { core: CoreEngine }) {
  return (
    <div className="core-band-bg relative grid grid-cols-[auto_1fr] items-center gap-5 overflow-hidden rounded-2xl px-6 py-5 text-white shadow-[0_16px_34px_-16px_rgba(0,60,120,0.7)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-3xl" aria-hidden="true">{core.emoji}</div>
      <div>
        <div className="font-display text-lg font-extrabold">{core.title}</div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {core.feats.map((f, i) => <span key={i} className="rounded-lg border border-white/25 bg-white/15 px-2.5 py-1 text-xs">{f}</span>)}
        </div>
      </div>
    </div>
  );
}
```

`components/atlas/flow-band.tsx`:
```tsx
import type { FlowBand as FlowBandT, FlowStep } from "@/content/overview-types";

function Step({ s }: { s: FlowStep }) {
  const tone = s.variant === "alt" ? "bg-samo-orange-l border-samo-orange-b" : s.variant === "end" ? "bg-samo-green-l border-samo-green-b" : "bg-white border-line";
  const k = s.variant === "alt" ? "text-samo-orange-d" : s.variant === "end" ? "text-samo-green-d" : "text-samo-blue";
  return (
    <div className={`flex flex-1 flex-col gap-0.5 rounded-xl border p-2.5 ${tone}`}>
      <span className={`text-[8.5px] font-extrabold uppercase tracking-wide ${k}`}>{s.k}</span>
      <span className="text-[10.5px] font-medium leading-tight text-ink">{s.v}</span>
    </div>
  );
}
export function FlowBand({ band }: { band: FlowBandT }) {
  return (
    <div className="mb-3 rounded-2xl border border-line bg-[#fbfcfe] p-4">
      <div className="mb-3 flex items-center gap-2 font-display text-sm font-extrabold text-samo-blue-d">
        <span aria-hidden="true">{band.emoji}</span>{band.title}
        {band.note && <span className="ml-auto rounded-lg border border-samo-orange-b bg-samo-orange-l px-2.5 py-1 text-[10px] font-bold text-samo-orange-d">{band.note}</span>}
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {band.steps.map((s, i) => <Step key={i} s={s} />)}
        {band.branch && <div className="flex flex-[1.4] gap-2">{band.branch.map((s, i) => <Step key={i} s={s} />)}</div>}
      </div>
    </div>
  );
}
```
> `#fbfcfe` — почти-белый фон; добавить токен `--color-surface-soft: #fbfcfe;` в Task 1 и заменить на `bg-surface-soft`.

`components/atlas/chip-panel.tsx`:
```tsx
import { zoneColor } from "@/content/zones";
import type { CrossModule, DataGroup } from "@/content/overview-types";

export function CrossModulesPanel({ modules }: { modules: CrossModule[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_8px_20px_-16px_rgba(11,44,82,0.4)]">
      <div className="mb-3 font-display text-[12.5px] font-extrabold uppercase tracking-wider text-samo-blue-d">⚙️ Сквозные модули</div>
      <div className="flex flex-wrap gap-2">
        {modules.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-[#f5f8fc] px-2.5 py-1.5 text-[10.5px] font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: zoneColor(m.zone) }} aria-hidden="true" />{m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
export function DataPanel({ groups }: { groups: DataGroup[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_8px_20px_-16px_rgba(11,44,82,0.4)]">
      <div className="mb-3 font-display text-[12.5px] font-extrabold uppercase tracking-wider text-samo-blue-d">🗄️ Данные и интеграции</div>
      <ul className="flex flex-col gap-2">
        {groups.map((g, i) => (
          <li key={i} className="rounded-lg border border-line bg-[#f5f8fc] px-3 py-2 text-[10.5px] text-ink-soft">
            <span className="text-[9px] font-extrabold uppercase tracking-wide text-faint">{g.label}</span>
            <div>{g.items.join(" · ")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
> `#f5f8fc` → токен `--color-surface-tint`; заменить на `bg-surface-tint`.

`components/atlas/result-banner.tsx`:
```tsx
import type { ResultBanner as ResultBannerT } from "@/content/overview-types";
export function ResultBanner({ banner }: { banner: ResultBannerT }) {
  return (
    <div className="result-band-bg mt-5 flex items-center gap-4 rounded-2xl border border-samo-green-b px-6 py-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-samo-green-b bg-white text-2xl" aria-hidden="true">{banner.emoji}</div>
      <div>
        <div className="font-display text-lg font-extrabold text-samo-green-d">{banner.title}</div>
        <div className="mt-1 text-xs text-[#2c5a44]">{banner.sub}</div>
      </div>
    </div>
  );
}
```
> `#2c5a44` → токен `--color-green-soft`; заменить на `text-green-soft`.

`components/atlas/poster-frame.tsx`:
```tsx
import type { ReactNode } from "react";
export function PosterFrame({ children }: { children: ReactNode }) {
  return (
    <div className="poster-page-bg min-h-screen w-full px-4 py-7 md:px-7">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-line bg-white pb-7 shadow-[0_26px_70px_-24px_rgba(11,44,82,0.34)]">
        <div className="poster-top-bar absolute inset-x-0 top-0 h-[7px]" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
```

`components/atlas/poster-header.tsx`:
```tsx
import type { MetaChip } from "@/content/overview-types";
import { MetaChips } from "@/components/atlas/meta-chips";
export function PosterHeader({ eyebrow, title, lead, meta }: { eyebrow: string; title: string; lead: string; meta: MetaChip[] }) {
  return (
    <header className="poster-header-tex border-b border-line px-10 pb-5 pt-8">
      <div className="flex items-center gap-2.5 font-display text-[11px] font-bold uppercase tracking-[3px] text-samo-blue">
        <span className="inline-block h-0.5 w-7 rounded bg-samo-orange" aria-hidden="true" />{eyebrow}
      </div>
      <h1 className="my-2.5 font-display text-4xl font-extrabold leading-tight text-samo-blue-d">{title}</h1>
      <p className="max-w-3xl text-sm text-ink">{lead}</p>
      <MetaChips items={meta} />
    </header>
  );
}
```

- [ ] **Step 4: Run → PASS** (`npm run test`). Если линт ругается на оставшиеся hex (`#fbfcfe`, `#f5f8fc`, `#2c5a44`, `#33485c`) — добавить токены `--color-surface-soft/-tint`, `--color-green-soft`, `--color-ink-soft` в `@theme` (Task 1) и заменить инлайны на классы. Повторить `npm run build`.

- [ ] **Step 5: Commit** — `git add components/atlas styles/brand.css tests/components && git commit -m "feat(atlas): CoreBand, FlowBand, ChipPanel, ResultBanner, PosterFrame, PosterHeader (TDD)"`

---

## Phase 4 — Канон-верификация контента

### Task 9: Верифицировать факты L0 по канону (субагент)

**Files:** Create `docs/STATUS.md` (раздел «Канон-верификация L0»), временный `docs/_canon-l0-facts.md` (заметки)

- [ ] **Step 1: Сформировать список фактов к проверке** из `dnm-architecture-poster.html`:
счётчики (11 кабинетов / 73 модуля / 108 моделей / 4 семестра / языки ru-kz-tj-uz); ядро (тест ≥70%, солары, RBAC-scope, ИИ-аватар наставника); по кабинетам — денежные/нормативные (роялти 20%; выплаты Фикса+Бонус−Штраф; лимиты групп 5–8; наполнение 250/120; коэф. пробного 70–80%; «принято/не принято» без баллов; 3 пути регистрации; статусы договора активен/не активен/ждёт оплаты).

- [ ] **Step 2: Дispatch субагент `general-purpose`** с задачей: через MCP `project-docs` (`list_index` → `get_doc(<ID>)` со сверкой версии) подтвердить каждый факт; вернуть таблицу `факт → подтверждён? → значение по канону → ID+версия → расхождение`. Промпт обязан запрещать выдумывание: «если в каноне нет — пометь `НЕ НАЙДЕНО`, не угадывай».

- [ ] **Step 3: Зафиксировать результат** в `docs/STATUS.md` (раздел «Расхождения», badge `divergent` где надо). Факты со статусом подтверждён → пойдут в данные как есть; `НЕ НАЙДЕНО`/расхождение → в данных помечаем `unverified: true` (meta) или формулируем нейтрально.

- [ ] **Step 4: Commit** — `git add docs/STATUS.md && git commit -m "docs(canon): верификация фактов L0 (срез)"`

---

## Phase 5 — Контент L0 (поэтапно по этажам)

> Источник буллетов — `dnm-architecture-poster.html` (строки 184–412), скорректированный результатами Task 9. Каждый этаж — отдельный коммит; экран не ломается (незаполненные кабинеты — стабы). Ниже — ПОЛНЫЙ воркед-пример этажа «Потребители»; этажи 2–3 и блоки ядра/процессов/модулей транскрибируются из тех же строк HTML в ту же структуру с применением Task 9.

### Task 8: Каркас `overview.ts` + этаж «Потребители»

**Files:** Modify `content/overview.ts`; Test `tests/content/overview.test.ts`

- [ ] **Step 1: Переписать `tests/content/overview.test.ts` под новую модель**

```ts
import { describe, it, expect } from "vitest";
import { overview } from "@/content/overview";
import { getCabinet } from "@/content/cabinets";
import { OverviewSchema } from "@/content/schema";

it("overview валиден по схеме", () => { expect(() => OverviewSchema.parse(overview)).not.toThrow(); });
it("все slug'и кабинетов L0 есть в реестре", () => {
  for (const c of overview.tiers.flatMap((t) => t.cabinets)) expect(getCabinet(c.slug), c.slug).toBeDefined();
});
it("куратор присутствует", () => {
  expect(overview.tiers.flatMap((t) => t.cabinets).some((c) => c.slug === "curator")).toBe(true);
});
it("нет запретных формулировок (7 этапов / 0–100%)", () => {
  const blob = JSON.stringify(overview);
  expect(blob).not.toMatch(/7 этап/); expect(blob).not.toMatch(/0[–-]100%/);
});
```

- [ ] **Step 2: Run → FAIL** (старый overview.ts).

- [ ] **Step 3: Написать новый `content/overview.ts`** — каркас + этаж «Потребители» (ученик-hero, родитель, гость). Этажи 2–3 + ядро/процессы/модули/result добавляются в Task 10–11; пока их разделы — пустые массивы валидной формы, чтобы схема прошла:

```ts
import type { OverviewSpec } from "@/content/overview-types";

export const overview: OverviewSpec = {
  header: {
    eyebrow: "Экосистема SAMO · автономный образовательный модуль",
    title: "Архитектура модуля «Дети на миллион»",
    lead: "Детская Бизнес Академия предпринимательства · финансовая грамотность · 10–17 лет.",
    meta: [
      { label: "кабинетов", value: "11", unverified: true },
      { label: "модуля", value: "73", unverified: true },
      { label: "моделей данных", value: "108", unverified: true },
      { label: "4 семестра · постоянный набор" },
      { label: "ru / kz / tj / uz" },
    ],
  },
  core: { emoji: "🧠", title: "Учебный движок · Аналитика и KPI · Геймификация", feats: [] },
  tiers: [
    {
      title: "Потребители",
      cabinets: [
        { slug: "child", emoji: "🎓", name: "Кабинет ученика", roleCaption: "ребёнок 10–17 лет · потребитель обучения", zone: "green", hero: true,
          highlights: [
            "Уроки смотрит заранее → на занятии разбор фрагментов с куратором",
            "СУ (Система успеха) + Бизнес-проект — два отдельных блока",
            "Звёздочки за активность → солары, уровни, рейтинг, магазин",
            "ДЗ: статус «принято / не принято», средняя, успеваемость",
            "Сертификат как ритуал: ролик «путь успеха» → вручение",
            "ИИ-аватар наставника, «Зачем учиться» (топ-100)",
            "Расписание, чат группы, уведомления, профиль",
            "3 пробных урока на стадии знакомства с продуктом",
          ] },
        { slug: "parent", emoji: "👪", name: "Кабинет родителя", roleCaption: "контроль и оплата · отдельный аккаунт", zone: "blue",
          highlights: [
            "Мои дети: статусы активен / не активен / ждёт оплаты · реф-ссылка",
            "Центр контроля: мгновенное уведомление о непосещении урока",
            "Сводка: ДЗ «принято/не принято», рейтинг; отчёты куратора",
            "Старт с договора (онлайн-подпись) → оплата, рассрочка, график",
            "Расторжение договора (поэтапно) · приостановка («академ»)",
            "Чаты: куратор / админ / франчайзи · «поблагодарить» · опросы",
            "Расписание ребёнка · приобретённые курсы · программа",
          ] },
        { slug: "guest", emoji: "🚪", name: "Гость (онбординг)", roleCaption: "знакомство с продуктом до оплаты", zone: "green",
          highlights: [
            "Доступ к 3 пробным урокам на стадии знакомства",
            "Запись на пробный урок через менеджера",
            "Переход в ученика после договора и оплаты",
          ] },
      ],
    },
  ],
  processes: [],
  crossModules: [],
  dataLayer: [],
  result: { emoji: "🏆", title: "Финансово грамотный ребёнок и управляемая сеть школ",
    sub: "лид → пробный урок → договор → обучение → результат и пролонгация · непрерывный набор групп" },
};
```
> Факты `guest` («3 пробных урока», «через менеджера») — также в Task 9; если в каноне иначе — поправить.

- [ ] **Step 4: Run → схема + инварианты PASS** (`npm run test -- overview schema`). Если падает на «slug guest» — убедиться, что `guest` есть в `CABINETS` (есть, см. `content/cabinets/index.ts`).

- [ ] **Step 5: Commit** — `git add content/overview.ts tests/content/overview.test.ts && git commit -m "feat(content): L0 каркас + этаж «Потребители» (канон)"`

### Task 10: Этажи «Команда школы» и «Сеть и управление» + ядро

**Files:** Modify `content/overview.ts`

- [ ] **Step 1: Заполнить `core.feats`** (из HTML строки 188–194, с Task 9):
```ts
core: { emoji: "🧠", title: "Учебный движок · Аналитика и KPI · Геймификация", feats: [
  "урок-цикл, программа семестра, тесты ≥70%, экзамены",
  "дашборды, рейтинги, отчётность, аналитика CRM + счётчик",
  "звёздочки за активность → солары, уровни, достижения",
  "RBAC + scope-изоляция «своя школа / сеть»",
  "ИИ-аватар наставника — у ученика, родителя, куратора",
] },
```

- [ ] **Step 2: Добавить этаж «Операционная команда школы»** (куратор, ст. куратор, админ, менеджер, финансист, качество-и-контроль) — транскрибировать буллеты из HTML строк 241–304 в `OverviewCabinet[]` (zone: куратор/ст.куратор/менеджер `teal`, админ `orange`, финансист `gold`, качество `slate`). Куратор `slug:"curator"`; качество — отдельная карточка без своего маршрута (slug `quality`, добавить стаб в `CABINETS` если потребуется навигация, иначе `slug:"school-admin"` как контейнер — РЕШЕНИЕ: добавить стаб `quality` в `content/cabinets/index.ts`). Применить Task 9 (роялти 20%, лимиты 5–8, 250/120, коэф. 70–80%).

- [ ] **Step 3: Добавить этаж «Сеть и управление»** (франчайзи `purple`, куратор-франшиз `purple`, руководитель `blue`) — из HTML строк 309–337.

- [ ] **Step 4: Run → PASS** (`npm run test -- overview schema`). Убедиться, что новые slug'и есть в `CABINETS` (добавить стаб `quality` при необходимости — отдельный микрошаг с тестом `getCabinet("quality")`).

- [ ] **Step 5: Commit** — `git add content/overview.ts content/cabinets/index.ts && git commit -m "feat(content): этажи «Команда школы» + «Сеть» + ядро (канон)"`

### Task 11: Процессы + сквозные модули + данные

**Files:** Modify `content/overview.ts`

- [ ] **Step 1: `processes`** — две ленты из HTML строк 343–368:
```ts
processes: [
  { emoji: "💼", title: "Воронка продаж и пробного урока", note: "коэф. успешности куратора 70–80%", steps: [
    { k: "Маркетинг", v: "лид: таргет / органика / реклама / рекомендация" },
    { k: "Менеджер", v: "квалификация в CRM, запись на пробный" },
    { k: "3 урока", v: "доступ родителю + ребёнку (~1 час)" },
    { k: "Пробный урок", v: "куратор формирует ценность у родителя", variant: "alt" },
    { k: "Дожим", v: "продавец закрывает сделку (WhatsApp)", variant: "alt" },
    { k: "Договор → оплата", v: "логин/пароль ребёнку, доступ открыт", variant: "end" },
  ] },
  { emoji: "📄", title: "Жизненный цикл договора", note: "активен · не активен · ждёт оплаты", steps: [
    { k: "Договор", v: "онлайн-подпись или вложение с подписью" },
    { k: "Оплата", v: "онлайн/офлайн, рассрочка, график" },
    { k: "Доступ", v: "ученик + родитель на платформе" },
    { k: "Контроль", v: "прогресс, отчёты, обратная связь" },
  ], branch: [
    { k: "Пролонгация", v: "новый период", variant: "end" },
    { k: "Приостановка", v: "«академ» / каникулы" },
    { k: "Расторжение", v: "поэтапно → возврат", variant: "alt" },
  ] },
],
```

- [ ] **Step 2: `crossModules` + `dataLayer`** — из HTML строк 375–401 (чипы с зонами; группы данных Хранение / Видео и связь / Платформа SAMO).

- [ ] **Step 3: Run → PASS.** Commit — `git add content/overview.ts && git commit -m "feat(content): процессы + сквозные модули + данные L0 (канон)"`

---

## Phase 6 — Сборка страницы и golden

### Task 12: Собрать `app/page.tsx`

**Files:** Modify `app/page.tsx`

- [ ] **Step 1: Переписать страницу** на новые компоненты:
```tsx
import { PosterFrame } from "@/components/atlas/poster-frame";
import { PosterHeader } from "@/components/atlas/poster-header";
import { SectionHeader } from "@/components/atlas/section-header";
import { CoreBand } from "@/components/atlas/core-band";
import { TierLabel } from "@/components/atlas/tier-label";
import { OverviewCabinetCard } from "@/components/atlas/overview-cabinet-card";
import { FlowBand } from "@/components/atlas/flow-band";
import { CrossModulesPanel, DataPanel } from "@/components/atlas/chip-panel";
import { ResultBanner } from "@/components/atlas/result-banner";
import { overview } from "@/content/overview";

export default function Home() {
  const o = overview;
  return (
    <PosterFrame>
      <PosterHeader {...o.header} />
      <div className="px-10 pt-5">
        <SectionHeader no="01" title="Ядро модуля" caption="общий движок всех кабинетов" />
        <CoreBand core={o.core} />
        <SectionHeader no="02" title="Роли и кабинеты" caption="11 кабинетов в трёх контурах" />
        {o.tiers.map((t) => (
          <div key={t.title}>
            <TierLabel>{t.title}</TierLabel>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {t.cabinets.map((c) => <OverviewCabinetCard key={c.slug} cab={c} />)}
            </div>
          </div>
        ))}
        <SectionHeader no="03" title="Ключевые процессы" caption="сквозные бизнес-сценарии" />
        {o.processes.map((p, i) => <FlowBand key={i} band={p} />)}
        <SectionHeader no="04" title="Сквозные модули и платформа" caption="общие сервисы, данные, интеграции" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]">
          <CrossModulesPanel modules={o.crossModules} />
          <DataPanel groups={o.dataLayer} />
        </div>
        <ResultBanner banner={o.result} />
      </div>
    </PosterFrame>
  );
}
```
> Карточки кабинетов остаются кликабельными ссылками на `/cabinet/[slug]`. Если `OverviewCabinetCard` должна быть ссылкой — обернуть её содержимое в `next/link` `Link` (как `CabinetBlock`), сохранив доступность (нативный `<a>`). Добавить в Task 6: проп `href` + обёртка `<Link>`, тест на роль `link`. ВЫПОЛНИТЬ это уточнение Task 6 перед Task 12.

- [ ] **Step 2: hero-этаж шире** — этаж «Потребители» с hero-ученик: на десктопе ученик занимает 2 колонки. Реализовать через `className` контейнера первого тира (`md:grid-cols-[1.42fr_1fr]` для 2 карточек) ИЛИ оставить равные 3 колонки (упрощение). РЕШЕНИЕ: равные колонки (YAGNI) — hero-стиль карточки даёт визуальный акцент через 2-колоночные буллеты и крупнее не делаем. Зафиксировать в коде как есть.

- [ ] **Step 3: Run dev + ручная проверка** — `npm run dev`, открыть `/`. Сверить с `dnm-architecture-poster.png` (vision-first-ui gate 1 уже пройден при планировании). Проверить адаптив (1280 / 768 / 375).

- [ ] **Step 4: typecheck + build** — `npm run typecheck && npm run build` → PASS (статический экспорт).

- [ ] **Step 5: Commit** — `git add app/page.tsx components/atlas/overview-cabinet-card.tsx && git commit -m "feat(L0): сборка обзорного постера в постер-стилистике"`

### Task 13: Golden-screenshot L0 + STATUS

**Files:** Modify `e2e/atlas.spec.ts`; Modify `docs/STATUS.md`

- [ ] **Step 1: Обновить/добавить e2e-проверки L0** в `e2e/atlas.spec.ts`:
```ts
test("L0: постер рендерит секции и нет запретных формулировок", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "Роли и кабинеты" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Ключевые процессы" })).toBeVisible();
  await expect(page.getByText("Жизненный цикл договора")).toBeVisible();
  await expect(page.getByText("Финансово грамотный ребёнок", { exact: false })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("7 этап");
});
test("L0: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("overview-l0.png", { fullPage: true });
});
```

- [ ] **Step 2: Сгенерировать baseline** — `npm run e2e -- --update-snapshots`. Проверить артефакт `e2e/__screenshots__/overview-l0*.png` (Read скриншота — vision-first-ui gate 2, не верить отчёту вслепую).

- [ ] **Step 3: Прогнать e2e** — `npm run e2e` → PASS (функц. + визуал).

- [ ] **Step 4: Обновить `docs/STATUS.md`** — L0 редизайн собран; зеркало кода (компоненты, контент, golden). Сверить намерение (CLAUDE.md «Текущий статус» устарел — «репо docs-only» неверно; поднять вопрос владельцу отдельно, не править молча сверх STATUS).

- [ ] **Step 5: Commit** — `git add e2e docs/STATUS.md && git commit -m "test(e2e): golden L0 + STATUS (L0 редизайн собран)"`

---

## Self-Review (выполнен при написании)

- **Покрытие спеки:** §2 язык → Task 1,3–7; §4.1 L0 контент-модель → Task 2,3,8,10,11; §5 канон-верификация → Task 9; §6 golden → Task 13; §7а поэтапность → Phase 5 по этажам. ✓
- **Плейсхолдеры:** контент-буллеты этажа «Потребители», ядра, процессов — приведены полностью; этажи 2–3 ссылаются на точные строки `dnm-architecture-poster.html` (легальная транскрипция из источника, не «TBD»). Канон-верификация — отдельной задачей (факты нельзя выдумать без MCP). ✓
- **Согласованность типов:** `OverviewSpec`/`OverviewCabinet`/`FlowBand`/`MetaChip` едины в Task 2 (types), Task 3 (Zod), Task 8–12 (data+render). ✓
- **Известный долг:** hex-инлайны (`#33485c`, `#fbfcfe`, `#f5f8fc`, `#2c5a44`) в Task 6–7 переводятся в токены (`ink-soft`, `surface-soft`, `surface-tint`, `green-soft`) — явный шаг в Task 7 Step 4 (запрет hex в компонентах). ✓
- **Кликабельность карточек** — уточнение Task 6 (`href` + `<Link>`) выполняется до Task 12. ✓

## Открытые риски

1. **Канон-верификация (Task 9)** может вернуть расхождения по счётчикам (73 модуля / 108 моделей) — тогда meta-чипы остаются `unverified`. Это ожидаемо, не блокер.
2. **Карточка «Качество и контроль»** не имеет своего маршрута — добавляем стаб `quality` в реестр (Task 10 Step 2).
3. **hero-этаж** упрощён до равных колонок (Task 12 Step 2) — если владелец захочет «ученик шире», вернуть `grid-cols-[1.42fr_1fr]`.
