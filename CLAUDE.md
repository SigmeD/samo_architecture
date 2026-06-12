# CLAUDE.md — DNM Architecture Explorer · Next.js atlas + docs knowledge-base (гибрид)

> Living-doc: первоисточник контекста для Claude Code в этом репо. Обновляется при изменении стека / структуры / процесса / скоупа и после каждой Phase. Bootstrap'нут 2026-06-06 из `CLAUDE_MD_TEMPLATE.md` (Application Matrix §0).

## Проект

**Что это.** Гибрид двух контуров в одном репозитории:
- **(а) Атлас** — `DNM Architecture Explorer`: интерактивный навигируемый атлас архитектуры ДНМ («Дети на миллион», детская образовательная система предпринимательства). Next.js App Router + TS strict + Tailwind v4 + shadcn/ui, полностью статический SSG, деплой Vercel, **без бэка / auth / мок-API**. Контент-как-данные: постер → кабинет → бизнес-процесс модуля. Презентационная карта, не функциональный продукт.
- **(б) База знаний** — docs-контур: исходные постеры архитектуры (`docs/architecture/*.html` + `*.png`), ADR, брендбук, дизайн-спеки и планы (`docs/superpowers/`).

**Цель.** Дать владельцу и разработчикам актуальную, привязанную к канону, интерактивную карту архитектуры ДНМ. Каждый узел трассируется к нормативу (ID + версия), а badge `implStatus` показывает «намерение vs код».

**Кому.** Владелец бизнеса + команда разработки ДНМ. Ключевая бизнес-цель клиента — продажа франшизы (влияет на архитектуру).

**Текущая фаза.** v0 live (`samoarchitecture.vercel.app`), единая постер-стилистика L0+L1. **Наполнены ВСЕ 15 из 15 кабинетов — стабов нет** (13 ролевых + **Директор школы** и **HR/рекрутинг ДНМ** — сплит/новые роли 12.06; Куратор/Ученик/Родитель/Бухгалтер · Куратор франшиз/Франчайзи-партнёр/Директор школы/Администратор/Старший куратор · Руководитель/Менеджер по продажам/Маркетолог/HR · Гость · Методист). Добавлены: L0 **«Сводная карта системы»** (`/map`: иерархия + матрица RBAC + карта передач), механизм меток **New** (новизна vs постер, снимается при мердже), UX-редизайн читаемости (панель «Роль, границы и инварианты» внизу + контур-цикл). **Кабинет ученика переработан (09.06):** наложение приоритетов удержание/посещение/честная механика баллов + когортный слой JUNIOR/SENIOR → **16 доменов** (солары merit/gift, рейтинг 3 среза × когорта, тиры/перцентиль; метки New на 8 доменах). Созданы человекочитаемые **MD-описания 12 кабинетов** (`docs/cabinets/`). **Встречи 08–09.06 (ветка `update_09_06`):** BA-команда сделала gap-анализ (`docs/superpowers/specs/2026-06-09-dnm-08-09-gap-analysis.md`) — выявлено **9 реверсов/решений владельца R1–R9** (НЕ править молча; часть «уточнить с франшизой»); **Фаза 1** — аддитивные правки 6 кабинетов; **Фаза 3** — **новый кабинет методиста** (конструктор видов уроков) + роли ГО + Бизнес-академия сквозная → **13 кабинетов**. Реверсы помечены `⚠`/`divergent` + canon-proposal; **Само Глобал — отдельный продукт вне атласа**. Расхождения с каноном — в `docs/canon-proposals/` (на согласовании клиента, не правим канон молча). **Серия правок по скриншотам владельца (09.06):** (а) рендер связей — обоюдные ⇄ кликабельные карточки, односторонние ←/→ блоком «Односторонние связи» ниже; (б) **строгая вертикаль данных/эскалации** — каждый кабинет связан только ±1 уровень (отчёты вверх Куратор→Ст.куратор→Админ→Франчайзи→КФ→Руководитель; методпакеты вниз через КФ; финлиния ГО отдельно), гард-тест `system-graph.test.ts`; (в) **чат-хаб админа школы** (⇄ ученик-старшие/ст.куратор/родитель/бухгалтер/франчайзи/менеджер/маркетолог); (г) **РЕВЕРС воронки продаж** — договор у менеджера, админ подтверждает, оплата через бухгалтерию (совпало с каноном RBAC v1.4 §6 → canon-proposals sales-S2/guest **ОТОЗВАНЫ**); «Менеджер по продажам ДНМ», метрика лида, Топ-20 постов; (д) чистка `/map`. **`update_09_06` смёржена в `main`** (PR #7, merge `4a33c6f`, 09.06) → прод обновлён. Осталось (новая ветка): Фаза 0 опросник R1–R9, Фаза 2 реверсы, Фаза 4 (граница Само Глобал). План rollout: `docs/superpowers/plans/2026-06-06-cabinets-poster-rollout.md`.

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
# ⚠ НЕ запускать e2e/build при ЖИВОМ `npm run dev` на том же `.next`: playwright поднимает свой
#   webServer → манифест чанков рассинхронивается → dev отдаёт 500 (`Cannot find module './NNN.js'`),
#   при этом typecheck/build/e2e зелёные. Fix: остановить dev → `rm -rf .next` → перезапустить dev.
#   Проверять РАБОТУ localka HTTP-статусом (curl -o /dev/null -w '%{http_code}'), не только grep контента.

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

## Текущий статус (2026-06-12)

> Подробное зеркало кода и вся история — `docs/STATUS.md`. Здесь — компактный срез (форензика прошлых сессий — в STATUS + git).

**Готово (на проде `samoarchitecture.vercel.app`):** атлас в постер-стиле L0+L1; **15 из 15 кабинетов наполнены, стабов нет**; L0 «Сводная карта системы» `/map` (иерархия + матрица RBAC v1.6 + карта передач); контент-как-данные (типы + Zod + `sources[]` с канон-версиями); guardrails — обезличено, доля роялти 50% нигде, метки New убраны везде. История реализации (06–09.06: каркас, постер-редизайн, наполнение кабинетов, канон-синки) — `docs/STATUS.md` + git.

**Сессия 12.06 — всё смёржено в `main` (PR #10→#11→#12, прод verified).** Запрошенный gap-анализ канон↔атлас по орг-роли (`Screenshot_4` вшит в `CONV-ROLES-DNM-001 v1.6 §2б`):
- **Сплит Админ/Директор:** жирный `school-admin` → `/cabinet/director` («Директор школы ДНМ», `op-direktor-shkoly-dnm`); новый лёгкий `/school-admin` (обслуживающий/распределяющий).
- **Новый ЛК HR/рекрутинг ДНМ** (`op-hr-dnm`, blue).
- **Ре-пин всех 15 кабинетов** под актуальный канон 12.06 (RBAC 1.6 · HIERARCHY 1.11 · ROLES 1.6 · TZ 3.10 · M3 2.10 · FINANCE-REPORT 1.4 · M10 1.2 · RATING 1.5 · KPI-PAYOUT 1.3 · SOLARS 1.1 · REG 1.4 · …); ГО-роли (РОП/Финансист ГО/Менеджер франшиз) как маркеры в `/map`, «Ст.куратор ГО» убран (OQ-ORG-04).
- **Разрешён открытый дрейф C1–C5** (`docs/canon-proposals/2026-06-12-t5-open-drift.md`): C1 trial-runner (менеджер сам ИЛИ куратор по цепочке менеджер→админ→ст.куратор) · C2 marketer «ноль финансов» (не видит выручку) · C3 методист-авторинг · C4 расцепление Франчайзи-партнёр/Директор · C5 ст.куратор лейблы.
- **Связи Директора расширены до 8** (по Screenshot_4: подчинённые + эскалац. чат с родителем). **Онбординг новичка + шкала развития L0–L5** в кабинете франчайзи (прогрессивная разблокировка по найму, провижининг, дашборд рекомендаций).
- typecheck 0 · **test 278/278** · **e2e 35/35** · vision-gate ✓.

**Открытые вопросы** (в атласе «на подтверждении»; полный список — `docs/STATUS.md` + `docs/canon-proposals/`):
- Процедура урока: 3-фаза `REG-DNM-LESSON-001` vs 9-этапная `REG-DNM-CURATOR-001`.
- Номиналы соларов/лимит семестра; KPI-ставки/планы выплат.
- `OQ-ORG-01/02/03` (Таргет/СММ-сплит; линия HR; per-resource RBAC новых ролей — Директор/Финансист ГО/HR/Методист/Таргетолог); `OQ-HR-02/03/04`.
- Экономика франшизы L0–L5 (наёмный «Директор школы» в карту ролей/RBAC; правила понижения уровня) — ADR-0002 Proposed.
- Функции ИИ-аватара наставника (канон — отд. продукт M19).

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
