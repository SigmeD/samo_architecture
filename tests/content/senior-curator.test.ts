import { describe, it, expect } from "vitest";
import { seniorCurator } from "@/content/cabinets/senior-curator";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет старшего куратора (senior-curator)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(seniorCurator)).not.toThrow();
  });
  it("зона blue, planned, не стаб, роль op-starshiy-kurator-dnm, тайтл «Старший куратор ДНМ»", () => {
    expect(seniorCurator.zone).toBe("blue");
    expect(seniorCurator.implStatus).toBe("planned");
    expect(seniorCurator.isStub).toBeFalsy();
    expect(seniorCurator.role.code).toBe("op-starshiy-kurator-dnm");
    expect(seniorCurator.role.title).toBe("Старший куратор ДНМ");
  });

  // Вертикаль (admin/director split 12.06): учебная вертикаль СК ↔ директор школы;
  // админ остаётся операционной стыковкой. Связи только ±1 уровень.
  it("crossLinks РОВНО director/school-admin/curator (both) + child/parent (out, своё преподавание); убраны lead/franchise/franchise-curator/finance", () => {
    const byTo = Object.fromEntries(seniorCurator.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(Object.keys(byTo).sort()).toEqual(["child", "curator", "director", "parent", "school-admin"]);
    expect(byTo["director"]).toBe("both");
    expect(byTo["school-admin"]).toBe("both");
    expect(byTo["curator"]).toBe("both");
    expect(byTo["child"]).toBe("out");
    expect(byTo["parent"]).toBe("out");
    for (const removed of ["lead", "franchise", "franchise-curator", "finance"]) {
      expect(byTo[removed], `связь ${removed} должна быть удалена`).toBeUndefined();
    }
  });
  it("учебная вертикаль: СК подчиняется ДИРЕКТОРУ школы (отчёты/методпакеты); первая связь — director", () => {
    expect(seniorCurator.crossLinks[0]?.toCabinet).toBe("director");
    const directorLink = seniorCurator.crossLinks.find((l) => l.toCabinet === "director");
    expect(directorLink?.label).toMatch(/директор[а-яё]* школы/iu);
    expect(directorLink?.label).toMatch(/ВВЕРХ ПО ВЕРТИКАЛИ|подчиняется/iu);
  });
  it("СК — точка сбора отчётов обучения/посещения/ОС → Директору школы (не напрямую выше); админ = операционная стыковка (чат)", () => {
    const blob = JSON.stringify(seniorCurator);
    expect(blob).toMatch(/собирает ВСЕ отчёты|точка сбора/iu);
    expect(blob).toMatch(/передаёт Директору школы/iu);
    expect(blob).toMatch(/чат с админ/iu);
    // подчинение теперь директору, не администратору
    expect(blob).toMatch(/Подчинение: директор школы → старший куратор/iu);
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
