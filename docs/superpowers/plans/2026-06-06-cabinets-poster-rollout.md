# Глобальный план: все кабинеты в постер-стиле (L1 rollout)

> Решение владельца (2026-06-06): отрисовать ВСЕ кабинеты в единой постер-стилистике L0. Общий рендерер `/cabinet/[slug]` переводится на постер-компоненты (content-as-data — один рендерер, все кабинеты разом). Эталоны верстки — `docs/architecture/dnm-cabinet-*.png`. Контент — канон (MCP) + встречи 04–05.06.

## Очередь (по приоритету владельца)

1. **Кабинет ученика** (`child`) — СЕЙЧАС: полное наполнение `content/cabinets/child.ts` (канон+встречи) + перевод общего L1-рендерера на постер-стиль. Эталон `dnm-cabinet-child.png`. Зона green.
2. **Доработка кабинета куратора** (`curator`) — уже наполнен; привести под постер-рендерер, сверить с `dnm-cabinet-curator.png`, перегенерить golden.
3. **Остальные кабинеты** — наполнение `content/cabinets/*.ts` из стабов (parent, school-admin, senior-curator, sales, marketer, finance, franchise, franchise-curator, lead, guest) + сверка с их `dnm-cabinet-*.png`.

## Архитектура рендера (общая для всех)

Постер-компоненты L1 (`components/atlas/*`, по образцу L0):
- `CabinetPoster` каркас (PosterFrame + top-bar) + `CabinetHeader` (роль, статус, назначение, крошки, «назад к постеру», навигация-чипы по доменам).
- `CoreProcessBand` — ядро-процесс (нумерованные шаги, end/alt-варианты, badge «на подтверждении», note, sources).
- `DomainPanel` — домен (зональный left-stripe, title, буллеты, SourceRef, readOnly/toggleable бейджи).
- `CrossLinkPanel` — связь с кабинетом (направление, label, source) — кликабельна на `/cabinet/[toCabinet]`.
- `ModulePanel` — модуль (status-бейдж, drilldown-ссылка).
- Переиспользуем: `ImplStatusBadge`, `SourceRef`, `Breadcrumbs`, `Legend` (по возможности — постер-вариант).

Старые `PosterLayout / DomainCard / ProcessFlow / CrossLinkBadge / ModuleCard` — заменяются; орфаны удаляются (правило 16).

## Инварианты контента (не нарушать)

- Ученик: ДЗ «принято/на доработку» БЕЗ баллов (нет 0–100%/grade); тесты ≥70%; СУ и Бизнес-проект — два отдельных блока; финансы ученику не показываем; ядро = «Учебный цикл» (Видео→Классная→ДЗ→Тест→Следующий урок→Сертификат), не «7 этапов».
- Каждый узел несёт `sources[]` (canon ID+версия); meeting-only факты — без canon-id, помечаются (unverified/divergent), расхождения → `docs/STATUS.md`.

## DoD каждого кабинета

Контент валиден по `CabinetSchema` (Zod-тест) · L1 рендерится в постер-стиле · карточки/связи кликабельны · крошки + «назад» · адаптив · **vision-first-ui gate 2** (Playwright screenshot vs `dnm-cabinet-<slug>.png`) · golden обновлён · `docs/STATUS.md` обновлён.
