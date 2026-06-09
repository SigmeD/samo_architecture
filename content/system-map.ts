import type { SystemMap } from "@/content/types";

/**
 * Сводная карта системы (L0 /map) — иерархия ролей + матрица «роль×раздел×право» + карта передач.
 * Портирована из проектного дока `docs/architecture/sistema-karta-rolei.html` (видение владельца) и
 * СВЕРЕНА С КАНОНОМ: значения матрицы = `CONV-RBAC-DNM-001` v1.4 (авторитет, локальный клон samo-docs);
 * ячейки, где новое намерение (кабинеты/canon-proposals) расходится с текущим каноном, помечены `divergent`.
 * Цель (запрос владельца): зафиксировать принятые решения и вскрыть нестыковки ДО разработки.
 * Источники: CONV-RBAC-DNM-001 v1.4, CONV-ROLE-HIERARCHY-001 v1.8, CONV-ROLES-DNM-001 v1.3.
 * Обезличено (только роли); доля распределения роялти не отображается (роялти 20% — как в каноне).
 */

const SECTIONS = [
  "Программа · авторинг", "Программа · утвержд.", "Финансы сети", "Финансы школы",
  "Аналитика сети", "Дашборд школы", "Данные ученика", "Воронка / CRM",
  "Маркетинг", "Магазин", "Академия", "Права (RBAC)", "Видео / качество",
];

export const systemMap: SystemMap = {
  hierarchy: [
    { label: "Головной офис", zone: "blue", connector: "down", roles: [
      { title: "Руководитель проекта", slug: "lead", caption: "франчайзер · «все данные» · утверждает программу" },
      { title: "Методист", slug: "methodist", caption: "авторинг методики · конструктор видов уроков", tag: "новое 08–09.06" },
      { title: "Финансист ГО", slug: "finance", dashed: true, caption: "финансы сети → руководителю сводно", tag: "⚠ разделить с бухгалтером (R1)" },
      { title: "Старший куратор ГО", dashed: true, caption: "над старшими кураторами школ", tag: "новое" },
      { title: "Менеджер по продажам франшиз", dashed: true, caption: "продаёт франшизы (≠ менеджер школы)", tag: "новое" },
    ] },
    { label: "Сеть", zone: "purple", connector: "down", roles: [
      { title: "Куратор франшиз", slug: "franchise-curator", caption: "курирует франчайзи · авторит программу", tag: "право «методист»" },
    ] },
    { label: "Владелец", zone: "gold", connector: "down", roles: [
      { title: "Франчайзи-партнёр", slug: "franchise", caption: "владелец сети школ · роялти · план/факт" },
    ] },
    { label: "Управление школой", zone: "orange", connector: "down", roles: [
      { title: "Администратор школы", slug: "school-admin", caption: "операции · директор школы" },
      { title: "Бухгалтер", slug: "finance", dashed: true, caption: "у франчайзи · подтверждает оплаты" },
      { title: "РОП + маркетинг", dashed: true, caption: "в модели сети — под франчайзи" },
    ] },
    { label: "Продажи · маркетинг", zone: "teal", connector: "down", roles: [
      { title: "Менеджер по продажам", slug: "sales", caption: "воронка лида-родителя" },
      { title: "Маркетолог / Таргетолог", slug: "marketer", dashed: true, caption: "лиды, контент", tag: "не детализирован" },
    ] },
    { label: "Преподавание", zone: "blue", connector: "down", roles: [
      { title: "Старший куратор", slug: "senior-curator", caption: "играющий тренер: преподаёт + менторит" },
      { title: "Куратор", slug: "curator", caption: "ведёт уроки, проверяет работы" },
    ] },
    { label: "Клиент", zone: "green", roles: [
      { title: "Ученик", slug: "child", caption: "проходит программу · Солары" },
      { title: "Родитель", slug: "parent", caption: "плательщик · контроль · вовлечение" },
    ] },
  ],
  hierarchyNote:
    "Модель-зависимость: пунктирные блоки (Бухгалтер, РОП+маркетинг, Маркетолог) перемещаются между уровнями по орг-модели франчайзи — в «одной школе» продажи/маркетинг под администратором, в «сети школ» централизованы под франчайзи. Каждая функция переключается отдельно (не единым рубильником). В модели «сеть школ» появляется исполнительный директор как фильтр аналитики: сводки идут через него, франчайзи получает только нужную выборку (прибыль/деньги/вопросы). Новые роли ГО (08–09.06): методист, старший куратор ГО, менеджер по продажам франшиз; финансист ГО предлагается отделить от бухгалтера франшизы (R1).",
  matrix: {
    sections: SECTIONS,
    rows: [
      { role: "Руководитель проекта", slug: "lead", cells: [
        { level: "full", divergent: true, note: "Канон RBAC v1.4: конструктор программы = CRUD у руководителя (br7). Новое намерение — авторинг у куратора франшиз, у руководителя только утверждение (canon-proposal L1)." },
        { level: "full", divergent: true, note: "Отдельного gate «утверждение программы» в каноне нет — новое намерение (дифф/предпросмотр, пилот→сеть, откат) (canon-proposal L1)." },
        "full", "view", "full", "view",
        { level: "view", divergent: true, note: "Канон даёт br7 R(все) на данные ученика. Новое намерение/спека §16 — только агрегат по школам, без данных отдельного ученика (canon-proposal L2)." },
        "view", "partial", "full", "full", "full", "full",
      ] },
      { role: "Методист", slug: "methodist", offCanon: true, cells: [
        { level: "full", divergent: true, note: "Методист авторит методику/программу (встреча 08–09.06). Расходится с каноном RBAC v1.4 (CRUD у руководителя br7) И с текущим атласом (авторинг у куратора франшиз) — три конкурирующие модели одного права. → canon-proposal 2026-06-09-methodist-cabinet.md (не решено)." },
        "view", "none", "none", "view", "none", "none", "none", "none", "none", "full", "none", "view",
      ] },
      { role: "Куратор франшиз", slug: "franchise-curator", cells: [
        { level: "none", divergent: true, note: "Канон RBAC v1.4: у куратора франшиз нет конструктора программы. Новое намерение — авторинг/редактор/публикация у КФ (право «методист») (canon-proposal L1)." },
        { level: "partial", divergent: true, note: "Публикацию программы во все школы ведёт КФ (новое намерение); в каноне ресурса нет (canon-proposal L1)." },
        "view", "view", "partial", "view", "none", "none", "view", "none", "full", "partial", "partial",
      ] },
      { role: "Франчайзи-партнёр", slug: "franchise", cells: [
        "none", "none", "none", "partial", "partial", "full", "view", "view", "partial", "partial", "partial", "partial", "view",
      ] },
      { role: "Администратор школы", slug: "school-admin", cells: [
        "none", "none", "none", "partial", "none", "full", "full", "partial", "toggle", "full", "partial", "none", "full",
      ] },
      { role: "Старший куратор", slug: "senior-curator", cells: [
        "none", "none", "none", "none", "none", "view", "partial", "none", "none", "none", "partial", "none", "partial",
      ] },
      { role: "Куратор", slug: "curator", cells: [
        "view", "none", "none", "none", "none", "partial", "full", "partial", "none", "none", "partial", "none", "view",
      ] },
      { role: "Менеджер по продажам", slug: "sales", cells: [
        "none", "none", "none", "view", "none", "partial", "none", "full", "view", "none", "partial", "none", "none",
      ] },
      { role: "Маркетолог / Таргетолог", slug: "marketer", offCanon: true, cells: [
        "none", "none", "none", "none", "none", "partial", "none", "partial", "full", "none", "partial", "none", "none",
      ] },
      { role: "Бухгалтер / Финансист", slug: "finance", cells: [
        "none", "none", "full", "full", "partial", "view", "none", "view", "none", "view", "partial", "none", "none",
      ] },
      { role: "Родитель", slug: "parent", cells: [
        "view", "none", "none", "partial", "none", "none", "partial", "none", "none", "view", "partial", "none", "none",
      ] },
      { role: "Ученик", slug: "child", cells: [
        "partial", "none", "none", "none", "none", "none", "partial", "none", "none", "partial", "none", "none", "none",
      ] },
    ],
  },
  matrixNote:
    "Значения — по канону RBAC v1.4; ⚠ помечает расхождение с новым намерением (см. нестыковки ниже). Данные ученика (прогресс, сертификаты) видят только куратор, старший куратор, администратор, родитель и сам ученик — руководитель и куратор франшиз их не видят (агрегаты по школам). Финансовый дашборд ведёт бухгалтер, а отображается в трёх кабинетах (бухгалтер → франчайзи / куратор франшиз → руководитель) по правам. «Маркетолог / Таргетолог» спроектирован, но в RBAC v1.4 не внесён.",
  divergences: [
    { title: "Авторинг учебной программы", detail: "Канон RBAC v1.4: «Конструктор программы (уроки/ДЗ/тесты)» = CRUD у руководителя (br7), у куратора франшиз — нет. Новое намерение: авторинг/редактор/публикация — у куратора франшиз, у руководителя только утверждение (gate). → canon-proposal L1 (docs/canon-proposals/2026-06-08-lead-cabinet.md)." },
    { title: "Данные отдельного ученика на уровне ГО", detail: "Канон даёт руководителю R(все) на прогресс/профиль ученика. Новое намерение / спека §16: руководитель и куратор франшиз видят только агрегат по школам, без данных отдельного ученика. → canon-proposal L2." },
    { title: "Gate утверждения программы", detail: "Отдельного ресурса «утверждение программы» в каноне нет (есть конструктор у br7). Новый gate: дифф/предпросмотр, раскатка пилот→сеть, откат, версии. → canon-proposal L1." },
    { title: "Автор программы: + методист (встреча 08–09.06)", detail: "Встречи 08–09.06 вводят отдельную роль методиста как автора методики/программы (workflow «методист готовит → руководитель утверждает/отклоняет, не правит»). Это ТРЕТЬЯ модель поверх канона (br7-руководитель) и атласа (куратор франшиз) — три конкурирующих актора одного права «авторинг». → canon-proposal 2026-06-09-methodist-cabinet.md. R2, на согласовании." },
    { title: "Финиерархия: бухгалтер франшизы ↔ финансист ГО (R1)", detail: "Встреча 08.06: две разные роли — бухгалтер франшизы → финансист ГО → руководитель + «связка-акт». Атлас слил их в один кабинет finance. → решение владельца (R1); пока финансист ГО помечен как «разделить»." },
  ],
  handoffs: [
    { title: "Продажи и зачисление", emoji: "🎯", flows: [
      { from: { label: "Маркетолог", zone: "orange" }, what: "лиды", to: { label: "Менеджер", zone: "teal" } },
      { from: { label: "Менеджер", zone: "teal" }, what: "демо-доступ + запись", to: { label: "Куратор", zone: "blue" } },
      { from: { label: "Куратор", zone: "blue" }, what: "результат пробного", to: { label: "Менеджер", zone: "teal" } },
      { from: { label: "Менеджер", zone: "teal" }, what: "согласившийся клиент", to: { label: "Администратор", zone: "orange" } },
      { from: { label: "Администратор", zone: "orange" }, what: "договор + оплата", to: { label: "Бухгалтер", zone: "gold" }, suffix: "подтверждает" },
      { from: { label: "Администратор", zone: "orange" }, what: "доступ после оплаты", to: { label: "Ученик + Родитель", zone: "green" } },
    ] },
    { title: "Обучение и качество", emoji: "🎓", flows: [
      { from: { label: "Куратор", zone: "blue" }, what: "отчёты, ОС, прогресс", to: { label: "Родитель", zone: "blue" } },
      { from: { label: "Куратор", zone: "blue" }, what: "показатели групп", to: { label: "Старший куратор", zone: "blue" } },
      { from: { label: "Старший куратор", zone: "blue" }, what: "нагрузка + наставничество", to: { label: "Куратор", zone: "blue" } },
      { from: { label: "Старший куратор", zone: "blue" }, what: "отчёты по кураторам", to: { label: "Администратор", zone: "orange" } },
      { from: { label: "Ученик", zone: "green" }, what: "достижения / гордость", to: { label: "Родитель", zone: "blue" } },
      { from: { label: "Родитель", zone: "blue" }, what: "обращения: заморозка/возврат", to: { label: "Администратор", zone: "orange" } },
    ] },
    { title: "Управление сетью", emoji: "🏢", flows: [
      { from: { label: "Администратор", zone: "orange" }, what: "отчёты/KPI школы", to: { label: "Франчайзи", zone: "purple" }, suffix: "входит как директор" },
      { from: { label: "Франчайзи", zone: "purple" }, what: "KPI, план/факт", to: { label: "Куратор франшиз", zone: "purple" } },
      { from: { label: "Куратор франшиз", zone: "purple" }, what: "сводки, статус франчайзи", to: { label: "Руководитель", zone: "blue" } },
      { from: { label: "Куратор франшиз", zone: "purple" }, what: "настройка программы", to: { label: "Руководитель", zone: "blue" }, suffix: "утверждает" },
      { from: { label: "Методист", zone: "blue" }, what: "авторинг программы + виды уроков", to: { label: "Руководитель", zone: "blue" }, suffix: "⚠ утверждает/откл. (R2)" },
      { from: { label: "Руководитель", zone: "blue" }, what: "программа, стандарты, права", to: { label: "вся сеть", zone: "purple" } },
    ] },
    { title: "Финансы", emoji: "💰", flows: [
      { from: { label: "Бухгалтер франчайзи", zone: "gold" }, what: "фин. дашборд — 1 в 2 кабинета", to: { label: "Куратор франшиз", zone: "purple" }, also: { label: "Руководитель", zone: "blue" } },
      { from: { label: "Финансист", zone: "gold" }, what: "финансы сети сводно", to: { label: "Руководитель", zone: "blue" } },
      { from: { label: "Франчайзи", zone: "purple" }, what: "роялти 20% ежемес.", to: { label: "Головной офис", zone: "blue" } },
      { from: { label: "Родитель", zone: "blue" }, what: "оплата", to: { label: "Бухгалтер", zone: "gold" }, suffix: "подтверждает → билет" },
      { from: { label: "Франчайзи", zone: "purple" }, what: "взнос", to: { label: "Маркетинговый фонд", zone: "blue" }, suffix: "перераспределение" },
    ] },
  ],
  sources: [
    { id: "CONV-RBAC-DNM-001", version: "1.4" },
    { id: "CONV-ROLE-HIERARCHY-001", version: "1.8" },
    { id: "CONV-ROLES-DNM-001", version: "1.3" },
  ],
};
