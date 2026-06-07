import { describe, it, expect } from "vitest";
import { schoolAdmin } from "@/content/cabinets/school-admin";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет администратора школы (school-admin)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(schoolAdmin)).not.toThrow();
  });
  it("зона orange, planned, не стаб", () => {
    expect(schoolAdmin.zone).toBe("orange");
    expect(schoolAdmin.implStatus).toBe("planned");
    expect(schoolAdmin.isStub).toBeFalsy();
    expect(schoolAdmin.role.code).toBe("op-admin-shkoly-dnm");
  });
  it("ядро — зачисление ученика (мастер, 6 шагов)", () => {
    expect(schoolAdmin.coreProcess.title).toMatch(/зачислени/i);
    expect(schoolAdmin.coreProcess.steps).toHaveLength(6);
  });
  it("инвариант границы финансов: только дебиторка, P&L/роялти/маржа конфиденц (владелец+бухгалтер), без доли 50%", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/дебиторк/i);
    expect(blob).toMatch(/конфиденц/i);
    expect(blob).toMatch(/только владельц\w* и бухгалтер|владельцу и бухгалтеру/i);
    expect(blob).not.toMatch(/50%/);
  });
  it("инвариант scope: своя школа (schoolId)", () => {
    expect(JSON.stringify(schoolAdmin)).toMatch(/schoolId|свою школу|своей школы|одной школы/i);
  });
  it("инвариант: отдел качества = функция администратора; пробные — в продажах; непосещение у админа", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/Отдел качества/i);
    expect(blob).toMatch(/функци\w* администратора|функцию исполняет администратор/i);
    expect(blob).toMatch(/ПРОБНЫЕ УРОКИ ЗДЕСЬ|пробные уроки/i);
    expect(blob).toMatch(/непосещени/i);
  });
  it("инвариант адаптивности: 2 орг-модели через feature-toggles", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/feature-toggle|фиче-тогл/i);
    expect(blob).toMatch(/одна школа|сеть|модел/i);
    expect(schoolAdmin.domains.some((d) => d.toggleable)).toBe(true);
  });
  it("франчайзи входит как директор (FR-M3-094, реципрокно)", () => {
    expect(JSON.stringify(schoolAdmin)).toMatch(/FR-M3-094|как директор/i);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of schoolAdmin.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
