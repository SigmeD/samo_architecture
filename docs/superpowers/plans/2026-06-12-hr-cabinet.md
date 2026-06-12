# ЛК HR/рекрутинг ДНМ — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Новый кабинет «HR / рекрутинг ДНМ» (`op-hr-dnm`, slug `hr`, zone blue) по канону `REG-DNM-HR-001 v1.1`, интегрированный в реестр/`/map`/overview/e2e.

**Architecture:** Content-as-data `CabinetSpec`. HR подчиняется `director` (both), отдаёт данные `finance` (out). Источник контента: `docs/superpowers/specs/2026-06-12-hr-cabinet-design.md`.

**Tech Stack:** Next.js SSG, TS strict, Zod, Vitest, Playwright.

---

### Task 1: Тест кабинета HR (RED)

**Files:** Create `tests/content/hr.test.ts`

- [ ] **Step 1:** Создать `tests/content/hr.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { hr } from "@/content/cabinets/hr";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет HR / рекрутинг (hr)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(hr)).not.toThrow();
  });
  it("идентичность: slug hr, op-hr-dnm, blue, planned, не стаб", () => {
    expect(hr.slug).toBe("hr");
    expect(hr.role.code).toBe("op-hr-dnm");
    expect(hr.role.title).toMatch(/HR|рекрутинг/i);
    expect(hr.zone).toBe("blue");
    expect(hr.implStatus).toBe("planned");
    expect(hr.isStub).toBeFalsy();
  });
  it("ядро — воронка найма → ... → удержание (6 шагов)", () => {
    expect(hr.coreProcess.title).toMatch(/воронк|найм/i);
    expect(hr.coreProcess.steps).toHaveLength(6);
  });
  it("ключевые домены: KPI-карты персонала + база данных персонала + академия онбординга", () => {
    const blob = JSON.stringify(hr);
    expect(blob).toMatch(/KPI-карт/i);
    expect(blob).toMatch(/база данных персонал|system of record|базы данных сотруд/i);
    expect(blob).toMatch(/онбординг|аттестац/i);
    expect(blob).toMatch(/тест\w* при приёме|банк тестов/i);
  });
  it("граница: без учебных/финансовых данных, не считает выплаты, без 50%", () => {
    const blob = JSON.stringify(hr);
    expect(blob).toMatch(/без учебных|не считает выплат|≠ бухгалтер|не видит P&L|без финотчёт/i);
    expect(blob).not.toMatch(/50%/);
  });
  it("ставка = кадровый атрибут, не платёжная операция", () => {
    expect(JSON.stringify(hr)).toMatch(/кадровый атрибут|не платёж/i);
  });
  it("связи: director (both) + finance (out)", () => {
    const dir = Object.fromEntries(hr.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(dir).toEqual({ director: "both", finance: "out" });
  });
  it("все both-связи резолвятся; нет связи lead", () => {
    expect(hr.crossLinks.map((l) => l.toCabinet)).not.toContain("lead");
    for (const l of hr.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("OQ-ORG-02 (линия подчинения) показан как открытый вопрос", () => {
    expect(JSON.stringify(hr)).toMatch(/OQ-ORG-02/);
  });
});
```

- [ ] **Step 2:** Run `npm run test -- hr` → FAIL (нет `content/cabinets/hr.ts`). Это RED. Commit:
```
git add tests/content/hr.test.ts
git commit -m "test(cabinets): инварианты кабинета HR (RED)"
```

---

### Task 2: Кабинет HR (GREEN) + регистрация

**Files:** Create `content/cabinets/hr.ts`; Modify `content/cabinets/index.ts`

- [ ] **Step 1:** Создать `content/cabinets/hr.ts` (`export const hr: CabinetSpec`) по дизайн-спеке §1–§7. Read `content/cabinets/methodist.ts` (blue-зона sibling) для стиля, `content/types.ts` для shape. Состав:
  - `slug: "hr"`, `role: { code: "op-hr-dnm", title: "HR / рекрутинг ДНМ", emoji: "👥" }`, `zone: "blue"`, `implStatus: "planned"`.
  - Докблок + `purpose`: найм/адаптация/кадровый учёт/удержание; владелец KPI-каркаса персонала + базы данных сотрудников; уровень школа/сеть; подчинение Директору школы (Модель А)/сеть (Модель Б, `OQ-ORG-02`); **без учебных/финансовых данных**, **не считает выплаты** (это движок KPI-PAYOUT + бухгалтер); ставка = **кадровый атрибут, не платёж**; обезличено; без 50%.
  - `coreProcess`: title «Воронка найма → онбординг → аттестация → допуск → удержание», badge «кадровый контур», 6 шагов (дизайн §2), каждый с `source`.
  - `domains` (8, дизайн §3), каждый с `source` (цитаты REG-DNM-HR-001 v1.1 §2.x/§3). ATS-автоматизацию пометить в тексте как ⏸/planned (ADR-0002).
  - **crossLinks (2):**
```ts
crossLinks: [
  { toCabinet: "director", direction: "both", label: "ВВЕРХ ПО ВЕРТИКАЛИ: HR подчиняется директору школы (Модель А; в Модели Б — на уровне сети, OQ-ORG-02). Согласование KPI-карт ролей и оргструктуры; отчёты по найму/укомплектованности/текучести — директору.", source: "REG-DNM-HR-001 v1.1 §1; CONV-ROLE-HIERARCHY-001 v1.11; reports 2026-06-10 §2" },
  { toCabinet: "finance", direction: "out", label: "Кадровый handoff в бухгалтерию: KPI-карты ролей и база персонала (ставка как кадровый атрибут) питают ФОТ — бухгалтер + движок SPEC-KPI-PAYOUT считают выплату (Фикс+Бонус−Штраф). HR НЕ считает выплаты (граница OQ-HR-02).", source: "REG-DNM-HR-001 v1.1 §2.3/§2.4; SPEC-KPI-PAYOUT-001 v1.1" },
],
```
  - `modules` (~7): recruiting-funnel, intake-tests, onboarding-academy, staff-kpi-cards, staff-database, policy-discipline, retention. Каждый `{ slug, title, status: "planned", summary }`. (Onboarding-Academy summary — упомянуть M6-LMS платформу.)
  - `sources[]`: REG-DNM-HR-001 v1.1, CONV-ROLES-DNM-001 v1.6, CONV-RBAC-DNM-001 v1.6, CONV-ROLE-HIERARCHY-001 v1.11, SPEC-KPI-PAYOUT-001 v1.1, SPEC-DNM-RATING-001 v1.2.

- [ ] **Step 2:** В `content/cabinets/index.ts`: `import { hr } from "@/content/cabinets/hr";` + `hr,` в `CABINETS`.

- [ ] **Step 3:** `npm run test -- hr && npm run typecheck`. Expected: hr 9/9 PASS, typecheck 0. (system-graph: hr→director both требует обратной — её добавим в Task 3; пока hr-own тесты зелёные, system-graph может падать на hr⇄director — ок, чиним в Task 3.)

- [ ] **Step 4:** Commit:
```
git add content/cabinets/hr.ts content/cabinets/index.ts
git commit -m "feat(cabinets): кабинет HR / рекрутинг ДНМ (op-hr-dnm, blue)"
```

---

### Task 3: Реципрокная связь director → hr

**Files:** Modify `content/cabinets/director.ts`, `tests/content/director.test.ts`

- [ ] **Step 1:** В `content/cabinets/director.ts` добавить crossLink (director теперь 4 связи):
```ts
{ toCabinet: "hr", direction: "both", label: "ВНИЗ (кадровый контур): директор курирует HR/рекрутинг школы — согласует KPI-карты ролей и оргструктуру, получает отчёты по найму/укомплектованности/текучести. Расчёт выплат — у бухгалтера, не у HR.", source: "REG-DNM-HR-001 v1.1 §1; CONV-ROLE-HIERARCHY-001 v1.11" },
```

- [ ] **Step 2:** В `tests/content/director.test.ts` обновить граф-ассерт: `{ franchise: "both", "school-admin": "both", "senior-curator": "both", hr: "both" }`.

- [ ] **Step 3:** `npm run test && npm run typecheck`. Expected: всё зелёное (`system-graph` реципрокность hr⇄director both ✓), typecheck 0.

- [ ] **Step 4:** Commit:
```
git add content/cabinets/director.ts tests/content/director.test.ts
git commit -m "refactor(graph): director ↔ hr (кадровая вертикаль, реципрокность)"
```

---

### Task 4: /map — HR в иерархии + строка матрицы

**Files:** Modify `content/system-map.ts`, `tests/content/system-map.test.ts`

- [ ] **Step 1:** В `content/system-map.ts` добавить HR в иерархию на школьном/операционном уровне под Директором (рядом с Бухгалтером): `{ title: "HR / рекрутинг", slug: "hr", caption: "найм, кадры, KPI-карты, удержание · OQ-ORG-02" }`. В `matrix.rows` добавить строку «HR» (slug `hr`): scope-уровни по `REG-DNM-HR-001 v1.1 §5` (база персонала, банк тестов, KPI-карты = CRU кадровый; финансы/учёба = `none`); **детальный per-resource RBAC отложен (`OQ-ORG-03`)** — где неизвестно, `view`/`partial` + `MatrixCell.note`. НЕ выдумывать full-доступ.

- [ ] **Step 2:** Обновить `tests/content/system-map.test.ts` под новую роль/строку (счёт/slug). Не ослаблять проверки.

- [ ] **Step 3:** `npm run test -- system-map && npm run typecheck`. PASS, 0.

- [ ] **Step 4:** Commit:
```
git add content/system-map.ts tests/content/system-map.test.ts
git commit -m "feat(map): HR/рекрутинг в иерархии + строка матрицы (scope, OQ-ORG-03 pending)"
```

---

### Task 5: overview карточка HR

**Files:** Modify `content/overview.ts`

- [ ] **Step 1:** В `content/overview.ts` добавить карточку: `{ slug: "hr", emoji: "👥", name: "HR / рекрутинг ДНМ", roleCaption: "найм · кадры · KPI-карты · удержание", zone: "blue", highlights: [...] }` — highlights: воронка найма+метрики; банк тестов при приёме; Академия онбординга/аттестация (M6-LMS); KPI-карты персонала (HR задаёт, движок считает); база данных персонала (system of record; ставка=кадровый атрибут); политика/дисциплина/медиация; удержание/антитекучка; границы (без учебных/финансовых данных). Разместить рядом с операционными ролями школы.

- [ ] **Step 2:** `npm run typecheck && npm run test`. PASS, 0. (Если overview-тест считает карточки — обновить.)

- [ ] **Step 3:** Commit:
```
git add content/overview.ts
git commit -m "feat(overview): карточка HR / рекрутинг ДНМ"
```

---

### Task 6: e2e + golden + vision gate

**Files:** Modify `e2e/atlas.spec.ts`

- [ ] **Step 1:** Добавить e2e (по образцу методиста, blue) + golden:
```ts
test("кабинет HR/рекрутинг: blue-зона, воронка найма, кадровые границы, обезличено", async ({ page }) => {
  await page.goto("/cabinet/hr/");
  await expect(page.getByRole("heading", { level: 1, name: /HR|рекрутинг/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  await expect(page.getByText(/воронк/i).first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("50%");
  await expect(page.locator("body")).not.toContainText(/Д[оа]влат|Гульшат/);
  await page.getByRole("link", { name: /Директор школы/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/director/);
});
test("кабинет HR/рекрутинг: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/hr/");
  await expect(page).toHaveScreenshot("cabinet-hr.png", { fullPage: true });
});
```

- [ ] **Step 2:** Перегенерировать голдены (НЕ при живом dev; форсить свежий сервер во избежание stale-`out/` — `CI=true` если reuseExistingServer мешает; grep собранного `out/cabinet/hr/index.html` на «HR / рекрутинг» перед доверием):
`npm run e2e -- --update-snapshots`
Ожидаемо новые/изменённые: `cabinet-hr.png` (создан), `overview-l0.png` (+карточка), `map.png` (+HR), `cabinet-director.png` (+связь hr). Сообщить какие.

- [ ] **Step 3:** `npm run typecheck && npm run test && npm run build && npm run e2e` — всё зелёное. Сообщить абсолютный путь `cabinet-hr.png` для независимой визуальной проверки контроллером.

- [ ] **Step 4:** Commit:
```
git add e2e/
git commit -m "test(e2e): голден cabinet-hr + перегенерация L0/map/director"
```

---

### Task 7: MD-док + STATUS

**Files:** Create `docs/cabinets/hr.md`; Modify `docs/STATUS.md`

- [ ] **Step 1:** Создать `docs/cabinets/hr.md` (латинское имя по конвенции; mirror `content/cabinets/hr.ts` — счёт доменов/модулей сверить с источником) в стиле sibling `docs/cabinets/finansist.md`.
- [ ] **Step 2:** В `docs/STATUS.md` «В работе» добавить запись о T4 (HR-кабинет, версии, числа тестов); в «Расхождения 12.06» пометить пункт HR `→ T4 ВЫПОЛНЕН`.
- [ ] **Step 3:** `npm run typecheck` → 0. Commit:
```
git add docs/cabinets/hr.md docs/STATUS.md
git commit -m "docs: MD HR-кабинет + STATUS под T4"
```

---

## Self-Review
- Покрытие спеки §1–§8 → Tasks 1–7. Связи director(both)+finance(out) → Task 2/3. /map scope без CRUD → Task 4. Границы/OQ → Task 1 (тесты) + Task 2 (контент).
- Плейсхолдеров нет: домены/связи заданы дизайн-спекой с цитатами.
- Типы согласованы: `op-hr-dnm`/slug `hr`/направления связей едины в тестах и контенте.
- Граф: hr⇄director both (реципрокно, Task 3), hr→finance out (без реципрокности). `system-graph` зелёный.
