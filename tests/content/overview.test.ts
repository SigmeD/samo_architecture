import { describe, it, expect } from "vitest";
import { overview } from "@/content/overview";
import { getCabinet } from "@/content/cabinets";
import { OverviewSchema } from "@/content/schema";

const allCabs = () => overview.tiers.flatMap((t) => t.cabinets);

describe("overview L0", () => {
  it("валиден по OverviewSchema", () => {
    expect(() => OverviewSchema.parse(overview)).not.toThrow();
  });
  it("все slug'и кабинетов L0 есть в реестре", () => {
    for (const c of allCabs()) expect(getCabinet(c.slug), c.slug).toBeDefined();
  });
  it("куратор, родитель и маркетолог присутствуют (состав по встречам 04–05.06)", () => {
    const slugs = allCabs().map((c) => c.slug);
    expect(slugs).toContain("curator");
    expect(slugs).toContain("parent");
    expect(slugs).toContain("marketer");
  });
  it("«Качество и контроль» не отдельный кабинет", () => {
    expect(allCabs().map((c) => c.slug)).not.toContain("quality");
  });
  it("каждый кабинет несёт ≥1 highlight", () => {
    for (const c of allCabs()) expect(c.highlights.length, c.slug).toBeGreaterThan(0);
  });
  it("шапка — только качественные чипы (без числовых value)", () => {
    for (const m of overview.header.meta) expect(m.value, m.label).toBeUndefined();
  });
  it("нет запретных формулировок (7 этапов / 0–100%)", () => {
    const blob = JSON.stringify(overview);
    expect(blob).not.toMatch(/7 этап/);
    expect(blob).not.toMatch(/0[–-]100%/);
  });
  it("указание владельца: доля распределения роялти (50%) не отображается", () => {
    expect(JSON.stringify(overview)).not.toMatch(/50%/);
  });

  // === Реверс воронки продаж #1 (09.06): договор у менеджера ===

  it("воронка #1: договор у менеджера, админ подтверждает, оплата через бухгалтерию", () => {
    const funnel = overview.processes.find((p) => /Воронка продаж/i.test(p.title));
    expect(funnel, "воронка продаж и пробного урока").toBeDefined();
    const blob = JSON.stringify(funnel);
    // договор оформляет менеджер (а не админ)
    expect(blob).toMatch(/менеджер.{0,60}договор|договор/i);
    expect(blob).toMatch(/Дожим.{0,40}договор/i);
    expect(blob).toMatch(/[Аа]дмин.{0,40}подтвержда/);
    expect(blob).toMatch(/бухгалтер/i);
    // пробное проводит менеджер ИЛИ назначенный куратор (не «куратор формирует ценность» как единственный пробный)
    expect(blob).toMatch(/назнача\S*.*куратор|куратора из расписания/i);
    expect(blob).not.toMatch(/куратор формирует ценность/);
  });
});
