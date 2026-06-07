import { describe, it, expect } from "vitest";
import { getAllCabinetSlugs } from "@/content/cabinets";

it("реестр кабинетов отражает состав по встречам 04–05.06", () => {
  const slugs = getAllCabinetSlugs();
  // подтверждённые встречами кабинеты
  expect(slugs).toContain("curator");
  expect(slugs).toContain("parent"); // полноценный кабинет (встреча 04.06), не раздел ученика
  expect(slugs).toContain("marketer"); // новый кабинет (встреча 05.06): СММ + Таргет
  // «Качество и контроль» — функция администратора, НЕ отдельный кабинет
  expect(slugs).not.toContain("quality");
  expect(slugs.length).toBe(12);
});
