import { describe, it, expect } from "vitest";
import { franchiseCurator } from "@/content/cabinets/franchise-curator";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет куратора франшиз (franchise-curator)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(franchiseCurator)).not.toThrow();
  });
  it("зона purple, planned, не стаб, роль op-kurator-franshiz-dnm", () => {
    expect(franchiseCurator.zone).toBe("purple");
    expect(franchiseCurator.implStatus).toBe("planned");
    expect(franchiseCurator.isStub).toBeFalsy();
    expect(franchiseCurator.role.code).toBe("op-kurator-franshiz-dnm");
  });
  it("инвариант владельца: доля распределения роялти (50%) и имена НЕ показываются", () => {
    const blob = JSON.stringify(franchiseCurator);
    expect(blob).not.toMatch(/50\s*%/);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b/i);
  });
  it("СТРОГАЯ ВЕРТИКАЛЬ: crossLinks = ровно {lead:both, franchise:both, methodist:both, finance:in}", () => {
    const map = Object.fromEntries(franchiseCurator.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(map).toEqual({
      lead: "both",
      franchise: "both",
      methodist: "both",
      finance: "in",
    });
  });
  it("УБРАНЫ связи в обход уровней (senior-curator, marketer)", () => {
    const targets = franchiseCurator.crossLinks.map((l) => l.toCabinet);
    for (const gone of ["senior-curator", "marketer"]) {
      expect(targets, gone).not.toContain(gone);
    }
  });
  it("связь с методистом: методист в подчинении КФ, методпакеты вниз через КФ", () => {
    const m = franchiseCurator.crossLinks.find((l) => l.toCabinet === "methodist");
    expect(m?.direction).toBe("both");
    expect(m?.label).toMatch(/методист/i);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of franchiseCurator.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
