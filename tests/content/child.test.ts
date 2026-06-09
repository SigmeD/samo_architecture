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
  it("посещение: раннее предупреждение, tiered, наставник, мягкий возврат, без автозаморозки", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/раннее предупреждение/i);
    expect(blob).toMatch(/наставник посещаемости|success mentor/i);
    expect(blob).toMatch(/без автоматической приостановки/i);
    expect(blob).not.toMatch(/заморожен/); // гард-инвариант
  });
  it("есть домены «Какие курсы» (бывш. когортный слой), «Удержание», «Блог»; всего 17 доменов", () => {
    const titles = child.domains.map((d) => d.title);
    expect(titles.some((t) => /Какие курсы/.test(t))).toBe(true);
    expect(titles.some((t) => /Удержание/.test(t))).toBe(true);
    expect(titles.some((t) => /📝 Блог/.test(t))).toBe(true);
    expect(child.domains).toHaveLength(17);
  });
  it("C1: термин «Когортный слой» в заголовках доменов убран (по просьбе заказчика)", () => {
    const titles = child.domains.map((d) => d.title);
    expect(titles.some((t) => /Когортный слой/.test(t))).toBe(false);
  });
  it("C1: виды уроков — у урока есть ВИД со своим визуалом, сложность считывается визуально", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/вид[аы]? урок|у урока.*вид|ВИД/);
    expect(blob).toMatch(/сложност/i);
    expect(blob).toMatch(/визуал/i);
  });
  it("C1: «эффект гонки» — на любое действие сразу значок/балл", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/эффект гонки/i);
    expect(blob).toMatch(/на любое действие/i);
  });
  it("C1: усреднение позиции рейтинга — «вы 5-й» без раскрытия числа таких же", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/усреднени|вы 5-й|не раскрыва/i);
  });
  it("C1: переход 13→14 — сертификат «взрослого», разблокировка взрослого курса, родитель видит", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/стал взрослым|сертификат.*взросл/i);
    expect(blob).toMatch(/разблокировк.*взросл/i);
    expect(blob).toMatch(/родитель видит/i);
  });
  it("C1: мультиязычность ИИ-аватара ru/en/de (не путать с языком обучения)", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/мультиязычн/i);
    expect(blob).toMatch(/ru\/en\/de/i);
  });
  it("C1: за действия в СУ начисляются баллы/солары", () => {
    const su = child.domains.find((d) => /систем[аыу] успеха/i.test(d.title))!;
    expect(JSON.stringify(su.items)).toMatch(/балл|солар/i);
  });
  it("когортная подача на Главной; чат одноклассников; ритуал 13→14 в профиле", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/чат между одноклассниками|общени.*одногруппник/i);
    expect(blob).toMatch(/Профиль основателя/i);
    expect(blob).toMatch(/переход.*13.*14|Герой.*Профиль предпринимател/i);
  });
  it("ДЗ-с-родителем (младшие) + чаты родитель/куратор/админ(SENIOR)", () => {
    const blob = JSON.stringify(child);
    expect(blob).toMatch(/вместе с родителем|ДЗ.*с родителем/i);
    expect(blob).toMatch(/уведомлен\S*\s+родител/i);
    expect(blob).toMatch(/чат с куратором/i);
    expect(blob).toMatch(/чат с администратором школы/i);
    expect(blob).toMatch(/SENIOR/);
  });
  it("нет меток New в кабинете ученика", () => {
    const anyNew = child.coreProcess.steps.some(s=>s.isNew)||child.domains.some(d=>d.isNew)||child.crossLinks.some(l=>l.isNew)||child.modules.some(m=>m.isNew);
    expect(anyNew).toBe(false);
  });
});
