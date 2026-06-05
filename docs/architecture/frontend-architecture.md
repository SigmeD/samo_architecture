# Frontend Architecture: "Дети на миллион" (ДНМ)

**Версия:** 1.0
**Дата:** 30.03.2026
**Статус:** APPROVED
**Автор:** agent-architector
**Назначение:** архитектурный документ для agent-dev — инициализация проекта и реализация всех экранов

---

## 1. Обзор и принципы

### 1.1. Цель

Фронтенд-прототип платформы ДНМ — полностью функциональный UI с мок-данными, готовый к подключению реального API через переключение одной env-переменной. Прототип покрывает все 6 ролевых кабинетов и все бизнес-flow из ФО.

### 1.2. Архитектурные принципы

1. **Feature-sliced-lite** — модули группируются по ролевым кабинетам (bounded contexts), shared-код вынесен отдельно
2. **API-абстракция** — единый интерфейс `apiClient`; реализация подменяется через `VITE_API_MODE=mock|real`
3. **Type-first** — все типы выводятся из Prisma-моделей (раздел 2 etap-3-dnm-plan.md), единый источник истины
4. **Ролевая изоляция** — каждый кабинет — отдельный lazy-loaded модуль с собственным layout и маршрутами
5. **i18n-ready** — все строки интерфейса через react-i18next, 4 языка (ru, kz, tj, uz)
6. **Брендбук-compliance** — Tailwind-конфиг строго по САМО style guide (цвета, шрифты, радиусы)
7. **Мок-автономность** — MSW + in-memory DB обеспечивают полноценную работу без бэкенда

---

## 2. Стек технологий

| Категория | Технология | Версия | Назначение |
|-----------|-----------|--------|------------|
| UI-фреймворк | React | 19 | Компоненты, хуки |
| Сборка | Vite | 6.x | Dev-server, HMR, build |
| Язык | TypeScript | 5.x | Строгая типизация |
| Стили | Tailwind CSS | 4.x | Утилитарные классы |
| Компоненты | shadcn/ui | latest | Базовые UI-компоненты (кастомизация под брендбук) |
| Роутинг | React Router | 7.x | File-based-like маршрутизация, nested routes |
| State | Zustand | 5.x | Глобальное состояние (auth, UI) |
| Формы | React Hook Form + Zod | latest | Валидация, wizard-формы |
| i18n | react-i18next | latest | Мультиязычность |
| Графики | Recharts | 2.x | Дашборды, прогресс |
| Моки | MSW | 2.x | Перехват запросов, мок-API |
| HTTP | ky | latest | HTTP-клиент (легче axios, поддержка hooks) |
| Иконки | lucide-react | latest | Иконки для shadcn/ui |
| Даты | date-fns | latest | Форматирование дат |

---

## 3. Структура директорий

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── components.json                    # shadcn/ui config
├── public/
│   ├── locales/
│   │   ├── ru/
│   │   │   ├── common.json
│   │   │   ├── child.json
│   │   │   ├── parent.json
│   │   │   ├── curator.json
│   │   │   ├── school-admin.json
│   │   │   ├── franchise.json
│   │   │   └── project-lead.json
│   │   ├── kz/
│   │   ├── tj/
│   │   └── uz/
│   └── assets/
│       ├── logo-color.png
│       ├── logo-inverse.png
│       └── logo-on-blue.png
│
├── src/
│   ├── main.tsx                       # точка входа, провайдеры
│   ├── app.tsx                        # корневой компонент с RouterProvider
│   ├── router.tsx                     # определение всех маршрутов
│   ├── vite-env.d.ts
│   │
│   ├── api/                           # API-абстракция
│   │   ├── client.ts                  # apiClient: ky instance с baseUrl, interceptors
│   │   ├── types.ts                   # ResponseEnvelope<T>, PaginatedResponse<T>, ApiError
│   │   ├── endpoints/                 # функции-обёртки по доменам
│   │   │   ├── auth.api.ts
│   │   │   ├── students.api.ts
│   │   │   ├── enrollments.api.ts
│   │   │   ├── groups.api.ts
│   │   │   ├── schools.api.ts
│   │   │   ├── lessons.api.ts
│   │   │   ├── homework.api.ts
│   │   │   ├── tests.api.ts
│   │   │   ├── schedule.api.ts
│   │   │   ├── attendance.api.ts
│   │   │   ├── payments.api.ts
│   │   │   ├── contracts.api.ts
│   │   │   ├── curators.api.ts
│   │   │   ├── curriculum.api.ts
│   │   │   ├── certificates.api.ts
│   │   │   ├── dashboard.api.ts
│   │   │   └── notifications.api.ts
│   │   └── hooks/                     # React Query-like хуки (или свои на useEffect+Zustand)
│   │       ├── use-students.ts
│   │       ├── use-lessons.ts
│   │       └── ...
│   │
│   ├── types/                         # TypeScript-типы (маппинг Prisma -> TS)
│   │   ├── models.ts                  # все доменные типы
│   │   ├── enums.ts                   # перечисления
│   │   ├── auth.ts                    # User, Role, JwtPayload
│   │   └── api.ts                     # request/response DTO
│   │
│   ├── stores/                        # Zustand stores
│   │   ├── auth.store.ts              # currentUser, role, token, login/logout
│   │   ├── ui.store.ts                # sidebar collapsed, theme, locale
│   │   └── notifications.store.ts     # in-app уведомления
│   │
│   ├── lib/                           # утилиты
│   │   ├── utils.ts                   # cn(), formatDate, и т.д.
│   │   ├── i18n.ts                    # конфигурация react-i18next
│   │   ├── constants.ts               # роли, статусы, лимиты
│   │   └── validators.ts              # Zod-схемы, общие для нескольких модулей
│   │
│   ├── components/                    # Shared UI-компоненты
│   │   ├── ui/                        # shadcn/ui (генерируются через CLI)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── form.tsx
│   │   │
│   │   ├── data-table/                # Универсальная таблица с фильтрами
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-toolbar.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── data-table-column-header.tsx
│   │   │   └── data-table-faceted-filter.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── student-card.tsx
│   │   │   ├── group-card.tsx
│   │   │   ├── lesson-card.tsx
│   │   │   ├── school-card.tsx
│   │   │   └── child-summary-card.tsx  # карточка ребёнка в кабинете родителя
│   │   │
│   │   ├── progress/
│   │   │   ├── semester-progress.tsx   # визуальная полоска прогресса по семестру
│   │   │   ├── lesson-progress.tsx     # прогресс по урокам
│   │   │   └── stats-card.tsx          # карточка с числом и лейблом (KPI)
│   │   │
│   │   ├── schedule/
│   │   │   ├── schedule-list.tsx       # список занятий
│   │   │   └── schedule-grid.tsx       # сетка по неделям
│   │   │
│   │   ├── forms/
│   │   │   ├── form-wizard.tsx         # многошаговая форма (generic)
│   │   │   ├── wizard-step.tsx
│   │   │   └── form-field-wrapper.tsx  # обёртка для RHF + shadcn
│   │   │
│   │   ├── feedback/
│   │   │   ├── status-badge.tsx        # универсальный бейдж статуса
│   │   │   ├── feedback-hint.tsx       # подсказка куратору по обратной связи
│   │   │   └── empty-state.tsx         # заглушка "нет данных"
│   │   │
│   │   ├── layout/
│   │   │   ├── app-shell.tsx           # общая оболочка: sidebar + header + main
│   │   │   ├── sidebar.tsx             # боковая навигация (collapsible)
│   │   │   ├── header.tsx              # шапка: логотип, юзер, язык, уведомления
│   │   │   ├── breadcrumbs.tsx
│   │   │   ├── page-header.tsx         # заголовок страницы + actions
│   │   │   └── notification-bell.tsx   # колокольчик уведомлений
│   │   │
│   │   ├── auth/
│   │   │   ├── protected-route.tsx     # guard: проверка авторизации и роли
│   │   │   ├── role-redirect.tsx       # редирект по роли после логина
│   │   │   └── login-form.tsx          # форма мок-логина
│   │   │
│   │   └── common/
│   │       ├── language-switcher.tsx
│   │       ├── confirm-dialog.tsx
│   │       ├── file-upload.tsx         # загрузка файлов (ДЗ)
│   │       ├── video-player.tsx        # обёртка видеоплеера
│   │       └── export-button.tsx       # экспорт в Excel/PDF
│   │
│   ├── modules/                       # Ролевые кабинеты
│   │   │
│   │   ├── child/                     # Кабинет ребёнка
│   │   │   ├── layout.tsx             # sidebar: уроки, прогресс, расписание, уведомления
│   │   │   ├── pages/
│   │   │   │   ├── dashboard.tsx       # 1.1: приветствие, прогресс, ближайшее занятие
│   │   │   │   ├── lessons.tsx         # 1.2: список уроков семестра
│   │   │   │   ├── lesson-detail.tsx   # 1.2: видео + классная работа + ДЗ + тест
│   │   │   │   ├── homework-submit.tsx # 1.2: форма сдачи ДЗ
│   │   │   │   ├── test-attempt.tsx    # 1.2: прохождение теста (макс 3 попытки)
│   │   │   │   ├── progress.tsx        # 1.3: статистика, история тестов
│   │   │   │   ├── schedule.tsx        # 1.4: календарь занятий
│   │   │   │   ├── semester-exam.tsx   # 1.5: итоговый тест + сертификат
│   │   │   │   └── notifications.tsx   # 1.6: центр уведомлений
│   │   │   └── components/            # компоненты, специфичные для кабинета
│   │   │       ├── lesson-card-child.tsx
│   │   │       ├── test-result.tsx
│   │   │       ├── homework-status.tsx
│   │   │       └── certificate-download.tsx
│   │   │
│   │   ├── parent/                    # Кабинет родителя
│   │   │   ├── layout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── dashboard.tsx       # 2.1: карточки детей, уведомления
│   │   │   │   ├── child-progress.tsx  # 2.2: прогресс конкретного ребёнка
│   │   │   │   ├── attendance.tsx      # 2.3: посещаемость
│   │   │   │   ├── curator-reports.tsx # 2.4: отчёты куратора
│   │   │   │   ├── payments.tsx        # 2.5: история оплат + оферта
│   │   │   │   ├── contract-sign.tsx   # 2.5: просмотр и подписание оферты
│   │   │   │   └── feedback.tsx        # 2.6: обратная связь
│   │   │   └── components/
│   │   │       ├── child-selector.tsx  # переключалка между детьми
│   │   │       ├── payment-history.tsx
│   │   │       └── contract-viewer.tsx
│   │   │
│   │   ├── curator/                   # Кабинет куратора
│   │   │   ├── layout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── groups.tsx          # 3.1: мои группы
│   │   │   │   ├── group-detail.tsx    # 3.1: состав группы
│   │   │   │   ├── lesson-journal.tsx  # 3.2: журнал занятий + чек-лист 7 этапов
│   │   │   │   ├── homework-review.tsx # 3.3: список ДЗ на проверку
│   │   │   │   ├── homework-detail.tsx # 3.3: проверка конкретного ДЗ + feedback
│   │   │   │   ├── performance.tsx     # 3.4: сводная таблица успеваемости
│   │   │   │   ├── parent-reports.tsx  # 3.5: отчёты родителям
│   │   │   │   ├── report-create.tsx   # 3.5: составление отчёта
│   │   │   │   └── schedule.tsx        # 3.6: личное расписание
│   │   │   └── components/
│   │   │       ├── checklist-form.tsx  # чек-лист 7 этапов занятия
│   │   │       ├── feedback-form.tsx   # форма обратной связи по ДЗ
│   │   │       ├── performance-table.tsx
│   │   │       └── report-template.tsx
│   │   │
│   │   ├── school-admin/              # Кабинет администратора школы
│   │   │   ├── layout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── students.tsx        # 4.1: список учеников
│   │   │   │   ├── student-detail.tsx  # 4.1: карточка ученика
│   │   │   │   ├── student-enroll.tsx  # 4.1 + 7: wizard записи ребёнка (6 шагов)
│   │   │   │   ├── student-transfer.tsx# 4.1: перевод между группами
│   │   │   │   ├── groups.tsx          # 4.2: группы и семестры
│   │   │   │   ├── group-detail.tsx    # 4.2: управление составом
│   │   │   │   ├── group-create.tsx    # 4.2: создание группы
│   │   │   │   ├── schedule.tsx        # 4.3: расписание школы
│   │   │   │   ├── attendance.tsx      # 4.4: отметка посещаемости
│   │   │   │   ├── payments.tsx        # 4.5: оплаты школы
│   │   │   │   ├── payment-create.tsx  # 4.5: ручное внесение оплаты
│   │   │   │   └── curators.tsx        # 4.6: кураторы школы
│   │   │   └── components/
│   │   │       ├── enroll-wizard/      # Wizard записи ребёнка (6 шагов)
│   │   │       │   ├── step-student-info.tsx
│   │   │       │   ├── step-group-assign.tsx
│   │   │       │   ├── step-parent-account.tsx
│   │   │       │   ├── step-invitation.tsx
│   │   │       │   ├── step-contract.tsx
│   │   │       │   └── step-payment.tsx
│   │   │       ├── attendance-grid.tsx
│   │   │       └── student-filters.tsx
│   │   │
│   │   ├── franchise/                 # Кабинет франчайзи
│   │   │   ├── layout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── dashboard.tsx       # 5.1: дашборд KPI
│   │   │   │   ├── students.tsx        # 5.2: ученики (= school-admin view)
│   │   │   │   ├── groups.tsx          # 5.2: группы
│   │   │   │   ├── finances.tsx        # 5.3: финансы школы
│   │   │   │   └── reports.tsx         # 5.4: отчётность + экспорт
│   │   │   └── components/
│   │   │       ├── kpi-cards.tsx
│   │   │       └── finance-summary.tsx
│   │   │
│   │   └── project-lead/             # Кабинет руководителя проекта
│   │       ├── layout.tsx
│   │       ├── pages/
│   │       │   ├── dashboard.tsx       # 6.1: главный дашборд (все школы)
│   │       │   ├── schools.tsx         # 6.2: управление школами
│   │       │   ├── school-detail.tsx   # 6.2: карточка школы
│   │       │   ├── school-create.tsx   # 6.2: создание школы
│   │       │   ├── curriculum.tsx      # 6.3: учебная программа
│   │       │   ├── lesson-editor.tsx   # 6.3: редактор уроков
│   │       │   ├── curators.tsx        # 6.4: реестр кураторов
│   │       │   └── reports.tsx         # 6.5: сводная отчётность
│   │       └── components/
│   │           ├── dashboard-charts.tsx
│   │           ├── school-map.tsx      # может быть простая таблица школ по городам
│   │           └── curriculum-tree.tsx
│   │
│   └── mocks/                         # MSW мок-слой
│       ├── browser.ts                 # setupWorker (для dev)
│       ├── server.ts                  # setupServer (для тестов)
│       ├── db.ts                      # in-memory DB (Map/Array)
│       ├── seed.ts                    # начальные данные
│       ├── factories/                 # фабрики для генерации данных
│       │   ├── school.factory.ts
│       │   ├── student.factory.ts
│       │   ├── group.factory.ts
│       │   ├── lesson.factory.ts
│       │   ├── enrollment.factory.ts
│       │   ├── parent.factory.ts
│       │   ├── curator.factory.ts
│       │   ├── payment.factory.ts
│       │   ├── attendance.factory.ts
│       │   ├── homework.factory.ts
│       │   ├── test.factory.ts
│       │   └── user.factory.ts
│       └── handlers/                  # MSW request handlers
│           ├── auth.handlers.ts
│           ├── students.handlers.ts
│           ├── enrollments.handlers.ts
│           ├── groups.handlers.ts
│           ├── schools.handlers.ts
│           ├── lessons.handlers.ts
│           ├── homework.handlers.ts
│           ├── tests.handlers.ts
│           ├── schedule.handlers.ts
│           ├── attendance.handlers.ts
│           ├── payments.handlers.ts
│           ├── contracts.handlers.ts
│           ├── curators.handlers.ts
│           ├── curriculum.handlers.ts
│           ├── certificates.handlers.ts
│           ├── dashboard.handlers.ts
│           └── index.ts               # объединяет все handlers
│
├── .env.development                   # VITE_API_MODE=mock, VITE_API_BASE_URL=
├── .env.production                    # VITE_API_MODE=real, VITE_API_BASE_URL=https://...
└── .env.example
```

---

## 4. Маршрутизация

### 4.1. Верхнеуровневая структура маршрутов

```
/login                              — мок-авторизация (выбор роли)
/child/*                            — кабинет ребёнка (cr4-rebenok-dnm)
/parent/*                           — кабинет родителя (cr5-roditel-dnm)
/curator/*                          — кабинет куратора (op-kurator-dnm)
/school-admin/*                     — кабинет админа школы (op-admin-shkoly-dnm)
/franchise/*                        — кабинет франчайзи (pr2-franchayzi-dnm)
/lead/*                             — кабинет руководителя (br7-rukovoditel-dnm)
```

### 4.2. Полная таблица маршрутов

#### Кабинет ребёнка (`/child`)

| Маршрут | Компонент | Раздел ФО | Описание |
|---------|-----------|-----------|----------|
| `/child` | `dashboard.tsx` | 1.1 | Главная: приветствие, прогресс, ближайшее занятие |
| `/child/lessons` | `lessons.tsx` | 1.2 | Список уроков семестра (карточки) |
| `/child/lessons/:lessonId` | `lesson-detail.tsx` | 1.2 | Урок: видео, классная работа, ДЗ, тест (табы) |
| `/child/lessons/:lessonId/homework` | `homework-submit.tsx` | 1.2 | Форма сдачи ДЗ |
| `/child/lessons/:lessonId/test` | `test-attempt.tsx` | 1.2 | Прохождение теста (3 попытки) |
| `/child/progress` | `progress.tsx` | 1.3 | Прогресс: уроки, ДЗ, тесты, статистика |
| `/child/schedule` | `schedule.tsx` | 1.4 | Расписание: список / сетка по неделям |
| `/child/semester-exam` | `semester-exam.tsx` | 1.5 | Итоговый тест + сертификат |
| `/child/notifications` | `notifications.tsx` | 1.6 | Центр уведомлений |

#### Кабинет родителя (`/parent`)

| Маршрут | Компонент | Раздел ФО | Описание |
|---------|-----------|-----------|----------|
| `/parent` | `dashboard.tsx` | 2.1 | Карточки детей, ближайшие занятия, уведомления |
| `/parent/children/:childId/progress` | `child-progress.tsx` | 2.2 | Прогресс конкретного ребёнка |
| `/parent/children/:childId/attendance` | `attendance.tsx` | 2.3 | Посещаемость ребёнка |
| `/parent/children/:childId/reports` | `curator-reports.tsx` | 2.4 | Отчёты куратора о ребёнке |
| `/parent/payments` | `payments.tsx` | 2.5 | История оплат, следующий платёж |
| `/parent/contract/:contractId` | `contract-sign.tsx` | 2.5 | Просмотр и подписание оферты |
| `/parent/feedback` | `feedback.tsx` | 2.6 | Обратная связь куратору/администратору |

#### Кабинет куратора (`/curator`)

| Маршрут | Компонент | Раздел ФО | Описание |
|---------|-----------|-----------|----------|
| `/curator` | `groups.tsx` | 3.1 | Мои группы (список) |
| `/curator/groups/:groupId` | `group-detail.tsx` | 3.1 | Состав группы |
| `/curator/groups/:groupId/journal/:lessonId` | `lesson-journal.tsx` | 3.2 | Журнал занятия + чек-лист 7 этапов |
| `/curator/homework` | `homework-review.tsx` | 3.3 | Список ДЗ на проверку (фильтры) |
| `/curator/homework/:submissionId` | `homework-detail.tsx` | 3.3 | Проверка ДЗ + обратная связь |
| `/curator/groups/:groupId/performance` | `performance.tsx` | 3.4 | Сводная таблица успеваемости |
| `/curator/reports` | `parent-reports.tsx` | 3.5 | Список отчётов родителям |
| `/curator/reports/new` | `report-create.tsx` | 3.5 | Создание отчёта (шаблон + подсказки) |
| `/curator/schedule` | `schedule.tsx` | 3.6 | Личное расписание |

#### Кабинет администратора школы (`/school-admin`)

| Маршрут | Компонент | Раздел ФО | Описание |
|---------|-----------|-----------|----------|
| `/school-admin` | `students.tsx` | 4.1 | Список учеников (фильтры: группа, семестр, статус) |
| `/school-admin/students/:studentId` | `student-detail.tsx` | 4.1 | Карточка ученика |
| `/school-admin/students/enroll` | `student-enroll.tsx` | 4.1 + 7 | **Wizard записи ребёнка** (6 шагов) |
| `/school-admin/students/:studentId/transfer` | `student-transfer.tsx` | 4.1 | Перевод между группами |
| `/school-admin/groups` | `groups.tsx` | 4.2 | Группы и семестры |
| `/school-admin/groups/:groupId` | `group-detail.tsx` | 4.2 | Управление составом группы |
| `/school-admin/groups/new` | `group-create.tsx` | 4.2 | Создание группы |
| `/school-admin/schedule` | `schedule.tsx` | 4.3 | Расписание всех групп |
| `/school-admin/attendance` | `attendance.tsx` | 4.4 | Отметка посещаемости (массово по группе) |
| `/school-admin/payments` | `payments.tsx` | 4.5 | Оплаты школы + задолженности |
| `/school-admin/payments/new` | `payment-create.tsx` | 4.5 | Ручное внесение оплаты |
| `/school-admin/curators` | `curators.tsx` | 4.6 | Кураторы школы + назначение |

#### Кабинет франчайзи (`/franchise`)

| Маршрут | Компонент | Раздел ФО | Описание |
|---------|-----------|-----------|----------|
| `/franchise` | `dashboard.tsx` | 5.1 | Дашборд KPI: ученики, заполненность, оплаты, посещаемость |
| `/franchise/students` | `students.tsx` | 5.2 | Ученики (= school-admin view) |
| `/franchise/groups` | `groups.tsx` | 5.2 | Группы |
| `/franchise/finances` | `finances.tsx` | 5.3 | Финансы: история оплат, суммы по семестрам |
| `/franchise/reports` | `reports.tsx` | 5.4 | Отчётность + экспорт Excel/PDF |

#### Кабинет руководителя проекта (`/lead`)

| Маршрут | Компонент | Раздел ФО | Описание |
|---------|-----------|-----------|----------|
| `/lead` | `dashboard.tsx` | 6.1 | Главный дашборд: все школы, продажи, учёба, группы |
| `/lead/schools` | `schools.tsx` | 6.2 | Список школ: город, тип, статус, ученики |
| `/lead/schools/:schoolId` | `school-detail.tsx` | 6.2 | Карточка школы |
| `/lead/schools/new` | `school-create.tsx` | 6.2 | Создание школы |
| `/lead/curriculum` | `curriculum.tsx` | 6.3 | Учебная программа: семестры, уроки |
| `/lead/curriculum/:lessonId` | `lesson-editor.tsx` | 6.3 | Редактор урока (контент, видео, тест) |
| `/lead/curators` | `curators.tsx` | 6.4 | Реестр кураторов по всем школам |
| `/lead/reports` | `reports.tsx` | 6.5 | Сводная отчётность + экспорт |

### 4.3. Механика защиты маршрутов

```
<ProtectedRoute>
  ├── проверяет наличие auth token в store
  ├── проверяет allowedRoles[] vs currentUser.role
  ├── если нет токена → redirect /login
  └── если роль не совпадает → redirect на дашборд своей роли
```

Каждый кабинет обёрнут в `<ProtectedRoute allowedRoles={[...]}>`

### 4.4. Логин-экран (мок-авторизация)

Страница `/login` содержит:
- Логотип САМО
- Список предустановленных пользователей (по одному на каждую роль)
- Клик по карточке пользователя = мгновенный логин (запись в Zustand + localStorage)
- Redirect на дашборд соответствующего кабинета

Предустановленные пользователи:
1. **Алиса Иванова** — ребёнок (cr4-rebenok-dnm)
2. **Марина Иванова** — родитель (cr5-roditel-dnm)
3. **Динара Касымова** — куратор (op-kurator-dnm)
4. **Светлана Петрова** — администратор школы (op-admin-shkoly-dnm)
5. **Руслан Ахметов** — франчайзи (pr2-franchayzi-dnm)
6. **Айгерим Нурланова** — руководитель проекта (br7-rukovoditel-dnm)

---

## 5. State Management (Zustand Stores)

### 5.1. `auth.store.ts`

```ts
interface AuthState {
  user: User | null;
  token: string | null;
  role: DnmRole | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;     // для мок-режима: выбор пользователя
  logout: () => void;
  hydrate: () => void;                 // восстановление из localStorage
}
```

### 5.2. `ui.store.ts`

```ts
interface UIState {
  sidebarCollapsed: boolean;
  locale: 'ru' | 'kz' | 'tj' | 'uz';
  toggleSidebar: () => void;
  setLocale: (locale: string) => void;
}
```

### 5.3. `notifications.store.ts`

```ts
interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  fetchNotifications: () => Promise<void>;
}
```

**Принцип:** stores содержат только глобальный UI-state и auth. Серверные данные (ученики, уроки, группы) НЕ хранятся в Zustand -- они запрашиваются через API-хуки и управляются на уровне компонентов (fetch-on-mount или SWR-паттерн). Это предотвращает рассинхронизацию.

---

## 6. API-слой и мок-инфраструктура (MSW)

### 6.1. Переключение mock / real

В `src/main.tsx`:

```ts
async function prepareApp() {
  if (import.meta.env.VITE_API_MODE === 'mock') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

prepareApp().then(() => createRoot(...).render(<App />));
```

### 6.2. API-клиент

`src/api/client.ts` — инстанс `ky` с настройками:
- `prefixUrl` из `VITE_API_BASE_URL` (для mock — пустой, MSW перехватит)
- `hooks.beforeRequest` — добавляет `Authorization: Bearer <token>` из auth.store
- `hooks.afterResponse` — обработка 401 (logout), 403, 500
- Типизированная обёртка: `apiClient.get<T>(url) -> Promise<ResponseEnvelope<T>>`

### 6.3. Формат ответов (ResponseEnvelope)

Все ответы API следуют формату бэкенда:

```ts
// Успех
interface ResponseEnvelope<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
  };
}

// Ошибка
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

### 6.4. API-эндпоинты (контракты)

Все URL имеют префикс `/api/dnm/`.

| Метод | URL | Описание | Используется в |
|-------|-----|----------|----------------|
| POST | `/auth/login` | Мок-логин (выбор пользователя) | login-form |
| GET | `/students` | Список учеников (с пагинацией, фильтрами) | school-admin, franchise, lead |
| GET | `/students/:id` | Карточка ученика | school-admin |
| POST | `/students` | Создание ученика | school-admin (wizard шаг 1) |
| PATCH | `/students/:id` | Обновление ученика | school-admin |
| POST | `/students/:id/transfer` | Перевод между группами | school-admin |
| GET | `/enrollments` | Зачисления (фильтр по student/group/semester) | все кабинеты |
| POST | `/enrollments` | Создание зачисления | school-admin (wizard шаг 2) |
| PATCH | `/enrollments/:id` | Обновление статуса | school-admin |
| GET | `/groups` | Список групп (фильтр по school/semester) | curator, school-admin, franchise, lead |
| GET | `/groups/:id` | Детали группы с составом | curator, school-admin |
| POST | `/groups` | Создание группы | school-admin, lead |
| PATCH | `/groups/:id` | Обновление группы | school-admin, lead |
| GET | `/schools` | Список школ | franchise, lead |
| GET | `/schools/:id` | Карточка школы | lead |
| POST | `/schools` | Создание школы | lead |
| PATCH | `/schools/:id` | Обновление школы | lead |
| GET | `/curriculum` | Учебные программы | lead |
| GET | `/curriculum/:id/lessons` | Уроки программы | child, lead |
| GET | `/lessons/:id` | Детали урока (видео, классная работа) | child, curator |
| POST | `/lessons` | Создание урока | lead |
| PATCH | `/lessons/:id` | Обновление урока | lead |
| GET | `/homework?enrollmentId=` | ДЗ ученика / группы | child, curator |
| POST | `/homework/:id/submit` | Сдача ДЗ | child |
| PATCH | `/homework/submissions/:id` | Проверка ДЗ (куратор) | curator |
| GET | `/tests/:lessonId` | Тест урока | child |
| POST | `/tests/:testId/attempt` | Попытка прохождения теста | child |
| GET | `/tests/attempts?enrollmentId=` | История попыток | child, parent |
| GET | `/schedule?groupId=` | Расписание группы | child, curator, school-admin |
| POST | `/schedule` | Создание слота расписания | school-admin |
| PATCH | `/schedule/:id` | Изменение слота | school-admin |
| GET | `/attendance?groupId=&date=` | Посещаемость | curator, school-admin, parent |
| POST | `/attendance` | Отметка посещаемости (массово) | curator, school-admin |
| GET | `/payments?schoolId=` | Оплаты школы | school-admin, franchise, lead |
| POST | `/payments` | Внесение оплаты | school-admin |
| GET | `/payments?parentId=` | Оплаты родителя | parent |
| GET | `/contracts/:id` | Договор оферты | parent |
| POST | `/contracts/:id/sign` | Подписание оферты | parent |
| GET | `/curators?schoolId=` | Кураторы школы | school-admin, lead |
| POST | `/curators/assign` | Назначение куратора на группу | school-admin, lead |
| GET | `/curators/checklist?lessonId=` | Чек-лист куратора | curator |
| POST | `/curators/checklist` | Сохранение чек-листа | curator |
| GET | `/certificates?enrollmentId=` | Сертификаты ученика | child |
| GET | `/semester-exams/:semesterId` | Итоговый тест | child |
| POST | `/semester-exams/:id/attempt` | Попытка итогового теста | child |
| GET | `/dashboard/lead` | Агрегация для дашборда руководителя | lead |
| GET | `/dashboard/franchise?schoolId=` | Агрегация для франчайзи | franchise |
| GET | `/notifications` | Уведомления текущего пользователя | все |
| PATCH | `/notifications/:id/read` | Пометка как прочитанное | все |
| GET | `/reports/parent?childId=` | Отчёты куратора для родителя | parent |
| POST | `/reports/parent` | Создание отчёта | curator |

### 6.5. MSW in-memory DB

`src/mocks/db.ts` — хранилище на основе `Map<string, Entity[]>`:

```ts
interface MockDB {
  users: User[];
  schools: DnmSchool[];
  semesters: DnmSemester[];
  groups: DnmGroup[];
  students: DnmStudent[];
  enrollments: DnmEnrollment[];
  parentLinks: DnmParentLink[];
  curriculum: DnmCurriculum[];
  lessons: DnmLesson[];
  homework: DnmHomework[];
  homeworkSubmissions: DnmHomeworkSubmission[];
  tests: DnmTest[];
  testAttempts: DnmTestAttempt[];
  scheduleSlots: DnmScheduleSlot[];
  attendance: DnmAttendance[];
  payments: DnmPayment[];
  contracts: DnmContract[];
  curatorAssignments: DnmCuratorAssignment[];
  curatorChecklists: DnmCuratorChecklist[];
  certificates: DnmCertificate[];
  notifications: Notification[];
}
```

Инициализируется из `seed.ts` при старте MSW worker.

### 6.6. Фабрики данных

Каждая фабрика экспортирует:
- `create(overrides?)` — создаёт одну сущность с faker-подобными данными
- `createMany(count, overrides?)` — пакетное создание
- Все ID — UUID v4

---

## 7. TypeScript-типы (маппинг Prisma -> TS)

### 7.1. Перечисления (`src/types/enums.ts`)

```ts
// Роли ДНМ
enum DnmRole {
  CHILD = 'cr4-rebenok-dnm',
  PARENT = 'cr5-roditel-dnm',
  PROJECT_LEAD = 'br7-rukovoditel-dnm',
  DEPARTMENT_HEAD = 'br5-rukovoditel-podrazdeleniya-dnm',
  FRANCHISE = 'pr2-franchayzi-dnm',
  CURATOR = 'op-kurator-dnm',
  SCHOOL_ADMIN = 'op-admin-shkoly-dnm',
  SALES_MANAGER = 'op-menedzher-prodazh-dnm',
}

// Возрастная группа
enum AgeGroup {
  JUNIOR = 'JUNIOR',   // 10-13 лет, семестры 1-3
  SENIOR = 'SENIOR',   // 14-17 лет, семестр 4
}

// Формат занятий
enum ClassFormat {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
}

// Тип школы
enum SchoolType {
  OWN = 'OWN',
  FRANCHISE = 'FRANCHISE',
}

// Статусы
enum SchoolStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }
enum SemesterStatus { DRAFT = 'DRAFT', ACTIVE = 'ACTIVE', COMPLETED = 'COMPLETED' }
enum EnrollmentStatus { ACTIVE = 'ACTIVE', COMPLETED = 'COMPLETED', DROPPED = 'DROPPED' }
enum HomeworkSubmissionStatus { PENDING = 'PENDING', REVIEWED = 'REVIEWED', ACCEPTED = 'ACCEPTED', REJECTED = 'REJECTED' }
enum AttendanceStatus { PRESENT = 'PRESENT', ABSENT = 'ABSENT', EXCUSED = 'EXCUSED', LATE = 'LATE' }
enum PaymentMethod { KASPI = 'KASPI', RAHMET = 'RAHMET', CASH = 'CASH', BANK = 'BANK', QR = 'QR' }
enum PaymentStatus { PENDING = 'PENDING', CONFIRMED = 'CONFIRMED', REFUNDED = 'REFUNDED' }
enum ContractStatus { DRAFT = 'DRAFT', SENT = 'SENT', SIGNED = 'SIGNED', TERMINATED = 'TERMINATED' }
enum CertificateType { SEMESTER = 'SEMESTER', GRADUATION = 'GRADUATION' }
enum LessonStatus { NOT_STARTED = 'NOT_STARTED', IN_PROGRESS = 'IN_PROGRESS', COMPLETED = 'COMPLETED' }
enum CurriculumStatus { DRAFT = 'DRAFT', PUBLISHED = 'PUBLISHED', ARCHIVED = 'ARCHIVED' }
```

### 7.2. Модели (`src/types/models.ts`)

```ts
// Базовые поля (аналог Prisma timestamps)
interface BaseEntity {
  id: string;
  createdAt: string;   // ISO 8601
  updatedAt: string;
}

interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: DnmRole;
  avatarUrl?: string;
  isActive: boolean;
}

interface DnmSchool extends BaseEntity {
  name: string;
  city: string;
  address?: string;
  type: SchoolType;
  status: SchoolStatus;
  franchiseId?: string;
  phone?: string;
  email?: string;
}

interface DnmSemester extends BaseEntity {
  schoolId: string;
  number: 1 | 2 | 3 | 4;
  ageGroup: AgeGroup;
  startDate: string;
  endDate: string;
  status: SemesterStatus;
}

interface DnmGroup extends BaseEntity {
  semesterId: string;
  name: string;
  format: ClassFormat;
  schedule: GroupScheduleConfig;  // JSON
  maxStudents: number;
  currentStudents: number;        // computed
  language: 'ru' | 'kz' | 'tj' | 'uz';
  curatorId?: string;
}

interface GroupScheduleConfig {
  days: number[];          // 0=пн, 6=вс
  startTime: string;       // "10:00"
  endTime: string;         // "12:00"
  meetLink?: string;
}

interface DnmStudent extends BaseEntity {
  userId: string;
  schoolId: string;
  currentSemesterId?: string;
  currentGroupId?: string;
  age: number;
  ageGroup: AgeGroup;
  status: EnrollmentStatus;
  points: number;           // зарезервировано для геймификации
  user?: User;              // populated
}

interface DnmEnrollment extends BaseEntity {
  studentId: string;
  semesterId: string;
  groupId: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  student?: DnmStudent;
  semester?: DnmSemester;
  group?: DnmGroup;
}

interface DnmParentLink extends BaseEntity {
  parentUserId: string;
  studentId: string;
  relationship: 'mother' | 'father' | 'guardian';
  isConfirmed: boolean;
  parent?: User;
  student?: DnmStudent;
}

interface DnmCurriculum extends BaseEntity {
  semesterType: AgeGroup;
  semesterNumber: 1 | 2 | 3 | 4;
  version: string;
  status: CurriculumStatus;
  lessonsCount: number;
}

interface DnmLesson extends BaseEntity {
  curriculumId: string;
  order: number;
  title: string;
  description: string;
  videoUrl?: string;
  content: Record<string, LessonContent>;  // ключ = locale
  status?: LessonStatus;                    // computed per enrollment
  isLocked?: boolean;                       // computed: предыдущий тест не пройден
}

interface LessonContent {
  title: string;
  description: string;
  videoUrl?: string;
  classworkDescription?: string;
  classworkMaterials?: string[];
}

interface DnmClasswork extends BaseEntity {
  lessonId: string;
  type: string;
  content: Record<string, string>;   // мультиязычный
}

interface DnmHomework extends BaseEntity {
  lessonId: string;
  description: Record<string, string>;  // мультиязычный
  deadlineDays: number;                  // относительный дедлайн от даты урока
}

interface DnmHomeworkSubmission extends BaseEntity {
  homeworkId: string;
  enrollmentId: string;
  content: string;
  fileUrls: string[];
  status: HomeworkSubmissionStatus;
  grade?: number;
  feedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  student?: DnmStudent;
}

interface DnmTest extends BaseEntity {
  lessonId: string;
  questions: TestQuestion[];
  passingScore: number;        // процент для прохождения
  maxAttempts: number;         // default: 3
}

interface TestQuestion {
  id: string;
  text: Record<string, string>;   // мультиязычный
  options: TestOption[];
  correctOptionId: string;
}

interface TestOption {
  id: string;
  text: Record<string, string>;
}

interface DnmTestAttempt extends BaseEntity {
  testId: string;
  enrollmentId: string;
  answers: Record<string, string>;  // questionId -> selectedOptionId
  score: number;
  attemptNumber: number;
  passed: boolean;
}

interface DnmScheduleSlot extends BaseEntity {
  groupId: string;
  dayOfWeek: number;        // 0-6
  startTime: string;
  endTime: string;
  format: ClassFormat;
  location?: string;         // адрес или ссылка на видеовстречу
  isRecurring: boolean;
  specificDate?: string;     // если конкретная дата (перенос)
}

interface DnmAttendance extends BaseEntity {
  enrollmentId: string;
  scheduleSlotId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  student?: DnmStudent;
}

interface DnmPayment extends BaseEntity {
  parentLinkId: string;
  enrollmentId: string;
  amount: number;
  currency: string;           // KZT, TJS, UZS
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  parent?: User;
  student?: DnmStudent;
}

interface DnmContract extends BaseEntity {
  parentLinkId: string;
  enrollmentId: string;
  templateId?: string;
  status: ContractStatus;
  signedAt?: string;
  documentUrl?: string;
}

interface DnmCuratorAssignment extends BaseEntity {
  curatorUserId: string;
  schoolId?: string;
  groupId?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  curator?: User;
  group?: DnmGroup;
}

interface DnmCuratorChecklist extends BaseEntity {
  curatorAssignmentId: string;
  lessonId: string;
  date: string;
  items: ChecklistItem[];
  isCompleted: boolean;
}

interface ChecklistItem {
  step: number;             // 1-7
  title: string;            // "Приветствие", "Проверка ДЗ", etc.
  isChecked: boolean;
  notes?: string;
}

interface DnmCertificate extends BaseEntity {
  enrollmentId: string;
  semesterExamId?: string;
  type: CertificateType;
  number: string;
  issuedAt: string;
  fileUrl: string;
}

interface DnmSemesterExam extends BaseEntity {
  semesterId: string;
  enrollmentId: string;
  passed: boolean;
  score: number;
  certificateId?: string;
}

// Уведомления
interface Notification extends BaseEntity {
  userId: string;
  type: string;              // 'lesson.reminder', 'homework.reviewed', etc.
  title: string;
  message: string;
  isRead: boolean;
  link?: string;             // маршрут для перехода
}

// Дашборд руководителя
interface LeadDashboardData {
  totalStudents: number;
  totalSchools: number;
  totalRevenue: number;
  revenueTarget: number;
  avgAttendance: number;
  avgProgress: number;
  schoolsBreakdown: SchoolKPI[];
  semesterDistribution: { semester: number; count: number }[];
}

interface SchoolKPI {
  schoolId: string;
  schoolName: string;
  city: string;
  students: number;
  revenue: number;
  attendance: number;
  progress: number;
}

// Дашборд франчайзи
interface FranchiseDashboardData {
  students: number;
  groupsFull: number;
  groupsTotal: number;
  revenueMonth: number;
  revenueTarget: number;
  attendance: number;
}
```

---

## 8. Shared-компоненты

### 8.1. Каталог компонентов

| Компонент | Путь | Описание | Используется в |
|-----------|------|----------|----------------|
| **DataTable** | `components/data-table/` | Таблица с сортировкой, фильтрами, пагинацией, выбором строк | Ученики, Оплаты, Посещаемость, Кураторы, Школы |
| **StudentCard** | `components/cards/student-card.tsx` | Карточка ученика: фото, имя, группа, прогресс | school-admin, curator |
| **GroupCard** | `components/cards/group-card.tsx` | Карточка группы: название, семестр, заполненность, куратор | curator, school-admin |
| **LessonCard** | `components/cards/lesson-card.tsx` | Карточка урока: номер, название, статус, lock-иконка | child |
| **SchoolCard** | `components/cards/school-card.tsx` | Карточка школы: город, тип, ученики, KPI | lead |
| **ChildSummaryCard** | `components/cards/child-summary-card.tsx` | Карточка ребёнка для родителя: имя, прогресс, ближайшее занятие | parent |
| **SemesterProgress** | `components/progress/semester-progress.tsx` | Визуальная полоска: N из M уроков пройдено | child, parent |
| **LessonProgress** | `components/progress/lesson-progress.tsx` | Прогресс по этапам урока (видео, КР, ДЗ, тест) | child |
| **StatsCard** | `components/progress/stats-card.tsx` | KPI-карточка: число + лейбл + тренд | dashboards |
| **ScheduleList** | `components/schedule/schedule-list.tsx` | Список занятий: дата, время, группа, формат | child, curator, school-admin |
| **ScheduleGrid** | `components/schedule/schedule-grid.tsx` | Недельная сетка расписания | child, school-admin |
| **FormWizard** | `components/forms/form-wizard.tsx` | Пошаговая форма: steps, validation per step, navigation | school-admin (запись ребёнка) |
| **WizardStep** | `components/forms/wizard-step.tsx` | Один шаг wizard: title, content, isActive, isCompleted | school-admin |
| **StatusBadge** | `components/feedback/status-badge.tsx` | Цветной бейдж: ACTIVE/зелёный, PENDING/оранжевый, DROPPED/красный | везде |
| **FeedbackHint** | `components/feedback/feedback-hint.tsx` | Подсказка куратору: "начать с положительного -> зона роста -> поддержка" | curator |
| **EmptyState** | `components/feedback/empty-state.tsx` | Заглушка "нет данных" с иллюстрацией | везде |
| **AppShell** | `components/layout/app-shell.tsx` | Оболочка: sidebar + header + main content area | все кабинеты |
| **Sidebar** | `components/layout/sidebar.tsx` | Боковая навигация, collapsible, items по роли | все кабинеты |
| **Header** | `components/layout/header.tsx` | Шапка: логотип, имя пользователя, язык, уведомления | все кабинеты |
| **Breadcrumbs** | `components/layout/breadcrumbs.tsx` | Хлебные крошки | все |
| **PageHeader** | `components/layout/page-header.tsx` | Заголовок страницы + кнопки действий | все |
| **ProtectedRoute** | `components/auth/protected-route.tsx` | Guard-компонент: проверка auth + роли | router |
| **LoginForm** | `components/auth/login-form.tsx` | Выбор мок-пользователя | /login |
| **LanguageSwitcher** | `components/common/language-switcher.tsx` | Переключатель ru/kz/tj/uz | header |
| **FileUpload** | `components/common/file-upload.tsx` | Drag-n-drop загрузка файлов | child (ДЗ), lead (видео) |
| **VideoPlayer** | `components/common/video-player.tsx` | Обёртка HTML5 video player | child |
| **ConfirmDialog** | `components/common/confirm-dialog.tsx` | Модальное окно подтверждения | везде |
| **ExportButton** | `components/common/export-button.tsx` | Экспорт в Excel/PDF | franchise, lead |

### 8.2. Особенности реализации ключевых компонентов

**FormWizard** (для flow записи ребёнка, 6 шагов):
- Generic компонент, принимает массив `steps: WizardStepConfig[]`
- Каждый шаг имеет свою Zod-схему валидации
- Навигация: "Назад" / "Далее" / "Завершить"
- Progress indicator сверху (шаги с номерами и названиями)
- Данные накапливаются между шагами в общем state
- Финальный submit отправляет все данные одним batch-запросом

**DataTable**:
- На основе `@tanstack/react-table` (рекомендуемый shadcn/ui подход)
- Поддержка: серверная пагинация, column sorting, faceted filters, row selection
- Конфигурируемые columns через generic типы

**ChecklistForm** (чек-лист куратора, 7 этапов):
- Hardcoded 7 этапов (из ФО 3.2): Приветствие, Проверка ДЗ, Пояснение нового материала, Перерыв, Практика, Рефлексия, Завершение
- Каждый этап: checkbox + optional text note
- Сохранение через POST/PATCH

---

## 9. Конфигурация Tailwind + брендбук

### 9.1. `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SAMO Brandbook colors
        samo: {
          blue: '#0055A7',
          'blue-light': '#E6EFF7',    // фон для выделенных секций
          'blue-dark': '#003D7A',     // hover для primary кнопок
          orange: '#F7933C',
          'orange-light': '#FEF3E8',  // фон для badges/уведомлений
          green: '#00A550',
          'green-light': '#E6F5ED',   // фон для success-секций
        },
        // shadcn/ui CSS variables mapping
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0055A7',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#F7933C',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#00A550',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        secondary: ['Fira Sans', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.625rem',   // 10px — основной для карточек
        md: '0.5rem',     // 8px — кнопки
        sm: '0.375rem',   // 6px — inputs
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

### 9.2. CSS-переменные для shadcn/ui (`src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Fira+Sans:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 210 100% 33%;         /* #0055A7 */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 20% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 20% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 28 92% 60%;            /* #F7933C */
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 210 100% 33%;            /* #0055A7 */
    --radius: 0.5rem;
  }
}
```

### 9.3. Правила применения цветов (для agent-dev)

| Элемент | Цвет | Класс Tailwind |
|---------|------|----------------|
| Primary кнопки | SAMO Blue #0055A7 | `bg-primary text-primary-foreground` |
| Primary hover | Тёмный синий | `hover:bg-samo-blue-dark` |
| Навигация (sidebar, header) | SAMO Blue | `bg-samo-blue text-white` |
| Заголовки h1-h3 | SAMO Blue | `text-samo-blue` |
| Badges уведомлений | SAMO Orange | `bg-samo-orange text-white` |
| Success статусы | SAMO Green | `bg-samo-green text-white` |
| Background подсказок | Оранжевый светлый | `bg-samo-orange-light` |
| Текст на белом фоне | Тёмно-серый | `text-foreground` (не чёрный) |
| Текст на синем фоне | Белый | `text-white` |
| Детский кабинет | Можно ярче оранжевый/зелёный для акцентов, но синий остаётся доминирующим |

---

## 10. Seed-данные

### 10.1. Объём seed-данных

| Сущность | Количество | Описание |
|----------|------------|----------|
| Школы | 3 | Алматы (собственная), Астана (франшиза), Бишкек (франшиза) |
| Семестры | 6 | По 2 на школу (активный + завершённый) |
| Группы | 8 | 2-3 на школу (офлайн + онлайн, младшая + старшая) |
| Ученики | 15 | По 4-6 на группу |
| Родители | 10 | Некоторые с 2 детьми |
| ParentLinks | 15 | Связь родитель-ученик |
| Кураторы | 4 | 1-2 на школу |
| CuratorAssignments | 6 | Привязка к группам |
| Учебные программы | 2 | JUNIOR (сем. 1) + SENIOR (сем. 4) |
| Уроки | 12 | По 6 на программу |
| Homework | 12 | По 1 на урок |
| HomeworkSubmissions | 30 | 2-3 на урок (от разных учеников) |
| Тесты | 12 | По 1 на урок |
| TestAttempts | 20 | Разные результаты |
| ScheduleSlots | 16 | 2 на группу |
| Attendance | 60 | 4 занятия x 15 учеников |
| Payments | 15 | По 1 на зачисление |
| Contracts | 15 | По 1 на зачисление |
| CuratorChecklists | 8 | Несколько заполненных |
| Certificates | 3 | Для завершивших семестр |
| Notifications | 20 | Разные типы |
| **Пользователи (User)** | 35 | 15 учеников + 10 родителей + 4 куратора + 3 админа + 2 франчайзи + 1 руководитель |

### 10.2. Конкретные seed-данные

**Школы:**
1. `school-almaty` — "ДНМ Алматы" (OWN, ACTIVE, г. Алматы)
2. `school-astana` — "ДНМ Астана" (FRANCHISE, ACTIVE, г. Астана)
3. `school-bishkek` — "ДНМ Бишкек" (FRANCHISE, ACTIVE, г. Бишкек)

**Пользователи для логина (из раздела 4.4):**
1. Алиса Иванова (cr4-rebenok-dnm) — ученица школы Алматы, группа "Юниор-1", семестр 2
2. Марина Иванова (cr5-roditel-dnm) — мама Алисы (+ ещё одного ребёнка в школе Астана)
3. Динара Касымова (op-kurator-dnm) — куратор в школе Алматы, 2 группы
4. Светлана Петрова (op-admin-shkoly-dnm) — админ школы Алматы
5. Руслан Ахметов (pr2-franchayzi-dnm) — франчайзи школы Астана
6. Айгерим Нурланова (br7-rukovoditel-dnm) — руководитель проекта (видит все школы)

**Данные для демонстрации ключевых flow:**
- У Алисы: 4 пройденных урока, 1 текущий (ДЗ сдано, ждёт проверки), остальные заблокированы
- ДЗ в разных статусах: PENDING (2), ACCEPTED (3), REJECTED (1)
- Тесты: 1 пройден с 1 попытки, 1 пройден со 2 попытки, 1 не пройден (2 попытки, осталась 1)
- Посещаемость: 80% (2 пропуска из 10 занятий)
- 1 сертификат за завершённый семестр 1
- У Марины: 2 ребёнка, 1 неоплаченный счёт, 1 неподписанная оферта
- У куратора Динары: 3 ДЗ на проверке, 1 незаполненный чек-лист
- В школе Алматы: 1 группа заполнена на 100%, 1 на 60%
- Дашборд руководителя: данные по 3 школам с разными KPI

---

## 11. Порядок реализации (для agent-dev)

### Фаза 1: Инфраструктура (1-2 дня)

1. **Инициализация проекта**
   - `npm create vite@latest frontend -- --template react-ts`
   - Установка зависимостей (Tailwind 4, shadcn/ui, React Router 7, Zustand, MSW, react-i18next, RHF, Zod, Recharts, ky, lucide-react, date-fns)
   - Конфигурация: `tailwind.config.ts` (раздел 9), `tsconfig.json` (paths: `@/` -> `src/`), `vite.config.ts` (alias)
   - `components.json` для shadcn/ui с кастомной темой

2. **Базовые файлы**
   - `src/types/enums.ts`, `src/types/models.ts` — все типы (раздел 7)
   - `src/lib/utils.ts`, `src/lib/constants.ts`, `src/lib/i18n.ts`
   - `src/stores/auth.store.ts`, `src/stores/ui.store.ts`
   - `src/api/client.ts`, `src/api/types.ts`

3. **shadcn/ui компоненты** — установить через CLI: button, card, dialog, input, select, table, tabs, badge, progress, skeleton, toast, dropdown-menu, sheet, separator, avatar, checkbox, textarea, calendar, form

4. **Мок-инфраструктура (MSW)**
   - `src/mocks/db.ts` — in-memory DB
   - `src/mocks/factories/` — все фабрики
   - `src/mocks/seed.ts` — начальные данные (раздел 10)
   - `src/mocks/handlers/auth.handlers.ts` — мок-логин
   - `src/mocks/browser.ts` — setupWorker
   - Подключение в `main.tsx`

### Фаза 2: Layout и роутинг (1 день)

5. **Layout-компоненты**
   - `app-shell.tsx`, `sidebar.tsx`, `header.tsx`, `breadcrumbs.tsx`, `page-header.tsx`
   - `notification-bell.tsx`, `language-switcher.tsx`

6. **Auth и роутинг**
   - `protected-route.tsx`, `role-redirect.tsx`, `login-form.tsx`
   - `src/router.tsx` — полная таблица маршрутов (раздел 4) с lazy-loading модулей
   - 6 layout-файлов для каждого кабинета (sidebar-навигация по роли)

### Фаза 3: Shared-компоненты (1-2 дня)

7. **DataTable** — универсальная таблица на @tanstack/react-table
8. **Карточки** — StudentCard, GroupCard, LessonCard, SchoolCard, ChildSummaryCard
9. **Прогресс** — SemesterProgress, LessonProgress, StatsCard
10. **Расписание** — ScheduleList, ScheduleGrid
11. **Формы** — FormWizard, WizardStep, FormFieldWrapper, FileUpload
12. **Прочее** — StatusBadge, FeedbackHint, EmptyState, ConfirmDialog, VideoPlayer, ExportButton

### Фаза 4: Кабинеты (по приоритету, 5-7 дней)

**Приоритет 1 — ядро учебного процесса:**

13. **Кабинет ребёнка** — dashboard, lessons, lesson-detail (видео+КР+ДЗ+тест), progress, schedule, semester-exam, notifications
    - MSW handlers: lessons, homework, tests, schedule, certificates, notifications

14. **Кабинет родителя** — dashboard (карточки детей), child-progress, attendance, curator-reports, payments, contract-sign, feedback
    - MSW handlers: parent-specific endpoints

**Приоритет 2 — управление:**

15. **Кабинет куратора** — groups, lesson-journal (чек-лист 7 этапов), homework-review, performance, parent-reports, schedule
    - MSW handlers: curators, homework submissions, checklists

16. **Кабинет администратора школы** — students, groups, schedule, attendance, payments, curators + **Wizard записи ребёнка (6 шагов)**
    - MSW handlers: students, enrollments, groups, attendance, payments, contracts

**Приоритет 3 — аналитика:**

17. **Кабинет франчайзи** — dashboard (KPI), students/groups (переиспользовать school-admin), finances, reports
    - MSW handlers: dashboard aggregation

18. **Кабинет руководителя** — dashboard (все школы), schools, curriculum (редактор уроков), curators, reports
    - MSW handlers: dashboard, schools, curriculum

### Фаза 5: Полировка (1-2 дня)

19. **i18n** — заполнение файлов переводов (ru — полные, kz/tj/uz — заглушки)
20. **Responsive** — адаптация sidebar (mobile: sheet), таблиц (mobile: карточки)
21. **Edge cases** — empty states, loading skeletons, error boundaries
22. **Итого экранов**: ~45 страниц

### Общая оценка: 10-14 рабочих дней

---

## Риски и ограничения

| # | Риск | Митигация |
|---|------|-----------|
| R1 | Переводы kz/tj/uz — нет контента | Заполнить ru полностью, остальные — stub "TODO: перевод" |
| R2 | Видеоплеер — нет реальных видео | Использовать placeholder-видео (sample MP4) или YouTube embed |
| R3 | Экспорт Excel/PDF в прототипе | Stub: кнопка показывает toast "Экспорт в разработке" |
| R4 | Формат расписания может измениться | ScheduleSlot достаточно гибкий (recurring + specificDate) |
| R5 | Объём seed-данных может быть недостаточен для edge cases | Фабрики позволяют быстро добавить данные |

---

## Передать agent-dev

Полный список задач для реализации — раздел 11 (Фазы 1-5, пункты 1-21). Каждый пункт — отдельная задача. Зависимости между задачами линейны: Фаза N зависит от Фазы N-1.

**Критические бизнес-моменты (не пропустить при реализации):**
1. Блокировка следующего урока до прохождения теста предыдущего (LessonCard: `isLocked` + визуальный замок)
2. Тест: максимум 3 попытки, отображение оставшихся, блокировка после исчерпания
3. Wizard записи ребёнка: 6 шагов, валидация на каждом, batch-submit
4. Чек-лист куратора: 7 фиксированных этапов (hardcoded), checkbox + notes
5. Подсказка куратору при проверке ДЗ: "начать с положительного -> зона роста -> поддержка"
6. Подписание оферты родителем: просмотр документа + кнопка "Подписать"
7. Перевод ученика между группами: выбор целевой группы + проверка свободных мест
8. Переход младшая -> старшая группа: после 3-го семестра, UI-уведомление
9. StatusBadge: единая цветовая индикация по всем кабинетам (зелёный/оранжевый/красный)
10. Дашборд руководителя: графики Recharts (bar chart оплат, pie chart распределения по семестрам, line chart посещаемости)
