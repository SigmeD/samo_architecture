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
  it("указание владельца: доля Довлатова (50%) НЕ отображается", () => {
    const blob = JSON.stringify(finance);
    expect(blob).not.toMatch(/Давлатов/);
    expect(blob).not.toMatch(/50%/);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of finance.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
