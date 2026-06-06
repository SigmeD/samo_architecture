# Кабинет финансиста/бухгалтера — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline) или subagent-driven-development. Steps — checkbox (`- [ ]`).

**Goal:** Наполнить кабинет финансиста/бухгалтера (`content/cabinets/finance.ts`) истинным контентом из канона + 3 встреч и отрисовать его в существующей постер-стилистике (общий рендерер `/cabinet/[slug]` уже готов).

**Architecture:** Content-as-data. Рендерер, компоненты (`cabinet-header`, `core-process-band`, `domain-panel`, `cross-link-panel`, `module-panel`), палитра и иконки уже реализованы (кабинеты curator/child/parent). Новое — только TS-контент `finance.ts` + тесты + golden. Зона **gold**. Контент верифицирован воркфлоу (канон через MCP + встречи 04–05.06 + эталон `dnm-cabinet-finance.html`).

**Tech Stack:** Next.js 15 (App Router, SSG), TS strict, Tailwind v4, Vitest, Playwright.

**Источники контента (canon):** SPEC-FINANCE-REPORT-001 v1.1, SPEC-DNM-REPORT-TEMPLATES-001 v2.0, SPEC-KPI-PAYOUT-001 v1.0, SPEC-M10-FRANCHISING-001 v1.1, SPEC-DNM-REG-001 v1.1, SPEC-DNM-TZ-001 v3.3, SPEC-M3-DNM-001 v2.1, CONV-RBAC-DNM-001 v1.3, CONV-ROLES-DNM-001 v1.2, ARCH-ORG-001 v1.2, ADR-0002 v1.1.

---

## Инварианты (НЕ нарушать)

1. **Конфиденциальность финотчётов:** полный P&L / ФОТ / Cashflow видят ТОЛЬКО владелец бизнеса (Рук/br7) и бухгалтер; администратор школы — ТОЛЬКО дебиторку и неоплаченные договора.
2. **Роялти = фиксированный 20% от ВАЛОВОЙ прибыли, ОТДЕЛЬНОЙ строкой** (не в составе расходов); распределение роялти — **в кабинете руководителя проекта, НЕ у бухгалтера** (долю распределения в атласе не отображаем — указание владельца).
3. **Выплаты = Фикса + ΣБонусов − ΣШтрафов (≥0)**; бухгалтер принимает уже согласованные руководителем суммы на выплату (экспорт 1С/Excel/PDF).
4. **Бухгалтер НЕ принимает оплату, НЕ ведёт график рассрочки, НЕ ведёт расторжение** — работает с агрегированным финрезультатом; «Возврат» в процедуре = «Расторжение договора» (ведёт администратор, бухгалтер — read-only).
5. Роль #7 «Бухгалтер» (быв. «Финансист»), id `op-finansist-dnm` сохранён (CONV-ROLES-DNM-001 v1.2). Зона gold, implStatus `planned`.

---

## File Structure

- **Create:** `content/cabinets/finance.ts` — `CabinetSpec` бухгалтера.
- **Modify:** `content/cabinets/index.ts` — заменить стаб `finance` на импорт.
- **Create:** `tests/content/finance.test.ts` — Zod-валидация + инварианты.
- **Modify:** `e2e/atlas.spec.ts` — функц. тест + golden `cabinet-finance.png`.
- **No change:** `app/cabinet/[slug]/page.tsx` и компоненты — рендерят finance автоматически.

Структура `finance.ts` (по researched-контенту):
- **role:** `{ code: "op-finansist-dnm", title: "Бухгалтер ДНМ", emoji: "📊" }`, zone `gold`, implStatus `planned`.
- **coreProcess** «Финансовый результат сети (ОПиУ → закрытие периода)», badge «на подтверждении», 6 шагов: 💵 Доходы → 📦 Валовая прибыль → 💸 Расходы (P&L) → 🧮 Доход до налогообложения → 💧 Чистая прибыль и Cashflow → ✅ Период закрыт (end).
- **domains (14):** 📊 Дашборд · 💵 Доходы · 💸 Расходы (P&L) · 📈 P&L и результат (ОПиУ) · 💰 Роялти 20% · 👔 ФОТ · 🧾 Выплаты (Фикс+Бонус−Штраф) · 🏦 Основные средства · 💧 Cashflow · 🧮 Дебиторка и задолженность · ↩️ Возвраты (=Расторжение) · 💳 Платежи и способы оплаты · 📅 Периоды и закрытие · 💼 Паушальные взносы и экономика франшизы.
- **crossLinks (6):** franchise (both), school-admin (both), lead (out), sales (in), curator (in), parent (in).
- **modules (8):** royalty-calculator, payouts-kpi, pnl-report, payments-receivables, refund-termination, period-closing, fixed-assets, cashflow — все `planned`.
- **sources:** union 11 canon ID+версий выше.

---

## Task 1: Контент `finance.ts`

**Files:** Create `content/cabinets/finance.ts`

- [ ] **Step 1: Записать `CabinetSpec` бухгалтера** по структуре выше (полный researched-контент: purpose, coreProcess 6 шагов, 14 доменов, 6 связей, 8 модулей, 11 sources). Каждый домен/шаг/связь несёт `source` (canon ID+версия). Заголовки доменов/шагов — с ведущим emoji (икон-тайл). `readOnly: true` на чисто-просмотровых доменах (дашборд, P&L, ФОТ, возвраты, платежи). Открытые вопросы (ставка налога, фикс-ставки KPI, структура «Отчёт», финмодель Анастасии, 1С-интеграция, Само 24) — формулировать «на подтверждении», не выдумывать числа.

- [ ] **Step 2: typecheck** — `npm run typecheck` → PASS (структура соответствует `CabinetSpec`).

## Task 2: Регистрация + тесты

**Files:** Modify `content/cabinets/index.ts`; Create `tests/content/finance.test.ts`

- [ ] **Step 1:** В `index.ts` — `import { finance } from "@/content/cabinets/finance";`, заменить строку-стаб `finance: stub(...)` на `finance,`.

- [ ] **Step 2: Написать тест** `tests/content/finance.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { finance } from "@/content/cabinets/finance";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет финансиста (finance)", () => {
  it("валиден по CabinetSchema", () => { expect(() => CabinetSchema.parse(finance)).not.toThrow(); });
  it("зона gold", () => { expect(finance.zone).toBe("gold"); });
  it("ядро — финансовый результат / закрытие периода", () => {
    expect(finance.coreProcess.title).toMatch(/результат|ОПиУ|период/i);
    expect(finance.coreProcess.steps.length).toBeGreaterThanOrEqual(5);
  });
  it("инвариант: роялти отдельной строкой, выплаты Фикс+Бонус−Штраф, конфиденциальность", () => {
    const blob = JSON.stringify(finance);
    expect(blob).toMatch(/20%/);
    expect(blob).toMatch(/Фикс/);
    expect(blob).toMatch(/конфиденциал/i);
  });
  it("инвариант: бухгалтер НЕ принимает оплату; возврат = расторжение", () => {
    const blob = JSON.stringify(finance);
    expect(blob).toMatch(/НЕ принимает оплату/);
    expect(blob).toMatch(/[Рр]асторжени/);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of finance.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
```

- [ ] **Step 3: typecheck + test** — `npm run typecheck && npm run test` → PASS (data-driven `cabinets.test.ts` тоже покроет finance).

## Task 3: Сборка (проверка)

- [ ] **Step 1:** `npm run build` → PASS (18 страниц; `/cabinet/finance` уже в `generateStaticParams`).

## Task 4: Vision-first-ui gate 2 + golden

**Files:** Modify `e2e/atlas.spec.ts`

- [ ] **Step 1:** Поднять dev (`npm run dev`, background), `npm run typecheck`/`test` уже зелёные.

- [ ] **Step 2: Playwright** — resize 1320, navigate `/cabinet/finance`, screenshot fullPage → **Read скриншот**; verbal diff против `docs/architecture/dnm-cabinet-finance.png` по регионам (шапка/нав/ядро-цепочка/домены/связи). Структурное расхождение → итерировать; косметика → закрыть с пометкой.

- [ ] **Step 3: Добавить e2e** в `e2e/atlas.spec.ts`:

```ts
test("кабинет финансиста: постер-рендер, gold-зона, инварианты", async ({ page }) => {
  await page.goto("/cabinet/finance/");
  await expect(page.getByRole("heading", { level: 1, name: /Бухгалтер ДНМ/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  await expect(page.getByText(/Роялти/).first()).toBeVisible();
  await page.getByRole("link", { name: /Франчайзи/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/franchise/);
});
test("кабинет финансиста: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/finance/");
  await expect(page).toHaveScreenshot("cabinet-finance.png", { fullPage: true });
});
```

- [ ] **Step 4: Регенерация golden** — остановить dev → `npm run e2e -- --update-snapshots` → PASS → очистить `.next` → поднять dev (защита от порчи `.next` билдом e2e).

## Task 5: Документация

**Files:** Modify `docs/STATUS.md`, `CLAUDE.md`

- [ ] **Step 1:** В `docs/STATUS.md` (rollout-секция) — отметить finance done (источники, инварианты, открытые вопросы: ставка налога, фикс-ставки KPI, структура «Отчёт», финмодель Анастасии, Само 24).
- [ ] **Step 2:** В `CLAUDE.md` статус-строки — добавить Бухгалтера к наполненным кабинетам.
- [ ] **Step 3:** Коммит — только по явной команде владельца (правило 6).

---

## DoD

`CabinetSchema` (Zod) ✓ · инварианты-тесты ✓ · typecheck 0 · test зелёный · build 18 · e2e (вкл. golden `cabinet-finance.png`) ✓ · vision gate 2 vs `dnm-cabinet-finance.png` ✓ · `docs/STATUS.md` обновлён.

## Открытые вопросы (показать «на подтверждении»)

Ставка налога (упрощёнка/ИПН); фикс-ставки и планы KPI (Айгерим, SPEC-KPI-PAYOUT-001 §5); структура вкладки «Отчёт» (Анастасия/Айгерим); реализованная финмодель/калькулятор роялти Анастасии (OQ-001, discovery до ADR-0002); 1С-интеграция; Само 24 (ADR-0002 Proposed, гейт G0 — сейчас бухгалтерия видит лишь 30–40% оплат).
