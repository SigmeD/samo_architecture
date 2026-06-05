# Архитектурные карты ДНМ «Дети на миллион»

Набор визуальных схем платформы **для передачи заказчику**. Все диаграммы построены и сверены **из фактического кода** (`backend/src/modules/**`, `backend/prisma/schema.prisma`, `frontend/src/router.tsx`, `frontend/src/lib/constants.ts` `SIDEBAR_ITEMS`, страницы кабинетов), а не из плана. Срез: **2026-06-02**.

> Каждая схема — пара файлов: `*.html` (исходник, правится без перерисовки) и `*.png` (изображение для презентаций/печати). Перегенерация PNG: поднять локальный сервер в этой папке и снять полностраничный скриншот (ширина страницы 1660px).

## Обзорная карта

| Карта | Файл | Что показывает |
| --- | --- | --- |
| 🖼️ Архитектура модуля — обзорный постер | [`dnm-architecture-poster.png`](dnm-architecture-poster.png) · [html](dnm-architecture-poster.html) | Поплакатно: Руководство сети → Ядро (учебный движок · аналитика · геймификация) → Данные/интеграции · Кабинет ученика · **6 пар «модуль ↔ роль»** → поддерживающие модули → результат. Все **11 ролей**. |

## Схемы кабинетов (все 11)

Единая стилистика: шапка с ролью → секции кабинета → ядро-процесс → карточки-домены → межкабинетные связи (только реальные кабинеты/роли) → нижняя логика + легенда. Без ссылок/путей.

| Кабинет | Роль | Файл | Ядро |
| --- | --- | --- | --- |
| 🎓 Ученик | `cr4-rebenok-dnm` | [`dnm-cabinet-child.png`](dnm-cabinet-child.png) · [html](dnm-cabinet-child.html) | Учебный цикл (видео→классная→ДЗ→тест→экзамен→сертификат) + петля геймификации |
| 👨‍👩‍👧 Родитель | `cr5-roditel-dnm` | [`dnm-cabinet-parent.png`](dnm-cabinet-parent.png) · [html](dnm-cabinet-parent.html) | Центр контроля над ребёнком; оплата/договор/рассрочка |
| 🧑‍🏫 Куратор | `op-kurator-dnm` | [`dnm-cabinet-curator.png`](dnm-cabinet-curator.png) · [html](dnm-cabinet-curator.html) | Журнал урока (7 этапов) + цикл проверки работ |
| 🏫 Администратор школы | `op-admin-shkoly-dnm` | [`dnm-cabinet-school-admin.png`](dnm-cabinet-school-admin.png) · [html](dnm-cabinet-school-admin.html) | Мастер зачисления ученика; 8 операционных доменов |
| 🏢 Франчайзи / директор | `pr2-franchayzi-dnm` | [`dnm-cabinet-franchise.png`](dnm-cabinet-franchise.png) · [html](dnm-cabinet-franchise.html) | Сеть франшизы (школы→группы→ученики); вход в школу как директор |
| 🎯 Руководитель проекта | `br7-rukovoditel-dnm` | [`dnm-cabinet-lead.png`](dnm-cabinet-lead.png) · [html](dnm-cabinet-lead.html) | Учебная программа и редактор урока (головной офис) |
| 🧑‍💼 Старший куратор | `op-starshiy-kurator-dnm` | [`dnm-cabinet-senior-curator.png`](dnm-cabinet-senior-curator.png) · [html](dnm-cabinet-senior-curator.html) | Контроль кураторов: рейтинг, KPI, распределение нагрузки |
| 🤝 Куратор франшиз | `op-kurator-franshiz-dnm` | [`dnm-cabinet-franchise-curator.png`](dnm-cabinet-franchise-curator.png) · [html](dnm-cabinet-franchise-curator.html) | Курирование франшиз: анализ→созвон→отчёт |
| 💼 Менеджер по продажам | `op-menedzher-prodazh-dnm` | [`dnm-cabinet-sales.png`](dnm-cabinet-sales.png) · [html](dnm-cabinet-sales.html) | Воронка продаж и онбординг (лид→…→зачисление) |
| 📊 Бухгалтер | `op-finansist-dnm` | [`dnm-cabinet-finance.png`](dnm-cabinet-finance.png) · [html](dnm-cabinet-finance.html) | Финансовый результат (Доходы − Расходы = P&L → Cashflow → период) |
| 🚪 Гость (онбординг) | — (публичный) | [`dnm-cabinet-guest.png`](dnm-cabinet-guest.png) · [html](dnm-cabinet-guest.html) | Точки входа, воронка онбординга, кем становится гость |

## Условные обозначения (общие)

- **→** — поток / навигация · **⇒** — начисление/награда (солары) · **↩︎** — повтор цикла.
- **🟠 / 🟣 / 🔵** — хаб с подразделами · **⚙** — опция под feature-toggle · **🔒** — только просмотр (read-only).
- Зональный цвет: синий — управление · зелёный — учёба/ученик · оранжевый — школа · фиолетовый — франшиза · бирюзовый — продажи/контроль · золотой — финансы.

> Покрыты все 11 кабинетов (вкл. возрастные ветки ребёнка) и гостевой онбординг. Каждая связь в блоке «потоки ценности» ведёт к реальному кабинету/роли.
