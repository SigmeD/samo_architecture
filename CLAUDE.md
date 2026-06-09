# CLAUDE.md — DNM Architecture Explorer · Next.js atlas + docs knowledge-base (гибрид)

> Living-doc: первоисточник контекста для Claude Code в этом репо. Обновляется при изменении стека / структуры / процесса / скоупа и после каждой Phase. Bootstrap'нут 2026-06-06 из `CLAUDE_MD_TEMPLATE.md` (Application Matrix §0).

## Проект

**Что это.** Гибрид двух контуров в одном репозитории:
- **(а) Атлас** — `DNM Architecture Explorer`: интерактивный навигируемый атлас архитектуры ДНМ («Дети на миллион», детская образовательная система предпринимательства). Next.js App Router + TS strict + Tailwind v4 + shadcn/ui, полностью статический SSG, деплой Vercel, **без бэка / auth / мок-API**. Контент-как-данные: постер → кабинет → бизнес-процесс модуля. Презентационная карта, не функциональный продукт.
- **(б) База знаний** — docs-контур: исходные постеры архитектуры (`docs/architecture/*.html` + `*.png`), ADR, брендбук, дизайн-спеки и планы (`docs/superpowers/`).

**Цель.** Дать владельцу и разработчикам актуальную, привязанную к канону, интерактивную карту архитектуры ДНМ. Каждый узел трассируется к нормативу (ID + версия), а badge `implStatus` показывает «намерение vs код».

**Кому.** Владелец бизнеса + команда разработки ДНМ. Ключевая бизнес-цель клиента — продажа франшизы (влияет на архитектуру).

**Текущая фаза.** v0 live (`samoarchitecture.vercel.app`), единая постер-стилистика L0+L1. **Наполнены ВСЕ 12 из 12 кабинетов — стабов нет** (Куратор/Ученик/Родитель/Финансист · Куратор франшиз/Франчайзи/Администратор школы/Старший куратор · Руководитель проекта/Менеджер по продажам/Маркетолог · **Гость (онбординг)** — 08.06, последний). Добавлены: L0 **«Сводная карта системы»** (`/map`: иерархия + матрица RBAC + карта передач), механизм меток **New** (новизна vs постер, снимается при мердже), UX-редизайн читаемости (панель «Роль, границы и инварианты» внизу + контур-цикл). Расхождения с каноном — в `docs/canon-proposals/` (на согласовании клиента, не правим канон молча). Текущая работа — ветка **`update_08_06`**. План rollout: `docs/superpowers/plans/2026-06-06-cabinets-poster-rollout.md`.

**Детали.** Дизайн-спека: `docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md`. Инженерная архитектура: `docs/architecture/frontend-architecture.md`. План: `docs/superpowers/plans/2026-06-06-dnm-curator-vertical-slice.md`.

## Источники истины (читать ПЕРВЫМ — не выдумывать)

| Источник | Роль | Доступ |
|---|---|---|
| **Канон `samo-docs`** | **АВТОРИТЕТ — «как должно быть»** (контракты, RBAC, процедуры, ADR, нормативы) | MCP `project-docs`: `list_index` → `get_doc(<ID>)` → `search_docs(q)`. URL: https://github.com/bobodzhonovdi/samo-docs |
| **Репо `samo-dnm`** | Кодовая база-ИСТОЧНИК информации «как сейчас» (для badge `implStatus`). Её код/компоненты **НЕ переиспользуются** | https://github.com/bobodzhonovdi/samo-dnm |

- **При конфликте КАНОН ПОБЕЖДАЕТ.** Код — вторичный факт только для статуса реализации.
- **НЕ ВЫДУМЫВАТЬ.** Любой норматив (раздел, версия, формулировка) берётся из канона через `get_doc` по ID со сверкой версии. Список doc-ID **НЕ хардкодить** в CLAUDE.md — источник истины это INDEX (`list_index`, фильтр по `apps`).
- **MCP недоступен → явный СТОП.** Не галлюцинировать контракты по памяти. Сообщить владельцу.
- **Расхождение код ↔ канон** → запись в `docs/STATUS.md` (раздел «Расхождения», badge `divergent`). Канон напрямую НЕ править; при необходимости изменить норматив — `propose_change(...)` (draft-PR в канон), не правка на месте.

## Два продукта — не путать

- **Атлас** (этот репо) — презентационный Next.js-сайт, навигируемая карта. Этот документ — про него.
- **Платформенный прототип ДНМ** — другой продукт (Vite 6 + React Router 7 + MSW + Zustand + i18next), полнофункциональный UI; на близком стеке строится `samo-dnm`. К атласу не относится. Старый `docs/architecture/frontend-architecture.md` описывал именно его и был заменён атласным (старая версия — в git-истории, коммит `f134113`).

## Стек

| Слой | Технологии |
|---|---|
| Фреймворк | Next.js latest (App Router, RSC, SSG) |
| Язык | TypeScript strict (`noUncheckedIndexedAccess`) |
| Стили | Tailwind v4 (`@theme`), единый источник токенов `styles/brand.css` |
| Компоненты | shadcn/ui (card, badge, tooltip, separator) + кастомные дженерики `components/atlas/*` |
| Шрифты | `next/font` — Roboto (UI/тело) + Fira Sans (заголовки/числа), self-host |
| Контент | Типизированные TS-модули (`content/`), Zod-валидация (`content/schema.ts`) |
| Тесты | Vitest + @testing-library/react (юнит) · Playwright (screenshot-diff) |
| Рендер | `output: "export"` (статический экспорт в `out/`) + `force-static` + `generateStaticParams()`. Нет route handlers / server actions / бэка |
| Деплой | Vercel — статический хостинг, Production = `main`, Preview на каждый PR |
| База знаний (контур б) | Markdown + HTML/PNG-постеры, ADR; Git, Conventional Commits, Keep a Changelog |

## Жёсткие правила

Все 18 mandatory rules из §2 шаблона. Для docs-контура часть адаптирована/помечена «контекст-зависимо».

1. **CLAUDE.md — живой документ.** Изменился стек / структура / процесс / скоуп — правим сразу; после Phase / фичи — обновляем «Текущий статус». Раз в спринт — аудит `claude-md-management:claude-md-improver`.
2. **Канон + Context7 — источники правды.** Любой норматив ДНМ → канон через MCP `project-docs` (см. блок «Источники истины»). Любой вопрос по сторонней библиотеке / SDK / CLI (Next.js, React 19, Tailwind v4, shadcn/ui, Zod, Vitest, Playwright, Vercel CLI) → сначала `mcp__plugin_context7_context7__resolve-library-id` → `query-docs`, потом ответ. Не из памяти.
3. **Superpowers — рабочий стандарт.** `superpowers:brainstorming` (перед creative-задачей), `superpowers:writing-plans` (3+ шага), `superpowers:test-driven-development` (контент-схемы, компоненты — RED→GREEN→REFACTOR), `superpowers:systematic-debugging` (любой баг), `superpowers:verification-before-completion` (перед claim'ом), `superpowers:executing-plans` / `subagent-driven-development` (исполнение плана из `docs/superpowers/plans/`).
4. **Subagents для нетривиального.** `Explore` — поиск по контенту/компонентам; `feature-dev:code-explorer` / `code-architect` / `code-reviewer` — анализ/дизайн/ревью; `general-purpose` — research канона. Не дублируй работу делегата (исключение — verification visual-gate, см. правило 10).
5. **MCP servers.** `project-docs` (канон — read-only, авторитет), `context7` (доки библиотек), `playwright` (screenshot-diff = gate 2 vision-first-ui), `vercel` (deploy/logs/preview), `ide` (TS diagnostics).
6. **Conventional Commits + ветки + PR.** `feat:` / `fix:` / `docs:` / `chore:` / `refactor:` / `test:`. Новый функционал → ветка `feature/<slug>`. Merge в `main` — через PR с зелёным CI (typecheck + test + e2e). Скилы — `commit-commands:commit` / `commit-push-pr`. Коммитить/пушить — только по просьбе владельца.
7. **Agile-итерации.** Фазы с явной целью и acceptance (Фаза 0 pre-flight → Фаза 1 срез Куратора → Фазы 2..N тиражирование). Скоуп зафиксирован в спеке; расширение — обновить спеку + согласовать.
8. **Update docs после Phase / фичи.** `docs/STATUS.md` (зеркало кода — обязательно) + «Текущий статус» в CLAUDE.md; при необходимости `CHANGELOG.md`, `README.md`, `docs/architecture/adr/`.
9. **TDD where applicable.** Контент-слой (Zod-схемы, данные кабинета) и дженерик-компоненты — failing-test-first (Vitest). Порт постеров — минимум Playwright screenshot-diff.
10. **Verification before completion.** «Готово» = команда запущена, вывод прочитан, gate пройден. **VISION-FIRST-UI обязателен:** перед закрытием любой UI-задачи — Playwright screenshot-diff против эталонного PNG в `docs/architecture/` (для среза — `dnm-cabinet-curator.png`). **Зелёный билд ≠ готово.** Если visual-gate claim'ил subagent — независимо проверить артефакт (`Read` скриншота + timestamps), не верить отчёту.
11. **Безопасность секретов.** `.mcp.json` содержит **Bearer-токен** канона → он в `.gitignore` (проверено), НИКОГДА не коммитить, не тащить в клиентский бандл, не в `NEXT_PUBLIC_*`. Токен `project-docs` MCP — **только в CI** (build-time валидация версий канона). Реальных секретов в репо нет; только `.env.example` со заглушками.
12. **Production deploy — только по явной команде владельца.** Preview на PR — автоматом. Скилл — `vercel:deployments-cicd`.
13. **Risky actions — спрашиваем.** Удаление APPROVED-доков класса «намерение», force-push, delete branch, удаление untracked-файлов — confirm before action. (Старый `frontend-architecture.md` уже заменён под защитным коммитом `f134113`.)
14. **Domain-specific skills.** `vision-first-ui` (любая UI-задача — обязательно), `claude-api` (если появится Anthropic SDK), `vercel:nextjs` / `vercel:shadcn` / `vercel:react-best-practices`. `docker-multitenancy` — не применимо (нет docker-compose).
15. **Memory system.** Auto-memory `~/.claude/projects/D--Projects-samo-architecture/memory/`. Сохранять решения по канону, предпочтения владельца, расхождения; не сохранять выводимое из git/кода.
16. **Vision-first UI discipline (правило A1, §2.11).** Gate 1 (вход): прочитать брендбук + эталонный HTML/PNG постера ДО кода. Gate 2 (выход): Playwright screenshot-diff против reference PNG. Запреты: ❌ hex-литералы в компонентах (только токены из `styles/brand.css`); ❌ хардкод шрифтов (только `font-sans`/`font-display` через CSS vars); ❌ orphan-компонент (создал → интегрировал в том же task'е); ❌ pipeline-green ≡ done. См. брендбук-блок ниже.
17. **«Обнови документацию» — двухступенчатый триггер** (синонимы: «update docs», «дополни доки», «зафиксируй итоги», «debrief»). Ветка A: (1) обновить доки проекта (`docs/STATUS.md` под код; «Текущий статус» CLAUDE.md; при изменении намерения — спеку/ADR, не молча); (2) проверить кандидата для `D:\Projects\claude-md-templates` (anti-pattern §8.X / recipe §3.X / mandatory §2 / example) — если lesson есть, предложить diff + `### Source`; если нет — явно сказать «новых правил для template не выделил». Детали — в глобальных правилах владельца.
18. **Recipes-first — consume down (§2.13).** Перед проектированием новой фичи и при нетривиальном debug — сначала `Glob`+`Grep` `${CLAUDE_TEMPLATES_DIR}/recipes/*.md` по `template_when:` + scan §8.X / §3.X, потом код. Особо: §3.30 (app↔canon через MCP), §3.15 (build-time vs runtime env для статического экспорта). `${CLAUDE_TEMPLATES_DIR}` unset → silent skip; lesson всё равно в `docs/STATUS.md`/`CHANGELOG`.

## Контент-как-данные (ключевой принцип атласа)

- **Типизированные TS-модули**, дженерик-рендереры, **один файл на кабинет** в `content/cabinets/` (`CabinetSpec`), drilldown — в `content/modules/<cabinet>/` (`ModuleSpec`). Типы — единый источник `content/types.ts`.
- **Zod-валидация** (`content/schema.ts`, `validateCabinet`/`validateModule`) — каждый кабинет/модуль проходит через тест-инвариант.
- **Каждый узел несёт `sources[]`** (canon ID + версия) — обязательно; питает компонент `SourceRef`. Свободнотекстовые `source` на шагах/доменах не парсить (иначе «выдумаем» номера разделов).
- **Badge `implStatus`** (`done`/`partial`/`planned`/`divergent`) = «намерение vs код». На постере — сводный наихудший статус; внутри кабинета — на каждом домене/модуле. Цвета из токенов, никакой логики во вью. `planned` — нейтрально-синий (НЕ красный); `divergent` — тонкий бордер + ⚠ + tooltip, не сплошная заливка.
- **layout** берём из HTML-постера, **контент** — из верифицированных данных канона (НЕ копировать устаревшее из HTML: ни «7 этапов», ни «оценка 0–100%»). Исходные `docs/architecture/*.html` не трогаем — они эталон для пиксель-diff.

## Брендбук, токены, зоны

Источник: `docs/brandbook/ui-style-guide.md` + `brandbook-samo.pdf`. Единый источник токенов в коде — `styles/brand.css` (`@theme`).

- **SAMO Blue `#0055A7` доминирует** — каркас/хром (шапка, крошки, кнопки, фокус-кольцо).
- **SAMO Orange `#F7933C` / SAMO Green `#00A550` — ТОЛЬКО акценты**, НЕ фоны секций.
- **Шрифты:** Roboto (UI/тело) + Fira Sans (заголовки/числа), через `next/font`.
- **Зональная палитра** (семантика поверх бренда, в `content/zones.ts`, токены не hex): синий=управление/операции · зелёный=учёба/ученик · оранжевый=школа/админ · фиолетовый=франшиза · бирюзовый=продажи/контроль · золотой=финансы.
- **Кабинет Куратора = СИНИЙ** (решение D2; зелёный резервируем за учеником, хотя старый HTML красит зелёным — поправить при порте).
- Зона красит акцент-полосу/бордеры/бейджи/ленту ядра/шапку кабинета; фоны страниц и секций — белые/синие. **Исключение (решение владельца 06.06, по эталонным постерам `dnm-cabinet-*`):** домен-карточки L1 используют циклическую палитру 6 акцентов с лёгкой тонировкой фона (`color-mix ~5%`) + икон-тайл — «выделение блоков», одобрено. Для текста <18px — тёмные варианты акцентов (`--color-samo-orange-d` / `--color-samo-green-d`, контраст WCAG AA).
- **Запрет hex-литералов в компонентах** (линт). Логотип — `public/brand/logo.svg`.

## Два класса документации

| Класс | Файлы | Источник правды | При расхождении с кодом |
|---|---|---|---|
| **Статус реализации** | `docs/STATUS.md` | код (это его зеркало) | привести STATUS под код (безопасно автообновлять) |
| **Намерение** | спеки `docs/superpowers/`, `docs/architecture/*` (incl. `frontend-architecture.md`, ADR), `README*`, `CLAUDE.md`, `CHANGELOG*` | канон / намерение | поднять вопрос (устарел док или баг в коде?), **НЕ править молча** |

## Workflow (Agile + SDLC)

```
эпик/фича → brainstorm (superpowers:brainstorming)
          → план (writing-plans → docs/superpowers/plans/)
          → реализация (TDD: Zod-схемы/компоненты RED→GREEN)
          → vision-first-ui gate 1 (Read references) перед UI-кодом
          → review (feature-dev:code-reviewer)
          → verify: typecheck + test + e2e + Playwright screenshot-diff (gate 2)
          → finish (PR, зелёный CI) → update docs/STATUS.md
```

**DoD (срез Куратора):** постер → блок Куратора кликабелен (прочие кабинеты — заглушки «в работе», не битые ссылки) → кабинет (15 доменов, badge-статусы, 8 связей, источники) → оба модуля (`lesson-journal` divergent, `homework-review` partial) как страницы бизнес-процесса · зона синяя, нет зелёных/оранжевых фоновых секций · крошки + «назад к постеру» · адаптив (desktop ≥1280 / tablet 768–1279 / mobile <768) · a11y (нативные `<a>`, focus-visible, контраст, статус не только цветом) · Vercel preview · **Playwright screenshot-diff против `dnm-cabinet-curator.png` пройден** · `docs/STATUS.md` обновлён.

**Ключевые инварианты (не нарушать):** ядро Куратора = «процедура урока, 3 фазы», НЕ «7 этапов»; оценивание ДЗ «принято/на доработку» без баллов (никаких «0–100%»/`grade`); финансы у куратора не отображаются.

## Команды

```bash
npm run dev        # next dev — локальная разработка
npm run build      # next build → статический экспорт в out/
npm run start      # next start
npm run typecheck  # tsc --noEmit (strict)
npm run test       # vitest run (юнит: схемы, контент, компоненты)
npm run e2e        # playwright test (screenshot-diff против эталонных PNG)
npm run lint       # next lint

# Vercel (deploy — только по явной команде владельца)
vercel link --yes
vercel deploy            # preview
vercel deploy --prod     # production
```
> Команды появятся после Фазы 1 Task 1 (каркас Next.js). Сейчас репо docs-only.

## Среды

| Среда | Где | Триггер обновления |
|---|---|---|
| local | рабочая копия разработчика | `npm run dev` |
| Preview | Vercel (per-PR) | push в feature-ветку / PR — автоматом |
| Production | Vercel (`main`) | merge в `main` — только после явной команды владельца |

Без рантайм-секретов (бэка нет). Токен `project-docs` MCP — только в CI (build-time валидация версий канона), не в бандл.

## Архитектура

```
DNM Architecture Explorer (Next.js, статический SSG → Vercel)

  L0  app/page.tsx            обзорный постер (порт dnm-architecture-poster)
       │  <Link href="/cabinet/[slug]">
  L1  app/cabinet/[slug]/page.tsx          страница кабинета (15 доменов, связи, badge)
       │  <Link href="/cabinet/[slug]/module/[moduleSlug]">
  L2  .../module/[moduleSlug]/page.tsx     бизнес-процесс модуля (ProcessFlow)

  content/  ← единственный источник контента (типы + Zod + данные канона)
  components/atlas/  ← дженерик-RSC (PosterLayout, ProcessFlow, DomainCard,
                       CrossLinkBadge, ImplStatusBadge, SourceRef, Breadcrumbs, …)
  styles/brand.css   ← @theme: бренд + зональные токены (единственный источник hex)

       ▲ читает (build-time, авторитет)
  MCP project-docs (канон samo-docs)        samo-dnm (код — факт «как сейчас» для badge)
```
Детали — `docs/architecture/frontend-architecture.md`.

## Структура репо

```
samo_architecture/
├── CLAUDE.md                       ← этот файл (living-doc)
├── .mcp.json                       ← MCP project-docs (Bearer-токен; В .gitignore!)
├── .gitignore
├── docs/
│   ├── STATUS.md                   ← зеркало кода (заводится в Фазе 0; пока нет)
│   ├── architecture/
│   │   ├── frontend-architecture.md    ← инженерная архитектура атласа
│   │   ├── README.md                   ← обзор постеров
│   │   ├── dnm-architecture-poster*.{html,png}   ← эталоны постера (пиксель-diff)
│   │   ├── dnm-cabinet-*.{html,png}              ← 11 кабинетов + бизнес-проект (эталоны)
│   │   └── adr/                        ← adr-001..005
│   ├── brandbook/                  ← ui-style-guide.md, brandbook-samo.pdf, logo*.{svg,png}
│   └── superpowers/
│       ├── specs/2026-06-06-dnm-interactive-architecture-design.md   ← дизайн-спека
│       └── plans/2026-06-06-dnm-curator-vertical-slice.md            ← план реализации
└── (app/ content/ components/ styles/ public/ tests/ e2e/ — появятся в Фазе 1)
```

## Setup на свежей машине

```bash
git clone <repo> samo_architecture
# .mcp.json не в git — получить токен канона у владельца, положить локально
# (структура: mcpServers.project-docs.headers.Authorization = "Bearer <token>")
npm install          # после Фазы 1 (каркас Next.js)
npm run dev
```

## State не в git

- `.mcp.json` (Bearer-токен канона — per-developer/CI)
- `node_modules/`, `.next/`, `out/`, `.vercel/` (см. `.gitignore`)
- Memory: `~/.claude/projects/D--Projects-samo-architecture/memory/*.md` — per-user

## Внешние сервисы / секреты

- **Канон `samo-docs`** — read-only через MCP `project-docs` (`https://docs67.samo.dev.vizor.company/mcp`). Auth — Bearer в `.mcp.json` (gitignored). Build-time валидация версий — в CI.
- **Vercel** — статический хостинг + preview. Без рантайм-env (бэка нет). Никаких `NEXT_PUBLIC_*` с секретами.
- **Реальных секретов в репо нет.** Если появится сборочный env — `.env.example` со заглушками; правки `.env*` — только с разрешения владельца.

## Бизнес-правила

Нормативные бизнес-правила ДНМ живут в **каноне** (`samo-docs` через MCP), не в репо. Верифицированные факты Куратора (роль, ядро-процесс, 15 доменов, 8 связей, расхождения) — в дизайн-спеке §8–§10. Не дублировать норматив в коде — ссылаться через `sources[]`.

## Реестр инструментов

### Скилы

| Скилл | Триггер |
|---|---|
| `superpowers:brainstorming` | Перед creative-задачей (новая фича/экран) |
| `superpowers:writing-plans` | Multi-step (3+ шага) |
| `superpowers:test-driven-development` | Zod-схемы, контент, компоненты |
| `superpowers:executing-plans` / `subagent-driven-development` | Исполнение плана из `docs/superpowers/plans/` |
| `superpowers:systematic-debugging` | Любой баг / падение теста |
| `superpowers:verification-before-completion` | Перед claim'ом success |
| **`vision-first-ui`** | **АВТО** на любой UI-задаче (design/UI/screen/верстка/макет/редизайн/компонент). Gate 1 + gate 2 (screenshot-diff). Без него UI-задача отбрасывается |
| `vercel:nextjs` | Любая работа с App Router / RSC / SSG |
| `vercel:shadcn` | Установка/композиция shadcn/ui |
| `vercel:react-best-practices` | Авто после редактирования 2+ TSX |
| `vercel:deployments-cicd` | Deploy / preview / rollback |
| `claude-md-management:claude-md-improver` | Раз в спринт — аудит CLAUDE.md |
| `commit-commands:commit-push-pr` | Готовая фича — коммит, push, PR |

### Subagents

| Агент | Применение |
|---|---|
| `Explore` | Read-only поиск по контенту/компонентам/постерам |
| `feature-dev:code-explorer` | Анализ существующих фич |
| `feature-dev:code-architect` | Дизайн новой фичи/компонента |
| `feature-dev:code-reviewer` | Аудит bugs/security/quality перед merge |
| `general-purpose` | Research канона / multi-step |

### MCP servers

| Сервер | Используем для |
|---|---|
| `project-docs` (`mcp__project-docs__*`) | **Канон samo-docs** — `list_index` / `get_doc` / `search_docs` / `propose_change` (read-only авторитет) |
| `plugin context7` | Документация библиотек (правило 2) |
| `plugin playwright` | Screenshot-diff (gate 2 vision-first-ui), golden-path |
| `plugin vercel` | Deploy / logs / projects / preview |
| `ide` | TypeScript diagnostics |

### Hooks (settings.json)

Project-scoped hooks не настроены. Глобальный Stop-хук `~/.claude/hooks/docs-sync-reminder.sh` напоминает после изменений кода: привести `docs/STATUS.md` под код и сверить намерение (specs/README/CLAUDE.md), не править молча. Конфигурация хуков — скилл `update-config`.

### Memory system

Path: `~/.claude/projects/D--Projects-samo-architecture/memory/`

## Текущий статус (2026-06-08)

> Подробное зеркало кода — `docs/STATUS.md`. Здесь — срез верхнего уровня.

**Сделано:**
- [x] Дизайн-спека + план утверждены; инженерная архитектура атласа (`frontend-architecture.md`)
- [x] Каркас Next.js 15 (App Router, strict TS, статический экспорт), бренд-токены, зоны
- [x] Контент-слой: типы + Zod (`content/schema.ts`), реестр `CABINETS` (12 кабинетов)
- [x] Вертикальный срез «Куратор»: L0 → кабинет (15 доменов / 8 связей) → 2 модуля; задеплоен (`samoarchitecture.vercel.app`)
- [x] **L0 постер-редизайн** (`feature/poster-style-redesign`): дизайн-система постер-стиля, `OverviewSpec`, контент по встречам 04–05.06 — 3 этажа / 12 кабинетов (добавлен **Маркетолог**; «Качество» — функция админа, не кабинет); шапка — качественные чипы
- [x] **L1 постер-рендерер всех кабинетов** (общий `/cabinet/[slug]`, content-as-data): компоненты `cabinet-header`/`core-process-band`/`domain-panel`/`cross-link-panel`/`module-panel`/`split-icon`; разноцветные домен-карточки + икон-тайлы + нав-бар + ядро-цепочка
- [x] **Наполнены 11 кабинетов** (канон + встречи + проектный док): Куратор (blue), Ученик (green), Родитель (blue), Финансист (gold), **Куратор франшиз (purple)**, **Франчайзи/директор (purple)**, **Администратор школы (orange, 14 доменов — операционный центр; ядро «Зачисление-мастер»)**, **Старший куратор (blue, 10 доменов — «играющий тренер»: сам преподаёт + руководит командой кураторов; контроль/коучинг раздельно; 07.06, Workflow «команда БА» нашла 9 пробелов логики/границ ролей, все разрешены против RBAC v1.4)**, **Руководитель проекта (blue, франчайзер — обновление 08.06, ветка `update_08_06`; 12 доменов; ядро «Стратегический контур франчайзера»)**, **Менеджер по продажам (teal, 08.06 — ядро «Воронка лида-родителя»; ⚠ пробное проводит куратор, договор/оплата у админа)**, **Маркетолог (orange, 08.06 — франчайзи-уровень; ядро «Контур лидогенерации со сквозной атрибуцией»; двухуровневая модель; связка с продажами)**. Каждый — ядро-процесс, домены, связи, модули, `sources[]`
- [x] **Канон синхронизирован** (06.06): Родитель/Маркетолог/«отдел качества»=функция админа/ИИ-аватар внесены в канон (`CONV-ROLES-DNM-001 v1.2`, `CONV-ROLE-HIERARCHY-001 v1.6`, `SPEC-DNM-TZ-001 v3.3`); `op-marketolog-dnm` — официальный канон; `propose_change` не нужен
- [x] **Указание владельца:** доля распределения роялти (50%) не отображается в атласе; **весь проект обезличен — только роли** (sweep 06.06: content/ + docs/; регрессионный guard-тест `tests/content/impersonal.test.ts`; см. memory)
- [x] **Push + production-деплой** (06.06): ветка в `origin`; `vercel deploy --prod` → **live `samoarchitecture.vercel.app`** (18 страниц, проверено)
- [x] Проверки: typecheck 0 · **test 83/83** · build · **e2e 13/13** (golden'ы L0 + 5 кабинетов) · vision gate 2 vs постер-стиль
- [x] **ПОЛНАЯ канон-синхронизация версий** (07.06, 4 MCP-ревизора): факты всех кабинетов+модулей подтверждены текущим каноном — **дрейфа фактов нет**; бампнуты пины TZ→3.5, M3→2.3, RBAC→1.4, ROLES→1.3, HIERARCHY→1.7, FINANCE-REPORT→1.2. Правка-лейбл br7 «Руководитель проекта ДНМ». `SPEC-M10-FRANCHISING-001` подтверждён живым (v1.1). Канон↔канон наблюдения и обогащения — в `docs/STATUS.md` (на подтверждении). typecheck/test 83/83/build/e2e 13/13 зелёные
- [x] **Канон обновлён (P1/P3) + атлас пересинхронизирован под текущий канон** (07.06): в `samo-docs` применены `SPEC-DNM-TZ-001` v3.8 (куратор франшиз = аккаунт-менеджер сети, §18.1/18.7) и `SPEC-M3-DNM-001` v2.6 (солары 8 кат./~1190, `OQ-UCH-03`), коммит `d08f718`. Атлас ре-пиннут (TZ 3.8, M3 2.6, FUNC 2.2, FINANCE-REPORT 1.3, M11 1.1, RATING 1.2, KPI-PAYOUT 1.1) + обогащён: `parent.ts` §18.8 (ПДн/мультиопекунство/самообслуживание/портфолио, OQ-PARENT-01..05), `finance.ts` «Вариант A» (D1–D5, без доли 50%). **Дрейфа фактов нет.** **⚠️ MCP отдаёт устаревший канон — версии из локального `canon/INDEX.md`** (memory). typecheck 0 · test 91/91 · build 19 · e2e 15/15 (голдены parent/finance перегенерены, vision gate 2 ✓)

- [x] **Кабинет руководителя проекта** (`lead.ts`, 08.06, ветка `update_08_06`) — из проектного дока ЛК + follow-up адверс. проверки (Google Docs) + встречи + канон. Ядро «Стратегический контур франчайзера» (6 стадий), 12 доменов, 8 связей, 14 модулей, blue. **Поправки к постеру:** программу авторит куратор франшиз (руководитель подтверждает); руководитель не видит данных отдельного ученика (только агрегат); ядро ≠ редактор уроков. **Механизм «New»** (item-level `isNew` + `NewBadge`, аддитивно; снимается при мердже в master). **Расхождения → `docs/canon-proposals/2026-06-08-lead-cabinet.md`** (на согласовании; главное — авторинг программы vs `CONV-RBAC-DNM-001` v1.4). Guardrails: без доли 50%, обезличено. typecheck 0 · **test 121/121** · build 18 · **e2e 21/21** · vision gate 2 ✓.
- [x] **UX-редизайн читаемости L1** (08.06, ветка `update_08_06`) — по фидбэку владельца: `purpose` убран из шапки → тематическая панель «Роль, границы и инварианты» внизу (с ⚠-поправками и «Границами» как callout); блок-цикл «Стратегический контур» вынесен вверх ядра (`coreProcess.loop`); source-рефы в карточках свёрнуты; свип карточек всех 9 кабинетов (9 субагентов-редакторов). test 121/121 · e2e 21/21.
- [x] **L0 «Сводная карта системы» `/map`** (08.06, ветка `update_08_06`) — иерархия ролей + матрица «роль×раздел×право» (канон RBAC v1.4 + ⚠ нестыковки) + карта передач. Портирован `docs/architecture/sistema-karta-rolei.html`, сверен с каноном. Линк-баннер с L0. test 128/128 · e2e 23/23.
- [x] **Кабинет менеджера по продажам** (`sales.ts`, 08.06, ветка `update_08_06`) — из проектного дока ЛК (Google Doc §17) + встречи + канон. Ядро «Воронка лида-родителя» (6 шагов до передачи, без оплат), 9 доменов, 6 связей, 8 модулей, teal. **Поправки к постеру:** пробное проводит куратор (не менеджер); договор/оплата/рассрочка/возвраты — у админа/финансов, бухгалтер подтверждает, менеджер видит статус (read). **Расхождения → `docs/canon-proposals/2026-06-08-sales-cabinet.md`** (RBAC v1.4 §6: Мен имеет CRU оплаты/рассрочки → убрать). Guardrails: обезличено, B2B вне scope. test sales 10/10.
- [x] **Кабинет маркетолога** (`marketer.ts`, 08.06, ветка `update_08_06`) — из 2 проектных доков (Google Docs) + майский отчёт + встреча 05.06 + канон. Франчайзи-уровень, ядро «Контур лидогенерации со сквозной атрибуцией» (6 шагов), 9 доменов, 7 связей, 9 модулей, orange. Двухуровневая модель (HQ vs франчайзи); сквозная UTM-атрибуция (событие конверсии у бухгалтера → close rate); KPI=качество; связка с `sales` (передаёт лиды). **Без эталон-постера → нет меток New.** **Расхождения → `docs/canon-proposals/2026-06-08-marketer-cabinet.md`** (M1 маркетолог вне RBAC v1.4; M2 пайплайн атрибуции; M3 KPI=качество). Обезличено. test marketer 10/10.
- [x] **Кабинет гостя** (`guest.ts`, 08.06, ветка `update_08_06`) — **ПОСЛЕДНИЙ из 12; реестр `CABINETS` наполнен целиком, стабов нет** (хелпер `stub()` удалён). Из эталон-постера `dnm-cabinet-guest.{html,png}` (02.06) + встреча 04.06 + канон. Роль `cr-gost-dnm`, **зона green**, ядро «Онбординг — от знакомства до зачисления» (6 шагов), 8 доменов, 7 связей, 8 модулей. **Поправки к постеру (метки New):** пробное проводит КУРАТОР (не менеджер); договор/оплату/рассрочку/зачисление ведёт АДМИНИСТРАТОР + финансы, факт оплаты — БУХГАЛТЕР; вход телефон+код (не email/Google). **Инварианты:** гость = состояние до авторизации (не роль RBAC, не строка `/map`); изолированная роль (ADR-003); реф-регистрация ребёнка — право только родителя; 7-дневный TTL; доступ к урокам только после оферты И `payment.confirmed`. **Расхождения → `docs/canon-proposals/2026-06-08-guest-cabinet.md`** (главное — само-противоречие канона «пробное=куратор vs менеджер», синхронизировать под TZ v3.8; оплата CRU у Мен убрать). Guardrails: обезличено, без доли 50%. typecheck 0 · **test 160/160** (guest +12) · build 19 · **e2e 29/29** (golden `cabinet-guest.png`) · vision gate 2 ✓.
- [x] **Финал (07.06):** code-review (critical нет) → PR #1 **смёржен в `main`** (`36b3aea`). Прод live `samoarchitecture.vercel.app`.

**Открытые вопросы** (показываются в атласе как «на подтверждении», полный список — спека §12, канон-сверка — `docs/STATUS.md`):
- Процедура урока: 3-фаза `REG-DNM-LESSON-001` vs 9-этапная методичка `REG-DNM-CURATOR-001` — руководитель франшизы (br7)
- Номиналы соларов и лимит за семестр (~1190 vs ~1140); фикс-ставки и планы KPI для выплат
- Точные числа: коэф. успешности пробного (встречи — «напр. 70–80%»), план/факт наполнения (250/120)
- Функции ИИ-аватара наставника в кабинетах ученика/родителя/куратора (канон относит к отд. продукту M19)

## Контакты

- **Maintainer:** Max (maximyarohin@gmail.com)
- **Канон (авторитет):** https://github.com/bobodzhonovdi/samo-docs (через MCP `project-docs`)
- **Код-источник (факт «как сейчас»):** https://github.com/bobodzhonovdi/samo-dnm

## Ссылки внутрь

- [docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md](./docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md) — дизайн-спека (бизнес-факты, §8 Куратор, §9 расхождения)
- [docs/superpowers/plans/2026-06-06-dnm-curator-vertical-slice.md](./docs/superpowers/plans/2026-06-06-dnm-curator-vertical-slice.md) — план реализации
- [docs/architecture/frontend-architecture.md](./docs/architecture/frontend-architecture.md) — инженерная архитектура атласа
- [docs/architecture/README.md](./docs/architecture/README.md) — обзор постеров (11 кабинетов)
- [docs/brandbook/ui-style-guide.md](./docs/brandbook/ui-style-guide.md) — брендбук
- [docs/architecture/adr/](./docs/architecture/adr/) — ADR-001..005
- `docs/STATUS.md` — зеркало реализации (заводится в Фазе 0)
