import { describe, it, expect } from "vitest";
import { director } from "@/content/cabinets/director";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет директора школы (director)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(director)).not.toThrow();
  });
  it("идентичность: slug director, роль op-direktor-shkoly-dnm, orange, planned", () => {
    expect(director.slug).toBe("director");
    expect(director.role.code).toBe("op-direktor-shkoly-dnm");
    expect(director.role.title).toMatch(/Директор школы/i);
    expect(director.zone).toBe("orange");
    expect(director.implStatus).toBe("planned");
  });
  it("инвариант границы финансов: P&L/роялти конфиденц, без доли 50%", () => {
    const blob = JSON.stringify(director);
    expect(blob).toMatch(/конфиденц/i);
    expect(blob).not.toMatch(/50%/);
  });
  it("вход как директор (FR-M3-094)", () => {
    expect(JSON.stringify(director)).toMatch(/FR-M3-094|как директор/i);
  });
  it("связи director = franchise + school-admin (both), вертикаль не напрямую руководителю", () => {
    const dir = Object.fromEntries(director.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(dir).toEqual({ franchise: "both", "school-admin": "both" });
    expect(director.crossLinks.map((l) => l.toCabinet)).not.toContain("lead");
  });
  it("все связи резолвятся", () => {
    for (const l of director.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
});
