import { describe, it, expect } from "vitest";
import { marketer } from "@/content/cabinets/marketer";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет маркетолога (marketer) — 08.06", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(marketer)).not.toThrow();
  });
  it("зона orange, planned, не стаб, роль op-marketolog-dnm", () => {
    expect(marketer.zone).toBe("orange");
    expect(marketer.implStatus).toBe("planned");
    expect(marketer.isStub).toBeFalsy();
    expect(marketer.role.code).toBe("op-marketolog-dnm");
  });
  it("ядро — контур лидогенерации → квалифицированный лид (6 шагов)", () => {
    expect(marketer.coreProcess.title).toMatch(/квалифицированн|лидогенерац/i);
    expect(marketer.coreProcess.steps).toHaveLength(6);
  });
  it("инвариант: франчайзи-уровень + двухуровневая модель (HQ vs франчайзи)", () => {
    const blob = JSON.stringify(marketer);
    expect(blob).toMatch(/франчайзи-уровень|франчайзи-маркетолог/i);
    expect(blob).toMatch(/двухуровнев\S*/i);
    expect(blob).toMatch(/закреплённ\S* аккаунт/i);
  });
  it("инвариант: передаёт лиды менеджеру, не закрывает сделку", () => {
    const blob = JSON.stringify(marketer);
    expect(blob).toMatch(/передаёт лиды|передача менеджеру/i);
    expect(blob).toMatch(/не закрывает сделку/i);
  });
  it("инвариант «ноль финансов» (C2, RBAC v1.6 §9): UTM-атрибуция до квалификации; выручка/close-rate — у ГО, маркетолог франчайзи НЕ видит", () => {
    const blob = JSON.stringify(marketer);
    expect(blob).toMatch(/UTM/);
    expect(blob).toMatch(/ноль финансов/i);
    expect(blob).toMatch(/бухгалтер/i);
    // выручка/close-rate отнесены к ГО, не к франчайзи-маркетологу
    expect(blob).toMatch(/у ГО|уровень ГО|Маркетолог ГО/);
    expect(blob).toMatch(/НЕ видит|не получает выручку|не видит выручк/i);
  });
  it("инвариант: KPI = доля квалиф. лидов (качество), не объём и не выручка/close-rate; не создаёт брендбук/центральный контент", () => {
    const blob = JSON.stringify(marketer);
    expect(blob).toMatch(/доля квалифицированных лидов|квалиф\. лид/i);
    expect(blob).toMatch(/не объём/i);
    expect(blob).toMatch(/не создаёт брендбук|центральн\S* контент/i);
  });
  it("нет меток New (эталон-постера нет) и scope = школа", () => {
    const anyNew =
      marketer.coreProcess.steps.some((s) => s.isNew) ||
      marketer.domains.some((d) => d.isNew) ||
      marketer.crossLinks.some((l) => l.isNew) ||
      marketer.modules.some((m) => m.isNew);
    expect(anyNew).toBe(false);
    expect(JSON.stringify(marketer)).toMatch(/вне scope|scope — школа|направление — ШКОЛА/i);
  });
  it("ключевая связка: sales (передаёт лиды, both); все связи резолвятся", () => {
    const s = marketer.crossLinks.find((l) => l.toCabinet === "sales");
    expect(s).toBeDefined();
    expect(s?.direction).toBe("both");
    for (const l of marketer.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("C6: интеграции соцсетей/Google Ads через AI/API (автосбор статистики)", () => {
    const blob = JSON.stringify(marketer);
    expect(blob).toMatch(/AI\/API|через API/i);
    expect(blob).toMatch(/Instagram/i);
    expect(blob).toMatch(/Google Ads/i);
    expect(blob).toMatch(/автосбор|автозахват/i);
  });
  it("C6: домен «Рекомендуемые материалы для продаж» — топ-5 роликов со всей сети", () => {
    const dom = marketer.domains.find((d) => /рекомендованн\S*|рекомендуемы\S* материал/i.test(d.title));
    expect(dom, "домен рекомендованных материалов").toBeDefined();
    const blob = JSON.stringify(marketer);
    expect(blob).toMatch(/топ-5|топ 5/i);
    expect(blob).toMatch(/просмотр/i);
  });
  it("C6: crossLink на sales несёт поток рекомендованных материалов и резолвится", () => {
    const s = marketer.crossLinks.find((l) => l.toCabinet === "sales");
    expect(s).toBeDefined();
    expect(/рекоменд\S*/i.test(s!.label)).toBe(true);
    expect(getCabinet("sales")).toBeDefined();
  });
  it("обезличено и без доли роялти 50%", () => {
    const blob = JSON.stringify(marketer);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b|Маржан/i);
    expect(blob).not.toMatch(/50\s*%/);
  });
});
