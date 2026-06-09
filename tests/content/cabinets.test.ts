import { describe, it, expect } from "vitest";
import { CABINETS, getCabinet } from "@/content/cabinets";
import { CabinetSchema } from "@/content/schema";

describe("реестр кабинетов (data-driven)", () => {
  for (const c of Object.values(CABINETS)) {
    it(`кабинет ${c.slug} валиден по CabinetSchema`, () => {
      expect(() => CabinetSchema.parse(c)).not.toThrow();
    });
  }

  it("каждый crossLink.toCabinet резолвится через getCabinet (кроме заглушек-связей)", () => {
    for (const c of Object.values(CABINETS)) {
      for (const l of c.crossLinks) {
        if (l.stub) continue; // заглушка на роль без кабинета (напр. Финансист ГО)
        expect(getCabinet(l.toCabinet), `${c.slug} → ${l.toCabinet}`).toBeDefined();
      }
    }
  });
});
