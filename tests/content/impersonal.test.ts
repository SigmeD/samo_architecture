import { describe, it, expect } from "vitest";
import { CABINETS } from "@/content/cabinets";
import { overview } from "@/content/overview";
import { lessonJournal } from "@/content/modules/curator/lesson-journal";
import { homeworkReview } from "@/content/modules/curator/homework-review";

/**
 * Обезличивание (правило владельца): атлас полностью обезличен — только роли,
 * никаких персональных имён. Регрессионный сторож для всего контента.
 * Имя пишется в двух вариантах (Д[оа]влат) — ловим оба.
 */
const NAMES = /Д[оа]влат|Айгерим|Анастас|Сережан|Саидмур|\bПавел\b/i;

describe("обезличивание: контент атласа без персональных имён", () => {
  for (const [slug, cabinet] of Object.entries(CABINETS)) {
    it(`кабинет «${slug}» — только роли`, () => {
      expect(JSON.stringify(cabinet)).not.toMatch(NAMES);
    });
  }

  it("L0 overview — только роли", () => {
    expect(JSON.stringify(overview)).not.toMatch(NAMES);
  });

  it("модули куратора (L2) — только роли", () => {
    expect(JSON.stringify(lessonJournal)).not.toMatch(NAMES);
    expect(JSON.stringify(homeworkReview)).not.toMatch(NAMES);
  });
});
