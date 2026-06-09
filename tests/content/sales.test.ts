import { describe, it, expect } from "vitest";
import { sales } from "@/content/cabinets/sales";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет менеджера по продажам (sales) — реверс 09.06", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(sales)).not.toThrow();
  });
  it("зона teal, planned, не стаб, роль op-menedzher-prodazh-dnm", () => {
    expect(sales.zone).toBe("teal");
    expect(sales.implStatus).toBe("planned");
    expect(sales.isStub).toBeFalsy();
    expect(sales.role.code).toBe("op-menedzher-prodazh-dnm");
  });
  it("role.title — «Менеджер по продажам ДНМ»", () => {
    expect(sales.role.title).toBe("Менеджер по продажам ДНМ");
  });
  it("ядро — воронка лида-родителя (6 шагов)", () => {
    expect(sales.coreProcess.title).toMatch(/воронк\S* лида/i);
    expect(sales.coreProcess.steps).toHaveLength(6);
  });
  it("РЕВЕРС: договор оформляет МЕНЕДЖЕР → администратор ПОДТВЕРЖДАЕТ → оплата через бухгалтерию", () => {
    const blob = JSON.stringify(sales);
    // менеджер оформляет договор
    expect(blob).toMatch(/договор[^"]*менеджер|менеджер[^"]*оформля\S*[^"]*договор/i);
    // администратор подтверждает
    expect(blob).toMatch(/админ\S*[^"]*подтвержда/i);
    // оплата через бухгалтерию
    expect(blob).toMatch(/оплата через бухгалтер/i);
  });
  it("РЕВЕРС: НЕТ старой формулировки «договор/оплату ведёт администратор» и «менеджер только закрывает до передачи»", () => {
    const blob = JSON.stringify(sales);
    expect(blob).not.toMatch(/договор и оплату оформляет администратор/i);
    expect(blob).not.toMatch(/договор[^"]*ведёт администратор/i);
    expect(blob).not.toMatch(/только закрывает продажу до передачи/i);
  });
  it("РЕВЕРС пробного: менеджер проводит сам ИЛИ назначает куратора, под контролем качества ст.куратора", () => {
    const blob = JSON.stringify(sales);
    expect(blob).toMatch(/менеджер проводит[^"]*сам|проводит онбординг[^"]*сам/i);
    expect(blob).toMatch(/назнача\S*[^"]*куратор/i);
    expect(blob).toMatch(/видеофиксац|контрол\S*[^"]*качеств/i);
    expect(blob).toMatch(/close-rate|close rate/i);
    // старого «ПРОБНОЕ ПРОВОДИТ КУРАТОР (не менеджер)» больше нет
    expect(blob).not.toMatch(/пробное проводит куратор/i);
  });
  it("метрика лида «X из 100» в домене Мои KPI", () => {
    const kpi = sales.domains.find((d) => d.title.includes("Мои KPI"));
    expect(kpi).toBeDefined();
    const blob = JSON.stringify(kpi);
    expect(blob).toMatch(/из 100/i);
  });
  it("НОВЫЙ домен «Топ-20 постов» (живые reels для дожима)", () => {
    const top = sales.domains.find((d) => /Топ-20 постов/i.test(d.title));
    expect(top).toBeDefined();
    const blob = JSON.stringify(top);
    expect(blob).toMatch(/reels|просмотр|охват/i);
    expect((top?.items.length ?? 0)).toBeGreaterThanOrEqual(2);
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
  it("НЕТ ни одного isNew (Screenshot_19)", () => {
    const anyNew =
      sales.domains.some((d) => d.isNew) ||
      sales.modules.some((m) => m.isNew) ||
      sales.crossLinks.some((l) => l.isNew);
    expect(anyNew).toBe(false);
  });
  it("crossLink parent — direction both (постоянный чат менеджер↔родитель-лид)", () => {
    const parent = sales.crossLinks.find((l) => l.toCabinet === "parent");
    expect(parent).toBeDefined();
    expect(parent?.direction).toBe("both");
    expect(parent?.label).toMatch(/чат/i);
    expect(parent?.label).toMatch(/лид/i);
  });
  it("все связи резолвятся", () => {
    for (const l of sales.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("crossLink school-admin: менеджер передаёт договор → админ подтверждает", () => {
    const sa = sales.crossLinks.find((l) => l.toCabinet === "school-admin");
    expect(sa).toBeDefined();
    expect(sa?.label).toMatch(/договор/i);
    expect(sa?.label).toMatch(/подтвержда/i);
  });
  it("crossLink curator: пробное менеджер сам ИЛИ назначенный куратор, под контролем качества", () => {
    const cur = sales.crossLinks.find((l) => l.toCabinet === "curator");
    expect(cur).toBeDefined();
    expect(cur?.label).toMatch(/назнача\S*[^"]*куратор|куратор[^"]*расписан/i);
    expect(cur?.label).toMatch(/контрол\S*[^"]*качеств|видеофиксац/i);
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
    for (const l of sales.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("обезличено и без доли роялти 50%", () => {
    const blob = JSON.stringify(sales);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b/i);
    expect(blob).not.toMatch(/50\s*%/);
  });
});
