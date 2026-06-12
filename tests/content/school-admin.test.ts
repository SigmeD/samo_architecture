import { describe, it, expect } from "vitest";
import { schoolAdmin } from "@/content/cabinets/school-admin";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет администратора школы (school-admin) — лёгкий, обслуживающий/распределяющий", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(schoolAdmin)).not.toThrow();
  });
  it("идентичность: slug school-admin, op-admin-shkoly-dnm, orange, planned, не стаб", () => {
    expect(schoolAdmin.slug).toBe("school-admin");
    expect(schoolAdmin.role.code).toBe("op-admin-shkoly-dnm");
    expect(schoolAdmin.role.title).toMatch(/Администратор школы/i);
    expect(schoolAdmin.zone).toBe("orange");
    expect(schoolAdmin.implStatus).toBe("planned");
    expect(schoolAdmin.isStub).toBeFalsy();
  });
  it("лёгкий: обслуживающая/распределяющая роль, НЕ управляющий (это Директор)", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/обслуживающ|распределя/i);
    expect(blob).toMatch(/НЕ управля|не управля|это директор|у директора/i);
  });
  it("границы: P&L закрыт, KPI/тоглы/права — у директора, без доли 50%", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/P&L|конфиденц|только дебиторк/i);
    expect(blob).not.toMatch(/50%/);
  });
  it("Администратор-Лидоруб — опц. dual-mode (модель Гульшата)", () => {
    expect(JSON.stringify(schoolAdmin)).toMatch(/Лидоруб/i);
  });
  it("непосещение: 1-е авто-пуш, 2-е звонок админа", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/непосещени/i);
    expect(blob).toMatch(/авто.?пуш|автоматическ/i);
  });
  it("РЕВЕРС: договор оформляет менеджер → админ ПОДТВЕРЖДАЕТ; оплата через бухгалтерию", () => {
    const blob = JSON.stringify(schoolAdmin);
    expect(blob).toMatch(/подтвержда\S*[^.]*договор|договор\S*[^.]*подтвержда/i);
    expect(blob).toMatch(/бухгалтер/i);
  });
  it("целевой граф связей (направления)", () => {
    const dir = Object.fromEntries(schoolAdmin.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(dir).toEqual({
      director: "both", "senior-curator": "both", finance: "both",
      sales: "both", marketer: "both", parent: "both", child: "both", guest: "in",
    });
  });
  it("чат с учеником только старшие/SENIOR (младшие через родителя)", () => {
    const childLink = schoolAdmin.crossLinks.find((l) => l.toCabinet === "child");
    expect(childLink?.label).toMatch(/старш/i);
    expect(childLink?.label).toMatch(/SENIOR|младш/i);
  });
  it("данные вверх через директора, НЕ напрямую руководителю", () => {
    const targets = schoolAdmin.crossLinks.map((l) => l.toCabinet);
    expect(targets).not.toContain("lead");
  });
  it("все связи резолвятся", () => {
    for (const l of schoolAdmin.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
