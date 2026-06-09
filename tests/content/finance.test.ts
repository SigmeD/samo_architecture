import { describe, it, expect } from "vitest";
import { finance } from "@/content/cabinets/finance";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет финансиста (finance)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(finance)).not.toThrow();
  });
  it("зона gold", () => {
    expect(finance.zone).toBe("gold");
  });
  it("ядро — финансовый результат / закрытие периода", () => {
    expect(finance.coreProcess.title).toMatch(/результат|ОПиУ|период/i);
    expect(finance.coreProcess.steps.length).toBeGreaterThanOrEqual(5);
  });
  it("инвариант: роялти 20%, выплаты Фикс+Бонус−Штраф, конфиденциальность", () => {
    const blob = JSON.stringify(finance);
    expect(blob).toMatch(/20%/);
    expect(blob).toMatch(/Фикс/);
    expect(blob).toMatch(/конфиденциал/i);
  });
  it("инвариант: бухгалтер НЕ принимает оплату; возврат = расторжение", () => {
    const blob = JSON.stringify(finance);
    expect(blob).toMatch(/НЕ принимает оплату/);
    expect(blob).toMatch(/[Рр]асторжени/);
  });
  it("указание владельца: доля основателя (50%) НЕ отображается", () => {
    const blob = JSON.stringify(finance);
    expect(blob).not.toMatch(/Д[оа]влат/);
    expect(blob).not.toMatch(/50%/);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of finance.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("crossLinks = целевая разводка фин.линии (09.06)", () => {
    const map = Object.fromEntries(finance.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(map).toEqual({
      franchise: "both",
      "school-admin": "both",
      "franchise-curator": "out",
      sales: "in",
      parent: "in",
    });
  });
  it("финлиния ГО: связь на franchise-curator (отчёты школ вверх); прямой связи на lead НЕТ (через Финансист ГО заглушку)", () => {
    const fc = finance.crossLinks.find((l) => l.toCabinet === "franchise-curator");
    expect(fc?.direction).toBe("out");
    expect(fc?.label).toMatch(/Финансист ГО|Само Глобал/);
    expect(fc?.label).toMatch(/отчёт\S*/i);
    expect(fc?.label).toMatch(/Куратор\S* франшиз|куратор\S* франшиз/i);
    // школьный бухгалтер НЕ связан напрямую с руководителем — линия идёт через Финансист ГО (заглушка в кабинете lead)
    expect(finance.crossLinks.some((l) => l.toCabinet === "lead")).toBe(false);
  });
  it("инвариант: куратор финансы НЕ видит — связь curator удалена", () => {
    const targets = finance.crossLinks.map((l) => l.toCabinet);
    expect(targets).not.toContain("curator");
  });
});
