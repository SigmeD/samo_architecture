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
  it("сплит Админ/Директор: обе роли в иерархии и матрице как отдельные строки", () => {
    const hierSlugs = systemMap.hierarchy.flatMap((t) => t.roles.map((r) => r.slug));
    expect(hierSlugs).toContain("director");
    expect(hierSlugs).toContain("school-admin");
    const rowSlugs = systemMap.matrix.rows.map((r) => r.slug);
    expect(rowSlugs).toContain("director");
    expect(rowSlugs).toContain("school-admin");
    // Директор школы и Администратор — разные строки матрицы (не дубль одной)
    expect(new Set(rowSlugs.filter((s) => s === "director" || s === "school-admin")).size).toBe(2);
  });
  it("Директор: per-resource RBAC отложен в OQ-ORG-03 — неизвестные ячейки помечены note, без выдуманных full", () => {
    const dir = systemMap.matrix.rows.find((r) => r.slug === "director");
    expect(dir, "нет строки Директор").toBeDefined();
    // Финансы сети директору закрыты (P&L не его); не должно быть full на «Финансы сети»
    const idx = (label: string) => systemMap.matrix.sections.indexOf(label);
    const cellLevel = (i: number) => {
      const c = dir!.cells[i];
      return typeof c === "object" ? c.level : c;
    };
    expect(cellLevel(idx("Финансы сети"))).toBe("none");
    // где использован уровень scope (view/partial) на спорных разделах — ожидаем пометку OQ-ORG-03 хотя бы в одной ячейке
    const hasOqNote = dir!.cells.some((c) => typeof c === "object" && /OQ-ORG-03/.test(c.note ?? ""));
    expect(hasOqNote, "нет пометки OQ-ORG-03 на отложенных правах Директора").toBe(true);
  });
  it("HR/рекрутинг: в иерархии и матрице; кадровый scope, учёба/финансы закрыты, per-resource RBAC отложен в OQ-ORG-03", () => {
    const hierSlugs = systemMap.hierarchy.flatMap((t) => t.roles.map((r) => r.slug));
    expect(hierSlugs).toContain("hr");
    const hr = systemMap.matrix.rows.find((r) => r.slug === "hr");
    expect(hr, "нет строки HR").toBeDefined();
    expect(hr!.cells.length, "HR: ячеек ≠ числу разделов").toBe(systemMap.matrix.sections.length);
    const idx = (label: string) => systemMap.matrix.sections.indexOf(label);
    const cellLevel = (i: number) => {
      const c = hr!.cells[i];
      return typeof c === "object" ? c.level : c;
    };
    // учебные и финансовые данные HR закрыты (REG-DNM-HR-001 v1.1 §5)
    expect(cellLevel(idx("Финансы сети"))).toBe("none");
    expect(cellLevel(idx("Финансы школы"))).toBe("none");
    expect(cellLevel(idx("Данные ученика"))).toBe("none");
    // нет выдуманных full (нет per-resource RBAC-колонки у HR)
    expect(hr!.cells.some((c) => (typeof c === "object" ? c.level : c) === "full"), "HR: выдуманный full").toBe(false);
    // отложенные права помечены OQ-ORG-03
    expect(hr!.cells.some((c) => typeof c === "object" && /OQ-ORG-03/.test(c.note ?? "")), "нет пометки OQ-ORG-03 у HR").toBe(true);
  });
  it("матрица сослана на RBAC v1.6", () => {
    const rbac = systemMap.sources.find((s) => s.id === "CONV-RBAC-DNM-001");
    expect(rbac?.version).toBe("1.6");
  });
  it("обезличено: без персональных имён и без доли роялти 50%", () => {
    const blob = JSON.stringify(systemMap);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b/i);
    expect(blob).not.toMatch(/50\s*%/);
  });
});
