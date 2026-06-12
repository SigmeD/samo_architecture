import type { SystemMap } from "@/content/types";

/**
 * Сводная карта системы (L0 /map) — иерархия ролей + матрица «роль×раздел×право» + карта передач.
 * Портирована из проектного дока `docs/architecture/sistema-karta-rolei.html` (видение владельца) и
 * СВЕРЕНА С КАНОНОМ: значения матрицы = `CONV-RBAC-DNM-001` v1.6 (авторитет, локальный клон samo-docs);
 * ячейки, где новое намерение (кабинеты/canon-proposals) расходится с текущим каноном, помечены `divergent`.
 * Цель (запрос владельца): зафиксировать принятые решения и вскрыть нестыковки ДО разработки.
 * v1.6: сплит Администратор/Директор — Директор школы = управляющий (оверсайт/KPI/тоглы),
 * Администратор = обслуживающая/распределяющая роль (операционка, P&L закрыт). Детальный per-resource
 * RBAC новых ролей (Директор и др.) отложен каноном в OQ-ORG-03 — CRUD-ячейки не выдумываем (scope/note).
 * Источники: CONV-RBAC-DNM-001 v1.6, CONV-ROLE-HIERARCHY-001 v1.11, CONV-ROLES-DNM-001 v1.7.
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
      { title: "Методист", slug: "methodist", caption: "авторинг методики · конструктор видов уроков" },
      { title: "РОП ГО", dashed: true, caption: "руководитель отдела продаж и маркетинга ГО · над Маркетолог ГО + Менеджер франшиз · структурный узел (не строка RBAC)" },
      { title: "Маркетолог ГО", dashed: true, caption: "бренд / все аккаунты сети · ГО-роль ДНМ" },
      { title: "Финансист ГО", dashed: true, caption: "сводная консолидация по сети + роялти · ГО-роль ДНМ (op-finansist-go-dnm)" },
      { title: "Менеджер по продажам франшиз", dashed: true, caption: "продаёт франшизы (scope M10) · ГО-роль ДНМ (op-menedzher-prodazh-franshiz-dnm) · ≠ менеджер школы" },
    ] },
    { label: "Сеть", zone: "purple", connector: "down", roles: [
      { title: "Куратор франшиз", slug: "franchise-curator", caption: "курирует франчайзи-партнёров · руководит методистом" },
    ] },
    { label: "Владелец", zone: "gold", connector: "down", roles: [
      { title: "Франчайзи-партнёр", slug: "franchise", caption: "владелец сети школ · роялти · план/факт" },
    ] },
    { label: "Управление школой", zone: "orange", connector: "down", roles: [
      { title: "Директор школы", slug: "director", caption: "управляет школой: оверсайт, KPI, фиче-тоглы, отчётность" },
      { title: "Бухгалтер", slug: "finance", dashed: true, caption: "под директором · P&L/роялти/дебиторка (downstream; приём/подтв. оплаты — Адм/Мен §6)" },
      { title: "HR / рекрутинг", slug: "hr", caption: "найм · кадры · KPI-карты · удержание · под директором (OQ-ORG-02 закрыт)" },
      { title: "РОП + маркетинг", dashed: true, caption: "в модели сети — под франчайзи" },
    ] },
    { label: "Операции школы", zone: "orange", connector: "down", roles: [
      { title: "Администратор школы", slug: "school-admin", caption: "обслуживающий/распределяющий контур: приём, оплаты, расписание, распределение" },
    ] },
    { label: "Продажи · маркетинг", zone: "teal", connector: "down", roles: [
      { title: "Менеджер по продажам", slug: "sales", caption: "воронка лида-родителя" },
      { title: "Маркетолог / Таргетолог", slug: "marketer", dashed: true, caption: "лиды, контент" },
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
    "Модель-зависимость: пунктирные блоки (Бухгалтер, РОП+маркетинг, Маркетолог) перемещаются между уровнями по орг-модели франчайзи — в «одной школе» продажи/маркетинг под администратором, в «сети школ» централизованы под франчайзи. Каждая функция переключается отдельно (не единым рубильником). В модели «сеть школ» появляется исполнительный директор как фильтр аналитики: сводки идут через него, франчайзи получает только нужную выборку (прибыль/деньги/вопросы). Роли головного офиса — Маркетолог ГО / Финансист ГО (op-finansist-go-dnm) / Менеджер по продажам франшиз (op-menedzher-prodazh-franshiz-dnm) — ратифицированные ГО-роли ДНМ (ROLES v1.6 §2а), показаны маркерами иерархии (не отдельные кабинеты: Само Глобал / M10 вне ядра атласа). Над ними — РОП ГО (структурный узел, не строка RBAC; ROLES v1.6 §2б). Школьные старшие кураторы отчитываются Куратору франшиз — отдельной «ГО-роли старшего куратора» нет (OQ-ORG-04, 12.06 понизил её).",
  matrix: {
    sections: SECTIONS,
    rows: [
      { role: "Руководитель проекта", slug: "lead", cells: [
        "full", "full", "full", "view", "full", "view", "view", "view", "partial", "full", "full", "full", "full",
      ] },
      { role: "Методист", slug: "methodist", cells: [
        "full", "view", "none", "none", "view", "none", "none", "none", "none", "none", "full", "none", "view",
      ] },
      { role: "Куратор франшиз", slug: "franchise-curator", cells: [
        "none", "partial", "view", "view", "partial", "view", "none", "none", "view", "none", "full", "partial", "partial",
      ] },
      { role: "Франчайзи-партнёр", slug: "franchise", cells: [
        "none", "none", "none", "partial", "partial", "full", "view", "view", "partial", "partial", "partial", "partial", "view",
      ] },
      { role: "Директор школы", slug: "director", cells: [
        "none", "none", "none",
        { level: "partial", note: "P&L закрыт; видит операционные финансы школы (RBAC v1.6)" },
        "view",
        { level: "full", note: "управление школой: оверсайт, KPI, фиче-тоглы" },
        { level: "view", note: "scope-уровень; детальный RBAC — OQ-ORG-03" },
        "view",
        { level: "view", note: "детальный RBAC — OQ-ORG-03" },
        "view",
        "partial",
        { level: "partial", note: "делегирование прав/тоглы — у директора; точные ячейки — OQ-ORG-03" },
        { level: "partial", note: "контроль качества/видеофиксация; детальный RBAC — OQ-ORG-03" },
      ] },
      { role: "Администратор школы", slug: "school-admin", cells: [
        "none", "none", "none",
        { level: "partial", note: "приём оплат/дебиторка/возвраты — операционно; P&L закрыт (RBAC v1.6 §6)" },
        "none", "view", "partial", "partial", "none", "full", "partial", "none", "none",
      ] },
      { role: "Старший куратор", slug: "senior-curator", cells: [
        "none", "none", "none", "none", "none", "view", "partial", "none", "none", "none", "partial", "none", "partial",
      ] },
      { role: "Куратор", slug: "curator", cells: [
        "view", "none", "none", "none", "none", "partial", "full", "partial", "none", "none", "partial", "none", "view",
      ] },
      { role: "Менеджер по продажам", slug: "sales", cells: [
        "none", "none", "none", "partial", "none", "partial", "none", "full", "view", "none", "partial", "none", "none",
      ] },
      { role: "Маркетолог / Таргетолог", slug: "marketer", cells: [
        "none", "none", "none", "none", "none", "partial", "none", "partial", "full", "none", "partial", "none", "none",
      ] },
      { role: "Бухгалтер / Финансист", slug: "finance", cells: [
        "none", "none", "full", "full", "partial", "view", "none", "view", "none", "none", "partial", "none", "none",
      ] },
      { role: "HR / рекрутинг", slug: "hr", cells: [
        // Программа (авторинг/утвержд.), финансы (сеть/школа), данные ученика, воронка/CRM, маркетинг, магазин — вне кадрового scope HR
        "none", "none", "none", "none",
        { level: "view", note: "кадровый scope: KPI-карты/нагрузка ролей по агрегатам; детальный RBAC — OQ-ORG-03" },
        { level: "view", note: "кадровый scope (укомплектованность/найм); детальный RBAC — OQ-ORG-03" },
        "none", "none", "none", "none",
        { level: "partial", note: "найм/онбординг/обучение персонала (банк тестов найма); детальный RBAC — OQ-ORG-03" },
        { level: "view", note: "у HR нет per-resource RBAC-колонки — OQ-ORG-03" },
        { level: "view", note: "кадровый scope (видеофиксация для оценки кадров); детальный RBAC — OQ-ORG-03" },
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
    "Значения — по канону RBAC v1.6. Жирный «администратор-как-управляющий» разделён: Директор школы — управление (оверсайт, KPI, фиче-тоглы, отчётность), Администратор — обслуживающая/распределяющая роль (приём, оплаты-операционно, расписание, распределение; P&L закрыт). Детальный per-resource RBAC новых ролей (Директор школы и др.) канон отложил в OQ-ORG-03 — ячейки Директора показаны на уровне scope (view/partial с пометками), точные CRUD не выдуманы. Данные ученика (прогресс, сертификаты) видят только куратор, старший куратор, администратор/директор, родитель и сам ученик — руководитель и куратор франшиз их не видят (агрегаты по школам). Финансовый дашборд ведёт бухгалтер, а отображается в трёх кабинетах (бухгалтер → франчайзи / куратор франшиз → руководитель) по правам. HR / рекрутинг ведёт базу персонала, банк тестов найма и KPI-карты ролей (CRU кадровый, REG-DNM-HR-001 v1.1 §5); учебные и финансовые данные ему закрыты; per-resource RBAC HR канон отложил в OQ-ORG-03 — ячейки даны на уровне scope (view/partial с пометками), точные CRUD не выдуманы.",
  divergences: [],
  handoffs: [
    { title: "Продажи и зачисление", emoji: "🎯", flows: [
      { from: { label: "Маркетолог", zone: "orange" }, what: "лиды (UTM)", to: { label: "Менеджер", zone: "teal" } },
      { from: { label: "Менеджер", zone: "teal" }, what: "онбординг + пробное (сам / назначает)", to: { label: "Куратор", zone: "blue" } },
      { from: { label: "Менеджер", zone: "teal" }, what: "договор (оформляет)", to: { label: "Администратор", zone: "orange" }, suffix: "подтверждает" },
      { from: { label: "Администратор", zone: "orange" }, what: "оплата (приём/подтв. — Адм/Мен §6, факт — M12)", to: { label: "Бухгалтер", zone: "gold" }, suffix: "учёт P&L (downstream)" },
      { from: { label: "Администратор", zone: "orange" }, what: "зачислен", to: { label: "Старший куратор", zone: "blue" } },
      { from: { label: "Старший куратор", zone: "blue" }, what: "в группу (сам / куратору)", to: { label: "Куратор", zone: "blue" } },
      { from: { label: "Администратор", zone: "orange" }, what: "доступ после оплаты", to: { label: "Ученик + Родитель", zone: "green" } },
    ] },
    { title: "Обучение и качество", emoji: "🎓", flows: [
      { from: { label: "Куратор", zone: "blue" }, what: "отчёты, ОС, прогресс", to: { label: "Родитель", zone: "blue" } },
      { from: { label: "Куратор", zone: "blue" }, what: "показатели групп", to: { label: "Старший куратор", zone: "blue" } },
      { from: { label: "Старший куратор", zone: "blue" }, what: "нагрузка + наставничество", to: { label: "Куратор", zone: "blue" } },
      { from: { label: "Старший куратор", zone: "blue" }, what: "отчёты по кураторам", to: { label: "Директор школы", zone: "orange" } },
      { from: { label: "Ученик", zone: "green" }, what: "достижения / гордость", to: { label: "Родитель", zone: "blue" } },
      { from: { label: "Родитель", zone: "blue" }, what: "обращения: заморозка/возврат", to: { label: "Администратор", zone: "orange" } },
    ] },
    { title: "Управление сетью", emoji: "🏢", flows: [
      { from: { label: "Директор школы", zone: "orange" }, what: "отчёты/KPI школы", to: { label: "Франчайзи", zone: "purple" }, suffix: "в модели A — сам владелец" },
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
      { from: { label: "Родитель", zone: "blue" }, what: "оплата (факт — M12/админ §6)", to: { label: "Бухгалтер", zone: "gold" }, suffix: "учёт (downstream) → билет" },
      { from: { label: "Франчайзи", zone: "purple" }, what: "взнос", to: { label: "Маркетинговый фонд", zone: "blue" }, suffix: "перераспределение" },
    ] },
  ],
  sources: [
    { id: "CONV-RBAC-DNM-001", version: "1.6" },
    { id: "CONV-ROLE-HIERARCHY-001", version: "1.11" },
    { id: "CONV-ROLES-DNM-001", version: "1.7" },
    { id: "REG-DNM-HR-001", version: "1.1" },
  ],
};
