import { test, expect } from "@playwright/test";

test("обзорный постер L0: секции, кабинеты, переход в куратора", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Архитектура модуля/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Роли и кабинеты" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Ключевые процессы" })).toBeVisible();
  // состав по встречам 04–05.06: родитель — кабинет, маркетолог добавлен, «Качество» — не кабинет
  await expect(page.getByText("Кабинет родителя")).toBeVisible();
  await expect(page.getByText("Маркетолог (СММ + Таргет)")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("7 этап");
  await expect(page.locator("body")).not.toContainText("Качество и контроль");
  await page.getByRole("link", { name: /Кабинет куратора/ }).click();
  await expect(page).toHaveURL(/\/cabinet\/curator/);
});

test("L0: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("overview-l0.png", { fullPage: true });
});

test("кабинет куратора: процедура урока, без '7 этапов' и '0–100%'", async ({ page }) => {
  await page.goto("/cabinet/curator/");
  await expect(page.getByText(/Процедура проведения онлайн-урока/).first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("7 этап");
  await expect(page.locator("body")).not.toContainText("0–100%");
  await expect(page.getByText(/расхождение с каноном/).first()).toBeVisible();
});

test("кабинет ученика: постер-рендер, зелёная зона, инварианты канона", async ({ page }) => {
  await page.goto("/cabinet/child/");
  await expect(page.getByRole("heading", { level: 1, name: /Ученик ДНМ/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("7 этап");
  await expect(page.locator("body")).not.toContainText("0–100%");
  await expect(page.locator("body")).not.toContainText("заморожен");
  // связь в кабинет родителя кликабельна
  await page.getByRole("link", { name: /Родитель/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/parent/);
});

test("кабинет ученика: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/child/");
  await expect(page).toHaveScreenshot("cabinet-child.png", { fullPage: true });
});

test("кабинет родителя: постер-рендер, синяя зона, инварианты", async ({ page }) => {
  await page.goto("/cabinet/parent/");
  await expect(page.getByRole("heading", { level: 1, name: /Родитель ДНМ/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("заморожен");
  await expect(page.locator("body")).not.toContainText("0–100%");
  // связь в кабинет ребёнка кликабельна
  await page.getByRole("link", { name: /Ученик ДНМ/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/child/);
});

test("кабинет родителя: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/parent/");
  await expect(page).toHaveScreenshot("cabinet-parent.png", { fullPage: true });
});

test("кабинет финансиста: постер-рендер, gold-зона, инварианты", async ({ page }) => {
  await page.goto("/cabinet/finance/");
  await expect(page.getByRole("heading", { level: 1, name: /Бухгалтер ДНМ/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  await expect(page.getByText(/Роялти/).first()).toBeVisible();
  // указание владельца: доли распределения роялти (50%) нет на странице
  await expect(page.locator("body")).not.toContainText("50%");
  await page.getByRole("link", { name: /Франчайзи/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/franchise/);
});

test("кабинет финансиста: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/finance/");
  await expect(page).toHaveScreenshot("cabinet-finance.png", { fullPage: true });
});

test("drilldown модулей доступен", async ({ page }) => {
  await page.goto("/cabinet/curator/");
  await page.getByRole("link", { name: /Журнал урока/ }).click();
  await expect(page).toHaveURL(/module\/lesson-journal/);
  await page.goto("/cabinet/curator/");
  await page.getByRole("link", { name: /Проверка ДЗ/ }).click();
  await expect(page).toHaveURL(/module\/homework-review/);
});

test("визуальный снимок кабинета куратора (baseline)", async ({ page }) => {
  await page.goto("/cabinet/curator/");
  await expect(page).toHaveScreenshot("cabinet-curator.png", { fullPage: true });
});

test("кабинет куратора франшиз: постер-рендер, purple-зона, обезличено, доступы к ЛК", async ({ page }) => {
  await page.goto("/cabinet/franchise-curator/");
  await expect(page.getByRole("heading", { level: 1, name: /Куратор франшиз/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  // обезличено: никаких персональных имён и доли роялти
  await expect(page.locator("body")).not.toContainText(/Д[оа]влат/);
  await expect(page.locator("body")).not.toContainText("50%");
  // ключевые требования владельца: доступы к ЛК партнёров + рейтинг по числу учеников
  await expect(page.getByText(/доступами к ЛК франчайзи-партнёров/).first()).toBeVisible();
  await expect(page.getByText(/по числу учеников/).first()).toBeVisible();
  // связь во франчайзи кликабельна
  await page.getByRole("link", { name: /Франчайзи/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/franchise/);
});

test("кабинет куратора франшиз: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/franchise-curator/");
  await expect(page).toHaveScreenshot("cabinet-franchise-curator.png", { fullPage: true });
});

test("кабинет франчайзи/директора: постер-рендер, purple-зона, финансы+планирование, обезличено", async ({ page }) => {
  await page.goto("/cabinet/franchise/");
  await expect(page.getByRole("heading", { level: 1, name: /Франчайзи \/ директор/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  // центр кабинета — финансы и планирование
  await expect(page.getByText(/Финансы и роялти/).first()).toBeVisible();
  await expect(page.getByText(/от цели к плану/).first()).toBeVisible();
  // инварианты владельца: доля распределения роялти (50%) и имена не отображаются
  await expect(page.locator("body")).not.toContainText("50%");
  await expect(page.locator("body")).not.toContainText(/Д[оа]влат/);
  // связь в финансы (бухгалтер) кликабельна
  await page.getByRole("link", { name: /Бухгалтер/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/finance/);
});

test("кабинет франчайзи/директора: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/franchise/");
  await expect(page).toHaveScreenshot("cabinet-franchise.png", { fullPage: true });
});

test("кабинет администратора школы: постер-рендер, orange-зона, граница финансов, обезличено", async ({ page }) => {
  await page.goto("/cabinet/school-admin/");
  await expect(page.getByRole("heading", { level: 1, name: /Администратор школы/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  // ядро — зачисление-мастер; граница финансов; обезличено
  await expect(page.getByText(/Зачисление ученика/).first()).toBeVisible();
  await expect(page.getByText(/только владельцу и бухгалтеру/).first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("50%");
  await expect(page.locator("body")).not.toContainText(/Д[оа]влат/);
  // связь в родителя кликабельна
  await page.getByRole("link", { name: /Родитель/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/parent/);
});

test("кабинет администратора школы: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/school-admin/");
  await expect(page).toHaveScreenshot("cabinet-school-admin.png", { fullPage: true });
});

test("кабинет старшего куратора: постер-рендер, blue-зона, двойная роль, обезличено", async ({ page }) => {
  await page.goto("/cabinet/senior-curator/");
  await expect(page.getByRole("heading", { level: 1, name: /Старший куратор/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Домены и функции" })).toBeVisible();
  // двойная роль «играющий тренер»: преподаёт сам + разделение контроль/коучинг
  await expect(page.getByText(/Моё преподавание/).first()).toBeVisible();
  await expect(page.getByText(/снять шляпу оценщика/).first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("50%");
  await expect(page.locator("body")).not.toContainText(/Д[оа]влат/);
  // связь в родителя кликабельна
  await page.getByRole("link", { name: /Родитель/ }).first().click();
  await expect(page).toHaveURL(/\/cabinet\/parent/);
});

test("кабинет старшего куратора: визуальный снимок (baseline)", async ({ page }) => {
  await page.goto("/cabinet/senior-curator/");
  await expect(page).toHaveScreenshot("cabinet-senior-curator.png", { fullPage: true });
});
