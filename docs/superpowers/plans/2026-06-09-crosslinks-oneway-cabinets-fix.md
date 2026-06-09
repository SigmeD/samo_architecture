# Связи: обоюдные кликабельны / односторонние — текстом + правки 3 кабинетов

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development или executing-plans. Шаги — чекбоксы.

**Goal:** Связи `both` (⇄) — кликабельные карточки; `in/out` (односторонние) — некликабельным текстом ниже. + контент-правки кабинетов ученик/родитель/гость (убрать New, добавить ДЗ-с-родителем/чаты/совместные уроки, менеджер-проводит-занятия, поправить посещаемость, направления связей).

**Architecture:** Глобальная правка рендера `app/cabinet/[slug]/page.tsx` + новый компонент `OneWayLinks`. Контент-как-данные в `content/cabinets/{child,parent,guest}.ts`. Глобальная правка задевает голдены ВСЕХ кабинетов + e2e-клики по односторонним связям.

**Tech Stack:** Next.js RSC, TS, Vitest, Playwright. ⚠ **§8.25:** перед playwright гасить `next dev`; после — `rm -rf .next` + рестарт dev.

**Источник:** скриншоты владельца Screenshot_4..9 (в корне репо) + проектные доки кабинетов.

---

### Task 1: Компонент — обоюдные карточки / односторонние текстом

**Files:**
- Create: `components/atlas/one-way-links.tsx`
- Modify: `app/cabinet/[slug]/page.tsx` (секция «Связи с кабинетами», строки 59–66)

- [ ] **Step 1: Создать `components/atlas/one-way-links.tsx`**
```tsx
import type { CrossLink, ZoneKey } from "@/content/types";
import { getCabinet } from "@/content/cabinets";
import { zoneColor } from "@/content/zones";

const GLYPH: Record<CrossLink["direction"], string> = { in: "←", out: "→", both: "⇄" };

/** Односторонние связи (in/out) — некликабельный текстовый список под карточками обоюдных. */
export function OneWayLinks({ links }: { links: CrossLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-3 rounded-2xl border border-line bg-surface-soft p-4">
      <h3 className="mb-2 font-display text-[11px] font-extrabold uppercase tracking-wide text-muted">Односторонние связи · информационно (без перехода)</h3>
      <ul className="flex flex-col gap-1.5">
        {links.map((l) => {
          const target = getCabinet(l.toCabinet);
          const name = target?.role.title ?? l.toCabinet;
          const accent = zoneColor((target?.zone ?? "blue") as ZoneKey);
          return (
            <li key={l.toCabinet} className="text-[11.5px] leading-snug text-ink-soft">
              <span aria-hidden="true" className="text-muted">{GLYPH[l.direction]}</span>{" "}
              <b style={{ color: accent }}>{name}</b> — {l.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: В page.tsx импортировать OneWayLinks**
После строки `import { CrossLinkPanel } ...` добавить:
```tsx
import { OneWayLinks } from "@/components/atlas/one-way-links";
```

- [ ] **Step 3: Заменить секцию связей (строки 59–66)**
```tsx
        {cabinet.crossLinks.length > 0 && (() => {
          const mutual = cabinet.crossLinks.filter((l) => l.direction === "both");
          const oneWay = cabinet.crossLinks.filter((l) => l.direction !== "both");
          return (
            <>
              <SectionHeader no="03" title="Связи с кабинетами" caption="кликабельны только обоюдные ⇄" />
              {mutual.length > 0 && (
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {mutual.map((l) => <CrossLinkPanel key={l.toCabinet} link={l} />)}
                </ul>
              )}
              <OneWayLinks links={oneWay} />
            </>
          );
        })()}
```

- [ ] **Step 4: typecheck**
Run: `npm run typecheck`  Expected: 0 ошибок.

- [ ] **Step 5: Commit**
```bash
git add components/atlas/one-way-links.tsx app/cabinet/[slug]/page.tsx
git commit -m "feat(atlas): обоюдные связи кликабельны, односторонние — текстом ниже"
```

---

### Task 2: Кабинет ученика (child.ts) — New, ДЗ-с-родителем, чаты

**Files:** Modify `content/cabinets/child.ts`; Test `tests/content/child.test.ts`

- [ ] **Step 1: Failing-инвариант (child.test.ts)**
```ts
it("ДЗ-с-родителем (младшие) + чаты родитель/куратор/админ(SENIOR)", () => {
  const blob = JSON.stringify(child);
  expect(blob).toMatch(/ДЗ.*с родителем|вместе с родителем/i);
  expect(blob).toMatch(/уведомлен\S*\s+родител/i);
  expect(blob).toMatch(/чат с куратором/i);
  expect(blob).toMatch(/чат с администратором школы.*SENIOR|SENIOR.*чат с администратором/i);
});
it("нет меток New в кабинете ученика", () => {
  const anyNew = child.coreProcess.steps.some(s=>s.isNew) || child.domains.some(d=>d.isNew) || child.crossLinks.some(l=>l.isNew) || child.modules.some(m=>m.isNew);
  expect(anyNew).toBe(false);
});
```

- [ ] **Step 2: Запуск — падает** Run: `npx vitest run tests/content/child.test.ts`

- [ ] **Step 3: Убрать ВСЕ `isNew: true` в child.ts** (домены/шаги/связи/модули) — глобально по файлу.

- [ ] **Step 4: В домен «📚 Учебный цикл и уроки» добавить item:**
```
"⚠ Домашнее задание ВМЕСТЕ С РОДИТЕЛЕМ (младшие группы): если ТЗ урока требует совместного выполнения — родитель получает уведомление о выполнении ДЗ с ребёнком (на согласовании)",
```

- [ ] **Step 5: В домен «💬 Чат группы и уведомления» добавить items:**
```
"Чат с куратором (вопросы по урокам/ДЗ) и чат с родителем — личные каналы ученика",
"⚠ Чат с администратором школы — только для СТАРШЕЙ группы (SENIOR); для младших групп заблокирован",
```

- [ ] **Step 6: Запуск — зелёно** Run: `npx vitest run tests/content/child.test.ts` + `npm run typecheck`

- [ ] **Step 7: Commit**
```bash
git add content/cabinets/child.ts tests/content/child.test.ts
git commit -m "feat(child): ДЗ вместе с родителем + чаты (куратор/родитель/админ SENIOR); убраны метки New"
```

---

### Task 3: Кабинет родителя (parent.ts) — New, посещаемость, совместные уроки, направления

**Files:** Modify `content/cabinets/parent.ts`; Test `tests/content/parent.test.ts`

- [ ] **Step 1: Failing-инвариант**
```ts
it("совместное ДЗ/уроки с ребёнком (младшие) + посещаемость по-русски (без EN-кодов)", () => {
  const blob = JSON.stringify(parent);
  expect(blob).toMatch(/совместн\S*.*ребёнк|ДЗ.*с ребёнком/i);
  expect(blob).not.toMatch(/PRESENT|ABSENT|EXCUSED|LATE/);
});
it("обоюдные (both) связи только: child/curator/school-admin/franchise; нет меток New", () => {
  const both = parent.crossLinks.filter(l=>l.direction==="both").map(l=>l.toCabinet).sort();
  expect(both).toEqual(["child","curator","franchise","school-admin"]);
  const anyNew = parent.domains.some(d=>d.isNew)||parent.crossLinks.some(l=>l.isNew)||parent.coreProcess.steps.some(s=>s.isNew)||parent.modules.some(m=>m.isNew);
  expect(anyNew).toBe(false);
});
```

- [ ] **Step 2: Запуск — падает** Run: `npx vitest run tests/content/parent.test.ts`

- [ ] **Step 3: Убрать ВСЕ `isNew: true` в parent.ts.**

- [ ] **Step 4: Посещаемость — заменить EN-коды на русские.** Найти строку с `PRESENT/ABSENT/EXCUSED/LATE` (ядро шаг «Посещаемость» или домен) и заменить статусы на: `присутствовал / отсутствовал / уважительная / опоздание`.

- [ ] **Step 5: Совместные уроки/ДЗ — в домен «🎁 Портфолио и удержание» или «📚 Программа курса ребёнка» добавить item:**
```
"⚠ Совместные уроки и ДЗ с ребёнком (младшие группы): при ТЗ совместного задания родитель получает уведомление о выполнении ДЗ вместе с ребёнком (зеркало кабинета ученика; на согласовании)",
```

- [ ] **Step 6: Направления связей.** Привести `direction` к: child=both, curator=**both** (был in), school-admin=both, franchise=both; finance=out, sales=in, guest=out, franchise-curator=out (останутся односторонними → уйдут вниз). Только эти 4 both.

- [ ] **Step 7: Запуск — зелёно** Run: `npx vitest run tests/content/parent.test.ts` + `npm run typecheck`

- [ ] **Step 8: Commit**
```bash
git add content/cabinets/parent.ts tests/content/parent.test.ts
git commit -m "feat(parent): совместные уроки с ребёнком, посещаемость по-русски, обоюдные связи (4), убраны New"
```

---

### Task 4: Кабинет гостя (guest.ts) — New, менеджер-проводит-занятия

**Files:** Modify `content/cabinets/guest.ts`; Test `tests/content/guest.test.ts`

- [ ] **Step 1: Failing-инвариант**
```ts
it("менеджер может проводить занятия (роль куратора); нет меток New", () => {
  const blob = JSON.stringify(guest);
  expect(blob).toMatch(/менеджер.*провод\S*\s+(пробн\S*|заняти)|роль\S*\s+куратора/i);
  const anyNew = guest.domains.some(d=>d.isNew)||guest.crossLinks.some(l=>l.isNew)||guest.coreProcess.steps.some(s=>s.isNew)||guest.modules.some(m=>m.isNew);
  expect(anyNew).toBe(false);
});
```

- [ ] **Step 2: Запуск — падает** Run: `npx vitest run tests/content/guest.test.ts`

- [ ] **Step 3: Убрать ВСЕ `isNew: true` в guest.ts.**

- [ ] **Step 4: В домен «🎓 Пробный урок» добавить item:**
```
"⚠ Менеджер по продажам МОЖЕТ проводить пробное занятие сам (берёт роль куратора) — гибкость по решению франчайзи (реверс R5, на согласовании; default — куратор)",
```
И в `crossLinks` к `sales` (direction both) дополнить label: менеджер может вести пробное (роль куратора).

- [ ] **Step 5: Запуск — зелёно** Run: `npx vitest run tests/content/guest.test.ts` + `npm run typecheck`

- [ ] **Step 6: Commit**
```bash
git add content/cabinets/guest.ts tests/content/guest.test.ts
git commit -m "feat(guest): менеджер может проводить пробное (роль куратора); убраны метки New"
```

---

### Task 5: Аудит e2e-кликов (односторонние больше не кликабельны)

**Files:** Modify `e2e/atlas.spec.ts`

- [ ] **Step 1: Найти клики по односторонним связям.** Каждый `getByRole("link", {name:/X/}).click()` по cross-link — проверить, что целевая связь `both`. Известная поломка: **гость** (строка ~274) кликает «Куратор» — но guest→curator теперь `out`. Заменить на клик по обоюдной связи гостя:
```ts
  // было: клик «Куратор» (теперь односторонняя — некликабельна)
  await page.getByRole("link", { name: /Менеджер по продажам/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/sales/);
```
(guest→sales = both; и обновить ассерт текста «проводит куратор» → «менеджер может проводить пробное»).

- [ ] **Step 2: Проверить остальные клики-связи** (parent-тест кликает child=both ✓; sales→school-admin both ✓; marketer→sales both ✓; methodist→lead both ✓; system-map both ✓). Если какой-то кликаемый таргет стал односторонним — заменить на both-связь того же кабинета.

- [ ] **Step 3: typecheck/компиляция тестов** Run: `npm run typecheck`

- [ ] **Step 4: Commit**
```bash
git add e2e/atlas.spec.ts
git commit -m "test(e2e): клики только по обоюдным связям (guest → менеджер вместо куратора)"
```

---

### Task 6: Голдены + e2e + vision-gate + verify

**Files:** `e2e/__screenshots__/*` (регенерация затронутых кабинетов)

- [ ] **Step 1: Полный юнит + typecheck + build**
Run: `npm run typecheck && npm run test`  Expected: всё зелёное.
Run: `npm run build`  Expected: 20 страниц (предварительно ГАСИТЬ dev — §8.25). Если dev поднят: `Get-NetTCPConnection -LocalPort 3000` → Stop-Process; затем build.

- [ ] **Step 2: Регенерировать голдены (dev погашен!)**
```
npx playwright test atlas.spec.ts --update-snapshots
```
Затронуты ВСЕ кабинеты с односторонними связями (child/parent/guest + любые другие) — голдены секции связей сдвинулись.

- [ ] **Step 3: Чистый e2e** Run: `npx playwright test atlas.spec.ts`  Expected: все PASS.

- [ ] **Step 4: VISION-GATE 2 (контроллер).** `Read` голдены: `cabinet-child.png`, `cabinet-parent.png`, `cabinet-guest.png` — проверить: обоюдные связи карточками, односторонние блоком «Односторонние связи · информационно» ниже; нет бейджей New; новые items (ДЗ-с-родителем, чаты, менеджер-проводит). Сверить против Screenshot_4..9. **Golden-green ≠ done.**

- [ ] **Step 5: Рестарт localka (§8.25):** `rm -rf .next` → `npm run dev` (фон) → curl HTTP-статусы child/parent/guest = 200.

- [ ] **Step 6: Commit голденов**
```bash
git add e2e/__screenshots__/
git commit -m "test(e2e): голдены под новый рендер связей + правки кабинетов"
```

---

## Self-Review
- **Spec coverage:** Screenshot_4 (New убран — Task 2/3/4) · Screenshot_5/6 (обоюдные кликабельны/односторонние ниже — Task 1) · Screenshot_7 (ДЗ-с-родителем/чаты ученик — Task 2) · Screenshot_8 (посещаемость RU — Task 3) · Screenshot_9 (parent обоюдные = 4, New убран — Task 3) · гость менеджер-проводит/односторонние вниз (Task 4/1). ✓
- **Placeholder scan:** конкретные items/код в каждом шаге. ✓
- **Type consistency:** `OneWayLinks({links})` — тип `CrossLink[]`; `direction` ∈ in/out/both (схема). page.tsx split по `direction==="both"`. ✓
- **Blast radius:** глобальный рендер → все голдены regen (Task 6 Step 2 `--update-snapshots` без -g). e2e-клики аудит (Task 5). ✓
