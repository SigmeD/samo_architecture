# Вертикаль данных/эскалации + чат-хаб админа — дизайн

**Дата:** 2026-06-09 · **Ветка:** `update_09_06` · **Статус:** утверждён владельцем (диалог 09.06).
**Источник:** Screenshot_10–16 владельца (Screenshot_16 — авторитетная оргвертикаль) + ответы на 4 вопроса.

## Модель

**Управленческая вертикаль (связи только ±1 уровень):**
```
Руководитель ⇄ Куратор франшиз ⇄ Франчайзи ⇄ Админ школы ⇄ Ст.куратор ⇄ Куратор ⇄ Ученик/Родитель
Методист ⇄ Куратор франшиз (под КФ) ; Методист ⇄ Руководитель (approval gate)
Финансовая линия (отдельно): Бухгалтер ⇄ Франчайзи ; Финансист → Руководитель
```
- **Отчёты вверх:** Куратор → Ст.куратор → Админ → Франчайзи → Куратор франшиз → Руководитель.
- **Методпакеты вниз** (процедура урока, проходной балл OQ-RATING-05): Руководитель → Методист → Куратор франшиз → Франчайзи → Админ → Ст.куратор → Куратор.
- **Руководитель** школьные данные видит ТОЛЬКО агрегатом через Куратора франшиз.

**Чат-хаб (overlay, кликабельные ⇄):** Админ школы ⇄ {Ученик(старшие; младшие заблок.), Ст.куратор, Родитель, Бухгалтер, Франчайзи, Менеджер, Маркетолог}; встречный «чат с Админом школы» в этих кабинетах.

**Функциональные хендоффы (сохраняем):** sales⇄curator (пробное), sales⇄marketer (лиды), parent⇄franchise (эскалация).

**Связи несут двойную роль** (данные-вертикаль + чаты): на карточке в `label` указываем тип («отчёт/команда» vs «чат»).

## Целевая разводка по кабинетам (toCabinet : direction)

Каждая связь должна быть **двусторонне согласована** (A→B both ⟺ B→A both).

| Кабинет | Целевые crossLinks |
|---|---|
| **lead** | franchise-curator:both · methodist:both (gate) · finance:in (фин.линия). УБРАТЬ: school-admin, curator, senior-curator, sales, marketer, franchise |
| **franchise-curator** | lead:both · franchise:both · methodist:both · finance:in (аналитика). УБРАТЬ: senior-curator, marketer |
| **franchise** | franchise-curator:both · school-admin:both · finance:both · parent:both (эскалация). УБРАТЬ: curator, senior-curator, marketer, sales, lead |
| **school-admin** (HUB) | franchise:both · senior-curator:both (отчёты+методпакеты+чат) · finance:both (чат+фин) · sales:both (чат+опер) · marketer:both (чат) · parent:both (чат) · child:both (чат, старшие; младшие заблок.) · guest:in. УБРАТЬ: lead, curator |
| **senior-curator** | school-admin:both (отчёты вверх+чат) · curator:both · child:both (своё преподавание) · parent:both. УБРАТЬ: lead, franchise, franchise-curator, finance. РОЛЬ-ТАЙТЛ → «Старший куратор ДНМ» |
| **curator** | senior-curator:both · child:both · parent:both · sales:both (пробное). УБРАТЬ: lead, franchise, school-admin, finance |
| **methodist** | lead:both (gate) · franchise-curator:both. УБРАТЬ: curator, senior-curator, child (программа течёт вниз по вертикали) |
| **finance** | franchise:both · school-admin:both (чат+фин) · franchise-curator:out (аналитика) · lead:out (фин.линия) · sales:in · parent:in. УБРАТЬ: curator |
| **sales** | curator:both · marketer:both · school-admin:both (чат+передача клиента) · finance:out · parent:out · child:out. УБРАТЬ: franchise-curator, lead |
| **marketer** | sales:both · school-admin:both (чат) · finance:in (событие конверсии). УБРАТЬ: lead, franchise, franchise-curator, curator |
| **child** | parent:both · curator:both · school-admin:both (чат, старшие) · sales:in · guest:in. (без изменений) |
| **parent** | child:both · curator:both · school-admin:both (чат) · franchise:both (эскалация) · finance:out · sales:in · guest:out. УБРАТЬ: franchise-curator |
| **guest** | sales:both · parent:both · child:both · school-admin:both · curator:out · finance:out · marketer:in. (без изменений) |

## Контент-фиксы

- **Куратор (curator.ts):** (1) статусы ДЗ по-русски в домене «Проверка ДЗ»: `PENDING→SUBMITTED→IN_REVIEW→ACCEPTED/REVISION` → «ожидает сдачи → сдано → на проверке → принято / на доработку»; (2) упростить item «Ручное начисление за субъективные работы — CRU(гр)…» → понятно; (3) **явно добавить**: «куратор начисляет соляры И выдаёт значки (медальки) ученикам по рубрике методиста — нажатие на значок начисляет солары и улетает ученику».
- **Ст.куратор (senior-curator.ts):** role.title → **«Старший куратор ДНМ»**; в домене/ядре отразить: собирает все отчёты по обучению/посещению + ОС от куратора → передаёт Админу школы; методпакеты получает от Админа → передаёт куратору.
- **Админ (school-admin.ts):** отразить: все обучающие отчёты от Ст.куратора; данные вверх → Франчайзи → Куратор франшиз → Руководитель; чат-хаб (список выше; ученик-чат только старшие группы).
- **Чаты:** в child/parent/finance/franchise/sales/marketer/senior-curator — пункт «чат с Администратором школы» (в соответствующем чат-домене).

## Реализация
- По одному имплементеру на кабинет (правит crossLinks своего файла под таблицу + контент-фиксы + тесты). Двусторонняя согласованность — контроллер сверяет граф после.
- Тест `tests/content/system-graph.test.ts` (новый): для каждой `both`-связи A→B существует обратная B→A `both` (граф-консистентность).
- Глобально: рендер уже делит both/one-way (готово). Голдены ВСЕХ кабинетов перегенерировать (секции связей изменятся). e2e-клики аудит (клики только по both). §8.25: dev гасить перед playwright.

## Acceptance
- Граф связей = таблица выше; двусторонняя согласованность both-связей (тест).
- Контент-фиксы куратора (ДЗ RU, соляры+значки), ст.куратор (rename+отчёты), админ (вертикаль+чат-хаб).
- Чат с админом во всех указанных кабинетах.
- typecheck 0 · test · build · e2e · vision-gate 2 (ключевые кабинеты сверены против Screenshot_16 вертикали).
- Обезличено; реверсы (R5 и т.п.) не трогаем.
