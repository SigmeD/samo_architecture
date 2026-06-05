# DNM Architecture Explorer — вертикальный срез «Куратор» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Также обязателен superpowers:vision-first-ui для любой UI-задачи (скриншот-diff против эталонного PNG до закрытия задачи).

**Goal:** Построить интерактивный атлас архитектуры ДНМ (Next.js, статика, Vercel) с рабочим вертикальным срезом: обзорный постер → кабинет Куратора (15 доменов по канону) → 2 модуля-drilldown (`lesson-journal`, `homework-review`).

**Architecture:** Презентационный Next.js App Router сайт. Контент-как-данные (типизированные TS-модули, один файл на кабинет), дженерик RSC-компоненты рендерят `CabinetSpec`/`ModuleSpec`. Без бэка/мутаций/auth. Канон samo-docs — источник истины; badge `implStatus` показывает «намерение vs код».

**Tech Stack:** Next.js (App Router, RSC, SSG) · TypeScript strict · Tailwind v4 (`@theme`) · shadcn/ui (примитивы) · Zod (валидация контента) · Vitest + @testing-library/react (юнит) · Playwright (screenshot-diff) · Vercel.

**Источники:** дизайн-спека `docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md` (бизнес-факты, §8 — данные Куратора, §9 — расхождения, §10 — модули). Эталоны вёрстки — `docs/architecture/dnm-architecture-poster.html` и `dnm-cabinet-curator.html` (+ PNG для diff).

**Ключевые инварианты (из спеки, не нарушать):** зона Куратора = **синий** `#0055A7` (D2; старый HTML зелёный — поправить при порте); ядро-процесс = «процедура урока (3 фазы)», **НЕ** «7 этапов»; оценивание ДЗ «принято/на доработку» **без баллов** (никаких «0–100%»/`grade`); финансы у куратора не отображаются.

---

## Структура файлов

| Файл | Ответственность |
|------|-----------------|
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` | Каркас, strict TS, статический экспорт |
| `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts` | Тест-раннеры |
| `app/layout.tsx` | Root: шрифты `next/font`, `styles/brand.css`, `<html lang=ru>`, SVG-спрайт |
| `app/page.tsx` | L0 обзорный постер |
| `app/cabinet/[slug]/page.tsx` | L1 страница кабинета + `generateStaticParams`/`generateMetadata` |
| `app/cabinet/[slug]/module/[moduleSlug]/page.tsx` | L2 бизнес-процесс модуля |
| `app/not-found.tsx` | 404 |
| `content/types.ts` | Типы контента (единый источник) |
| `content/schema.ts` | Zod-схемы + `validateCabinet`/`validateModule` |
| `content/zones.ts` | Зональная палитра (токены) |
| `content/cabinets/curator.ts` | `CabinetSpec` Куратора (полные данные канона) |
| `content/cabinets/index.ts` | Реестр кабинетов + `getCabinet`, `getAllCabinetSlugs` |
| `content/modules/curator/lesson-journal.ts`, `homework-review.ts` | `ModuleSpec` drilldown |
| `content/modules/index.ts` | `getModule`, `getModuleSlugs` |
| `content/overview.ts` | `OverviewSpec` главной |
| `components/atlas/*.tsx` | Презентационные дженерики |
| `styles/brand.css` | Бренд + зональные токены (`@theme`) |
| `public/brand/*` | Логотипы + PDF (копия из `docs/brandbook`) |
| `tests/**`, `e2e/**` | Юнит- и визуальные тесты |
| `docs/STATUS.md` | Зеркало состояния реализации (Фаза 0) |

---

## Фаза 0 — Pre-flight (без кода)

### Task 0: Завести STATUS.md и подтвердить вводные

**Files:** Create `docs/STATUS.md`

- [ ] **Step 1: Создать `docs/STATUS.md`**

```markdown
# Статус реализации — DNM Architecture Explorer (атлас)

> Зеркало текущего состояния кода относительно дизайн-спеки и канона. Обновляется вместе с кодом.

## Сделано
- [x] Дизайн-спека утверждена (docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md)
- [x] Защитный git-снимок (f134113); frontend-architecture.md заменён на атласный (0ea981d)

## В работе
- [ ] Фаза 1 — вертикальный срез «Куратор» (см. docs/superpowers/plans/2026-06-06-dnm-curator-vertical-slice.md)

## Не покрыто / отложено
- [ ] Кабинеты, кроме Куратора (Фазы 2..N) — стабы
- [ ] Перегенерация PNG из контента (scripts/render-posters.ts)

## Открытые вопросы канона (показаны в атласе как «на подтверждении»)
См. спеку §12 (процедура урока 3-фаза/9-этапов, номиналы соларов, KPI-ставки и др.).
```

- [ ] **Step 2: Commit**

```bash
git add docs/STATUS.md
git commit -m "docs: завести STATUS.md атласа (Фаза 0)"
```

---

## Фаза 1 — Каркас и тулинг

### Task 1: Инициализировать Next.js + строгий TS + статический экспорт

**Files:** Create `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `next-env.d.ts`, `app/layout.tsx` (заглушка), `app/page.tsx` (заглушка)

- [ ] **Step 1: `package.json`**

```json
{
  "name": "dnm-architecture-explorer",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "clsx": "^2.1.1",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.49",
    "vitest": "^3.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "jsdom": "^25.0.1",
    "@playwright/test": "^1.49.0"
  }
}
```

- [ ] **Step 2: `tsconfig.json` (strict + alias `@/`)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "skipLibCheck": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: `next.config.ts` (статический сайт)**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",            // полностью статический экспорт (Vercel отдаёт как статику)
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

- [ ] **Step 4: `postcss.config.mjs`**

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

- [ ] **Step 5: Заглушки `app/layout.tsx` и `app/page.tsx`** (чтобы билд проходил; заменим в Task 12/13)

```tsx
// app/layout.tsx
import type { ReactNode } from "react";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="ru"><body>{children}</body></html>);
}
```
```tsx
// app/page.tsx
export default function Home() { return <main>DNM Architecture Explorer</main>; }
```

- [ ] **Step 6: Установить зависимости и проверить билд**

Run: `npm install && npm run build`
Expected: установка ок; `next build` завершается без ошибок (статический экспорт в `out/`).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs next-env.d.ts app/
git commit -m "chore: каркас Next.js App Router (strict TS, статический экспорт)"
```

### Task 2: Тест-раннеры (Vitest + Playwright)

**Files:** Create `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`

- [ ] **Step 1: `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    globals: true,
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
});
```

- [ ] **Step 2: `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: `playwright.config.ts` (диф против эталона)**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02 } },
  webServer: {
    command: "npm run build && npx serve out -l 4321",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: { baseURL: "http://localhost:4321", viewport: { width: 1660, height: 1200 } },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 4: Smoke-тест Vitest**

Create `tests/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("smoke", () => { it("runs", () => { expect(1 + 1).toBe(2); }); });
```

- [ ] **Step 5: Запустить**

Run: `npm run test`
Expected: PASS (1 тест).

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts vitest.setup.ts playwright.config.ts tests/smoke.test.ts
git commit -m "test: Vitest + Playwright раннеры"
```

### Task 3: Бренд-токены, зоны, шрифты, ассеты

**Files:** Create `styles/brand.css`; Create/copy `public/brand/*`

- [ ] **Step 1: `styles/brand.css` (Tailwind v4 `@theme` + зоны)**

```css
@import "tailwindcss";

@theme {
  --color-samo-blue: #0055A7;
  --color-samo-blue-d: #003D7A;
  --color-samo-orange: #F7933C;
  --color-samo-orange-d: #b9670f;   /* тёмный вариант для текста <18px (WCAG AA) */
  --color-samo-green: #00A550;
  --color-samo-green-d: #0a6c3c;
  --color-zone-blue: #0055A7;
  --color-zone-green: #00A550;
  --color-zone-orange: #F7933C;
  --color-zone-purple: #6E3FA3;
  --color-zone-teal: #0E9CA6;
  --color-zone-gold: #C8901E;
  --color-status-divergent: #9c2b2b;
  --font-sans: "Roboto", system-ui, sans-serif;
  --font-display: "Fira Sans", system-ui, sans-serif;
}

:root { color-scheme: light; }
body { font-family: var(--font-sans); color: #1f2937; background: #fff; }
*:focus-visible { outline: 3px solid var(--color-samo-blue); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
```

- [ ] **Step 2: Скопировать ассеты брендбука в `public/brand/`**

Run:
```bash
mkdir -p public/brand
cp docs/brandbook/logo.svg docs/brandbook/logo-color.png docs/brandbook/logo-inverse.png docs/brandbook/logo-on-blue.png docs/brandbook/logo-bw.png docs/brandbook/brandbook-samo.pdf public/brand/
```
Expected: 6 файлов в `public/brand/`.

- [ ] **Step 3: Commit**

```bash
git add styles/brand.css public/brand/
git commit -m "feat: бренд-токены, зональная палитра, ассеты логотипа"
```

---

## Фаза 2 — Контент-слой (типы, Zod, данные Куратора)

### Task 4: Типы контента

**Files:** Create `content/types.ts`

- [ ] **Step 1: `content/types.ts`** (единый источник; используется всеми компонентами и страницами)

```ts
export type ImplStatus = "done" | "partial" | "planned" | "divergent";
export type Direction = "in" | "out" | "both";
export type ZoneKey = "blue" | "green" | "orange" | "purple" | "teal" | "gold";

export interface RoleMeta { code: string; title: string; emoji: string }
export interface SourceCitation { id: string; version: string; section?: string }

export interface ProcessStep {
  n: number; title: string; desc: string;
  actors?: string[]; source?: string; gamification?: string;
}
export interface ProcessFlow { title: string; badge?: string; steps: ProcessStep[]; note?: string }

export interface DomainSpec {
  title: string; items: string[]; source?: string;
  readOnly?: boolean; toggleable?: boolean;
}
export interface CrossLink {
  toCabinet: string; label: string; direction: Direction; source?: string;
}
export interface ModuleRef { slug: string; title: string; status: ImplStatus; summary: string }

export interface CabinetSpec {
  slug: string;
  role: RoleMeta;
  zone: ZoneKey;                 // токен зоны (не hex)
  purpose: string;
  coreProcess: ProcessFlow;
  domains: DomainSpec[];
  crossLinks: CrossLink[];
  modules: ModuleRef[];
  sources: SourceCitation[];
  implStatus: ImplStatus;
  isStub?: boolean;              // true для 10 ещё не наполненных кабинетов
}

export interface ModuleSpec {
  slug: string; cabinetSlug: string; title: string; status: ImplStatus; summary: string;
  purpose?: string; process?: ProcessFlow; domains?: DomainSpec[];
  crossLinks?: CrossLink[]; sources: SourceCitation[]; note?: string;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add content/types.ts && git commit -m "feat: типы контента атласа"
```

### Task 5: Zod-схемы и валидация (TDD)

**Files:** Create `content/schema.ts`, `tests/content/schema.test.ts`

- [ ] **Step 1: Написать падающий тест** `tests/content/schema.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { CabinetSchema, validateCabinet } from "@/content/schema";

const valid = {
  slug: "x", role: { code: "r", title: "R", emoji: "🧑" }, zone: "blue",
  purpose: "p", coreProcess: { title: "c", steps: [{ n: 1, title: "s", desc: "d" }] },
  domains: [{ title: "d", items: ["a"] }],
  crossLinks: [{ toCabinet: "y", label: "l", direction: "both" }],
  modules: [{ slug: "m", title: "M", status: "done", summary: "s" }],
  sources: [{ id: "SPEC-1", version: "1.0" }], implStatus: "partial",
};

describe("CabinetSchema", () => {
  it("accepts a valid cabinet", () => {
    expect(() => validateCabinet(valid)).not.toThrow();
  });
  it("rejects an unknown implStatus", () => {
    expect(() => validateCabinet({ ...valid, implStatus: "??" })).toThrow();
  });
  it("rejects an unknown zone", () => {
    expect(() => validateCabinet({ ...valid, zone: "rainbow" })).toThrow();
  });
});
```

- [ ] **Step 2: Запустить — должен упасть**

Run: `npm run test -- tests/content/schema.test.ts`
Expected: FAIL («Cannot find module @/content/schema»).

- [ ] **Step 3: Реализовать `content/schema.ts`**

```ts
import { z } from "zod";

export const ImplStatus = z.enum(["done", "partial", "planned", "divergent"]);
export const Direction = z.enum(["in", "out", "both"]);
export const ZoneKey = z.enum(["blue", "green", "orange", "purple", "teal", "gold"]);

const Source = z.object({ id: z.string(), version: z.string(), section: z.string().optional() });
const Step = z.object({
  n: z.number(), title: z.string(), desc: z.string(),
  actors: z.array(z.string()).optional(), source: z.string().optional(), gamification: z.string().optional(),
});
const Flow = z.object({ title: z.string(), badge: z.string().optional(), steps: z.array(Step).min(1), note: z.string().optional() });
const Domain = z.object({ title: z.string(), items: z.array(z.string()), source: z.string().optional(), readOnly: z.boolean().optional(), toggleable: z.boolean().optional() });
const Cross = z.object({ toCabinet: z.string(), label: z.string(), direction: Direction, source: z.string().optional() });
const ModuleRef = z.object({ slug: z.string(), title: z.string(), status: ImplStatus, summary: z.string() });

export const CabinetSchema = z.object({
  slug: z.string(), role: z.object({ code: z.string(), title: z.string(), emoji: z.string() }),
  zone: ZoneKey, purpose: z.string(), coreProcess: Flow,
  domains: z.array(Domain), crossLinks: z.array(Cross), modules: z.array(ModuleRef),
  sources: z.array(Source), implStatus: ImplStatus, isStub: z.boolean().optional(),
});

export const ModuleSchema = z.object({
  slug: z.string(), cabinetSlug: z.string(), title: z.string(), status: ImplStatus, summary: z.string(),
  purpose: z.string().optional(), process: Flow.optional(), domains: z.array(Domain).optional(),
  crossLinks: z.array(Cross).optional(), sources: z.array(Source), note: z.string().optional(),
});

export function validateCabinet(x: unknown) { return CabinetSchema.parse(x); }
export function validateModule(x: unknown) { return ModuleSchema.parse(x); }
```

- [ ] **Step 4: Запустить — должен пройти**

Run: `npm run test -- tests/content/schema.test.ts`
Expected: PASS (3 теста).

- [ ] **Step 5: Commit**

```bash
git add content/schema.ts tests/content/schema.test.ts
git commit -m "feat: Zod-схемы контента + валидация (TDD)"
```

### Task 6: Зональная палитра

**Files:** Create `content/zones.ts`

- [ ] **Step 1: `content/zones.ts`**

```ts
import type { ZoneKey } from "@/content/types";

export interface Zone { key: ZoneKey; label: string; varName: string; }

export const ZONES: Record<ZoneKey, Zone> = {
  blue:   { key: "blue",   label: "Управление/операции", varName: "--color-zone-blue" },
  green:  { key: "green",  label: "Учёба/ученик",        varName: "--color-zone-green" },
  orange: { key: "orange", label: "Школа/админ",          varName: "--color-zone-orange" },
  purple: { key: "purple", label: "Франшиза",             varName: "--color-zone-purple" },
  teal:   { key: "teal",   label: "Продажи/контроль",     varName: "--color-zone-teal" },
  gold:   { key: "gold",   label: "Финансы",              varName: "--color-zone-gold" },
};

/** CSS-значение цвета зоны для inline style (var()-ссылка, не hex). */
export const zoneColor = (z: ZoneKey) => `var(${ZONES[z].varName})`;
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck`
```bash
git add content/zones.ts && git commit -m "feat: реестр зональной палитры"
```

### Task 7: Контент кабинета Куратора (данные канона)

**Files:** Create `content/cabinets/curator.ts`, `content/cabinets/index.ts`, `tests/content/curator.test.ts`

> Данные транскрибируются из спеки §8 (верифицированы против канона). Зона = `blue` (D2). Источники свободным текстом на доменах/шагах оставляем как есть.

- [ ] **Step 1: Написать падающий тест-инвариант** `tests/content/curator.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { validateCabinet } from "@/content/schema";
import { curator } from "@/content/cabinets/curator";

describe("curator cabinet content", () => {
  it("проходит Zod-валидацию", () => { expect(() => validateCabinet(curator)).not.toThrow(); });
  it("зона = синяя (D2), не зелёная", () => { expect(curator.zone).toBe("blue"); });
  it("ядро-процесс — процедура урока, НЕ '7 этапов'", () => {
    expect(curator.coreProcess.steps).toHaveLength(3);
    const blob = JSON.stringify(curator).toLowerCase();
    expect(blob).not.toContain("7 этап");
    expect(blob).not.toContain("0–100%");
    expect(blob).not.toContain("0-100%");
  });
  it("lesson-journal и curator-rating помечены divergent", () => {
    const bySlug = Object.fromEntries(curator.modules.map((m) => [m.slug, m.status]));
    expect(bySlug["lesson-journal"]).toBe("divergent");
    expect(bySlug["curator-rating"]).toBe("divergent");
  });
  it("15 доменов, 8 связей, 14 модулей", () => {
    expect(curator.domains).toHaveLength(15);
    expect(curator.crossLinks).toHaveLength(8);
    expect(curator.modules).toHaveLength(14);
  });
});
```

- [ ] **Step 2: Запустить — упадёт** (`Cannot find module curator`).

Run: `npm run test -- tests/content/curator.test.ts` → FAIL.

- [ ] **Step 3: Реализовать `content/cabinets/curator.ts`** (полные данные из спеки §8)

```ts
import type { CabinetSpec } from "@/content/types";

export const curator: CabinetSpec = {
  slug: "curator",
  role: { code: "op-kurator-dnm", title: "Куратор ДНМ", emoji: "🧑‍🏫" },
  zone: "blue", // D2: операционная зона; зелёный резервируем за учеником
  implStatus: "partial",
  purpose:
    "Операционный кабинет педагога-куратора. Куратор — не оценщик, а модератор/наставник: проводит уроки во встроенном видеосозвоне по процедуре урока, проверяет ДЗ/классную работу (принято/на доработку, без баллов), даёт безоценочную обратную связь, вручную начисляет солары за субъективные работы, подтверждает посещаемость, формирует отчёты родителям, видит свой KPI/статистику, проходит обучение/тесты куратора. Scope — свои группы своей школы (schoolId+groupId). Финансы/оплаты не отображаются.",
  coreProcess: {
    title: "Процедура проведения онлайн-урока (3 фазы)",
    badge: "на подтверждении",
    note: "Заменяет отменённый чек-лист «7 этапов» (намерение, финальный пакет передаёт Айгерим). В каноне два кандидата структуры: 3-фазная (REG-DNM-LESSON-001) и 9-этапная методичка (REG-DNM-CURATOR-001).",
    steps: [
      { n: 1, title: "Приветствие", desc: "Войти за 5–10 мин, проверить технику/материалы, поздороваться, назвать тему, создать атмосферу.", source: "REG-DNM-LESSON-001 v1.0 §1" },
      { n: 2, title: "Основная часть", desc: "Программа и тайминг, примеры/интерактив, вовлечение, чат, дисциплина; внутри — проверка ДЗ/классной, безоценочная ОС (техника «Бутерброд»), ручное начисление соларов.", source: "REG-DNM-LESSON-001 v1.0 §2; SPEC-DNM-TZ-001 v3.2 §4.4", gamification: "ручное начисление соларов за субъективные работы" },
      { n: 3, title: "Завершение", desc: "Итоги, ОС по активности, ответы на вопросы, выдача ДЗ, прощание; подтверждение списка посещаемости (онлайн ≥40 мин).", source: "REG-DNM-LESSON-001 v1.0 §3; SPEC-M3-DNM-001 v2.0 §3.6" },
    ],
  },
  domains: [
    { title: "Мои группы", items: ["Список групп: семестр, число детей, ближайшее занятие", "Карточка группы и состав", "Перевод ученика в другое время/группу (автоуведомление администратора)"], source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
    { title: "Журнал занятий (процедура урока)", toggleable: true, items: ["Чек-лист процедуры урока (DnmCuratorChecklist)", "КАНОН: фиксированный «7-этапный» чек-лист отменён → конфигурируемая процедура (REG-DNM-LESSON-001 / 9-этапная инструкция)", "Привязка к расписанию и видеосозвону, фиксация посещаемости"], source: "REG-DNM-LESSON-001 v1.0; SPEC-DNM-TZ-001 v3.2 §4.4" },
    { title: "Проверка ДЗ", items: ["Очередь по группам + фильтры (ожидают/проверены/на доработке)", "Статусы PENDING → SUBMITTED → IN_REVIEW → ACCEPTED/REVISION", "Решение «Принять»/«На доработку» (комментарий обязателен); форматы текст/файл/фото", "Оценивание только «принято/не принято» — баллов нет (ДЕТИ-7 от 21.04.2026)", "Принцип ОС: позитив → зона роста → поддержка"], source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
    { title: "Классные работы, эссе, бизнес-проекты", items: ["Три цикла проверки (ДЗ/эссе/бизнес-проект), каждый со своими статусами и начислением соларов", "Эссе семестра: приём + отметка публичного прочтения", "Бизнес-проекты: ревью одобрить/отклонить + ОС"], source: "SPEC-M3-DNM-001 v2.0" },
    { title: "Посещаемость", items: ["Онлайн — автофиксация по подключению (≥40 мин), куратор подтверждает финальный список", "Офлайн — ручная отметка; статусы PRESENT/ABSENT/EXCUSED/LATE", "Непосещение обрабатывает администратор школы, не куратор"], source: "SPEC-M3-DNM-001 v2.0 §1" },
    { title: "Успеваемость группы", items: ["Сводная таблица прогресса (уроки/тесты/ДЗ) с цветовой индикацией", "Статистика на главной: ученики/группы, проведённые часы", "Список вопросов классной/тестов и ответов учеников"], source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
    { title: "Отчёты родителям", items: ["Периодический отчёт по шаблону + ручная отправка, история", "Авто-отчёты присутствия (ежедн./еженед./ежемес.) — вручную только обратная связь", "Ежемесячный видео/голосовой отзыв (AI-генерация, куратор подписывает)", "Месячный отчёт старшему куратору"], source: "SPEC-DNM-TZ-001 v3.2 §18.9" },
    { title: "Геймификация: начисление соларов", items: ["Ручное начисление за субъективные работы — CRU(гр), 10–max по категории", "Авто-начисления (тест с 1-й попытки 100% и др.) идемпотентны, без куратора", "Баланс/рейтинг ученика — только просмотр; магазин и выдача физтоваров недоступны"], source: "SPEC-DNM-TZ-001 v3.2 §4.4; REG-DNM-SOLARS-001 v1.0" },
    { title: "Расписание", items: ["Объединённый календарь уроков и видеосозвонов своих групп", "Отмена/перенос занятия (автоуведомления)", "Перенос ученика в другую группу/время"], source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
    { title: "Видеосозвоны (конференции)", items: ["Все уроки (вкл. итоговый тест) — встроенный видеосозвон, без Zoom/YouTube", "Видео на собственном хранилище, скачивание ограничено", "Обязательная видеозапись офлайн-уроков"], source: "SPEC-M3-DNM-001 v2.0 §1" },
    { title: "Все уроки / доступ к программе", readOnly: true, items: ["Полный просмотр уроков и материалов своих групп без ограничения прогрессом", "Детальный просмотр урока с тестами/заданиями"], source: "CONV-RBAC-DNM-001 v1.2" },
    { title: "Обучение куратора / «Академия»", items: ["Тесты на знание программы (результаты видны владельцу/админу) — R(св)", "Методические материалы и видео-инструкции", "Канон v3.1: банк ~100 вопросов, аттестация с проходным баллом"], source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
    { title: "Мой KPI / статистика", readOnly: true, items: ["Просмотр своих KPI: посещаемость/усваиваемость/в срок/пролонгации/отзывы", "Прогноз выплаты (Фикса+Бонус−Штрафы)", "Не видит расчёты других и не настраивает планы KPI"], source: "SPEC-KPI-PAYOUT-001 v1.0" },
    { title: "Пробные уроки", items: ["Расписание пробных уроков, коэффициент успешности", "Обязательная запись пробного урока", "Канон v3.1: пробный урок проводит куратор; менеджер закрывает сделку"], source: "SPEC-DNM-TZ-001 v3.2 §13.4" },
    { title: "Сертификаты, документы, задачи, чат, уведомления", items: ["Сертификаты ученика = просмотр (процесс вручения)", "Документы куратора, поурочный план", "Задачи, уведомления; чат/видеозвонок с учеником/родителем/администратором"], source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
  ],
  crossLinks: [
    { toCabinet: "child", direction: "both", label: "Проводит уроки, проверяет ДЗ/эссе/проекты (принято/на доработку), начисляет солары, подтверждает посещаемость, ведёт групповой чат; безоценочная ОС «Бутерброд»", source: "SPEC-M3-DNM-001 v2.0" },
    { toCabinet: "parent", direction: "both", label: "Отчёты + ежемесячный видеоотзыв; мессенджер/видеозвонок; родитель может «Поблагодарить» (вклад в рейтинг)", source: "REG-DNM-CURATOR-PARENTS-001 v1.0" },
    { toCabinet: "school-admin", direction: "both", label: "Автоуведомление о переносе; админ ведёт табель, выдаёт физтовары, обрабатывает непосещение (не куратор)", source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
    { toCabinet: "senior-curator", direction: "in", label: "Вышестоящая роль по scope школы: обучает кураторов, ведёт лидерборд, перераспределяет группы, принимает месячный отчёт", source: "CONV-ROLE-HIERARCHY-001 v1.4; CONV-RBAC-DNM-001 v1.2" },
    { toCabinet: "lead", direction: "in", label: "Руководитель проекта/франшиз (Айгерим): видит KPI/чек-листы, назначает по франшизе, согласует выплаты, ведёт конструктор программы", source: "SPEC-KPI-PAYOUT-001 v1.0" },
    { toCabinet: "finance", direction: "out", label: "Бухгалтер (быв. Финансист, id op-finansist-dnm) получает согласованные суммы выплат; куратор финансы не видит", source: "CONV-RBAC-DNM-001 v1.2" },
    { toCabinet: "franchise", direction: "in", label: "Франчайзи/директор настраивает KPI-планы/проценты, фиче-тоглы; видит дашборд кураторов своей школы", source: "SPEC-DNM-TZ-001 v3.2" },
    { toCabinet: "sales", direction: "both", label: "Куратор проводит пробный урок (канон v3.1), менеджер организует и закрывает сделку; общий модуль выплат", source: "SPEC-DNM-TZ-001 v3.2 §13.4" },
  ],
  modules: [
    { slug: "lesson-journal", title: "Журнал урока / процедура онлайн-урока", status: "divergent", summary: "Ядро-процесс. Код хардкодит отменённые «7 этапов»; канон требует конфигурируемую процедуру (REG-DNM-LESSON-001)." },
    { slug: "homework-review", title: "Проверка ДЗ", status: "partial", summary: "Очередь + детальная проверка, статусы принято/на доработку, без баллов. Остаточное grade(1..5) в DTO противоречит отмене баллов." },
    { slug: "classwork-essay-projects", title: "Классные, эссе, бизнес-проекты", status: "done", summary: "Три цикла проверки реализованы." },
    { slug: "attendance", title: "Посещаемость", status: "done", summary: "Автофиксация ≥40 мин + подтверждение куратора; уведомления при ABSENT." },
    { slug: "performance", title: "Успеваемость группы", status: "done", summary: "Сводная таблица прогресса, статистика на главной." },
    { slug: "parent-reports", title: "Отчёты родителям", status: "partial", summary: "Отчёты по шаблону; авто-отчёты присутствия (ежедн./еженед./ежемес.) не реализованы." },
    { slug: "solars-award", title: "Начисление соларов", status: "partial", summary: "Компонент есть; точка использования не верифицирована." },
    { slug: "schedule-conferences", title: "Расписание и видеосозвоны", status: "done", summary: "Календарь + перенос занятия/ученика." },
    { slug: "all-lessons", title: "Доступ ко всем урокам", status: "done", summary: "Каталог программы + детальный просмотр урока." },
    { slug: "training", title: "Обучение куратора / Академия", status: "partial", summary: "Training+квиз есть; полная «Академия» (банк ~100, аттестация) не подтверждена." },
    { slug: "my-kpi", title: "Мой KPI", status: "partial", summary: "getMyKpi есть; связь рейтинга с выплатами вне модуля curator." },
    { slug: "curator-rating", title: "Рейтинг куратора", status: "divergent", summary: "Код — только разрез школы; канон требует сетевой разрез + значок «Лучший куратор»." },
    { slug: "trial-lessons", title: "Пробные уроки", status: "done", summary: "Соответствует канон-разрешению v3.1 (проводит куратор)." },
    { slug: "certificates", title: "Сертификаты", status: "done", summary: "Выдача сертификатов ученикам." },
  ],
  sources: [
    { id: "REG-DNM-LESSON-001", version: "1.0" }, { id: "REG-DNM-CURATOR-001", version: "1.0" },
    { id: "REG-DNM-CURATOR-PARENTS-001", version: "1.0" }, { id: "SPEC-DNM-TZ-001", version: "3.2" },
    { id: "SPEC-M3-DNM-001", version: "2.0" }, { id: "SPEC-DNM-FUNC-001", version: "2.1" },
    { id: "SPEC-KPI-PAYOUT-001", version: "1.0" }, { id: "REG-DNM-SOLARS-001", version: "1.0" },
    { id: "CONV-RBAC-DNM-001", version: "1.2" }, { id: "CONV-ROLES-DNM-001", version: "1.1" },
    { id: "CONV-ROLE-HIERARCHY-001", version: "1.4" },
  ],
};
```

- [ ] **Step 4: Запустить тест — должен пройти**

Run: `npm run test -- tests/content/curator.test.ts`
Expected: PASS (5 тестов). Если падает на длине массивов — сверить с §8 спеки (15/8/14).

- [ ] **Step 5: Реестр кабинетов `content/cabinets/index.ts`** (Куратор + 10 стабов)

```ts
import type { CabinetSpec, ZoneKey } from "@/content/types";
import { curator } from "@/content/cabinets/curator";

const stub = (slug: string, title: string, code: string, emoji: string, zone: ZoneKey): CabinetSpec => ({
  slug, role: { code, title, emoji }, zone, implStatus: "planned", isStub: true,
  purpose: "Кабинет в проектировании.", coreProcess: { title: "В разработке", steps: [{ n: 1, title: "—", desc: "Раздел в проектировании." }] },
  domains: [], crossLinks: [], modules: [], sources: [],
});

export const CABINETS: Record<string, CabinetSpec> = {
  curator,
  child:            stub("child", "Ученик", "cr4-rebenok-dnm", "🎓", "green"),
  parent:           stub("parent", "Родитель", "cr5-roditel-dnm", "👨‍👩‍👧", "blue"),
  "school-admin":   stub("school-admin", "Администратор школы", "op-admin-shkoly-dnm", "🏫", "orange"),
  franchise:        stub("franchise", "Франчайзи / директор", "pr2-franchayzi-dnm", "🏢", "purple"),
  lead:             stub("lead", "Руководитель проекта", "br7-rukovoditel-dnm", "🎯", "blue"),
  "senior-curator": stub("senior-curator", "Старший куратор", "op-starshiy-kurator-dnm", "🧑‍💼", "teal"),
  "franchise-curator": stub("franchise-curator", "Куратор франшиз", "op-kurator-franshiz-dnm", "🤝", "purple"),
  sales:            stub("sales", "Менеджер по продажам", "op-menedzher-prodazh-dnm", "💼", "teal"),
  finance:          stub("finance", "Бухгалтер", "op-finansist-dnm", "📊", "gold"),
  guest:            stub("guest", "Гость (онбординг)", "guest", "🚪", "green"),
};

export const getCabinet = (slug: string): CabinetSpec | undefined => CABINETS[slug];
export const getAllCabinetSlugs = (): string[] => Object.keys(CABINETS);
```

- [ ] **Step 6: Typecheck + commit**

Run: `npm run typecheck && npm run test -- tests/content/`
```bash
git add content/cabinets/ tests/content/curator.test.ts
git commit -m "feat: контент кабинета Куратора (канон) + реестр кабинетов"
```

### Task 8: Модули-drilldown Куратора

**Files:** Create `content/modules/curator/lesson-journal.ts`, `content/modules/curator/homework-review.ts`, `content/modules/index.ts`, `tests/content/modules.test.ts`

- [ ] **Step 1: `content/modules/curator/lesson-journal.ts`**

```ts
import type { ModuleSpec } from "@/content/types";

export const lessonJournal: ModuleSpec = {
  slug: "lesson-journal", cabinetSlug: "curator",
  title: "Журнал урока: процедура проведения онлайн-урока",
  status: "divergent",
  summary: "Ядро-процесс кабинета. Код хардкодит отменённые «7 этапов»; канон требует конфигурируемую процедуру.",
  note: "На подтверждении у Айгерим: финальный пакет процедуры. В каноне два кандидата структуры — 3-фазная (REG-DNM-LESSON-001) и 9-этапная методичка (REG-DNM-CURATOR-001).",
  purpose: "Куратор ведёт урок во встроенном видеосозвоне по конфигурируемой процедуре и фиксирует посещаемость.",
  process: {
    title: "Процедура урока — 3 фазы (вложенная 9-этапная методичка)",
    badge: "на подтверждении",
    steps: [
      { n: 1, title: "Приветствие", desc: "Войти за 5–10 мин, проверить технику/материалы, поздороваться, назвать тему, создать атмосферу.", source: "REG-DNM-LESSON-001 v1.0 §1" },
      { n: 2, title: "Основная часть", desc: "Программа/тайминг, интерактив, вовлечение; внутри методичка: проверка ДЗ → пояснение ДЗ → перерыв → практика → рефлексия → фиксация урока (REG-DNM-CURATOR-001).", source: "REG-DNM-LESSON-001 v1.0 §2; REG-DNM-CURATOR-001 v1.0" },
      { n: 3, title: "Завершение", desc: "Итоги, ОС, ответы на вопросы, выдача ДЗ, прощание; подтверждение посещаемости (≥40 мин онлайн).", source: "REG-DNM-LESSON-001 v1.0 §3" },
    ],
  },
  crossLinks: [{ toCabinet: "child", label: "Урок проводится для группы учеников", direction: "out" }],
  sources: [{ id: "REG-DNM-LESSON-001", version: "1.0" }, { id: "REG-DNM-CURATOR-001", version: "1.0" }, { id: "SPEC-DNM-TZ-001", version: "3.2", section: "4.4" }],
};
```

- [ ] **Step 2: `content/modules/curator/homework-review.ts`**

```ts
import type { ModuleSpec } from "@/content/types";

export const homeworkReview: ModuleSpec = {
  slug: "homework-review", cabinetSlug: "curator", title: "Проверка домашнего задания",
  status: "partial",
  summary: "Очередь → карточка → решение «принято/на доработку» (без баллов) → ОС «Бутерброд».",
  note: "Остаточное поле grade(1..5) в review-homework.dto.ts противоречит отмене баллов (ДЕТИ-7 от 21.04.2026) — deprecated.",
  purpose: "Куратор проверяет ДЗ группы: безоценочная конкретная обратная связь, решение принять или отправить на доработку.",
  process: {
    title: "Цикл проверки ДЗ",
    steps: [
      { n: 1, title: "Очередь", desc: "Список ДЗ по группам с фильтрами: ожидают / на доработке / приняты, с периодами.", source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
      { n: 2, title: "Просмотр работы", desc: "Текст/файл/фото; видны затруднения ученика. Статусы PENDING → SUBMITTED → IN_REVIEW.", source: "SPEC-M3-DNM-001 v2.0" },
      { n: 3, title: "Обратная связь («Бутерброд»)", desc: "Позитив → зона роста → поддержка; аргументы и цитаты ученика/автора курса. Без оценочного суждения.", source: "REG-DNM-CURATOR-001 v1.0" },
      { n: 4, title: "Решение", desc: "«Принять» (ACCEPTED) или «На доработку» (REVISION) — комментарий обязателен. Баллов нет.", source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
      { n: 5, title: "Начисление соларов", desc: "При принятии — ручное начисление соларов за субъективную работу (10–max по категории).", source: "REG-DNM-SOLARS-001 v1.0", gamification: "10–max соларов" },
    ],
  },
  crossLinks: [{ toCabinet: "child", label: "ДЗ сдаёт ученик; результат и солары — ему", direction: "both" }],
  sources: [{ id: "SPEC-DNM-TZ-001", version: "3.2", section: "4.4" }, { id: "SPEC-M3-DNM-001", version: "2.0" }, { id: "REG-DNM-CURATOR-001", version: "1.0" }, { id: "REG-DNM-SOLARS-001", version: "1.0" }],
};
```

- [ ] **Step 3: `content/modules/index.ts`**

```ts
import type { ModuleSpec } from "@/content/types";
import { lessonJournal } from "@/content/modules/curator/lesson-journal";
import { homeworkReview } from "@/content/modules/curator/homework-review";

const MODULES: Record<string, Record<string, ModuleSpec>> = {
  curator: { "lesson-journal": lessonJournal, "homework-review": homeworkReview },
};

export const getModule = (cab: string, mod: string): ModuleSpec | undefined => MODULES[cab]?.[mod];
export const getModuleSlugs = (cab: string): string[] => Object.keys(MODULES[cab] ?? {});
export const getAllModulePairs = (): { cabinetSlug: string; moduleSlug: string }[] =>
  Object.entries(MODULES).flatMap(([cab, mods]) => Object.keys(mods).map((m) => ({ cabinetSlug: cab, moduleSlug: m })));
```

- [ ] **Step 4: Тест** `tests/content/modules.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { validateModule } from "@/content/schema";
import { lessonJournal } from "@/content/modules/curator/lesson-journal";
import { homeworkReview } from "@/content/modules/curator/homework-review";

describe("curator modules", () => {
  it("оба модуля валидны", () => {
    expect(() => validateModule(lessonJournal)).not.toThrow();
    expect(() => validateModule(homeworkReview)).not.toThrow();
  });
  it("homework-review без баллов", () => {
    const blob = JSON.stringify(homeworkReview).toLowerCase();
    expect(blob).not.toContain("0–100%");
    expect(blob).toContain("без баллов");
  });
});
```

- [ ] **Step 5: Запустить + commit**

Run: `npm run test -- tests/content/modules.test.ts` → PASS.
```bash
git add content/modules/ tests/content/modules.test.ts
git commit -m "feat: модули-drilldown Куратора (lesson-journal, homework-review)"
```

---

## Фаза 3 — Дженерик-компоненты (с тестами)

### Task 9: ImplStatusBadge (TDD)

**Files:** Create `components/atlas/impl-status-badge.tsx`, `tests/components/impl-status-badge.test.tsx`

- [ ] **Step 1: Падающий тест**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";

describe("ImplStatusBadge", () => {
  it("divergent → 'расхождение с каноном'", () => {
    render(<ImplStatusBadge status="divergent" />);
    expect(screen.getByText(/расхождение с каноном/i)).toBeInTheDocument();
  });
  it("done → 'реализовано'", () => {
    render(<ImplStatusBadge status="done" />);
    expect(screen.getByText(/реализовано/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Запустить → FAIL.** Run: `npm run test -- tests/components/impl-status-badge.test.tsx`

- [ ] **Step 3: Реализовать `components/atlas/impl-status-badge.tsx`**

```tsx
import type { ImplStatus } from "@/content/types";

const MAP: Record<ImplStatus, { label: string; cls: string; icon: string }> = {
  done:      { label: "реализовано", cls: "border-samo-green text-samo-green-d bg-green-50", icon: "✓" },
  partial:   { label: "частично", cls: "border-samo-orange text-samo-orange-d bg-orange-50", icon: "⚙" },
  planned:   { label: "план", cls: "border-samo-blue/40 text-samo-blue-d bg-blue-50 border-dashed", icon: "⏳" },
  divergent: { label: "расхождение с каноном", cls: "border-status-divergent text-status-divergent bg-red-50", icon: "⚠" },
};

export function ImplStatusBadge({ status, title }: { status: ImplStatus; title?: string }) {
  const s = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium ${s.cls}`} title={title} data-status={status}>
      <span aria-hidden="true">{s.icon}</span>{s.label}
    </span>
  );
}
```

- [ ] **Step 4: Запустить → PASS.** Run: `npm run test -- tests/components/impl-status-badge.test.tsx`

- [ ] **Step 5: Commit**
```bash
git add components/atlas/impl-status-badge.tsx tests/components/impl-status-badge.test.tsx
git commit -m "feat: ImplStatusBadge (TDD)"
```

### Task 10: SourceRef, Legend, Breadcrumbs

**Files:** Create `components/atlas/source-ref.tsx`, `legend.tsx`, `breadcrumbs.tsx`, `tests/components/source-ref.test.tsx`

- [ ] **Step 1: `components/atlas/source-ref.tsx`**

```tsx
import type { SourceCitation } from "@/content/types";

export function SourceRef({ sources }: { sources: SourceCitation[] }) {
  if (!sources.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1 text-xs">
      <span className="text-gray-500">Источники:</span>
      {sources.map((s) => (
        <code key={s.id + s.version} className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[11px] text-gray-700">
          {s.id} v{s.version}{s.section ? ` §${s.section}` : ""}
        </code>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: `components/atlas/breadcrumbs.tsx`**

```tsx
import Link from "next/link";

export interface Crumb { label: string; href?: string }
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-gray-600">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {c.href ? <Link href={c.href} className="text-samo-blue hover:underline">{c.label}</Link>
                    : <span aria-current="page" className="font-medium text-gray-900">{c.label}</span>}
            {i < items.length - 1 && <span aria-hidden="true" className="text-gray-400">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 3: `components/atlas/legend.tsx`**

```tsx
export function Legend() {
  return (
    <aside className="mt-8 rounded border border-gray-200 p-3 text-xs text-gray-600">
      <strong className="text-gray-800">Обозначения:</strong>{" "}
      → поток · ⇒ начисление (солары) · ↩︎ повтор цикла · ← управление сверху ·
      ⚙ под feature-toggle · 🔒 только просмотр · ⚠ расхождение с каноном
    </aside>
  );
}
```

- [ ] **Step 4: Тест SourceRef** `tests/components/source-ref.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SourceRef } from "@/components/atlas/source-ref";

it("рендерит ID + версию + раздел", () => {
  render(<SourceRef sources={[{ id: "SPEC-DNM-TZ-001", version: "3.2", section: "4.4" }]} />);
  expect(screen.getByText("SPEC-DNM-TZ-001 v3.2 §4.4")).toBeInTheDocument();
});
```

- [ ] **Step 5: Запустить + commit**

Run: `npm run test -- tests/components/source-ref.test.tsx` → PASS.
```bash
git add components/atlas/source-ref.tsx components/atlas/breadcrumbs.tsx components/atlas/legend.tsx tests/components/source-ref.test.tsx
git commit -m "feat: SourceRef, Breadcrumbs, Legend"
```

### Task 11: ProcessFlow, DomainCard, CrossLinkBadge, ModuleCard

**Files:** Create `components/atlas/process-flow.tsx`, `domain-card.tsx`, `cross-link-badge.tsx`, `module-card.tsx`, `tests/components/process-flow.test.tsx`

- [ ] **Step 1: `components/atlas/process-flow.tsx`**

```tsx
import type { ProcessFlow as Flow } from "@/content/types";

export function ProcessFlow({ flow }: { flow: Flow }) {
  return (
    <section aria-labelledby="core" className="my-6">
      <h2 id="core" className="font-display text-lg font-bold text-samo-blue">
        {flow.title}{flow.badge && <span className="ml-2 rounded bg-orange-100 px-2 py-0.5 text-xs text-samo-orange-d">{flow.badge}</span>}
      </h2>
      {flow.note && <p className="mt-1 text-sm text-gray-600">{flow.note}</p>}
      <ol className="mt-3 flex flex-col gap-3 md:flex-row md:items-stretch">
        {flow.steps.map((s) => (
          <li key={s.n} className="relative flex-1 rounded-lg border-l-4 border-samo-blue bg-blue-50/40 p-3">
            <div className="font-display font-bold text-samo-blue">{s.n}. {s.title}</div>
            <p className="mt-1 text-sm text-gray-700">{s.desc}</p>
            {s.gamification && <p className="mt-1 text-xs text-samo-orange-d">⇒ {s.gamification}</p>}
            {s.source && <p className="mt-1 font-mono text-[11px] text-gray-500">{s.source}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: `components/atlas/domain-card.tsx`**

```tsx
import type { DomainSpec } from "@/content/types";

export function DomainCard({ domain }: { domain: DomainSpec }) {
  return (
    <article className="rounded-lg border border-gray-200 p-3">
      <h3 className="font-display font-semibold text-gray-900">
        {domain.title}{domain.toggleable && <span title="feature-toggle" className="ml-1">⚙</span>}{domain.readOnly && <span title="только просмотр" className="ml-1">🔒</span>}
      </h3>
      <ul className="mt-2 list-disc pl-4 text-sm text-gray-700">
        {domain.items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </article>
  );
}
```

- [ ] **Step 3: `components/atlas/cross-link-badge.tsx`**

```tsx
import Link from "next/link";
import type { CrossLink, ZoneKey } from "@/content/types";
import { getCabinet } from "@/content/cabinets";
import { zoneColor } from "@/content/zones";

const GLYPH: Record<CrossLink["direction"], string> = { in: "←", out: "→", both: "⇄" };

export function CrossLinkBadge({ link }: { link: CrossLink }) {
  const target = getCabinet(link.toCabinet);
  const zone = (target?.zone ?? "blue") as ZoneKey;
  const name = target?.role.title ?? link.toCabinet;
  return (
    <li className="rounded border border-gray-200 p-2 text-sm">
      <Link href={`/cabinet/${link.toCabinet}`} className="font-medium hover:underline" style={{ color: zoneColor(zone) }}>
        <span aria-hidden="true" className="mr-1 text-gray-500">{GLYPH[link.direction]}</span>{name}
      </Link>
      <p className="mt-1 text-gray-700">{link.label}</p>
    </li>
  );
}
```

- [ ] **Step 4: `components/atlas/module-card.tsx`**

```tsx
import Link from "next/link";
import type { ModuleRef } from "@/content/types";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";

export function ModuleCard({ cabinetSlug, module, hasDrilldown }: { cabinetSlug: string; module: ModuleRef; hasDrilldown: boolean }) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-semibold text-gray-900">{module.title}</h3>
        <ImplStatusBadge status={module.status} title={module.summary} />
      </div>
      <p className="mt-1 text-sm text-gray-700">{module.summary}</p>
    </>
  );
  const base = "block rounded-lg border p-3";
  return hasDrilldown
    ? <Link href={`/cabinet/${cabinetSlug}/module/${module.slug}`} className={`${base} border-gray-200 hover:-translate-y-0.5 hover:shadow-md transition`}>{inner}<span className="mt-1 inline-block text-xs text-samo-blue">подробнее ↗</span></Link>
    : <article className={`${base} border-gray-200`} aria-disabled="true">{inner}</article>;
}
```

- [ ] **Step 5: Тест ProcessFlow** `tests/components/process-flow.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessFlow } from "@/components/atlas/process-flow";
import { curator } from "@/content/cabinets/curator";

it("рендерит 3 фазы куратора и badge 'на подтверждении'", () => {
  render(<ProcessFlow flow={curator.coreProcess} />);
  expect(screen.getByText(/Приветствие/)).toBeInTheDocument();
  expect(screen.getByText(/Завершение/)).toBeInTheDocument();
  expect(screen.getByText(/на подтверждении/)).toBeInTheDocument();
});
```

- [ ] **Step 6: Запустить + commit**

Run: `npm run test -- tests/components/` → PASS (все).
```bash
git add components/atlas/process-flow.tsx components/atlas/domain-card.tsx components/atlas/cross-link-badge.tsx components/atlas/module-card.tsx tests/components/process-flow.test.tsx
git commit -m "feat: ProcessFlow, DomainCard, CrossLinkBadge, ModuleCard"
```

### Task 12: Постер-компоненты обзора (CabinetBlock, RoleTier, FunnelFlow, PosterHero, PosterLayout)

**Files:** Create `components/atlas/cabinet-block.tsx`, `role-tier.tsx`, `funnel-flow.tsx`, `poster-hero.tsx`, `poster-layout.tsx`

> Эти компоненты порта обзорного постера. Контент берётся из `content/overview.ts` (Task 13). Вёрстку калибруем под `dnm-architecture-poster.html`; пиксель-diff — Task 16.

- [ ] **Step 1: `components/atlas/poster-layout.tsx`**

```tsx
import type { ReactNode } from "react";
import { zoneColor } from "@/content/zones";
import type { ZoneKey } from "@/content/types";

export function PosterLayout({ zone = "blue", children }: { zone?: ZoneKey; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1660px] px-4 py-6">
      <div className="h-2 w-full rounded-t" style={{ background: zoneColor(zone) }} />
      <main className="border border-t-0 border-gray-200 p-4 md:p-6">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: `components/atlas/cabinet-block.tsx`**

```tsx
import Link from "next/link";
import type { CabinetSpec } from "@/content/types";
import { zoneColor } from "@/content/zones";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";

export function CabinetBlock({ cabinet }: { cabinet: CabinetSpec }) {
  return (
    <Link href={`/cabinet/${cabinet.slug}`}
      className="group block rounded-lg border bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTopColor: zoneColor(cabinet.zone), borderTopWidth: 3 }}
      aria-disabled={cabinet.isStub ? "true" : undefined}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-display font-bold text-gray-900"><span aria-hidden="true">{cabinet.role.emoji}</span> {cabinet.role.title}</span>
        <ImplStatusBadge status={cabinet.implStatus} />
      </div>
      <div className="mt-0.5 font-mono text-[11px] text-gray-500">{cabinet.role.code}</div>
      {cabinet.isStub && <div className="mt-1 text-xs text-gray-400">в разработке</div>}
      <span className="mt-1 inline-block text-xs text-samo-blue opacity-0 transition group-hover:opacity-100">↗</span>
    </Link>
  );
}
```

- [ ] **Step 3: `components/atlas/role-tier.tsx`, `funnel-flow.tsx`, `poster-hero.tsx`** (порт секций обзора; данные из `OverviewSpec`)

```tsx
// role-tier.tsx
import type { CabinetSpec } from "@/content/types";
import { CabinetBlock } from "@/components/atlas/cabinet-block";
export function RoleTier({ title, caption, cabinets }: { title: string; caption?: string; cabinets: CabinetSpec[] }) {
  return (
    <section className="my-5">
      <h2 className="font-display text-base font-bold text-samo-blue">{title}</h2>
      {caption && <p className="text-sm text-gray-600">{caption}</p>}
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cabinets.map((c) => <CabinetBlock key={c.slug} cabinet={c} />)}
      </div>
    </section>
  );
}
```
```tsx
// funnel-flow.tsx
export interface FunnelStep { title: string; key?: boolean; win?: boolean; note?: string }
export function FunnelFlow({ steps }: { steps: FunnelStep[] }) {
  return (
    <ol className="my-5 flex flex-col gap-2 md:flex-row md:items-stretch">
      {steps.map((s, i) => (
        <li key={i} className={`flex-1 rounded-lg border p-2 text-sm ${s.key ? "border-samo-orange bg-orange-50" : s.win ? "border-samo-green bg-green-50" : "border-gray-200"}`}>
          <div className="font-medium">{s.title}</div>{s.note && <div className="text-xs text-gray-600">{s.note}</div>}
        </li>
      ))}
    </ol>
  );
}
```
```tsx
// poster-hero.tsx
export function PosterHero({ title, lead }: { title: string; lead: string }) {
  return (
    <header className="rounded-lg bg-samo-blue p-5 text-white">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-blue-100">{lead}</p>
    </header>
  );
}
```

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck`
```bash
git add components/atlas/poster-layout.tsx components/atlas/cabinet-block.tsx components/atlas/role-tier.tsx components/atlas/funnel-flow.tsx components/atlas/poster-hero.tsx
git commit -m "feat: постер-компоненты обзора"
```

### Task 13: OverviewSpec (контент главной)

**Files:** Create `content/overview.ts`, `tests/content/overview.test.ts`

> Транскрибировать из `dnm-architecture-poster.html`: hero (заголовок/лид), воронка, 3 тира ролей. Тиры группируют slug'и кабинетов (Потребители / Команда школы / Сеть и управление).

- [ ] **Step 1: `content/overview.ts`**

```ts
import type { FunnelStep } from "@/components/atlas/funnel-flow";

export interface OverviewTier { title: string; caption?: string; cabinetSlugs: string[] }
export interface OverviewSpec { hero: { title: string; lead: string }; funnel: FunnelStep[]; tiers: OverviewTier[] }

export const overview: OverviewSpec = {
  hero: {
    title: "Архитектура модуля «Дети на миллион»",
    lead: "Детская образовательная система предпринимательства (10–17 лет). Интерактивный атлас: кабинеты, процессы, модули — с трассировкой к канону.",
  },
  funnel: [
    { title: "Гость / лид" }, { title: "Пробный урок", key: true, note: "проводит куратор (канон v3.1)" },
    { title: "Оплата и договор" }, { title: "Зачисление" }, { title: "Обучение по семестрам" },
    { title: "Сертификат", win: true },
  ],
  tiers: [
    { title: "Потребители", caption: "ученик, родитель, гость", cabinetSlugs: ["child", "parent", "guest"] },
    { title: "Команда школы", caption: "операционные роли", cabinetSlugs: ["curator", "senior-curator", "school-admin", "sales", "finance"] },
    { title: "Сеть и управление", caption: "франшиза и головной офис", cabinetSlugs: ["franchise", "franchise-curator", "lead"] },
  ],
};
```

- [ ] **Step 2: Тест** `tests/content/overview.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { overview } from "@/content/overview";
import { getCabinet } from "@/content/cabinets";

it("все slug'и тиров существуют в реестре кабинетов", () => {
  const slugs = overview.tiers.flatMap((t) => t.cabinetSlugs);
  for (const s of slugs) expect(getCabinet(s), `missing ${s}`).toBeDefined();
});
it("куратор присутствует на постере", () => {
  expect(overview.tiers.some((t) => t.cabinetSlugs.includes("curator"))).toBe(true);
});
```

- [ ] **Step 3: Запустить + commit**

Run: `npm run test -- tests/content/overview.test.ts` → PASS.
```bash
git add content/overview.ts tests/content/overview.test.ts
git commit -m "feat: OverviewSpec главной (постер)"
```

---

## Фаза 4 — Маршруты/страницы

### Task 14: Root layout (шрифты + бренд)

**Files:** Modify `app/layout.tsx`

- [ ] **Step 1: `app/layout.tsx`**

```tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Roboto, Fira_Sans } from "next/font/google";
import "@/styles/brand.css";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], variable: "--font-roboto" });
const fira = Fira_Sans({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], variable: "--font-fira" });

export const metadata: Metadata = {
  title: "DNM Architecture Explorer",
  description: "Интерактивный атлас архитектуры модуля «Дети на миллион»",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${roboto.variable} ${fira.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Билд + commit**

Run: `npm run build`
```bash
git add app/layout.tsx && git commit -m "feat: root layout (Roboto+Fira, бренд-стили)"
```

### Task 15: L0 — обзорный постер

**Files:** Modify `app/page.tsx`

- [ ] **Step 1: `app/page.tsx`**

```tsx
import { PosterLayout } from "@/components/atlas/poster-layout";
import { PosterHero } from "@/components/atlas/poster-hero";
import { FunnelFlow } from "@/components/atlas/funnel-flow";
import { RoleTier } from "@/components/atlas/role-tier";
import { Legend } from "@/components/atlas/legend";
import { overview } from "@/content/overview";
import { getCabinet } from "@/content/cabinets";

export default function Home() {
  return (
    <PosterLayout zone="blue">
      <PosterHero title={overview.hero.title} lead={overview.hero.lead} />
      <FunnelFlow steps={overview.funnel} />
      {overview.tiers.map((t) => (
        <RoleTier key={t.title} title={t.title} caption={t.caption}
          cabinets={t.cabinetSlugs.map((s) => getCabinet(s)!).filter(Boolean)} />
      ))}
      <Legend />
    </PosterLayout>
  );
}
```

- [ ] **Step 2: Билд + ручная проверка ссылки**

Run: `npm run build` (Expected: страница `/` пререндерена). Запусти `npx serve out` и проверь: блок «Куратор ДНМ» — ссылка на `/cabinet/curator/`.

- [ ] **Step 3: Commit**
```bash
git add app/page.tsx && git commit -m "feat: L0 обзорный постер с кликабельными кабинетами"
```

### Task 16: L1 — страница кабинета

**Files:** Create `app/cabinet/[slug]/page.tsx`, `app/not-found.tsx`; Create `tests/pages/cabinet-params.test.ts`

- [ ] **Step 1: Тест generateStaticParams-источника** `tests/pages/cabinet-params.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { getAllCabinetSlugs } from "@/content/cabinets";

it("включает все 11 кабинетов, в т.ч. curator", () => {
  const slugs = getAllCabinetSlugs();
  expect(slugs).toContain("curator");
  expect(slugs.length).toBe(11);
});
```

- [ ] **Step 2: Запустить → PASS** (реестр готов из Task 7). Run: `npm run test -- tests/pages/cabinet-params.test.ts`

- [ ] **Step 3: `app/not-found.tsx`**

```tsx
import Link from "next/link";
export default function NotFound() {
  return (<main className="p-8"><h1 className="text-xl font-bold">Не найдено</h1><Link href="/" className="text-samo-blue">← К атласу</Link></main>);
}
```

- [ ] **Step 4: `app/cabinet/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PosterLayout } from "@/components/atlas/poster-layout";
import { Breadcrumbs } from "@/components/atlas/breadcrumbs";
import { ProcessFlow } from "@/components/atlas/process-flow";
import { DomainCard } from "@/components/atlas/domain-card";
import { ModuleCard } from "@/components/atlas/module-card";
import { CrossLinkBadge } from "@/components/atlas/cross-link-badge";
import { SourceRef } from "@/components/atlas/source-ref";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";
import { Legend } from "@/components/atlas/legend";
import { getCabinet, getAllCabinetSlugs } from "@/content/cabinets";
import { getModuleSlugs } from "@/content/modules";

export const dynamic = "force-static";
export function generateStaticParams() { return getAllCabinetSlugs().map((slug) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCabinet(params.slug);
  return { title: c ? `${c.role.title} — атлас ДНМ` : "Кабинет" };
}

export default function CabinetPage({ params }: { params: { slug: string } }) {
  const cabinet = getCabinet(params.slug);
  if (!cabinet) notFound();
  const drill = new Set(getModuleSlugs(cabinet.slug));
  return (
    <PosterLayout zone={cabinet.zone}>
      <Breadcrumbs items={[{ label: "Атлас ДНМ", href: "/" }, { label: cabinet.role.title }]} />
      <header className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-gray-900"><span aria-hidden="true">{cabinet.role.emoji}</span> {cabinet.role.title}</h1>
        <ImplStatusBadge status={cabinet.implStatus} />
      </header>
      <p className="mt-2 max-w-3xl text-sm text-gray-700">{cabinet.purpose}</p>

      <ProcessFlow flow={cabinet.coreProcess} />

      {cabinet.modules.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-lg font-bold text-samo-blue">Модули</h2>
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {cabinet.modules.map((m) => <ModuleCard key={m.slug} cabinetSlug={cabinet.slug} module={m} hasDrilldown={drill.has(m.slug)} />)}
          </div>
        </section>
      )}

      {cabinet.domains.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-lg font-bold text-samo-blue">Домены и функции</h2>
          <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {cabinet.domains.map((d) => <DomainCard key={d.title} domain={d} />)}
          </div>
        </section>
      )}

      {cabinet.crossLinks.length > 0 && (
        <section className="my-6">
          <h2 className="font-display text-lg font-bold text-samo-blue">Связи с другими кабинетами</h2>
          <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {cabinet.crossLinks.map((l) => <CrossLinkBadge key={l.toCabinet} link={l} />)}
          </ul>
        </section>
      )}

      <SourceRef sources={cabinet.sources} />
      <Legend />
    </PosterLayout>
  );
}
```

- [ ] **Step 5: Билд (пререндер всех 11 кабинетов)**

Run: `npm run build`
Expected: в выводе видны статические страницы `/cabinet/curator/`, `/cabinet/child/` и т.д.; ошибок нет.

- [ ] **Step 6: Commit**
```bash
git add "app/cabinet/[slug]/page.tsx" app/not-found.tsx tests/pages/cabinet-params.test.ts
git commit -m "feat: L1 страница кабинета (порт + generateStaticParams)"
```

### Task 17: L2 — страница модуля (drilldown)

**Files:** Create `app/cabinet/[slug]/module/[moduleSlug]/page.tsx`

- [ ] **Step 1: `app/cabinet/[slug]/module/[moduleSlug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PosterLayout } from "@/components/atlas/poster-layout";
import { Breadcrumbs } from "@/components/atlas/breadcrumbs";
import { ProcessFlow } from "@/components/atlas/process-flow";
import { CrossLinkBadge } from "@/components/atlas/cross-link-badge";
import { SourceRef } from "@/components/atlas/source-ref";
import { ImplStatusBadge } from "@/components/atlas/impl-status-badge";
import { getCabinet } from "@/content/cabinets";
import { getModule, getAllModulePairs } from "@/content/modules";

export const dynamic = "force-static";
export function generateStaticParams() {
  return getAllModulePairs().map((p) => ({ slug: p.cabinetSlug, moduleSlug: p.moduleSlug }));
}
export function generateMetadata({ params }: { params: { slug: string; moduleSlug: string } }): Metadata {
  const m = getModule(params.slug, params.moduleSlug);
  return { title: m ? `${m.title} — атлас ДНМ` : "Модуль" };
}

export default function ModulePage({ params }: { params: { slug: string; moduleSlug: string } }) {
  const cabinet = getCabinet(params.slug);
  const mod = getModule(params.slug, params.moduleSlug);
  if (!cabinet || !mod) notFound();
  return (
    <PosterLayout zone={cabinet.zone}>
      <Breadcrumbs items={[{ label: "Атлас ДНМ", href: "/" }, { label: cabinet.role.title, href: `/cabinet/${cabinet.slug}` }, { label: mod.title }]} />
      <header className="flex items-center gap-2">
        <h1 className="font-display text-2xl font-bold text-gray-900">{mod.title}</h1>
        <ImplStatusBadge status={mod.status} title={mod.summary} />
      </header>
      {mod.purpose && <p className="mt-2 max-w-3xl text-sm text-gray-700">{mod.purpose}</p>}
      {mod.note && <p className="mt-2 max-w-3xl rounded border border-orange-200 bg-orange-50 p-2 text-sm text-samo-orange-d">{mod.note}</p>}
      {mod.process && <ProcessFlow flow={mod.process} />}
      {mod.crossLinks && mod.crossLinks.length > 0 && (
        <ul className="my-4 grid grid-cols-1 gap-2 md:grid-cols-2">{mod.crossLinks.map((l) => <CrossLinkBadge key={l.toCabinet} link={l} />)}</ul>
      )}
      <SourceRef sources={mod.sources} />
    </PosterLayout>
  );
}
```

- [ ] **Step 2: Билд + проверка маршрутов**

Run: `npm run build`
Expected: пререндерены `/cabinet/curator/module/lesson-journal/` и `/cabinet/curator/module/homework-review/`.

- [ ] **Step 3: Commit**
```bash
git add "app/cabinet/[slug]/module/[moduleSlug]/page.tsx"
git commit -m "feat: L2 страница модуля (drilldown)"
```

---

## Фаза 5 — Визуальная верность, деплой, верификация

### Task 18: Пиксель-diff против эталонных PNG (vision-first-ui)

**Files:** Create `e2e/atlas.spec.ts`; reference `docs/architecture/dnm-cabinet-curator.png`, `dnm-architecture-poster.png`

> ВНИМАНИЕ (vision-first-ui): зелёный билд ≠ готово. Сверяем рендер с эталоном. Зона Куратора у нас СИНЯЯ (D2) — это намеренное отличие от зелёного старого PNG; поэтому первый прогон создаёт baseline скриншоты, а владельцу показываем рендер рядом с исходным PNG для приёмки расхождений (ядро-процесс, цвет зоны, отсутствие «0–100%»).

- [ ] **Step 1: `e2e/atlas.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("обзорный постер рендерится и ведёт в кабинет куратора", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Архитектура модуля/ })).toBeVisible();
  await page.getByRole("link", { name: /Куратор ДНМ/ }).click();
  await expect(page).toHaveURL(/\/cabinet\/curator/);
  await expect(page.getByRole("heading", { name: /Куратор ДНМ/ })).toBeVisible();
});

test("кабинет куратора: процедура урока, без '7 этапов' и '0–100%'", async ({ page }) => {
  await page.goto("/cabinet/curator/");
  await expect(page.getByText(/Процедура проведения онлайн-урока/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText("7 этап");
  await expect(page.locator("body")).not.toContainText("0–100%");
  await expect(page.getByText(/расхождение с каноном/).first()).toBeVisible();
});

test("drilldown модулей доступен", async ({ page }) => {
  await page.goto("/cabinet/curator/");
  await page.getByRole("link", { name: /Журнал урока/ }).click();
  await expect(page).toHaveURL(/module\/lesson-journal/);
  await page.goto("/cabinet/curator/");
  await page.getByRole("link", { name: /Проверка ДЗ/ }).click();
  await expect(page).toHaveURL(/module\/homework-review/);
});

test("визуальный снимок кабинета куратора (baseline)", async ({ page }) => {
  await page.goto("/cabinet/curator/");
  await expect(page).toHaveScreenshot("cabinet-curator.png", { fullPage: true });
});
```

- [ ] **Step 2: Установить браузер Playwright и прогнать**

Run: `npx playwright install chromium && npm run e2e`
Expected: функциональные тесты PASS; визуальный — создаёт baseline при первом прогоне.

- [ ] **Step 3: Ручная приёмка рядом с эталоном**

Открой `out/cabinet/curator/index.html` и `docs/architecture/dnm-cabinet-curator.png` рядом. Сверь структуру (шапка → процесс → модули → домены → связи). Зафиксируй намеренные отличия (синяя зона, процедура урока вместо «7 этапов», без баллов) — это и есть актуализация по канону.

- [ ] **Step 4: Commit**
```bash
git add e2e/ && git commit -m "test(e2e): функциональный + визуальный diff кабинета куратора"
```

### Task 19: Деплой Vercel + финальная верификация

**Files:** Modify `docs/STATUS.md`

- [ ] **Step 1: Полная проверка**

Run: `npm run typecheck && npm run test && npm run build`
Expected: всё зелёное; статический экспорт в `out/`.

- [ ] **Step 2: Preview-деплой Vercel**

Run: `npx vercel deploy` (preview). Либо подключить репозиторий в Vercel (framework preset Next.js, Production = `main`). Проверить, что `.mcp.json` НЕ задеплоен (он в `.gitignore`).

- [ ] **Step 3: Smoke на preview-URL**

Открой preview-URL: `/` → клик «Куратор ДНМ» → `/cabinet/curator/` → клик модуля → `/cabinet/curator/module/lesson-journal/`. Хлебные крошки и «назад к постеру» работают.

- [ ] **Step 4: Обновить `docs/STATUS.md`** (Сделано: срез Куратора; В работе: Фазы 2..N) и commit

```bash
git add docs/STATUS.md
git commit -m "docs: STATUS — вертикальный срез Куратора готов и задеплоен"
```

---

## Self-review плана (выполнено автором)

- **Покрытие спеки:** §5 стек/структура/маршруты → Task 1,3,14–17 · §6 типы/контент → Task 4–8,13 · §7 UX (состояния, badge, крошки, зоны, a11y) → Task 9–12,16 · §8 факты Куратора → Task 7 · §9 расхождения (badge divergent/partial) → Task 7,9 · §10 оба drilldown → Task 8,17 · §11 фазы → структура плана · §14 DoD (пиксель-diff) → Task 18. Открытые вопросы §12 показаны как `note`/badge «на подтверждении» в контенте (Task 7,8).
- **Плейсхолдеры:** код приведён в каждом шаге; контент Куратора — полностью (Task 7); «остальные 10 кабинетов» намеренно стабы (это часть дизайна, не плейсхолдер).
- **Согласованность типов:** `CabinetSpec.zone: ZoneKey` (токен), `zoneColor(zone)` в компонентах; `getCabinet/getAllCabinetSlugs`, `getModule/getModuleSlugs/getAllModulePairs` — имена согласованы между Task 7,8,16,17. `ImplStatusBadge({status,title})` используется одинаково.
- **Известное отличие от эталона:** зона Куратора синяя (D2) vs зелёный старый PNG — намеренно; Task 18 фиксирует это как приёмочное расхождение, а не баг.
