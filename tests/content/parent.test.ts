import { describe, it, expect } from "vitest";
import { parent } from "@/content/cabinets/parent";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет родителя (parent)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(parent)).not.toThrow();
  });
  it("зона blue (управление/операции)", () => {
    expect(parent.zone).toBe("blue");
  });
  it("ядро = центр контроля над ребёнком", () => {
    expect(parent.coreProcess.title).toMatch(/контрол/i);
    expect(parent.coreProcess.steps.length).toBeGreaterThanOrEqual(5);
  });
  it("инвариант: нет «заморожен» / «7 этап» / «0–100%»", () => {
    const blob = JSON.stringify(parent);
    expect(blob).not.toMatch(/заморожен/);
    expect(blob).not.toMatch(/7 этап/);
    expect(blob).not.toMatch(/0[–-]100%/);
  });
  it("ДЗ без баллов; родитель ДЗ/тесты от лица ребёнка не сдаёт", () => {
    const blob = JSON.stringify(parent);
    expect(blob).toMatch(/принято/);
    expect(blob).toMatch(/баллов/i);
    expect(blob).toMatch(/НЕ сдаёт/);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of parent.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });

  // === Аддитивные правки C2 (gap-анализ 08–09.06) ===

  it("C2: трёхуровневый рейтинг ученика — в группе / в школе / в проекте", () => {
    const progress = parent.domains.find((d) => /Прогресс/i.test(d.title));
    expect(progress).toBeDefined();
    const blob = JSON.stringify(progress);
    expect(blob).toMatch(/в группе/i);
    expect(blob).toMatch(/в школе/i);
    expect(blob).toMatch(/в проекте/i);
  });

  it("C2: расписание ребёнка по семестру (12 недель ≈ 24 урока, фильтр)", () => {
    const blob = JSON.stringify(parent);
    expect(blob).toMatch(/12 недел/i);
    expect(blob).toMatch(/24 урок/i);
  });

  it("C2: опросы о школе → отчётность франшизы → куратор франшиз (crossLink out)", () => {
    const surveys = parent.domains.find((d) => /Опрос/i.test(d.title));
    expect(surveys).toBeDefined();
    expect(JSON.stringify(surveys)).toMatch(/франш/i);
    const link = parent.crossLinks.find((l) => l.toCabinet === "franchise-curator");
    expect(link, "crossLink на franchise-curator").toBeDefined();
    expect(link!.direction).toBe("out");
  });

  it("C2: явный инвариант-запрет — сравнительные рейтинги школ родителю НЕ показываются", () => {
    const blob = JSON.stringify(parent);
    expect(blob).toMatch(/рейтинг/i);
    expect(blob).toMatch(/школ.{0,40}НЕ показыва/i);
  });

  it("C2: концепция универсального кабинета / Global Samo (на подтверждении)", () => {
    const blob = JSON.stringify(parent);
    expect(blob).toMatch(/Global Samo|Само Глобал/i);
    expect(blob).toMatch(/путь клиента/i);
  });

  // === Task 3 (crosslinks one-way + content fix, 09.06) ===

  it("совместное ДЗ/уроки с ребёнком (младшие) + посещаемость по-русски (без EN-кодов)", () => {
    const blob = JSON.stringify(parent);
    expect(blob).toMatch(/совместн\S*.*ребёнк|ДЗ.*с ребёнком/i);
    expect(blob).not.toMatch(/PRESENT|ABSENT|EXCUSED|LATE/);
  });
  it("обоюдные (both) связи только child/curator/school-admin/franchise; нет меток New", () => {
    const both = parent.crossLinks.filter((l) => l.direction === "both").map((l) => l.toCabinet).sort();
    expect(both).toEqual(["child", "curator", "franchise", "school-admin"]);
    const anyNew =
      parent.domains.some((d) => d.isNew) ||
      parent.crossLinks.some((l) => l.isNew) ||
      parent.coreProcess.steps.some((s) => s.isNew) ||
      parent.modules.some((m) => m.isNew);
    expect(anyNew).toBe(false);
  });
});
