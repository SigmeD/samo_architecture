import { describe, it, expect } from "vitest";
import { methodist } from "@/content/cabinets/methodist";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет методиста (methodist) — 09.06, новая роль ГО (N1)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(methodist)).not.toThrow();
  });
  it("зона blue (провизорно), planned, не стаб, роль op-metodist-dnm", () => {
    expect(methodist.zone).toBe("blue");
    expect(methodist.implStatus).toBe("planned");
    expect(methodist.isStub).toBeFalsy();
    expect(methodist.role.code).toBe("op-metodist-dnm");
    expect(methodist.role.title).toBe("Методист");
    expect(methodist.role.emoji).toBe("📐");
    expect(methodist.slug).toBe("methodist");
  });
  it("ядро — контур авторинга методики (6 шагов)", () => {
    expect(methodist.coreProcess.title).toMatch(/авторинг\S*\s+методик/i);
    expect(methodist.coreProcess.badge).toMatch(/авторинг методик/i);
    expect(methodist.coreProcess.steps).toHaveLength(6);
  });
  it("инвариант: конструктор видов уроков + AI-сегментация плана по видам", () => {
    const blob = JSON.stringify(methodist);
    expect(blob).toMatch(/конструктор видов уроков/i);
    expect(blob).toMatch(/AI-сегментаци/i);
    // визуал генерируется по сложности вида
    expect(blob).toMatch(/визуал\S*.*сложност|сложност\S*.*визуал/i);
  });
  it("инвариант: методист авторит → руководитель только УТВЕРЖДАЕТ/ОТКЛОНЯЕТ (не правит сам)", () => {
    const blob = JSON.stringify(methodist);
    expect(blob).toMatch(/методист\s+авторит|готовит\s+метод/i);
    expect(blob).toMatch(/утвержда\S*\s*\/?\s*отклоня|подтвержда\S*.*(не правит|gate)/i);
    expect(blob).toMatch(/не правит/i);
  });
  it("⚠ расхождение: авторинг переходит от куратора франшиз к методисту + конфликт с RBAC v1.4 → canon-proposal", () => {
    const blob = JSON.stringify(methodist);
    expect(blob).toMatch(/куратор\S*\s+франшиз/i);
    expect(blob).toMatch(/CONV-RBAC-DNM-001 v1\.4/);
    expect(blob).toMatch(/canon-proposal/i);
  });
  it("домен методконтента Бизнес-академии (курс куратора, 100 вопросов о дисциплине)", () => {
    const blob = JSON.stringify(methodist);
    expect(blob).toMatch(/Бизнес-академи/i);
    expect(blob).toMatch(/100 вопрос\S* о дисциплине/i);
  });
  it("дополнено из дока: рубрика значков (merit/gift), мультиязычность ru/en/de, сертификат 13→14, качество (доходимость)", () => {
    const blob = JSON.stringify(methodist);
    expect(blob).toMatch(/рубрик\S*\s+значк|каталог значков/i);
    expect(blob).toMatch(/merit\s*\/?\s*gift|merit.*gift/i);
    expect(blob).toMatch(/ru\/en\/de/i);
    expect(blob).toMatch(/13→14|13-14|стал взрослым/i);
    expect(blob).toMatch(/доходимост/i);
  });
  it("границы (док §16): подчиняется куратору франшиз; НЕ преподаёт; единая программа (школы не редактируют)", () => {
    const blob = JSON.stringify(methodist);
    expect(blob).toMatch(/подчиня\S*.*куратор\S*\s+франшиз|непосредственн\S*\s+руководител/i);
    expect(blob).toMatch(/не преподаёт/i);
    expect(blob).toMatch(/единая программа|школы.*не редактир/i);
  });
  it("ключевые связи: lead/curator/franchise-curator/senior-curator/child резолвятся", () => {
    const targets = methodist.crossLinks.map((l) => l.toCabinet);
    for (const t of ["lead", "curator", "franchise-curator", "senior-curator", "child"]) {
      expect(targets, t).toContain(t);
    }
    for (const l of methodist.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("связь на lead = gate подтверждения (both); КФ = непосредственный руководитель + авторинг выделен (both)", () => {
    const lead = methodist.crossLinks.find((l) => l.toCabinet === "lead");
    expect(lead?.direction).toBe("both");
    expect(lead?.label).toMatch(/подтвержда\S*|утвержда\S*|gate/i);
    const kf = methodist.crossLinks.find((l) => l.toCabinet === "franchise-curator");
    expect(kf?.direction).toBe("both");
    expect(kf?.label).toMatch(/непосредственн\S*\s+руководител|авторинг\s+выделен|право/i);
  });
  it("модули (≥10): виды/утверждение/методсопровождение/геймификация/мультиязык/сертификаты/версии/качество", () => {
    expect(methodist.modules.length).toBeGreaterThanOrEqual(10);
    const slugs = methodist.modules.map((m) => m.slug);
    for (const s of ["lesson-type-constructor", "approval-cycle", "methodics-support", "gamification-methodology", "multilang-content", "certificate-templates", "versioning-publication", "program-quality"]) {
      expect(slugs, s).toContain(s);
    }
    for (const m of methodist.modules) expect(m.status).toBe("planned");
  });
  it("обезличено (без имён, «контент основателя») и без доли роялти 50%", () => {
    const blob = JSON.stringify(methodist);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b|Маржан|Динар|Андре[йя]/i);
    expect(blob).not.toMatch(/50\s*%/);
  });
});
