import { describe, it, expect } from "vitest";
import { franchise } from "@/content/cabinets/franchise";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет франчайзи / директора (franchise)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(franchise)).not.toThrow();
  });
  it("зона purple, planned, не стаб", () => {
    expect(franchise.zone).toBe("purple");
    expect(franchise.implStatus).toBe("planned");
    expect(franchise.isStub).toBeFalsy();
  });
  it("ядро — цикл управления сетью (6 шагов)", () => {
    expect(franchise.coreProcess.title).toMatch(/сет|управлени/i);
    expect(franchise.coreProcess.steps).toHaveLength(6);
  });
  it("центр кабинета — деньги и планирование (роялти 20%, «от цели к плану»)", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).toMatch(/20%/);
    expect(blob).toMatch(/от цели к плану/i);
    expect(blob).toMatch(/роялти/i);
  });
  it("инвариант владельца: доля распределения роялти (50%) и имена НЕ показываются", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).not.toMatch(/50%/);
    expect(blob).not.toMatch(/Д[оа]влат/);
  });
  it("инвариант: scope своей сети + финансы ГО read-only", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).toMatch(/franchiseeId|своя сеть|свою сеть|своей сети/i);
    expect(blob).toMatch(/read-only|read only/i);
  });
  it("инвариант: не дублирует операционку администратора (делегировано)", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).toMatch(/делегир|зам.*по операционке|операционн/i);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of franchise.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
