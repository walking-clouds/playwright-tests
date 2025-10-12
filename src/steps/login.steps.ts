import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { TestData } from "../utils/TestData";
import { TestUtils } from "../utils/TestUtils";

const { Given, When, Then } = createBdd(test);

// Background steps
Given("I am on the SauceDemo login page", async ({ loginPage }) => {
  TestUtils.logTestStep("Navigating to SauceDemo login page");
  await loginPage.navigateToLogin();
});

Given("the login page is properly loaded", async ({ loginPage }) => {
  TestUtils.logTestStep("Verifying login page is properly loaded");
  await loginPage.validateLoginPageElements();
});

Given(
  "the login page elements are properly displayed",
  async ({ loginPage }) => {
    TestUtils.logTestStep("Verifying login page elements are displayed");
    await loginPage.validateLoginPageElements();
  }
);

// Login action steps
When("I enter valid standard user credentials", async ({ loginPage }) => {
  TestUtils.logTestStep("Entering standard user credentials");
  const credentials = TestData.getUserCredentials("standard");
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
});

When("I enter valid problem user credentials", async ({ loginPage }) => {
  TestUtils.logTestStep("Entering problem user credentials");
  const credentials = TestData.getUserCredentials("problem");
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
});

When(
  "I enter valid performance glitch user credentials",
  async ({ loginPage }) => {
    TestUtils.logTestStep("Entering performance glitch user credentials");
    const credentials = TestData.getUserCredentials("performance");
    await loginPage.enterUsername(credentials.username);
    await loginPage.enterPassword(credentials.password);
  }
);

When("I enter valid visual user credentials", async ({ loginPage }) => {
  TestUtils.logTestStep("Entering visual user credentials");
  const credentials = TestData.getUserCredentials("visual");
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
});

When("I enter locked out user credentials", async ({ loginPage }) => {
  TestUtils.logTestStep("Entering locked out user credentials");
  const credentials = TestData.getUserCredentials("locked");
  await loginPage.enterUsername(credentials.username);
  await loginPage.enterPassword(credentials.password);
});

When(
  "I enter invalid username {string}",
  async ({ loginPage }, username: string) => {
    TestUtils.logTestStep(`Entering invalid username: ${username}`);
    await loginPage.enterUsername(username);
  }
);

When(
  "I enter invalid password {string}",
  async ({ loginPage }, password: string) => {
    TestUtils.logTestStep(`Entering invalid password: ${password}`);
    await loginPage.enterPassword(password);
  }
);

When("I leave the username field empty", async ({ loginPage }) => {
  TestUtils.logTestStep("Leaving username field empty");
  await loginPage.clearUsername();
});

When("I leave the password field empty", async ({ loginPage }) => {
  TestUtils.logTestStep("Leaving password field empty");
  await loginPage.clearPassword();
});

When(
  "I leave both username and password fields empty",
  async ({ loginPage }) => {
    TestUtils.logTestStep("Leaving both username and password fields empty");
    await loginPage.clearForm();
  }
);

When("I enter valid username", async ({ loginPage }) => {
  TestUtils.logTestStep("Entering valid username");
  const credentials = TestData.getUserCredentials("standard");
  await loginPage.enterUsername(credentials.username);
});

When("I enter valid password", async ({ loginPage }) => {
  TestUtils.logTestStep("Entering valid password");
  const credentials = TestData.getUserCredentials("standard");
  await loginPage.enterPassword(credentials.password);
});

When("I click the login button", async ({ loginPage }) => {
  TestUtils.logTestStep("Clicking login button");
  await loginPage.clickLoginButton();
});

// Combined login steps
Given("I login with standard user credentials", async ({ loginPage }) => {
  TestUtils.logTestStep("Logging in with standard user");
  await loginPage.loginWithStandardUser();
});

When("I login as {string} user", async ({ loginPage }, userType: string) => {
  TestUtils.logTestStep(`Logging in as ${userType} user`);
  const credentials = TestData.getUserCredentials(userType);
  await loginPage.login(credentials.username, credentials.password);
});

// Assertion steps
Then("I should be redirected to the inventory page", async ({ loginPage }) => {
  TestUtils.logTestStep("Verifying redirect to inventory page");
  await loginPage.validateSuccessfulLogin();
  TestUtils.logAssertion("Redirect to inventory page", true);
});

Then(
  "I should be redirected to the inventory page eventually",
  async ({ loginPage }) => {
    TestUtils.logTestStep(
      "Verifying redirect to inventory page (with patience)"
    );
    // Use enhanced retry with mobile optimization (assume mobile context for performance glitch)
    await TestUtils.retryWithMobileOptimization(
      async () => await loginPage.validateSuccessfulLogin(),
      4,
      3000,
      true // Assume mobile context for this step since it's used for performance-sensitive scenarios
    );
    TestUtils.logAssertion("Redirect to inventory page (eventually)", true);
  }
);

Then("I should see the products page title", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Verifying products page title");
  await inventoryPage.validateInventoryPageElements();
  TestUtils.logAssertion("Products page title visible", true);
});

Then("I should see a locked out error message", async ({ loginPage }) => {
  TestUtils.logTestStep("Verifying locked out error message");
  await loginPage.validateLockedUserError();
  TestUtils.logAssertion("Locked out error message displayed", true);
});

Then(
  "I should see an invalid credentials error message",
  async ({ loginPage }) => {
    TestUtils.logTestStep("Verifying invalid credentials error message");
    await loginPage.validateInvalidCredentialsError();
    TestUtils.logAssertion("Invalid credentials error message displayed", true);
  }
);

Then(
  "I should see a username required error message",
  async ({ loginPage }) => {
    TestUtils.logTestStep("Verifying username required error message");
    await loginPage.validateEmptyUsernameError();
    TestUtils.logAssertion("Username required error message displayed", true);
  }
);

Then(
  "I should see a password required error message",
  async ({ loginPage }) => {
    TestUtils.logTestStep("Verifying password required error message");
    await loginPage.validateEmptyPasswordError();
    TestUtils.logAssertion("Password required error message displayed", true);
  }
);

Then("I should remain on the login page", async ({ loginPage }) => {
  TestUtils.logTestStep("Verifying user remains on login page");
  const isOnLoginPage = await loginPage.isLoginPageLoaded();
  expect(isOnLoginPage).toBe(true);
  TestUtils.logAssertion("User remains on login page", true);
});

Then(
  "I should see the appropriate login result for {string}",
  async ({ loginPage, inventoryPage }, userType: string) => {
    TestUtils.logTestStep(
      `Verifying appropriate login result for ${userType} user`
    );

    switch (userType.toLowerCase()) {
      case "standard":
      case "problem":
      case "performance_glitch":
      case "error":
      case "visual":
        await loginPage.validateSuccessfulLogin();
        TestUtils.logAssertion(`${userType} user login successful`, true);
        break;
      case "locked_out":
        await loginPage.validateLockedUserError();
        TestUtils.logAssertion(`${userType} user shows locked error`, true);
        break;
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }
  }
);
