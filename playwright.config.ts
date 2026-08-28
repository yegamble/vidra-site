import { defineConfig, devices } from "@playwright/test";

/**
 * The responsive/a11y gate. It runs against a production build — `npm run ci`
 * chains `build` before `test:e2e`, and GitHub Actions runs that same chain, so
 * a green check here means the same thing it means locally.
 *
 * Chromium only, on purpose: these are layout, landmark and hit-target
 * assertions, not rendering-engine comparisons, and one browser keeps the
 * suite under a couple of minutes. Viewports are parameterised inside the
 * specs rather than split into projects, so one route's failure names the
 * width it failed at instead of a project name.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
