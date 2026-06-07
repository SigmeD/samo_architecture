import type { ModuleSpec } from "@/content/types";
import { lessonJournal } from "@/content/modules/curator/lesson-journal";
import { homeworkReview } from "@/content/modules/curator/homework-review";

const MODULES: Record<string, Record<string, ModuleSpec>> = {
  curator: { "lesson-journal": lessonJournal, "homework-review": homeworkReview },
};

export const getModule = (cab: string, mod: string): ModuleSpec | undefined => MODULES[cab]?.[mod];
export const getModuleSlugs = (cab: string): string[] => Object.keys(MODULES[cab] ?? {});
export const getAllModulePairs = (): { cabinetSlug: string; moduleSlug: string }[] =>
  Object.entries(MODULES).flatMap(([cab, mods]) => Object.keys(mods).map((m) => ({ cabinetSlug: cab, moduleSlug: m })));
