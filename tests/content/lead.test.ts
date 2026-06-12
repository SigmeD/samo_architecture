import { describe, it, expect } from "vitest";
import { lead } from "@/content/cabinets/lead";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет руководителя проекта (lead) — обновление 08.06", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(lead)).not.toThrow();
  });
  it("зона blue, planned, не стаб, роль br7-rukovoditel-dnm", () => {
    expect(lead.zone).toBe("blue");
    expect(lead.implStatus).toBe("planned");
    expect(lead.isStub).toBeFalsy();
    expect(lead.role.code).toBe("br7-rukovoditel-dnm");
  });
  it("ядро — стратегический контур франчайзера (6 стадий)", () => {
    expect(lead.coreProcess.title).toMatch(/стратегическ\S* контур/i);
    expect(lead.coreProcess.steps).toHaveLength(6);
  });
  it("ПОПРАВКА: программу авторит куратор франшиз, руководитель ПОДТВЕРЖДАЕТ (не авторит)", () => {
    const blob = JSON.stringify(lead);
    expect(blob).toMatch(/куратор франшиз.*авторит|авторит.*куратор франшиз/i);
    expect(blob).toMatch(/подтвержда/i);
    expect(blob).toMatch(/поправк\S* к постеру/i);
  });
  it("ГРАНИЦА: руководитель НЕ видит данные отдельного ученика (только агрегат)", () => {
    const blob = JSON.stringify(lead);
    expect(blob).toMatch(/НЕ видит.*ученик|без данных отдельного ученика|не работает с данными отдельного ученика/i);
    expect(blob).toMatch(/агрегат/i);
  });
  it("инвариант владельца: доля распределения роялти (50%) НЕ отображается; обезличено", () => {
    const blob = JSON.stringify(lead);
    expect(blob).not.toMatch(/50\s*%/);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b/i);
  });
  it("новые подсистемы: целостность роялти на участии+видеофиксация, мультивалютность USD, маркетинг-фонд, offboarding", () => {
    const blob = JSON.stringify(lead);
    expect(blob).toMatch(/целостность роялти/i);
    expect(blob).toMatch(/видеофиксаци/i);
    expect(blob).toMatch(/мультивалютн|база.*USD|USD/i);
    expect(blob).toMatch(/маркетингов\S* фонд/i);
    expect(blob).toMatch(/offboarding|отзыв доступов|миграци\S* учеников/i);
  });
  it("метки New убраны (нет isNew ни в одном блоке)", () => {
    const anyNew =
      lead.coreProcess.steps.some((s) => s.isNew) ||
      lead.domains.some((d) => d.isNew) ||
      lead.crossLinks.some((l) => l.isNew) ||
      lead.modules.some((m) => m.isNew);
    expect(anyNew).toBe(false);
  });
  it("все связи резолвятся в реестре; метки New на связях убраны", () => {
    const fc = lead.crossLinks.find((l) => l.toCabinet === "franchise-curator");
    expect(fc?.isNew).toBeFalsy();
    for (const l of lead.crossLinks) if (!l.stub) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("финлиния ГО: ЗАГЛУШКА «Финансист ГО» = ГО-роль ДНМ (ратифицировано, не Само Глобал, не школьный бухгалтер)", () => {
    const f = lead.crossLinks.find((l) => l.stub === "Финансист ГО");
    expect(f, "нет stub-связи Финансист ГО").toBeDefined();
    expect(f?.direction).toBe("both");
    expect(f?.label).toMatch(/ГО-роль ДНМ|op-finansist-go-dnm/i);
    // T5: framing «Само Глобал отдельный продукт» снят (ратифицировано ROLES v1.6 §2а)
    expect(f?.label).not.toMatch(/Само Глобал/);
    expect(f?.label).toMatch(/НЕ школьный бухгалтер|отдельная финансовая линия/i);
    // прямой связи на кабинет бухгалтера (finance) быть НЕ должно — это ломало логику
    expect(lead.crossLinks.some((l) => l.toCabinet === "finance" && !l.stub)).toBe(false);
  });
  it("СТРОГАЯ ВЕРТИКАЛЬ: crossLinks = ровно {franchise-curator:both, methodist:both, finance-go(stub):both}", () => {
    const map = Object.fromEntries(lead.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(map).toEqual({
      "franchise-curator": "both",
      methodist: "both",
      "finance-go": "both",
    });
  });
  it("УБРАНЫ обходящие вертикаль связи (school-admin, curator, senior-curator, sales, marketer, franchise)", () => {
    const targets = lead.crossLinks.map((l) => l.toCabinet);
    for (const gone of ["school-admin", "curator", "senior-curator", "sales", "marketer", "franchise"]) {
      expect(targets, gone).not.toContain(gone);
    }
  });
});
