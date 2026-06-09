import { describe, it, expect } from "vitest";
import { validateCabinet } from "@/content/schema";
import { curator } from "@/content/cabinets/curator";

describe("curator cabinet content", () => {
  it("проходит Zod-валидацию", () => { expect(() => validateCabinet(curator)).not.toThrow(); });
  it("зона = синяя (D2), не зелёная", () => { expect(curator.zone).toBe("blue"); });
  it("ядро-процесс — процедура урока, НЕ '7 этапов'", () => {
    expect(curator.coreProcess.steps).toHaveLength(3);
    const blob = JSON.stringify(curator).toLowerCase();
    expect(blob).not.toContain("7 этап");
    expect(blob).not.toContain("0–100%");
    expect(blob).not.toContain("0-100%");
  });
  it("lesson-journal и curator-rating помечены divergent", () => {
    const bySlug = Object.fromEntries(curator.modules.map((m) => [m.slug, m.status]));
    expect(bySlug["lesson-journal"]).toBe("divergent");
    expect(bySlug["curator-rating"]).toBe("divergent");
  });
  it("15 доменов, 4 связи (вертикаль ±1 уровень), 14 модулей", () => {
    expect(curator.domains).toHaveLength(15);
    expect(curator.crossLinks).toHaveLength(4);
    expect(curator.modules).toHaveLength(14);
  });

  // Вертикаль 09.06: связи только ±1 уровень + функциональный хендофф sales
  it("crossLinks РОВНО senior-curator/child/parent/sales — все both; убраны lead/franchise/school-admin/finance", () => {
    const byTo = Object.fromEntries(curator.crossLinks.map((l) => [l.toCabinet, l.direction]));
    expect(Object.keys(byTo).sort()).toEqual(["child", "parent", "sales", "senior-curator"]);
    expect(byTo["senior-curator"]).toBe("both");
    expect(byTo["child"]).toBe("both");
    expect(byTo["parent"]).toBe("both");
    expect(byTo["sales"]).toBe("both");
    for (const removed of ["lead", "franchise", "school-admin", "finance"]) {
      expect(byTo[removed], `связь ${removed} должна быть удалена`).toBeUndefined();
    }
  });

  // Контент-фикс 09.06: статусы ДЗ по-русски, англ.-коды убраны
  it("ДЗ-статусы по-русски; нет англ.-кодов PENDING/SUBMITTED/IN_REVIEW/ACCEPTED/REVISION", () => {
    const blob = JSON.stringify(curator);
    expect(blob).toMatch(/ожидает сдачи → сдано → на проверке → принято \/ на доработку/u);
    for (const code of ["PENDING", "SUBMITTED", "IN_REVIEW", "ACCEPTED", "REVISION"]) {
      expect(blob, `англ.-код ${code} должен быть убран`).not.toContain(code);
    }
  });

  // Контент-фикс 09.06: куратор выдаёт значки И начисляет соляры
  it("куратор выдаёт значки (медальки) И начисляет соляры ученику по рубрике методиста", () => {
    const blob = JSON.stringify(curator).toLowerCase();
    expect(blob).toMatch(/значк/);
    expect(blob).toMatch(/медальк/);
    expect(blob).toMatch(/нажал на значок/);
    expect(blob).toMatch(/соляр[а-яё]* начисляются|начисляет соляр/u);
  });

  // C3 (08.06): аддитивные правки логики урока и посещаемости
  it("C3: «отметить участников» — критичный шаг + тиринг (пуш → звонок администратора, не куратора)", () => {
    const blob = JSON.stringify(curator).toLowerCase();
    expect(blob).toMatch(/отмет[а-яё]* участник/u);
    expect(blob).toMatch(/пуш родител/);
    // повторное непосещение → звонок именно администратора
    expect(blob).toMatch(/звонок администратор/);
  });
  it("C3: видна 11-шаговая последовательность урока (детализация, не замена 3 фаз)", () => {
    // 3 фазы-инвариант не сломан
    expect(curator.coreProcess.steps).toHaveLength(3);
    // 11-шаговый порядок виден как loop-контур
    expect(curator.coreProcess.loop).toBeDefined();
    expect(curator.coreProcess.loop).toHaveLength(11);
    const loopBlob = (curator.coreProcess.loop ?? []).join(" | ").toLowerCase();
    expect(loopBlob).toMatch(/отмет[а-яё]* участник/u);
    expect(loopBlob).toMatch(/подтвержд[а-яё]* посещаемост/u);
  });
  it("C3: видеофиксация посещаемости — 3–4 снимка с камеры, сверка с отметкой", () => {
    const blob = JSON.stringify(curator).toLowerCase();
    expect(blob).toMatch(/видеофиксаци/);
    expect(blob).toMatch(/3[–\-]4 снимк/);
  });
  it("C3: обучение куратора — через сквозную Бизнес-академию (кабинет тренера отдельно НЕ делается)", () => {
    const blob = JSON.stringify(curator).toLowerCase();
    expect(blob).toMatch(/сквозн[а-яё]* бизнес-академи/u);
    expect(blob).toMatch(/кабинет тренера/);
  });
});
