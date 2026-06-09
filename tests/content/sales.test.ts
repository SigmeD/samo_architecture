import { describe, it, expect } from "vitest";
import { sales } from "@/content/cabinets/sales";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет менеджера по продажам (sales) — 08.06", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(sales)).not.toThrow();
  });
  it("зона teal, planned, не стаб, роль op-menedzher-prodazh-dnm", () => {
    expect(sales.zone).toBe("teal");
    expect(sales.implStatus).toBe("planned");
    expect(sales.isStub).toBeFalsy();
    expect(sales.role.code).toBe("op-menedzher-prodazh-dnm");
  });
  it("ядро — воронка лида-родителя (6 шагов)", () => {
    expect(sales.coreProcess.title).toMatch(/воронк\S* лида/i);
    expect(sales.coreProcess.steps).toHaveLength(6);
  });
  it("ПОПРАВКА: пробное проводит КУРАТОР (не менеджер)", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/пробное проводит куратор/i);
    expect(blob).toMatch(/поправк\S* к постеру/i);
  });
  it("ГРАНИЦА: менеджер не оформляет договор/оплату/рассрочку; оплату подтверждает бухгалтер; видит статус read", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/бухгалтер подтвержда/i);
    expect(blob).toMatch(/администратор\S*\s*\/\s*финансы|у администратора\/финансов|администратор оформляет/i);
    expect(blob).toMatch(/только просмотр|статус \(read\)|видит статус/i);
  });
  it("инвариант: омниканальный дожим WhatsApp ↔ CRM с аудитом", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/whatsapp/i);
    expect(blob).toMatch(/аудит/i);
    expect(blob).toMatch(/speed-to-lead/i);
  });
  it("scope: только лиды-родители ДНМ; B2B/инвесторы — отдельная CRM Samo Global", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/только лиды-родител/i);
    expect(blob).toMatch(/Samo Global/i);
  });
  it("метка «New»: есть новые блоки и есть существовавшие в постере (без метки)", () => {
    const anyNew = sales.domains.some((d) => d.isNew) || sales.modules.some((m) => m.isNew) || sales.crossLinks.some((l) => l.isNew);
    expect(anyNew).toBe(true);
    const kpi = sales.domains.find((d) => d.title.includes("Мои KPI"));
    expect(kpi?.isNew).toBeFalsy();
  });
  it("связи marketer и curator помечены New; все связи резолвятся", () => {
    const mk = sales.crossLinks.find((l) => l.toCabinet === "marketer");
    const cur = sales.crossLinks.find((l) => l.toCabinet === "curator");
    expect(mk?.isNew).toBe(true);
    expect(cur?.isNew).toBe(true);
    for (const l of sales.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("C5 KPI: период созревания лида (3/7/12/30 дн), степень закрытия, время 1-го контакта до 40 мин", () => {
    const kpi = sales.domains.find((d) => d.title.includes("Мои KPI"));
    expect(kpi).toBeDefined();
    const blob = JSON.stringify(kpi);
    expect(blob).toMatch(/созреван/i);
    expect(blob).toMatch(/3\s*\/\s*7\s*\/\s*12\s*\/\s*30/);
    expect(blob).toMatch(/40\s*мин/i);
    expect(blob).toMatch(/степень закрыт/i);
  });
  it("C5 рекомендация совместного урока родитель+ребёнок (исходящий поток)", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/совместн\S* урок/i);
    // визуализируется в кабинетах родителя и ученика — исходящие связи
    const toParent = sales.crossLinks.some((l) => l.toCabinet === "parent");
    const toChild = sales.crossLinks.some((l) => l.toCabinet === "child");
    expect(toParent || toChild).toBe(true);
  });
  it("C5 ⚠ куратор франшиз СКРЫТ от франчайзи; агрегация наверх (КФ / руководитель)", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/скрыт/i);
    expect(blob).toMatch(/куратор\S*\s*франши/i);
    expect(blob).toMatch(/агрег/i);
  });
  it("C5 связи: франчайзи-партнёр и руководитель продаж (РОП) головного офиса", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/франчайзи-партн/i);
    expect(blob).toMatch(/РОП|руководител\S*\s*продаж/i);
    // все связи резолвятся
    for (const l of sales.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("обезличено и без доли роялти 50%", () => {
    const blob = JSON.stringify(sales);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b/i);
    expect(blob).not.toMatch(/50\s*%/);
  });
});
