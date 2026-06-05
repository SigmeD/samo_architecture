# Frontend Architecture — DNM Architecture Explorer (интерактивный атлас)

**Версия:** 1.0
**Дата:** 2026-06-06
**Статус:** DRAFT (инженерный документ; следует за дизайн-спекой)
**Назначение:** как строить интерактивный атлас архитектуры ДНМ — стек, структура, маршруты, компоненты, контент-слой, порт постеров, деплой.

> **Замена старого документа.** Этот файл заменил прежний `frontend-architecture.md` v1.0 (30.03.2026), который описывал **другой продукт** — платформенный прототип ДНМ (Vite + React Router + MSW + Zustand). Тот продукт к атласу не относится; его описание сохранено в git-истории (коммит `f134113`) и/или живёт в репозитории `samo-dnm`. Не путать два трека.
>
> **Дизайн, бизнес-факты и решения** — в `docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md`. Здесь — только инженерная часть «как».

---

## 1. Что это

Презентационный навигируемый «атлас» архитектуры ДНМ: обзорный постер → страница кабинета → бизнес-процесс модуля. Контент статичен, типизирован, привязан к канону (`project-docs`). **Без бэка, без авторизации, без мок-API** — это не функциональный прототип, а карта архитектуры для владельца и разработчиков.

## 2. Принципы

1. **Контент-как-данные** — типизированные TS-модули; дженерик-рендереры; один файл на кабинет.
2. **Канон — источник истины** — каждый узел несёт `sources[]` (ID + версия). Badge `implStatus` показывает «намерение vs код».
3. **Статика по умолчанию** — всё пререндерится (SSG), zero client JS на контентных страницах (RSC).
4. **Брендбук-первый** — один источник токенов; синий доминирует, оранжевый/зелёный — только акценты.
5. **Пиксельная верность** — порт постеров проверяется Playwright screenshot-diff против исходного HTML.

## 3. Стек

| Категория | Технология | Назначение |
|-----------|-----------|------------|
| Фреймворк | Next.js latest (App Router) | Маршрутизация, RSC, SSG |
| Язык | TypeScript (strict) | Типизация контента и компонентов |
| Стили | Tailwind (v4, `@theme`) | Токены, утилиты |
| Компоненты | shadcn/ui (card, badge, tooltip, separator) | Базовые примитивы; остальной хром — кастом |
| Шрифты | `next/font` — Roboto + Fira Sans | Self-host, без layout shift |
| Иконки | SVG-спрайт (из постеров) / lucide-react | Иконки блоков |
| Деплой | Vercel | Статический хостинг, preview на PR |

Рендер: `export const dynamic = 'force-static'` + `generateStaticParams()`. Нет route handlers и server actions.

## 4. Структура директорий

```
app/
  layout.tsx                       # шрифты, brand CSS vars, <html lang=ru>, SVG-спрайт
  page.tsx                         # L0: обзорный постер (порт dnm-architecture-poster)
  cabinet/[slug]/page.tsx          # L1: страница кабинета (порт dnm-cabinet-*)
  cabinet/[slug]/module/[moduleSlug]/page.tsx  # L2: бизнес-процесс модуля
  not-found.tsx
components/atlas/                  # презентационные RSC
  PosterLayout · PosterHero · FunnelFlow · RoleTier · CabinetBlock ·
  SectionTiles · ProcessFlow · ModuleCard · DomainCard · CrossLinkBadge ·
  ImplStatusBadge · Breadcrumbs · SourceRef · Legend · Icon
content/
  types.ts                         # единый источник типов (см. спеку §6)
  zones.ts                         # зональная палитра (токены)
  overview.ts                      # OverviewSpec главной
  cabinets/curator.ts              # CabinetSpec куратора; остальные 10 — стабы
  cabinets/index.ts                # getCabinet(slug), getAllCabinetSlugs()
  modules/curator/lesson-journal.ts
  modules/curator/homework-review.ts
  modules/index.ts                 # getModule(cab, mod), getModuleSlugs(cab)
styles/brand.css                   # @theme: бренд + зональные токены
public/brand/                      # logo.svg + PNG-варианты + brandbook-samo.pdf
scripts/render-posters.ts          # (опц.) Playwright-перегенерация PNG из тех же данных
```

## 5. Маршрутизация (App Router, 3 уровня)

| Маршрут | Уровень | Содержимое |
|---------|---------|-----------|
| `/` | L0 | Обзорный постер; каждый блок кабинета — `<Link href="/cabinet/[slug]">` |
| `/cabinet/[slug]` | L1 | Страница кабинета; блоки модулей — `<Link href="/cabinet/[slug]/module/[moduleSlug]">` |
| `/cabinet/[slug]/module/[moduleSlug]` | L2 | Бизнес-процесс модуля (`ProcessFlow`) |

`generateStaticParams()` берёт slug'и из контент-слоя; `generateMetadata()` — из `purpose`/`role`. Неизвестный slug → `notFound()`. Блок без соответствующего `ModuleSpec` рендерится как `DomainCard`/заглушка, не как битая ссылка.

## 6. Контент-слой и типы

Типы — в `content/types.ts` (полное определение `CabinetSpec`/`ModuleSpec`/`ProcessFlow`/`CrossLink`/`SourceCitation` см. в спеке §6). Один файл на кабинет; зональная палитра — токены в `content/zones.ts` (не hex по компонентам). Свободнотекстовые `source` на шагах/доменах **не парсить** (иначе выдумаем номера разделов) — структурный `sources[]` уровня кабинета/модуля питает `SourceRef`.

Для среза полностью наполнены: `cabinets/curator.ts` + `modules/curator/lesson-journal.ts` + `modules/curator/homework-review.ts`. Остальные 10 кабинетов — стабы (`slug + role + zoneColor + implStatus`), чтобы постер отрисовал все блоки, но drilldown был только у Куратора.

## 7. Дженерик-компоненты

Все презентационные (RSC, без `'use client'` для среза), в `components/atlas/`:
`PosterLayout` (рамка + зональный акцент), `PosterHero`, `FunnelFlow` (воронка со стрелками), `RoleTier`, `CabinetBlock` (кликабельная карточка роли + `ImplStatusBadge`), `SectionTiles` (меню `.secbar`), `ProcessFlow` (ядро-процесс: нумерованные шаги + стрелки + actors + source/геймификация), `ModuleCard`/`DomainCard` (домен с ⚙/🔒), `CrossLinkBadge` (связь: направление + адресат + `SourceRef`), `ImplStatusBadge` (чистая функция `status → {label,color,icon}`), `Breadcrumbs` (из route params + заголовков), `SourceRef` (пилюля `ID vX.Y §section`), `Legend`, `Icon` (`<use href>` из спрайта).

## 8. Порт HTML → JSX (механический, lossless, затем data-driven)

1. **Стили:** перенести `<style>`-блоки постеров в один Tailwind-слой; бренд CSS-переменные → `styles/brand.css` (`:root`/`@theme`); шрифты → `next/font` (убрать Google Fonts `@import`).
2. **Разметка:** HTML → JSX механически (`class`→`className`, самозакрытие, inline-`style` → объект, `<svg><symbol>`-спрайт → `Icon`).
3. **Generify:** повторяющиеся блоки → `.map()` по контент-массивам (`.fstep`→`FunnelFlow`, `.tier .rc`→`CabinetBlock`, `.secbar .tile`→`SectionTiles`, `.core .step`→`ProcessFlow`, `.grid .card`→`ModuleCard/DomainCard`, `.handoffs .ho`→`CrossLinkBadge`).

**Правило:** **layout** берём из HTML-постера, **контент** — из верифицированных данных канона (не из устаревшего HTML; напр. НЕ копировать «7 этапов» и «оценка 0–100%»). Исходные `docs/architecture/*.html` не трогаем — они эталон для пиксель-diff. DoD порта — Playwright screenshot-diff (vision-first-ui), не только зелёный билд.

## 9. implStatus badge из данных

`ImplStatusBadge` — чистая функция от `ImplStatus` (`done/partial/planned/divergent`) через единый `STATUS_MAP`: `done`→зелёный ✓ · `partial`→оранжевый ⚙ «частично» · `planned`→нейтрально-синий ⏳ «план» (не красный) · `divergent`→предупреждающий ⚠ «расхождение с каноном» + tooltip. На постере карточка показывает сводный наихудший статус; внутри кабинета — на каждом домене/модуле. Цвета — из токенов, никакой логики во вью.

## 10. Брендбук, токены, зоны

Единый источник токенов — `styles/brand.css` (`@theme`): `--color-samo-blue:#0055A7`, `--color-samo-orange:#F7933C`, `--color-samo-green:#00A550`; зональные `--zone-*`. Запрет hex-литералов в компонентах (линт). Зональная палитра (семантика поверх бренда): синий=управление, зелёный=учёба/ученик, оранжевый=школа, фиолетовый=франшиза, бирюзовый=продажи/контроль, золотой=финансы. **Кабинет Куратора — синий** (решение D2; зелёный резервируем за учеником). Зона красит только акцент-полосу/бордеры/бейджи; фоны секций — белые/синие (правило брендбука «оранжевый/зелёный — только акцент»). Для текста <18px брать тёмные варианты акцентов (контраст WCAG AA). Логотип — `public/brand/logo.svg`.

## 11. Деплой (Vercel)

Framework preset Next.js; Production = ветка `main`; Preview-деплой на каждый PR (ревью контента глазами до merge). Без рантайм-секретов (бэка нет). Токен `project-docs` MCP — **только в CI** (build-time валидация версий канона), не в клиентский бандл, не в `NEXT_PUBLIC_*`.

## 12. Definition of Done и конвенции

- Срез Куратора: постер → кабинет (15 доменов, badge, 8 связей, источники) → оба модуля (`lesson-journal`, `homework-review`).
- Зона Куратора синяя; нет зелёных/оранжевых фоновых секций.
- Хлебные крошки + «назад к постеру»; адаптив (desktop/tablet/mobile); a11y (нативные ссылки, фокус, контраст).
- **Playwright screenshot-diff** против `dnm-cabinet-curator.png` — пройден.
- `docs/STATUS.md` (заводится в Фазе 0) обновлён под факт кода.

## Ссылки

- Дизайн-спека: `docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md`
- Канон (источник истины): MCP `project-docs` (samo-docs)
- Кодовая база-источник (информационно): `samo-dnm`
- Брендбук: `docs/brandbook/` (`ui-style-guide.md`, `brandbook-samo.pdf`, логотипы)
