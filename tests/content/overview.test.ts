import { describe, it, expect } from "vitest";
import { overview } from "@/content/overview";
import { getCabinet } from "@/content/cabinets";

it("все slug'и тиров существуют в реестре кабинетов", () => {
  const slugs = overview.tiers.flatMap((t) => t.cabinetSlugs);
  for (const s of slugs) expect(getCabinet(s), `missing ${s}`).toBeDefined();
});
it("куратор присутствует на постере", () => {
  expect(overview.tiers.some((t) => t.cabinetSlugs.includes("curator"))).toBe(true);
});
