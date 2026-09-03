import { defineConfig, devices } from "@playwright/test";

const projects = process.env.CI
  ? [
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },
    ]
  : [
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },
      // {
      //   name: "firefox",
      //   use: { ...devices["Desktop Firefox"] },
      // },
      // {
      //   name: "webkit",
      //   use: { ...devices["Desktop Safari"] },
      // },
    ];

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    locale: "en-US",
    trace: "on-first-retry",
  },

  projects,

  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      E2E_TEST: "true",
    },
  },
});
