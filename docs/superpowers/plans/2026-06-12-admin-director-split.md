# Сплит Админ/Директор — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Разделить «жирный» кабинет `school-admin` на «Директор школы ДНМ» (slug `director`, контент сохранён) + новый лёгкий «Администратор школы ДНМ» (slug `school-admin`, наполнен по канону), сохранив зелёные тесты/граф/vision-gate.

**Architecture:** Slug-стратегия B (gap-spec): жирный кабинет переезжает на `/cabinet/director`, освобождённый slug `school-admin` переиспользует новый лёгкий Админ. Операционные crossLinks контрагентов авто-остаются корректными (указывают на лёгкий Админ); вертикаль переключается на `director`. Гард `system-graph.test.ts` = both-реципрокность.

**Tech Stack:** Next.js 15 (SSG), TS strict, Zod (`content/schema.ts`), Vitest, Playwright screenshot-diff, content-as-data (`content/cabinets/*.ts`).

**Источники контента:** дизайн-спека `docs/superpowers/specs/2026-06-12-admin-director-split-design.md` (§3 split, §4 домены Админа); `CONV-RBAC-DNM-001 v1.6` (Адм-колонка); meeting `docs/client/meetings/2026-06-10-...md` §2–§3.

**Целевой граф связей (both, если не указано):**
| Кабинет | Связи ПОСЛЕ сплита |
|---|---|
| `director` (нов. идентичность жирного) | `franchise` (both), `school-admin` (both) |
| `school-admin` (нов. лёгкий) | `director` (both), `senior-curator` (both), `finance` (both), `sales` (both), `marketer` (both), `parent` (both), `child` (both), `guest` (in) |
| `franchise` | было `school-admin`(both) → стало `director`(both) |
| `finance`/`sales`/`marketer`/`parent`/`child`/`guest`/`senior-curator` | связь на `school-admin` — **без изменений** (указывает на лёгкий Админ) |

---

### Task 1: Переименовать жирный кабинет `school-admin` → `director`

**Files:**
- Create: `content/cabinets/director.ts` (копия `school-admin.ts` с правками идентичности)
- Delete (после Task 3): старый `content/cabinets/school-admin.ts` контент заменяется в Task 3
- Modify: `content/cabinets/index.ts`

- [ ] **Step 1: Создать `director.ts` из текущего `school-admin.ts`.** Скопировать весь файл `content/cabinets/school-admin.ts` в `content/cabinets/director.ts`. Затем внести правки идентичности:
  - `export const schoolAdmin` → `export const director`
  - `slug: "school-admin"` → `slug: "director"`
  - `role: { code: "op-admin-shkoly-dnm", title: "Администратор школы", emoji: "🏫" }` → `role: { code: "op-direktor-shkoly-dnm", title: "Директор школы ДНМ", emoji: "🏛️" }`
  - В докблоке и `purpose` заменить «администратора школы … управляющий ОДНОЙ школы, в малой орг-модели исполняет функции директора» → «директора школы ДНМ — управляющий школы (модель A: владелец-директор / модель B: наёмный директор); оверсайт + управление, операционка делегирована администратору». Сохранить упоминания границ финансов (P&L конфиденц), «вход как директор» (FR-M3-094), обезличенность, без 50%.
  - **crossLinks director (заменить весь массив на 2 связи):**
```ts
crossLinks: [
  { toCabinet: "franchise", direction: "both", label: "ВВЕРХ ПО ВЕРТИКАЛИ: директор школы — управляющий узел между школой и франчайзи-владельцем. Отчёты/KPI школы (явка, оплаты, дебиторка, наполнение, рейтинги) поднимаются наверх → Франчайзи → Куратор франшиз → Руководитель (НЕ напрямую). Франчайзи-владелец в модели A сам носит роль директора (FR-M3-094); задаёт стандарты, фиче-тоглы и KPI-планы.", source: "ARCH-ORG-001 v1.2; CONV-ROLE-HIERARCHY-001 v1.11; CONV-RBAC-DNM-001 v1.6; SPEC-DNM-TZ-001 v3.10" },
  { toCabinet: "school-admin", direction: "both", label: "ВНИЗ: операционка делегирована администратору школы (приём/подтверждение, оплаты-дебиторка, расписание/посещаемость, распределение, выдача за солары, табель). Директор видит аналитикой поверх и настраивает права/тоглы/KPI; администратор исполняет.", source: "CONV-RBAC-DNM-001 v1.6 §1/§3/§6/§7; meeting 2026-06-10 §2" },
],
```
  - Ре-пин версий в `sources[]` и инлайн `source:` затронутых строк, относящихся к идентичности роли/иерархии: `CONV-RBAC-DNM-001` 1.4→**1.6**, `CONV-ROLE-HIERARCHY-001` 1.8→**1.11**, `CONV-ROLES-DNM-001` 1.3→**1.6**, `SPEC-DNM-TZ-001` 3.8→**3.10**. (Полный content-aware ре-пин остальных пинов — задача T5; здесь только корректность идентичности.)

- [ ] **Step 2: Зарегистрировать `director` в реестре.** В `content/cabinets/index.ts`: добавить импорт `import { director } from "@/content/cabinets/director";` и ключ `director,` в `CABINETS`. (Ключ `"school-admin": schoolAdmin` пока оставить — заменится в Task 3.)

- [ ] **Step 3: Проверить типы.**
Run: `npm run typecheck`
Expected: 0 ошибок (если `school-admin.ts` ещё экспортит `schoolAdmin` — ок; временно два кабинета).

- [ ] **Step 4: Commit**
```bash
git add content/cabinets/director.ts content/cabinets/index.ts
git commit -m "refactor(cabinets): жирный school-admin → director (идентичность роли)"
```

---

### Task 2: Тест нового лёгкого Админа (RED)

**Files:**
- Modify: `tests/content/school-admin.test.ts` (переписать под лёгкий Админ)
- Create: `tests/content/director.test.ts` (перенести инварианты жирного)

- [ ] **Step 1: Создать `tests/content/director.test.ts`** — перенести проверки идентичности/инвариантов жирного кабинета на `director`:
```ts
import { describe, it, expect } from "vitest";
import { director } from "@/content/cabinets/director";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет директора школы (director)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(director)).not.toThrow();
  });
  it("идентичность: slug director, роль op-direktor-shkoly-dnm, orange, planned", () => {
    expect(director.slug).toBe("director");
    expect(director.role.code).toBe("op-direktor-shkoly-dnm");
    expect(director.role.title).toMatch(/Директор школы/i);
    expect(director.zone).toBe("orange");
    expect(director.implStatus).toBe("planned");
  });
  it("инвариант границы финансов: P&L/роялти конфиденц, без доли 50%", () => {
    const blob = JSON.stringify(director);
    expect(blob).toMatch(/конфиденц/i);
    expect(blob).not.toMatch(/50%/);
  });
  it("вход как директор (FR-M3-094)", () => {
    expect(JSON.stringify(director)).toMatch(/FR-M3-094|как директор/i);
  });
  it("связи director = franchise + school-admin (both), вертикаль не напрямую руководителю", () => {
    const dir = Object.fromEntries(director.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(dir).toEqual({ franchise: "both", "school-admin": "both" });
    expect(director.crossLinks.map((l) => l.toCabinet)).not.toContain("lead");
  });
  it("все связи резолвятся", () => {
    for (const l of director.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
```

- [ ] **Step 2: Переписать `tests/content/school-admin.test.ts`** под новый лёгкий Админ:
```ts
import { describe, it, expect } from "vitest";
import { schoolAdmin } from "@/content/cabinets/school-admin";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет администратора школы (school-admin) — лёгкий, обслуживающий/распределяющий", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(schoolAdmin)).not.toThrow();
  });
  it("идентичность: slug school-admin, op-admin-shkoly-dnm, orange, planned, не стаб", () => {
    expect(schoolAdmin.slug).toBe("school-admin");
    expect(schoolAdmin.role.code).toBe("op-admin-shkoly-dnm");
    expect(schoolAdmin.role.title).toMatch(/Администратор школы/i);
    expect(schoolAdmin.zone).toBe("orange");
    expect(schoolAdmin.implStatus).toBe("planned");
    expect(schoolAdmin.isStub).toBeFalsy();
  });
  it("лёгкий: обслуживающая/распределяющая роль, НЕ управляющий (это Директор)", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/обслуживающ|распределя/i);
    expect(blob).toMatch(/НЕ управля|не управля|это директор|у директора/i);
  });
  it("границы: P&L закрыт, KPI/тоглы/права — у директора, без доли 50%", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/P&L|конфиденц|только дебиторк/i);
    expect(blob).not.toMatch(/50%/);
  });
  it("Администратор-Лидоруб — опц. dual-mode (модель Гульшата)", () => {
    expect(JSON.stringify(schoolAdmin)).toMatch(/Лидоруб/i);
  });
  it("непосещение: 1-е авто-пуш, 2-е звонок админа", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/непосещени/i);
    expect(blob).toMatch(/авто.?пуш|автоматическ/i);
  });
  it("РЕВЕРС: договор оформляет менеджер → админ ПОДТВЕРЖДАЕТ; оплата через бухгалтерию", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/подтвержда\S*[^.]*договор|договор\S*[^.]*подтвержда/i);
    expect(blob).toMatch(/бухгалтер/i);
  });
  it("целевой граф связей (направления)", () => {
    const dir = Object.fromEntries(schoolAdmin.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(dir).toEqual({
      director: "both", "senior-curator": "both", finance: "both",
      sales: "both", marketer: "both", parent: "both", child: "both", guest: "in",
    });
  });
  it("чат с учеником только старшие/SENIOR (младшие через родителя)", () => {
    const childLink = schoolAdmin.crossLinks.find((l) => l.toCabinet === "child");
    expect(childLink?.label).toMatch(/старш/i);
    expect(childLink?.label).toMatch(/SENIOR|младш/i);
  });
  it("данные вверх через директора, НЕ напрямую руководителю", () => {
    const targets = schoolAdmin.crossLinks.map((l) => l.toCabinet);
    expect(targets).not.toContain("lead");
  });
  it("все связи резолвятся", () => {
    for (const l of schoolAdmin.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
```

- [ ] **Step 3: Запустить — должно ПАДАТЬ** (нового лёгкого `school-admin.ts` ещё нет).
Run: `npm run test -- school-admin director`
Expected: FAIL (school-admin.ts всё ещё жирный → граф/лёгкость не сходятся; director.test может пройти).

- [ ] **Step 4: Commit**
```bash
git add tests/content/director.test.ts tests/content/school-admin.test.ts
git commit -m "test(cabinets): инварианты director + лёгкого school-admin (RED)"
```

---

### Task 3: Новый лёгкий кабинет «Администратор школы ДНМ» (GREEN)

**Files:**
- Replace: `content/cabinets/school-admin.ts` (полностью переписать — лёгкий Админ)

- [ ] **Step 1: Переписать `content/cabinets/school-admin.ts`** как лёгкий кабинет по дизайн-спеке §4. Структура (`CabinetSpec`):
  - `slug: "school-admin"`, `role: { code: "op-admin-shkoly-dnm", title: "Администратор школы ДНМ", emoji: "🏫" }`, `zone: "orange"`, `implStatus: "planned"`.
  - `purpose`: лёгкий обслуживающий/распределяющий кабинет; НЕ управляющий (это Директор школы); P&L/KPI/тоглы/права — у директора; scope своя школа (schoolId); обезличено; без доли 50%.
  - `coreProcess`: title «Приём и распределение» (badge «обслуживающий контур»), 5 шагов: `Договор от менеджера → Админ подтверждает → Приём оплаты (бухгалтер подтверждает) → Активация → Распределение в группу/к ст.куратору`. `note` — реверс (договор оформляет менеджер, админ подтверждает; оплата через бухгалтерию).
  - `domains` (8, из §4 дизайн-спеки, каждый с `source` на канон):
    1. 📥 Приём и подтверждение (`source: CONV-RBAC-DNM-001 v1.6 §1; SPEC-DNM-TZ-001 v3.10 §18.16`)
    2. 💳 Операционные платежи — приём оплат, дебиторка, просрочка, возвраты; **граница: P&L/роялти/маржа конфиденц (владелец+бухгалтер)** (`CONV-RBAC-DNM-001 v1.6 §6; SPEC-FINANCE-REPORT-001 v1.3`)
    3. 🗓️ Расписание и посещаемость — массовая отметка, переносы, **непосещение: 1-е авто-пуш родителю, 2-е звонок админа** (`CONV-RBAC-DNM-001 v1.6 §3; meeting 2026-06-10 §3`)
    4. 🔀 Распределение — после оплаты → ст.куратор/группа, перевод между группами, приостановление (`meeting 2026-06-10 §2; CONV-RBAC-DNM-001 v1.6 §1`)
    5. 💬 Чат-хаб операционки — родитель, ученик-SENIOR (младшие через родителя), ст.куратор, бухгалтер, менеджер (`CONV-RBAC-DNM-001 v1.6 §5`)
    6. 🛒 Выдача за солары — отметка выдачи физтовара, остатки (`CONV-RBAC-DNM-001 v1.6 §4; SPEC-DNM-TZ-001 v3.10 §18.6`)
    7. ⏱️ Табель — учёт времени персонала → данные для ФОТ бухгалтеру (`CONV-RBAC-DNM-001 v1.6 §7`)
    8. ⚙️ Администратор-Лидоруб (`toggleable: true`) — опц. dual-mode: фильтр лидов квал/не-квал, назначение пробных, распределение по менеджерам (модель Гульшата) (`meeting 2026-06-10 §2`)
  - **Границы (в `purpose` или отдельным доменом-callout):** НЕ управляет (Директор), НЕ настраивает KPI/тоглы/права, P&L закрыт, контент/ДЗ/солары у куратора, педраспределение групп у ст.куратора.
  - `crossLinks` (8) — направления строго по целевому графу (Task header):
```ts
crossLinks: [
  { toCabinet: "director", direction: "both", label: "ВВЕРХ: администратор — операционный исполнитель под директором школы; отчёты/явка/оплаты/дебиторка/наполнение поднимаются директору, который видит аналитикой поверх и настраивает права/тоглы/KPI.", source: "CONV-ROLE-HIERARCHY-001 v1.11; CONV-RBAC-DNM-001 v1.6 §7/§8" },
  { toCabinet: "senior-curator", direction: "both", label: "Все обучающие отчёты, посещаемость и ОС куратора администратор получает от Старшего куратора (педагогический агрегатор); стыковка «табель/штатка ↔ нагрузка кураторов»: ст.куратор перераспределяет группы и заменяет заболевших, администратор согласует расписание. + прямой чат.", source: "CONV-ROLE-HIERARCHY-001 v1.11; CONV-RBAC-DNM-001 v1.6 §3" },
  { toCabinet: "finance", direction: "both", label: "Финансы школы: приём оплат и дебиторка администратора формируют доходную часть; табель → данные для ФОТ. Администратор видит ТОЛЬКО дебиторку/неоплаченные — полный финотчёт закрыт (владелец+бухгалтер); возврат оформляет администратор (CRU), бухгалтер проводит. + прямой чат.", source: "SPEC-FINANCE-REPORT-001 v1.3; CONV-RBAC-DNM-001 v1.6 §6" },
  { toCabinet: "sales", direction: "both", label: "Операции продаж: менеджер ведёт воронку, проводит пробное (сам или назначает куратора) и ОФОРМЛЯЕТ договор → передаёт администратору → администратор ПОДТВЕРЖДАЕТ; оплата через бухгалтерию (бухгалтер подтверждает); администратор ведёт дебиторку. + прямой чат.", source: "CONV-RBAC-DNM-001 v1.6 §6; SPEC-KPI-PAYOUT-001 v1.1" },
  { toCabinet: "marketer", direction: "both", label: "Прямой чат с маркетологом (координация кампаний школы, лидоген; в модели «одна школа» — на школе, в сети — централизованно у франчайзи).", source: "REG-DNM-MARKETING-001 v1.1" },
  { toCabinet: "parent", direction: "both", label: "Прямой чат с родителем: администратор — единая точка заявок (рассрочка/расторжение/приостановление, разблокировка); получает мгновенный Push о непосещении и ведёт эскалацию.", source: "CONV-RBAC-DNM-001 v1.6 §5; SPEC-DNM-TZ-001 v3.10 §10" },
  { toCabinet: "child", direction: "both", label: "ПРЯМОЙ ЧАТ С УЧЕНИКОМ — ТОЛЬКО СТАРШИЕ (SENIOR); для младших (JUNIOR) чат заблокирован (через родителя). Вне чата администратор — офлайн-контур: выдаёт физтовары за солары, отмечает офлайн-посещаемость, обрабатывает непосещение.", source: "CONV-RBAC-DNM-001 v1.6 §4/§5" },
  { toCabinet: "guest", direction: "in", label: "Гость/пробный: онбординг и пробный ведёт менеджер (сам или назначает куратора), договор оформляет менеджер → администратор подтверждает; зачисление оплаченного в группу после payment.confirmed (бухгалтер подтверждает).", source: "meeting 2026-06-10 §2; CONV-RBAC-DNM-001 v1.6 §6" },
],
```
  - `modules` (≈6): `intake-confirm`, `operational-payments`, `schedule-attendance`, `group-distribution`, `ops-chat-hub`, `lead-filter-toggle` — каждый `{ slug, title, status: "planned", summary }`.
  - `sources[]`: `CONV-RBAC-DNM-001 v1.6`, `CONV-ROLE-HIERARCHY-001 v1.11`, `CONV-ROLES-DNM-001 v1.6`, `SPEC-DNM-TZ-001 v3.10`, `SPEC-FINANCE-REPORT-001 v1.3`, `SPEC-DNM-REG-001 v1.1`, `SPEC-KPI-PAYOUT-001 v1.1`, `REG-DNM-MARKETING-001 v1.1`.

- [ ] **Step 2: Обновить реестр.** В `content/cabinets/index.ts` ключ `"school-admin": schoolAdmin` уже указывает на новый файл (импорт `schoolAdmin` из `@/content/cabinets/school-admin` сохранён) — проверить, что импорт на месте и `director` тоже в реестре (из Task 1).

- [ ] **Step 3: Запустить контент-тесты — должны ПРОЙТИ.**
Run: `npm run test -- school-admin director system-graph`
Expected: PASS (лёгкий Админ сходится с графом; both-реципрокность ещё может падать из-за franchise — фикс в Task 4; если падает только реципрокность franchise⇄director — это ожидаемо до Task 4).

- [ ] **Step 4: Commit**
```bash
git add content/cabinets/school-admin.ts content/cabinets/index.ts
git commit -m "feat(cabinets): новый лёгкий кабинет администратора школы (обслуживающий/распределяющий)"
```

---

### Task 4: Перецепить вертикаль `franchise` → `director` (реципрокность)

**Files:**
- Modify: `content/cabinets/franchise.ts` (crossLink school-admin → director)
- Modify: `tests/content/franchise.test.ts` (если ассертит связь school-admin)

- [ ] **Step 1: В `content/cabinets/franchise.ts`** найти crossLink `{ toCabinet: "school-admin", ... }` и заменить на `{ toCabinet: "director", direction: "both", label: "<вертикаль: франчайзи-владелец ↔ директор школы; франчайзи задаёт стандарты/тоглы/KPI, директор управляет школой и поднимает отчёты>", source: "ARCH-ORG-001 v1.2; CONV-ROLE-HIERARCHY-001 v1.11" }`. (Сохранить смысл: владелец ↔ управляющий.)

- [ ] **Step 2: Синхронизировать тест franchise.** Открыть `tests/content/franchise.test.ts`; если есть ассерт на `toCabinet: "school-admin"` в наборе связей — заменить на `director`. Запустить:
Run: `npm run test -- franchise`
Expected: PASS.

- [ ] **Step 3: Прогнать граф-гард.**
Run: `npm run test -- system-graph`
Expected: PASS (franchise⇄director both, director⇄school-admin both, school-admin⇄{...} both — все реципрокны).

- [ ] **Step 4: Полный прогон контент-тестов.**
Run: `npm run test`
Expected: PASS (включая impersonal-guard — он итерирует CABINETS, новый director+admin покрыты).

- [ ] **Step 5: Commit**
```bash
git add content/cabinets/franchise.ts tests/content/franchise.test.ts
git commit -m "refactor(graph): вертикаль franchise → director (реципрокность both)"
```

---

### Task 5: `/map` иерархия + матрица под сплит

**Files:**
- Modify: `content/system-map.ts`
- Modify: `tests/content/system-map.test.ts`

- [ ] **Step 1: В `content/system-map.ts`** в иерархии (`hierarchy`) добавить уровень «Директор школы» между Владельцем(Франчайзи) и операционным уровнем; перенести «Администратор школы» на операционный уровень как обслуживающую роль (`slug: "school-admin"`), добавить роль `{ title: "Директор школы", slug: "director", ... }`. В матрице (`matrix.rows`) роль «Адм» оставить (slug `school-admin`); добавить строку «Директор школы» (slug `director`) — ячейки уровня по доступному scope, разделы без детального RBAC пометить `note`/`partial` (per-resource pending `OQ-ORG-03`). Не выдумывать CRUD-ячейки для +5 ролей.

- [ ] **Step 2: Обновить `tests/content/system-map.test.ts`** — если ассертит число ролей иерархии/строк матрицы или конкретные slug, синхронизировать (добавить `director`, `school-admin` остаётся).
Run: `npm run test -- system-map`
Expected: PASS.

- [ ] **Step 3: Commit**
```bash
git add content/system-map.ts tests/content/system-map.test.ts
git commit -m "feat(map): уровень «Директор школы» в иерархии + строка матрицы"
```

---

### Task 6: `overview.ts` — карточка Директора + relabel Админа

**Files:**
- Modify: `content/overview.ts`

- [ ] **Step 1: В `content/overview.ts`** в секции «Роли и кабинеты»: текущую карточку `slug: "school-admin"` (name «Администратор школы», highlights про директорские функции) разделить —
  - переименовать её в Директора: `slug: "director", name: "Директор школы ДНМ", roleCaption: "управление школой · оверсайт + аналитика поверх"`, highlights оставить (директорские).
  - добавить новую карточку `slug: "school-admin", name: "Администратор школы ДНМ", roleCaption: "обслуживающий/распределяющий контур", zone: "orange"`, highlights — лёгкие (приём/подтверждение, операц. платежи, расписание+непосещение, распределение, чат-хаб, выдача за солары, табель, опц. Лидоруб).
  - попутно (T5-залёт допустим): `slug: "finance"` name «Бухгалтер / финансист» → «Бухгалтер ДНМ».

- [ ] **Step 2: Проверить типы + тесты.**
Run: `npm run typecheck && npm run test`
Expected: 0 ошибок, PASS.

- [ ] **Step 3: Commit**
```bash
git add content/overview.ts
git commit -m "feat(overview): карточки Директор + лёгкий Администратор; relabel Бухгалтер ДНМ"
```

---

### Task 7: e2e + vision gate 2 (голдены)

**Files:**
- Modify: `e2e/atlas.spec.ts`

- [ ] **Step 1: Обновить e2e `school-admin`** (строки ~133–150): тест должен отражать ЛЁГКИЙ Админ — ядро «Приём и распределение» вместо «Зачисление ученика»; заголовок «Администратор школы»; клик в «Родителя» → `/cabinet/parent` сохранить. Добавить проверку наличия «Лидоруб» и отсутствия «50%».

- [ ] **Step 2: Добавить e2e + golden для `director`** (по образцу других кабинетов):
```ts
test("кабинет директора школы: orange-зона, управление, граница финансов, обезличено", async ({ page }) => {
  await page.goto("/cabinet/director/");
  await expect(page.getByRole("heading", { level: 1, name: /Директор школы/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("50%");
  await expect(page.locator("body")).not.toContainText(/Д[оа]влат/);
  await page.getByRole("link", { name: /Франчайзи/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/franchise/);
});
test("кабинет директора школы: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/director/");
  await expect(page).toHaveScreenshot("cabinet-director.png", { fullPage: true });
});
```

- [ ] **Step 3: Проверить, что `senior-curator` e2e не сломан** — он кликает «Администратор школы» → `/cabinet/school-admin`; связь сохранена (school-admin↔senior-curator both). Если лейбл изменился — синхронизировать.

- [ ] **Step 4: Остановить dev, очистить `.next`, перегенерировать голдены.**
Run (ВНИМАНИЕ — не при живом `npm run dev`):
```bash
npm run e2e -- --update-snapshots
```
Expected: новый `cabinet-director.png` создан; `cabinet-school-admin.png` перегенерён (лёгкий Админ); прочие нейтральны.

- [ ] **Step 5: VISION GATE 2 — независимо прочитать скриншоты.** `Read` файлы `e2e/__screenshots__/.../cabinet-director.png` и `cabinet-school-admin.png` (или фактический путь снапшотов), убедиться: постер-стиль, ядро-лента помещается (6/5 шагов не обрезаны), orange-зона, домены читабельны. Свериться с `docs/architecture/dnm-cabinet-*.png` (стиль). НЕ верить только зелёному diff.

- [ ] **Step 6: Полный прогон.**
Run: `npm run typecheck && npm run test && npm run build && npm run e2e`
Expected: typecheck 0 · test PASS · build OK · e2e PASS.

- [ ] **Step 7: Commit**
```bash
git add e2e/
git commit -m "test(e2e): голдены director + лёгкий school-admin; vision gate 2"
```

---

### Task 8: MD-доки + STATUS

**Files:**
- Create: `docs/cabinets/director.md`
- Replace: `docs/cabinets/school-admin.md` (лёгкий Админ)
- Modify: `docs/STATUS.md`

- [ ] **Step 1:** `docs/cabinets/school-admin.md` → скопировать в `docs/cabinets/director.md` (директорский контент). Переписать `docs/cabinets/school-admin.md` под лёгкий Админ (8 доменов, ядро «Приём и распределение»). Имена — латиницей, как в остальных MD; счёт доменов/модулей сверить с `school-admin.ts`/`director.ts`.

- [ ] **Step 2:** В `docs/STATUS.md` добавить в «В работе» пункт о выполненном сплите (T3): что сделано, версии, числа тестов; отметить в разделе «Расхождения 12.06», что T3 закрыт.

- [ ] **Step 3: Commit**
```bash
git add docs/cabinets/director.md docs/cabinets/school-admin.md docs/STATUS.md
git commit -m "docs: MD director + лёгкий school-admin; STATUS под сплит"
```

---

## Self-Review (выполнено при написании)

- **Покрытие спеки:** §2 архитектура B → Task 1,3; §3 split функций → Task 1 (director сохраняет), Task 3 (admin лёгкий); §4 домены Админа → Task 3 Step 1; §5 вертикаль/граф → Task 1,3,4; §6 ripple (1–10) → Tasks 1–8. Все пункты ripple покрыты.
- **Плейсхолдеры:** домены Админа заданы списком §4 с источниками (не «TBD»); прозу пунктов `items[]` пишет исполнитель из цитированных канон-разделов — это контент-наполнение по спеке, не плейсхолдер.
- **Согласованность типов:** `op-direktor-shkoly-dnm`/`op-admin-shkoly-dnm`, slug `director`/`school-admin`, направления связей — единообразны во всех тасках и тестах.
- **Граф:** целевая таблица связей согласована между Task 3 (admin), Task 1 (director), Task 4 (franchise); both-реципрокность держит `system-graph.test.ts`.

## Вне scope (→ T5, отдельный план)

Полный content-aware ре-пин всех 13 кабинетов; РОП/Финансист ГО/Менеджер франшиз ГО как роли/строки; Таргет/СММ функциями в `marketer.ts`; уборка стаба «Ст.куратор ГО»; полная синхронизация `/map` матрицы под RBAC v1.6 §9.
