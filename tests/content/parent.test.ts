import { describe, it, expect } from "vitest";
import { parent } from "@/content/cabinets/parent";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет родителя (parent)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(parent)).not.toThrow();
  });
  it("зона blue (управление/операции)", () => {
    expect(parent.zone).toBe("blue");
  });
  it("ядро = центр контроля над ребёнком", () => {
    expect(parent.coreProcess.title).toMatch(/контрол/i);
    expect(parent.coreProcess.steps.length).toBeGreaterThanOrEqual(5);
  });
  it("инвариант: нет «заморожен» / «7 этап» / «0–100%»", () => {
    const blob = JSON.stringify(parent);
    expect(blob).not.toMatch(/заморожен/);
    expect(blob).not.toMatch(/7 этап/);
    expect(blob).not.toMatch(/0[–-]100%/);
  });
  it("ДЗ без баллов; родитель ДЗ/тесты от лица ребёнка не сдаёт", () => {
    const blob = JSON.stringify(parent);
    expect(blob).toMatch(/принято/);
    expect(blob).toMatch(/баллов/i);
    expect(blob).toMatch(/НЕ сдаёт/);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of parent.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
