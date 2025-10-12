import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  paths: ["src/features/*.feature"],
  steps: ["src/steps/*.steps.ts", "src/fixtures/fixtures.ts"],
});

export default defineConfig({
  testDir,
  timeout: 60 * 1000,
  expect: {
    timeout: 15 * 1000, // Increased for mobile stability
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["allure-playwright"],
    ["list"],
    [
      "playwright-ctrf-json-reporter",
      {
        outputFile: "ctrf-report.json",
        outputDir: "ctrf",
        minimal: false,
        testType: "e2e",
      },
    ],
  ],
  use: {
    baseURL: "https://www.saucedemo.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        // Mobile Chrome optimizations for better test stability
        launchOptions: {
          slowMo: 50, // Add slight delay for mobile interactions
        },
      },
    },
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
        // Mobile Safari optimizations for better test stability
        launchOptions: {
          slowMo: 100, // Add slight delay for mobile interactions
        },
      },
    },
  ],

  // No webServer needed - testing external SauceDemo site
});
