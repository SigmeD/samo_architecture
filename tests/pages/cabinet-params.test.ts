import { describe, it, expect } from "vitest";
import { getAllCabinetSlugs } from "@/content/cabinets";

it("включает все 11 кабинетов, в т.ч. curator", () => {
  const slugs = getAllCabinetSlugs();
  expect(slugs).toContain("curator");
  expect(slugs.length).toBe(11);
});
