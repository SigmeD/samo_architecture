import { describe, it, expect } from "vitest";
import { validateCabinet } from "@/content/schema";
import { curator } from "@/content/cabinets/curator";

describe("curator cabinet content", () => {
  it("проходит Zod-валидацию", () => { expect(() => validateCabinet(curator)).not.toThrow(); });
  it("зона = синяя (D2), не зелёная", () => { expect(curator.zone).toBe("blue"); });
  it("ядро-процесс — процедура урока, НЕ '7 этапов'", () => {
    expect(curator.coreProcess.steps).toHaveLength(3);
    const blob = JSON.stringify(curator).toLowerCase();
    expect(blob).not.toContain("7 этап");
    expect(blob).not.toContain("0–100%");
    expect(blob).not.toContain("0-100%");
  });
  it("lesson-journal и curator-rating помечены divergent", () => {
    const bySlug = Object.fromEntries(curator.modules.map((m) => [m.slug, m.status]));
    expect(bySlug["lesson-journal"]).toBe("divergent");
    expect(bySlug["curator-rating"]).toBe("divergent");
  });
  it("15 доменов, 8 связей, 14 модулей", () => {
    expect(curator.domains).toHaveLength(15);
    expect(curator.crossLinks).toHaveLength(8);
    expect(curator.modules).toHaveLength(14);
  });
});
