import { describe, it, expect } from "vitest";
import { franchise } from "@/content/cabinets/franchise";
import { CabinetSchema } from "@/content/schema";
import { getCabinet } from "@/content/cabinets";

describe("кабинет франчайзи-партнёра (franchise)", () => {
  it("валиден по CabinetSchema", () => {
    expect(() => CabinetSchema.parse(franchise)).not.toThrow();
  });
  it("зона purple, planned, не стаб", () => {
    expect(franchise.zone).toBe("purple");
    expect(franchise.implStatus).toBe("planned");
    expect(franchise.isStub).toBeFalsy();
  });
  it("C4: роль расцеплена — title «Франчайзи-партнёр» (собственник), не конфлейтит директора; code сохранён", () => {
    expect(franchise.role.code).toBe("pr2-franchayzi-dnm");
    expect(franchise.role.title).toBe("Франчайзи-партнёр");
    expect(franchise.role.title).not.toMatch(/директор/i);
    const blob = JSON.stringify(franchise);
    // идентичность собственника + операционка у директора школы (отдельный кабинет)
    expect(blob).toMatch(/собственник/i);
    expect(blob).toMatch(/op-direktor-shkoly-dnm|директор школы/i);
    expect(franchise.crossLinks.some((l) => l.toCabinet === "director")).toBe(true);
  });
  it("ядро — цикл управления сетью (6 шагов)", () => {
    expect(franchise.coreProcess.title).toMatch(/сет|управлени/i);
    expect(franchise.coreProcess.steps).toHaveLength(6);
  });
  it("центр кабинета — деньги и планирование (роялти 20%, «от цели к плану»)", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).toMatch(/20%/);
    expect(blob).toMatch(/от цели к плану/i);
    expect(blob).toMatch(/роялти/i);
  });
  it("инвариант владельца: доля распределения роялти (50%) и имена НЕ показываются", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).not.toMatch(/50%/);
    expect(blob).not.toMatch(/Д[оа]влат/);
  });
  it("инвариант: scope своей сети + финансы ГО read-only", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).toMatch(/franchiseeId|своя сеть|свою сеть|своей сети/i);
    expect(blob).toMatch(/read-only|read only/i);
  });
  it("инвариант: не дублирует операционку администратора (делегировано)", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).toMatch(/делегир|зам.*по операционке|операционн/i);
  });
  it("все связи резолвятся в реестре", () => {
    for (const l of franchise.crossLinks) expect(getCabinet(l.toCabinet), l.toCabinet).toBeDefined();
  });
  it("crossLinks приведены к вертикали ±1 уровень (09.06)", () => {
    const map = Object.fromEntries(franchise.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(map).toEqual({
      "franchise-curator": "both",
      director: "both",
      finance: "both",
      parent: "both",
    });
  });
  it("удалены связи вне вертикали (curator/senior-curator/marketer/sales/lead)", () => {
    const targets = franchise.crossLinks.map((l) => l.toCabinet);
    for (const gone of ["curator", "senior-curator", "marketer", "sales", "lead"])
      expect(targets).not.toContain(gone);
  });
  it("онбординг новичка + шкала развития L0–L5 (закрытие «Пути франчайзи-партнёра»)", () => {
    const blob = JSON.stringify(franchise);
    expect(blob).toMatch(/L0/);
    expect(blob).toMatch(/L5/);
    expect(blob).toMatch(/шкал\S* развития/i);
    expect(blob).toMatch(/онбординг/i);
    expect(blob).toMatch(/прогрессивн\S* разблокировк|нанял.*открыл/i);
  });
  it("новые домены онбординга/уровней присутствуют (4 шт)", () => {
    const titles = franchise.domains.map((d) => d.title);
    expect(titles.some((t) => /шкала развития.*L0.*L5/i.test(t))).toBe(true);
    expect(titles.some((t) => /прогрессивн\S* разблокировк/i.test(t))).toBe(true);
    expect(titles.some((t) => /провижининг|выдача доступов/i.test(t))).toBe(true);
    expect(titles.some((t) => /дашборд эффективности/i.test(t))).toBe(true);
  });
  it("новые модули онбординга/уровней присутствуют (5 шт, planned)", () => {
    const bySlug = Object.fromEntries(franchise.modules.map((m) => [m.slug, m]));
    for (const slug of ["onboarding-tracker", "development-levels", "role-based-unlocks", "staff-provisioning", "efficiency-recommendations"]) {
      expect(bySlug[slug], slug).toBeDefined();
      expect(bySlug[slug]!.status).toBe("planned");
    }
  });
});
