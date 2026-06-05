import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.02 } },
  webServer: {
    command: "npm run build && npx serve out -l 4321",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: { baseURL: "http://localhost:4321", viewport: { width: 1660, height: 1200 } },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
