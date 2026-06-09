import { describe, it, expect } from "vitest";
import { child } from "@/content/cabinets/child";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет ученика (child)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(child)).not.toThrow();
  });
  it("зона green (резерв ученика)", () => {
    expect(child.zone).toBe("green");
  });
  it("ядро = учебный цикл, сертификат — последний шаг", () => {
    expect(child.coreProcess.steps.length).toBeGreaterThanOrEqual(5);
    const last = child.coreProcess.steps.at(-1)!;
    expect(last.title).toMatch(/Сертификат/);
  });
  it("инвариант: нет «7 этапов» и шкалы 0–100%", () => {
    const blob = JSON.stringify(child);
    expect(blob).not.toMatch(/7 этап/);
    expect(blob).not.toMatch(/0[–-]100%/);
  });
  it("ДЗ без баллов: статус «принято/на доработку»", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/принято/);
    expect(blob).toMatch(/доработк/);
    expect(blob).toMatch(/без баллов/);
  });
  it("СУ и Бизнес-проект — два отдельных блока", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/систем[аыу] успеха/i);
    expect(blob).toMatch(/Бизнес-проект/);
    expect(blob).toMatch(/два самостоятельных блока/);
  });
  it("слово «заморожен» не используется в UI-формулировках", () => {
    expect(JSON.stringify(child)).not.toMatch(/заморожен/);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of child.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("Эссе и Бизнес-проект — отдельные домены; БП только SENIOR", () => {
    const titles = child.domains.map((d) => d.title);
    expect(titles.some((t) => /^✍️ Эссе$/.test(t) || /✍️ Эссе/.test(t))).toBe(true);
    expect(titles.some((t) => /💼 Бизнес-проект/.test(t))).toBe(true);
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/только.*SENIOR|SENIOR.*кульминаци/i);
    expect(blob).toMatch(/два самостоятельных блока/); // инвариант сохранён
  });
  it("в sources[] есть SPEC-DNM-RATING-001", () => {
    expect(child.sources.some((s) => s.id === "SPEC-DNM-RATING-001")).toBe(true);
  });
  it("солары: разрез merit/gift; merit сверх 1190; трата не снижает рейтинг", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/merit/i);
    expect(blob).toMatch(/gift|подароч/i);
    expect(blob).toMatch(/1190/);
    expect(blob).toMatch(/сверх|выше/i);
    expect(blob).toMatch(/в рейтинг не идут|только в баланс/i);
  });
  it("рейтинг: Версия A; 3 среза × когорта JUNIOR/SENIOR×семестр; тиры/перцентиль; анонимизация", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/merit-солар/i);            // состав = Версия A с merit
    expect(blob).toMatch(/тир/i);
    expect(blob).toMatch(/перцентил/i);
    expect(blob).toMatch(/когорт/i);
    expect(blob).toMatch(/анонимизир/i);
    expect(blob).toMatch(/группа.*школа.*сет|3 среза|три среза/i);
  });
});
