import { test, expect } from "@playwright/test";

test("обзорный постер рендерится и ведёт в кабинет куратора", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Архитектура модуля/ })).toBeVisible();
  await page.getByRole("link", { name: /Куратор ДНМ/ }).click();
  await expect(page).toHaveURL(/\/cabinet\/curator/);
  await expect(page.getByRole("heading", { name: /Куратор ДНМ/ })).toBeVisible();
});

test("кабинет куратора: процедура урока, без '7 этапов' и '0–100%'", async ({ page }) => {
  await page.goto("/cabinet/curator/");
  await expect(page.getByText(/Процедура проведения онлайн-урока/)).toBeVisible();
  await expect(page.locator("body")).not.toContainText("7 этап");
  await expect(page.locator("body")).not.toContainText("0–100%");
  await expect(page.getByText(/расхождение с каноном/).first()).toBeVisible();
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
