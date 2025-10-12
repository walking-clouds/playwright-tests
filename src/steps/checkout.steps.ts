import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { TestUtils } from "../utils/TestUtils";

const { Given, When, Then } = createBdd(test);

// Checkout navigation steps
When("I proceed to checkout", async ({ cartPage }) => {
  TestUtils.logTestStep("Proceeding to checkout");
  await cartPage.proceedToCheckout();
});

Given("I proceed to the checkout page", async ({ cartPage }) => {
  TestUtils.logTestStep("Navigating to checkout page");
  await cartPage.proceedToCheckout();
});

// Checkout form steps
When("I enter valid checkout information", async ({ checkoutPage }) => {
  TestUtils.logTestStep("Entering valid checkout information");
  await checkoutPage.fillCheckoutInformation("John", "Doe", "12345");
});

When(
  "I fill in checkout details as {string}, {string}, {string}",
  async (
    { checkoutPage },
    firstName: string,
    lastName: string,
    postalCode: string
  ) => {
    TestUtils.logTestStep(
      `Filling checkout details: ${firstName}, ${lastName}, ${postalCode}`
    );
    await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
  }
);

When(
  "I enter checkout information:",
  async ({ checkoutPage }, dataTable: any) => {
    TestUtils.logTestStep("Entering checkout information from data table");
    const rows = dataTable.rows();
    const firstName = rows[0][1];
    const lastName = rows[1][1];
    const postalCode = rows[2][1];
    await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
  }
);

When("I leave the first name field empty", async ({ checkoutPage }) => {
  TestUtils.logTestStep("Leaving first name field empty");
  await checkoutPage.fillCheckoutInformation("", "Doe", "12345");
});

When("I leave the last name field empty", async ({ checkoutPage }) => {
  TestUtils.logTestStep("Leaving last name field empty");
  await checkoutPage.fillCheckoutInformation("John", "", "12345");
});

When("I leave the postal code field empty", async ({ checkoutPage }) => {
  TestUtils.logTestStep("Leaving postal code field empty");
  await checkoutPage.fillCheckoutInformation("John", "Doe", "");
});

When("I leave all checkout fields empty", async ({ checkoutPage }) => {
  TestUtils.logTestStep("Leaving all checkout fields empty");
  await checkoutPage.fillCheckoutInformation("", "", "");
});

// Continue button
When("I click continue on checkout", async ({ checkoutPage }) => {
  TestUtils.logTestStep("Clicking continue on checkout");
  await checkoutPage.continueToNextStep();
});

// Checkout overview steps
Then(
  "I should be on the checkout overview page",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep("Verifying checkout overview page");
    await checkoutOverviewPage.validateCheckoutOverviewPageElements();
    TestUtils.logAssertion("On checkout overview page", true);
  }
);

Then("I should see the order summary", async ({ checkoutOverviewPage }) => {
  TestUtils.logTestStep("Verifying order summary is visible");
  const itemCount = await checkoutOverviewPage.getCartItemCount();
  expect(itemCount).toBeGreaterThan(0);
  TestUtils.logAssertion("Order summary visible", true);
});

Then(
  "I should see the payment information",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep("Verifying payment information is visible");
    const paymentInfo = await checkoutOverviewPage.getPaymentInfo();
    expect(paymentInfo).toBeTruthy();
    TestUtils.logAssertion("Payment information visible", true);
  }
);

Then(
  "I should see the shipping information",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep("Verifying shipping information is visible");
    const shippingInfo = await checkoutOverviewPage.getShippingInfo();
    expect(shippingInfo).toBeTruthy();
    TestUtils.logAssertion("Shipping information visible", true);
  }
);

// Total calculations
Then("I should see the subtotal", async ({ checkoutOverviewPage }) => {
  TestUtils.logTestStep("Verifying subtotal is visible");
  const subtotal = await checkoutOverviewPage.getSubtotalAmount();
  expect(subtotal).toBeGreaterThan(0);
  TestUtils.logAssertion("Subtotal visible", true);
});

Then("I should see the tax amount", async ({ checkoutOverviewPage }) => {
  TestUtils.logTestStep("Verifying tax amount is visible");
  const tax = await checkoutOverviewPage.getTaxAmount();
  expect(tax).toBeGreaterThanOrEqual(0);
  TestUtils.logAssertion("Tax amount visible", true);
});

Then("I should see the final total", async ({ checkoutOverviewPage }) => {
  TestUtils.logTestStep("Verifying final total is visible");
  const total = await checkoutOverviewPage.getTotalAmount();
  expect(total).toBeGreaterThan(0);
  TestUtils.logAssertion("Final total visible", true);
});

// Finish checkout
When(
  "I click finish to complete the purchase",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep("Clicking finish to complete purchase");
    await checkoutOverviewPage.finishCheckout();
  }
);

When("I complete the order", async ({ checkoutOverviewPage }) => {
  TestUtils.logTestStep("Completing the order");
  await checkoutOverviewPage.finishCheckout();
});

// Checkout complete steps
Then(
  "I should see the order confirmation",
  async ({ checkoutCompletePage }) => {
    TestUtils.logTestStep("Verifying order confirmation");
    await checkoutCompletePage.validateCheckoutCompletePageElements();
    TestUtils.logAssertion("Order confirmation visible", true);
  }
);

Then("I should see a success message", async ({ checkoutCompletePage }) => {
  TestUtils.logTestStep("Verifying success message");
  const message = await checkoutCompletePage.getCompleteText();
  expect(message).toBeTruthy();
  TestUtils.logAssertion("Success message visible", true);
});

Then(
  "I should see {string} message",
  async ({ checkoutCompletePage }, expectedMessage: string) => {
    TestUtils.logTestStep(`Verifying message: ${expectedMessage}`);
    const actualHeader = await checkoutCompletePage.getCompleteHeader();
    const actualText = await checkoutCompletePage.getCompleteText();

    // Normalize both expected and actual text (trim and normalize whitespace)
    const normalizeText = (text: string) => text.trim().replace(/\s+/g, " ");
    const normalizedExpected = normalizeText(expectedMessage);
    const normalizedHeader = normalizeText(actualHeader);
    const normalizedText = normalizeText(actualText);

    // Check both header and text for the expected message
    const headerContains = normalizedHeader.includes(normalizedExpected);
    const textContains = normalizedText.includes(normalizedExpected);

    expect(headerContains || textContains).toBe(true);
    TestUtils.logAssertion(`Message contains: ${expectedMessage}`, true);
  }
);

// Error validations
Then(
  "I should see an error about missing first name",
  async ({ checkoutPage }) => {
    TestUtils.logTestStep("Verifying first name error");
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("First Name is required");
    TestUtils.logAssertion("First name error shown", true);
  }
);

Then(
  "I should see an error about missing last name",
  async ({ checkoutPage }) => {
    TestUtils.logTestStep("Verifying last name error");
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("Last Name is required");
    TestUtils.logAssertion("Last name error shown", true);
  }
);

Then(
  "I should see an error about missing postal code",
  async ({ checkoutPage }) => {
    TestUtils.logTestStep("Verifying postal code error");
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain("Postal Code is required");
    TestUtils.logAssertion("Postal code error shown", true);
  }
);
