# 🎭 Playwright E2E Testing Suite

A comprehensive end-to-end testing suite for the SauceDemo web application using Playwright with BDD (Behavior-Driven Development) approach powered by Cucumber.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Project Structure](#️-project-structure)
- [🛠️ Prerequisites](#️-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [🧪 Running Tests](#-running-tests)
- [📝 BDD Feature Development](#-bdd-feature-development)
- [📊 Test Reporting](#-test-reporting)
- [🔧 Configuration](#-configuration)
- [🚀 GitHub Actions CI/CD](#-github-actions-cicd)
- [🌐 Multi-Browser Testing](#-multi-browser-testing)
- [📱 Mobile Testing](#-mobile-testing)
- [🐛 Debugging](#-debugging)
- [🤝 Contributing](#-contributing)

## 🎯 Overview

This project provides comprehensive test automation for the SauceDemo e-commerce application using:

- **Playwright** - Modern web automation framework
- **TypeScript** - Type-safe development
- **BDD/Cucumber** - Human-readable test scenarios
- **Page Object Model** - Maintainable test architecture
- **Allure Reports** - Rich test reporting
- **GitHub Actions** - Automated CI/CD pipeline

### ✅ Test Coverage

- **Authentication & Login** - User login validation across different user types
- **Cart Management** - Add, remove, and manage shopping cart operations
- **Purchase Flow** - Complete end-to-end purchase scenarios
- **Cross-Browser Testing** - Chromium, Firefox, WebKit
- **Mobile Testing** - Mobile Chrome & Safari
- **Performance Testing** - Performance glitch user scenarios
- **Visual Testing** - UI consistency validation

## 🏗️ Project Structure

```
playwright-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD pipeline
├── src/
│   ├── features/                  # BDD Feature files (Gherkin)
│   │   ├── login.feature
│   │   ├── cart-management.feature
│   │   └── purchase-flow.feature
│   ├── steps/                     # Step definitions (TypeScript)
│   │   ├── login.steps.ts
│   │   ├── inventory.steps.ts
│   │   ├── cart.steps.ts
│   │   ├── checkout.steps.ts
│   │   ├── purchase-flow.steps.ts
│   │   └── index.ts
│   ├── pages/                     # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── fixtures/                  # Test fixtures and data
│   │   ├── fixtures.ts
│   │   └── TestData.ts
│   └── utils/                     # Utility functions
│       └── TestUtils.ts
├── .features-gen/                 # Auto-generated BDD test files
├── allure-results/                # Allure test results
├── allure-report/                 # Generated Allure reports
├── playwright-report/             # HTML test reports
├── test-results/                  # Test execution results
├── playwright.config.ts           # Main Playwright configuration
├── playwright.basic.config.ts     # Basic configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd playwright-tests
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install --with-deps
```

### 4. Set Required Environment Variables

```bash
# Set the required password environment variable
export SAUCE_PASSWORD with valid value
# Or add to .env file
echo "SAUCE_PASSWORD="<>" >> .env
```

### 5. Generate BDD Test Files

```bash
npm run bdd:generate
```

### 6. Run Tests

```bash
npm test
```

## 🧪 Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### Browser-Specific Tests

```bash
# Run tests on specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile
```

### Tag-Based Test Execution

```bash
# Run smoke tests only
npx playwright test --grep="@smoke"

# Run specific feature tests
npx playwright test --grep="@purchase"
npx playwright test --grep="@login"
npx playwright test --grep="@cart"

# Run boundary validation tests
npx playwright test --grep="@boundary"

# Run performance tests
npx playwright test --grep="@performance"
```

### Environment-Specific Testing

```bash
# Run tests against different environments
BASE_URL=https://staging.saucedemo.com npm test
BASE_URL=https://dev.saucedemo.com npm test
```

## 📝 BDD Feature Development

### Creating New Features

1. **Create Feature File** in `src/features/`

```gherkin
# src/features/new-feature.feature
@smoke
Feature: New Feature
  As a user
  I want to perform some action
  So that I can achieve some goal

  Background:
    Given I am on the SauceDemo login page
    And the login page is properly loaded

  Scenario: New scenario
    When I perform some action
    Then I should see expected result
```

2. **Create Step Definitions** in `src/steps/`

```typescript
// src/steps/new-feature.steps.ts
import { Given, When, Then } from "playwright-bdd";
import { TestUtils } from "../utils/TestUtils";

When("I perform some action", async ({ page }) => {
  TestUtils.logTestStep("Performing action");
  // Implementation here
});

Then("I should see expected result", async ({ page }) => {
  TestUtils.logTestStep("Verifying result");
  // Assertions here
});
```

3. **Generate and Run Tests**

```bash
npm run bdd:generate
npm test
```

### BDD Best Practices

- Use **descriptive scenario names**
- Keep scenarios **focused and atomic**
- Use **Background** for common setup steps
- Leverage **Scenario Outline** for data-driven tests
- Apply **appropriate tags** (@smoke, @regression, etc.)

## 📊 Test Reporting

### HTML Reports

```bash
# View latest HTML report
npm run report
```

### Allure Reports

```bash
# Generate Allure report
npm run allure:generate

# Open Allure report in browser
npm run allure:open
```

### Report Features

- **Test execution summary**
- **Pass/fail statistics**
- **Browser-wise results**
- **Screenshots on failure**
- **Video recordings**
- **Test traces**
- **Performance metrics**

## 🔧 Configuration

### Playwright Configuration

Key settings in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: "./src/features",
  timeout: 60 * 1000, // Test timeout
  expect: { timeout: 10 * 1000 }, // Assertion timeout
  fullyParallel: true, // Parallel execution
  retries: process.env.CI ? 2 : 0, // Retry failed tests
  workers: process.env.CI ? 1 : undefined, // Worker processes

  use: {
    baseURL: "https://www.saucedemo.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
```

### Environment Variables

Create `.env` file for environment-specific settings:

```env
# Required - Password for all SauceDemo users

# Optional - Application settings
BASE_URL=https://www.saucedemo.com
HEADLESS=true
TIMEOUT=60000
```

#### Required Environment Variables

- **SAUCE_PASSWORD** - Password for all SauceDemo user accounts (required for security)

#### Setup Instructions

**Local Development:**

```bash
export SAUCE_PASSWORD=<>
```

**Using .env file:**

```bash
echo "SAUCE_PASSWORD=<>" >> .env
```

**GitHub Actions:**

- Add `SAUCE_PASSWORD` to your repository secrets
- Go to Settings → Secrets and variables → Actions → New repository secret

## 🚀 GitHub Actions CI/CD

The project includes automated testing via GitHub Actions in `.github/workflows/playwright.yml`.

### Workflow Features

- **Automatic execution** on push/PR to main/master
- **Manual triggering** via workflow_dispatch
- **Cross-browser testing** (Chromium, Firefox, WebKit)
- **Artifact upload** (test reports, screenshots, videos)
- **Allure report generation** and publishing

### Workflow Configuration

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4 # Upload reports
```

### Triggering CI/CD

```bash
# Push changes to trigger CI
git add .
git commit -m "Update tests"
git push origin main

# Or create pull request for validation
```

### Viewing Results

- Navigate to **Actions** tab in GitHub repository
- Click on workflow run to see detailed results
- Download artifacts for offline analysis

## 🌐 Multi-Browser Testing

The suite supports testing across multiple browsers:

### Desktop Browsers

- **Chromium** (Google Chrome, Microsoft Edge)
- **Firefox**
- **WebKit** (Safari)

### Configuration

```typescript
projects: [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "webkit", use: { ...devices["Desktop Safari"] } },
];
```

### Execution

```bash
# Run on all browsers
npm test

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📱 Mobile Testing

### Mobile Device Support

- **Mobile Chrome** (Android simulation)
- **Mobile Safari** (iOS simulation)

### Configuration

```typescript
projects: [
  { name: "Mobile Chrome", use: { ...devices["Pixel 5"] } },
  { name: "Mobile Safari", use: { ...devices["iPhone 12"] } },
];
```

### Mobile-Specific Tests

```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## 🐛 Debugging

### Debug Mode

```bash
# Run in debug mode with inspector
npm run test:debug

# Debug specific test
npx playwright test login.feature --debug
```

### Visual Debugging

```bash
# Run with visible browser
npm run test:headed

# Use Playwright UI mode
npm run test:ui
```

### Debug Features

- **Step-by-step execution**
- **Browser DevTools integration**
- **Element inspector**
- **Console logging**
- **Screenshots and videos on failure**
- **Trace viewer for detailed analysis**

### Troubleshooting

#### Common Issues

1. **Browser not installed**: Run `npx playwright install`
2. **Port conflicts**: Change port in config or stop conflicting services
3. **Timeout errors**: Increase timeout values in config
4. **Element not found**: Update selectors or add waits

#### Viewing Traces

```bash
# Open trace viewer
npx playwright show-trace test-results/trace.zip
```

## 🤝 Contributing

### Development Workflow

1. **Fork and Clone**

```bash
git clone <your-fork-url>
cd playwright-tests
```

2. **Create Feature Branch**

```bash
git checkout -b feature/new-test-scenario
```

3. **Install Dependencies**

```bash
npm install
```

4. **Make Changes**

- Add new feature files in `src/features/`
- Create corresponding step definitions in `src/steps/`
- Update page objects as needed

5. **Generate and Test**

```bash
npm run bdd:generate
npm test
```

6. **Commit and Push**

```bash
git add .
git commit -m "Add new test scenario for X feature"
git push origin feature/new-test-scenario
```

7. **Create Pull Request**

### Code Standards

- Use **TypeScript** for all code
- Follow **Page Object Model** pattern
- Write **descriptive BDD scenarios**
- Include **appropriate test tags**
- Add **proper error handling**
- Document **complex logic**

### Testing Guidelines

- **Test isolation** - Each test should be independent
- **Data cleanup** - Clean up test data after execution
- **Assertions** - Use meaningful assertion messages
- **Waits** - Use explicit waits instead of hard sleeps
- **Selectors** - Prefer data-test attributes over CSS/XPath

## 📈 Performance & Best Practices

### Test Performance

- Use **fullyParallel: true** for faster execution
- Implement **proper wait strategies**
- **Minimize test dependencies**
- **Clean up resources** after tests

### Maintainability

- Follow **DRY principles**
- Use **reusable components**
- Maintain **clear documentation**
- Regular **dependency updates**

### Security

- **Never commit credentials** to repository
- Use **environment variables** for sensitive data
- Implement **proper access controls**

## 📞 Support

For questions, issues, or contributions:

- Create an issue in the repository
- Review existing documentation
- Check GitHub Actions logs for CI/CD issues
- Refer to [Playwright documentation](https://playwright.dev/)

---

**Happy Testing! 🎭✨**
