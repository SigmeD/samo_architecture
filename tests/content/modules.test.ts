import { describe, it, expect } from "vitest";
import { validateModule } from "@/content/schema";
import { lessonJournal } from "@/content/modules/curator/lesson-journal";
import { homeworkReview } from "@/content/modules/curator/homework-review";

describe("curator modules", () => {
  it("оба модуля валидны", () => {
    expect(() => validateModule(lessonJournal)).not.toThrow();
    expect(() => validateModule(homeworkReview)).not.toThrow();
  });
  it("homework-review без баллов", () => {
    const blob = JSON.stringify(homeworkReview).toLowerCase();
    expect(blob).not.toContain("0–100%");
    expect(blob).toContain("без баллов");
  });
});
