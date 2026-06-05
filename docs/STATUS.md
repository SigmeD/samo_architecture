# Статус реализации — DNM Architecture Explorer (атлас)

> Зеркало текущего состояния кода относительно дизайн-спеки и канона. Обновляется вместе с кодом.

## Сделано
- [x] Дизайн-спека утверждена (`docs/superpowers/specs/2026-06-06-dnm-interactive-architecture-design.md`)
- [x] Защитный git-снимок (`f134113`); `frontend-architecture.md` заменён на атласный (`0ea981d`)
- [x] План вертикального среза «Куратор» (`docs/superpowers/plans/2026-06-06-dnm-curator-vertical-slice.md`)
- [x] Корневой `CLAUDE.md` (правила проекта, `36b3c01`)

## В работе
- Фаза 1 — вертикальный срез «Куратор» (ветка `feature/curator-vertical-slice`) — **собран, не смёржен**
  - [x] Task 1 — каркас Next.js (App Router, strict TS, static export) — Next 15.5.19
  - [x] Task 2 — тест-раннеры (Vitest + Playwright)
  - [x] Task 3 — бренд-токены, зоны, ассеты (`styles/brand.css`, `public/brand/`)
  - [x] Task 4–6 — контент: типы, Zod-схема (TDD), зоны
  - [x] Task 7–8 — контент Куратора (15 доменов / 8 связей / 14 модулей) + 2 модуля
  - [x] Task 9–13 — дженерик-компоненты (`components/atlas/*`)
  - [x] Task 14–17 — маршруты L0/L1/L2 (Next 15 async params; 17 статических страниц)
  - [x] Task 18 — Playwright e2e (3 функц. ✓) + baseline screenshot
  - [x] Task 19 — деплой Vercel (production: https://samoarchitecture.vercel.app)
  - [ ] Финал: code-review всего среза → merge `feature/curator-vertical-slice` → `main`

**Проверено:** `npm run build` (17 страниц) · `npm run test` 18/18 · `npm run typecheck` 0 ошибок · e2e канон-инварианты · **живой сайт** https://samoarchitecture.vercel.app рендерит кабинет Куратора (процедура урока, divergent-бейджи, без «7 этапов»/«0–100%»).

## Финальный code-review (READY TO MERGE)
Critical — нет; канон-верность подтверждена end-to-end; build/test/typecheck зелёные. Follow-ups:
- [ ] (Important, до кабинета №2) data-driven Zod-тест по всем `CABINETS` + `getAllModulePairs()`
- [ ] (Important, до кабинета №2) тест целостности: каждый `crossLink.toCabinet` резолвится через `getCabinet`
- [ ] (Minor) убрать неиспользуемый `clsx`; решить судьбу поля `actors`; починить/убрать `next lint`
- [ ] (Minor) `.gitignore`: `test-results/`, `playwright-report/`; index-ключи; дубли заголовков (a11y); font-vars

## Не покрыто / отложено
- [ ] Кабинеты, кроме Куратора (Фазы 2..N) — навигируемые стабы
- [ ] Перегенерация PNG из контента (`scripts/render-posters.ts`)

## Открытые вопросы канона (показаны в атласе как «на подтверждении»)
См. спеку §12 (процедура урока 3-фаза/9-этапов, номиналы соларов, KPI-ставки, ИИ-аватар и др.).
