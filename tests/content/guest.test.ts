import { describe, it, expect } from "vitest";
import { guest } from "@/content/cabinets/guest";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет гостя (guest) — 08.06, последний из 12", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(guest)).not.toThrow();
  });
  it("зона green, planned, не стаб, роль cr-gost-dnm", () => {
    expect(guest.zone).toBe("green");
    expect(guest.implStatus).toBe("planned");
    expect(guest.isStub).toBeFalsy();
    expect(guest.role.code).toBe("cr-gost-dnm");
  });
  it("ядро — онбординг от знакомства до зачисления (6 шагов)", () => {
    expect(guest.coreProcess.title).toMatch(/онбординг/i);
    expect(guest.coreProcess.steps).toHaveLength(6);
  });
  it("инвариант: гость = состояние до авторизации, НЕ роль RBAC, не строка матрицы v1.4", () => {
    const blob = JSON.stringify(guest);
    expect(blob).toMatch(/пред-авторизационн\S* состояни|состояни\S* до (авторизации|регистрации)/i);
    expect(blob).toMatch(/не роль RBAC|не строк\S* RBAC/i);
    expect(blob).toMatch(/изолированн\S* роль|ADR-003/i);
  });
  it("ПОПРАВКА к постеру: пробное проводит КУРАТОР (не менеджер)", () => {
    const blob = JSON.stringify(guest);
    expect(blob).toMatch(/пробн\S*\s+(урок\s+)?проводит куратор/i);
    expect(blob).toMatch(/поправк\S* к постеру/i);
  });
  it("ГРАНИЦА: договор/оплату/рассрочку/зачисление ведёт администратор + финансы; бухгалтер подтверждает payment.confirmed", () => {
    const blob = JSON.stringify(guest);
    expect(blob).toMatch(/администратор\S* школы/i);
    expect(blob).toMatch(/бухгалтер/i);
    expect(blob).toMatch(/payment\.confirmed/i);
  });
  it("ПОПРАВКА: вход — телефон + код (канон); email/Google — это «как сейчас» в коде", () => {
    const blob = JSON.stringify(guest);
    expect(blob).toMatch(/телефон\S*\s*\+?\s*код|номер\S* телефона/i);
    expect(blob).toMatch(/email\/Google/i);
    expect(blob).toMatch(/как сейчас/i);
  });
  it("инвариант: реф-регистрация ребёнка — право ТОЛЬКО родителя (у гостя и ученика нет)", () => {
    const blob = JSON.stringify(guest);
    expect(blob).toMatch(/реф-регистрац\S* ребёнка/i);
    expect(blob).toMatch(/только\s+родител|право\s+(только\s+)?родител/i);
  });
  it("инвариант: срок гостевого аккаунта 7 дней; конвертация cr-gost-dnm → cr4-rebenok-dnm", () => {
    const blob = JSON.stringify(guest);
    expect(blob).toMatch(/7\s*дн/i);
    expect(blob).toMatch(/cr-gost-dnm\s*[→-]+\s*cr4-rebenok-dnm/i);
  });
  it("менеджер может проводить пробное (роль куратора); нет меток New", () => {
    const blob = JSON.stringify(guest);
    expect(blob).toMatch(/менеджер.*провод\S*\s+пробн|роль\S*\s+куратора/i);
    const anyNew = guest.domains.some(d=>d.isNew)||guest.crossLinks.some(l=>l.isNew)||guest.coreProcess.steps.some(s=>s.isNew)||guest.modules.some(m=>m.isNew);
    expect(anyNew).toBe(false);
  });
  it("ключевые связи: sales/curator/parent/child/school-admin/finance/marketer резолвятся", () => {
    const targets = guest.crossLinks.map((l) => l.toCabinet);
    for (const t of ["sales", "curator", "parent", "child", "school-admin", "finance", "marketer"]) {
      expect(targets, t).toContain(t);
    }
    for (const l of guest.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("обезличено и без доли роялти 50%", () => {
    const blob = JSON.stringify(guest);
    expect(blob).not.toMatch(/Д[оа]влат|Айгерим|Анастас|Сережан|\bПавел\b|Маржан/i);
    expect(blob).not.toMatch(/50\s*%/);
  });
});
