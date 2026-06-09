import { describe, it, expect } from "vitest";
import { systemMap } from "@/content/system-map";
import { SystemMapSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("сводная карта системы (system-map)", () => {
  it("валидна по SystemMapSchema", () => {
    expect(() => SystemMapSchema.parse(systemMap)).not.toThrow();
  });
  it("каждая строка матрицы = по ячейке на раздел", () => {
    const n = systemMap.matrix.sections.length;
    for (const r of systemMap.matrix.rows) expect(r.cells.length, r.role).toBe(n);
  });
  it("divergent-ячейки несут note (вскрытая нестыковка)", () => {
    for (const r of systemMap.matrix.rows)
      for (const c of r.cells)
        if (typeof c === "object" && c.divergent) expect(c.note, r.role).toBeTruthy();
  });
  it("карта чистая (маркеры убраны): divergences пуст, нет divergent-ячеек и offCanon", () => {
    expect(systemMap.divergences).toHaveLength(0);
    const flagged = systemMap.matrix.rows.flatMap((r) => r.cells).filter((c) => typeof c === "object" && c.divergent);
    expect(flagged).toHaveLength(0);
    expect(systemMap.matrix.rows.some((r) => r.offCanon)).toBe(false);
  });
  it("иерархия без tag-маркеров; есть Маркетолог ГО (Само Глобал); у куратора франшиз нет тега «методист»", () => {
    const allRoles = systemMap.hierarchy.flatMap((t) => t.roles);
    expect(allRoles.every((r) => !r.tag), "остался tag-маркер").toBe(true);
    expect(allRoles.some((r) => /Маркетолог ГО/.test(r.title)), "нет Маркетолог ГО").toBe(true);
    expect(JSON.stringify(systemMap)).not.toMatch(/право\s*«?методист/i);
  });
  it("slug-и иерархии и матрицы резолвятся в реестре кабинетов", () => {
    const slugs = [
      ...systemMap.hierarchy.flatMap((t) => t.roles.map((r) => r.slug)),
      ...systemMap.matrix.rows.map((r) => r.slug),
    ].filter(Boolean) as string[];
    for (const s of slugs) expect(getCabinet(s), s).toBeDefined();
  });
  it("обезличено: без персональных имён и без доли роялти 50%", () => {
    const blob = JSON.stringify(systemMap);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b/i);
    expect(blob).not.toMatch(/50\s*%/);
  });
});
