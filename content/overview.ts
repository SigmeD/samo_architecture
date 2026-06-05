import type { FunnelStep } from "@/components/atlas/funnel-flow";

export interface OverviewTier { title: string; caption?: string; cabinetSlugs: string[] }
export interface OverviewSpec { hero: { title: string; lead: string }; funnel: FunnelStep[]; tiers: OverviewTier[] }

export const overview: OverviewSpec = {
  hero: {
    title: "Архитектура модуля «Дети на миллион»",
    lead: "Детская образовательная система предпринимательства (10–17 лет). Интерактивный атлас: кабинеты, процессы, модули — с трассировкой к канону.",
  },
  funnel: [
    { title: "Гость / лид" }, { title: "Пробный урок", key: true, note: "проводит куратор (канон v3.1)" },
    { title: "Оплата и договор" }, { title: "Зачисление" }, { title: "Обучение по семестрам" },
    { title: "Сертификат", win: true },
  ],
  tiers: [
    { title: "Потребители", caption: "ученик, родитель, гость", cabinetSlugs: ["child", "parent", "guest"] },
    { title: "Команда школы", caption: "операционные роли", cabinetSlugs: ["curator", "senior-curator", "school-admin", "sales", "finance"] },
    { title: "Сеть и управление", caption: "франшиза и головной офис", cabinetSlugs: ["franchise", "franchise-curator", "lead"] },
  ],
};
