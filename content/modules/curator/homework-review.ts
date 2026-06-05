import type { ModuleSpec } from "@/content/types";

export const homeworkReview: ModuleSpec = {
  slug: "homework-review", cabinetSlug: "curator", title: "Проверка домашнего задания",
  status: "partial",
  summary: "Очередь → карточка → решение «принято/на доработку» (без баллов) → ОС «Бутерброд».",
  note: "Остаточное поле grade(1..5) в review-homework.dto.ts противоречит отмене баллов (ДЕТИ-7 от 21.04.2026) — deprecated.",
  purpose: "Куратор проверяет ДЗ группы: безоценочная конкретная обратная связь, решение принять или отправить на доработку.",
  process: {
    title: "Цикл проверки ДЗ",
    steps: [
      { n: 1, title: "Очередь", desc: "Список ДЗ по группам с фильтрами: ожидают / на доработке / приняты, с периодами.", source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
      { n: 2, title: "Просмотр работы", desc: "Текст/файл/фото; видны затруднения ученика. Статусы PENDING → SUBMITTED → IN_REVIEW.", source: "SPEC-M3-DNM-001 v2.0" },
      { n: 3, title: "Обратная связь («Бутерброд»)", desc: "Позитив → зона роста → поддержка; аргументы и цитаты ученика/автора курса. Без оценочного суждения.", source: "REG-DNM-CURATOR-001 v1.0" },
      { n: 4, title: "Решение", desc: "«Принять» (ACCEPTED) или «На доработку» (REVISION) — комментарий обязателен. Баллов нет.", source: "SPEC-DNM-TZ-001 v3.2 §4.4" },
      { n: 5, title: "Начисление соларов", desc: "При принятии — ручное начисление соларов за субъективную работу (10–max по категории).", source: "REG-DNM-SOLARS-001 v1.0", gamification: "10–max соларов" },
    ],
  },
  crossLinks: [{ toCabinet: "child", label: "ДЗ сдаёт ученик; результат и солары — ему", direction: "both" }],
  sources: [{ id: "SPEC-DNM-TZ-001", version: "3.2", section: "4.4" }, { id: "SPEC-M3-DNM-001", version: "2.0" }, { id: "REG-DNM-CURATOR-001", version: "1.0" }, { id: "REG-DNM-SOLARS-001", version: "1.0" }],
};
