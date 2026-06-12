import { describe, it, expect } from "vitest";
import { hr } from "@/content/cabinets/hr";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет HR / рекрутинг (hr)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(hr)).not.toThrow();
  });
  it("идентичность: slug hr, op-hr-dnm, blue, planned, не стаб", () => {
    expect(hr.slug).toBe("hr");
    expect(hr.role.code).toBe("op-hr-dnm");
    expect(hr.role.title).toMatch(/HR|рекрутинг/i);
    expect(hr.zone).toBe("blue");
    expect(hr.implStatus).toBe("planned");
    expect(hr.isStub).toBeFalsy();
  });
  it("ядро — воронка найма → ... → удержание (6 шагов)", () => {
    expect(hr.coreProcess.title).toMatch(/воронк|найм/i);
    expect(hr.coreProcess.steps).toHaveLength(6);
  });
  it("ключевые домены: KPI-карты персонала + база данных персонала + академия онбординга", () => {
    const blob = JSON.stringify(hr);
    expect(blob).toMatch(/KPI-карт/i);
    expect(blob).toMatch(/база данных персонал|system of record|базы данных сотруд/i);
    expect(blob).toMatch(/онбординг|аттестац/i);
    expect(blob).toMatch(/тест\w* при приёме|банк тестов/i);
  });
  it("граница: без учебных/финансовых данных, не считает выплаты, без 50%", () => {
    const blob = JSON.stringify(hr);
    expect(blob).toMatch(/без учебных|не считает выплат|≠ бухгалтер|не видит P&L|без финотчёт/i);
    expect(blob).not.toMatch(/50%/);
  });
  it("ставка = кадровый атрибут, не платёжная операция", () => {
    expect(JSON.stringify(hr)).toMatch(/кадровый атрибут|не платёж/i);
  });
  it("связи: director (both) + finance (out)", () => {
    const dir = Object.fromEntries(hr.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(dir).toEqual({ director: "both", finance: "out" });
  });
  it("все both-связи резолвятся; нет связи lead", () => {
    expect(hr.crossLinks.map((l) => l.toCabinet)).not.toContain("lead");
    for (const l of hr.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("OQ-ORG-02 (линия подчинения) показан как открытый вопрос", () => {
    expect(JSON.stringify(hr)).toMatch(/OQ-ORG-02/);
  });
});
