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
  it("есть ≥3 сводных расхождения и ≥1 помеченная ячейка", () => {
    expect(systemMap.divergences.length).toBeGreaterThanOrEqual(3);
    const flagged = systemMap.matrix.rows.flatMap((r) => r.cells).filter((c) => typeof c === "object" && c.divergent);
    expect(flagged.length).toBeGreaterThanOrEqual(1);
  });
  it("инвариант: авторинг программы помечен расхождением у руководителя и куратора франшиз", () => {
    const idx = systemMap.matrix.sections.findIndex((s) => /авторинг/i.test(s));
    expect(idx).toBeGreaterThanOrEqual(0);
    for (const role of ["Руководитель проекта", "Куратор франшиз"]) {
      const row = systemMap.matrix.rows.find((r) => r.role === role)!;
      const cell = row.cells[idx];
      expect(typeof cell === "object" && cell.divergent, role).toBe(true);
    }
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
