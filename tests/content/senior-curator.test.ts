import { describe, it, expect } from "vitest";
import { seniorCurator } from "@/content/cabinets/senior-curator";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет старшего куратора (senior-curator)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(seniorCurator)).not.toThrow();
  });
  it("зона blue, planned, не стаб, роль op-starshiy-kurator-dnm", () => {
    expect(seniorCurator.zone).toBe("blue");
    expect(seniorCurator.implStatus).toBe("planned");
    expect(seniorCurator.isStub).toBeFalsy();
    expect(seniorCurator.role.code).toBe("op-starshiy-kurator-dnm");
  });
  it("ядро — двойная роль «играющий тренер» (6 шагов)", () => {
    expect(seniorCurator.coreProcess.badge).toMatch(/играющий тренер/i);
    expect(seniorCurator.coreProcess.steps).toHaveLength(6);
  });
  it("инвариант: ПРЕПОДАЁТ САМ (поправка постера «не ведёт учеников»)", () => {
    const blob = JSON.stringify(seniorCurator);
    expect(blob).toMatch(/преподаёт сам|моё преподавание|зеркало куратора/i);
    expect(blob).toMatch(/поправк\w* к постеру|не ведёт/i);
  });
  it("инвариант: контроль (B1) и коучинг (B2) РАЗДЕЛЬНО («снять шляпу оценщика»)", () => {
    const titles = seniorCurator.domains.map((d) => d.title).join(" | ");
    expect(titles).toMatch(/B1/);
    expect(titles).toMatch(/B2/);
    expect(JSON.stringify(seniorCurator)).toMatch(/снять шляпу оценщика|разделить|раздельн/i);
  });
  it("инвариант: эксклюзив СК — перераспределение групп/учеников; НЕ дублирует админа", () => {
    const blob = JSON.stringify(seniorCurator);
    expect(blob).toMatch(/эксклюзив|перераспределение групп/i);
    expect(blob).toMatch(/НЕ дублирует администратора|не дубль|не дублирует/i);
  });
  it("инвариант: НЕ настраивает KPI-планы (R); видеофиксация = развитие, не слежка", () => {
    const blob = JSON.stringify(seniorCurator);
    expect(blob).toMatch(/НЕ настраивает KPI|не настраивает KPI|настройк\w* KPI.*франчайзи|задаёт франчайзи/i);
    expect(blob).toMatch(/не слежк/i);
  });
  it("инвариант: ДЗ «принято/на доработку» без баллов (в своём преподавании)", () => {
    const blob = JSON.stringify(seniorCurator);
    expect(blob).toMatch(/принято\s*\/\s*на доработку/i);
    expect(blob).toMatch(/без баллов/i);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of seniorCurator.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });

  // C4 (08.06): упрощённая подача цикла коучинга («слишком сложно» — заказчик)
  it("C4: цикл коучинга помечен как упрощённый (заказчик: «слишком сложно»), суть не утеряна", () => {
    const blob = JSON.stringify(seniorCurator).toLowerCase();
    expect(blob).toMatch(/упрощённ[а-яё]* подач|упрощённ[а-яё]* цикл|облегчённ[а-яё]* подач/u);
    expect(blob).toMatch(/слишком сложно/);
    // содержимое цикла коучинга сохранено
    expect(blob).toMatch(/цикл коучинга/);
  });
});
