import { describe, it, expect } from "vitest";
import { overview } from "@/content/overview";
import { getCabinet } from "@/content/cabinets";
import { OverviewSchema } from "@/content/schema";

const allCabs = () => overview.tiers.flatMap((t) => t.cabinets);

describe("overview L0", () => {
  it("валиден по OverviewSchema", () => {
    expect(() => OverviewSchema.parse(overview)).not.toThrow();
  });
  it("все slug'и кабинетов L0 есть в реестре", () => {
    for (const c of allCabs()) expect(getCabinet(c.slug), c.slug).toBeDefined();
  });
  it("куратор, родитель и маркетолог присутствуют (состав по встречам 04–05.06)", () => {
    const slugs = allCabs().map((c) => c.slug);
    expect(slugs).toContain("curator");
    expect(slugs).toContain("parent");
    expect(slugs).toContain("marketer");
  });
  it("«Качество и контроль» не отдельный кабинет", () => {
    expect(allCabs().map((c) => c.slug)).not.toContain("quality");
  });
  it("каждый кабинет несёт ≥1 highlight", () => {
    for (const c of allCabs()) expect(c.highlights.length, c.slug).toBeGreaterThan(0);
  });
  it("шапка — только качественные чипы (без числовых value)", () => {
    for (const m of overview.header.meta) expect(m.value, m.label).toBeUndefined();
  });
  it("нет запретных формулировок (7 этапов / 0–100%)", () => {
    const blob = JSON.stringify(overview);
    expect(blob).not.toMatch(/7 этап/);
    expect(blob).not.toMatch(/0[–-]100%/);
  });
  it("указание владельца: доля распределения роялти (50%) не отображается", () => {
    expect(JSON.stringify(overview)).not.toMatch(/50%/);
  });
});
