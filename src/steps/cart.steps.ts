import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { TestData } from "../utils/TestData";
import { TestUtils } from "../utils/TestUtils";

const { Given, When, Then } = createBdd(test);

// Given steps
Given(
  "I have added {string} to the cart",
  async ({ inventoryPage }, productName: string) => {
    TestUtils.logTestStep(`Given: Adding "${productName}" to cart`);
    await inventoryPage.addProductToCart(productName);
  }
);

// When steps - Cart navigation (checkout step moved to checkout.steps.ts to avoid duplicates)

// Then steps - Cart content validation
Then(
  "I should see {string} in the cart",
  async ({ cartPage }, productName: string) => {
    TestUtils.logTestStep(`Verifying "${productName}" is in cart`);
    await cartPage.validateItemInCart(productName);
    TestUtils.logAssertion(`${productName} is in cart`, true);
  }
);

Then("I should see all selected products in the cart", async ({ cartPage }) => {
  TestUtils.logTestStep("Verifying all selected products are in cart");
  const cartItemCount = await cartPage.getCartItemCount();
  expect(cartItemCount).toBeGreaterThan(0);
  TestUtils.logAssertion("All selected products are in cart", true);
});

Then(
  "the cart should show {int} item",
  async ({ cartPage }, expectedCount: number) => {
    TestUtils.logTestStep(`Verifying cart shows ${expectedCount} item(s)`);
    await cartPage.validateCartItemCount(expectedCount);
    TestUtils.logAssertion(`Cart shows ${expectedCount} item(s)`, true);
  }
);

Then(
  "the cart should show {int} items",
  async ({ cartPage }, expectedCount: number) => {
    TestUtils.logTestStep(`Verifying cart shows ${expectedCount} item(s)`);
    await cartPage.validateCartItemCount(expectedCount);
    TestUtils.logAssertion(`Cart shows ${expectedCount} item(s)`, true);
  }
);

Then(
  "I should see the correct price for {string}",
  async ({ cartPage }, productName: string) => {
    TestUtils.logTestStep(`Verifying correct price for "${productName}"`);
    const productData = TestData.getProductByName(productName);
    await cartPage.validateItemPrice(productName, productData.price);
    TestUtils.logAssertion(`Correct price for ${productName}`, true);
  }
);

// Checkout flow steps
When(
  "I fill in the checkout information with valid data",
  async ({ checkoutPage }) => {
    TestUtils.logTestStep("Filling checkout information with valid data");
    await checkoutPage.fillCheckoutInfoWithValidData();
  }
);

When(
  "I fill in the checkout information:",
  async ({ checkoutPage }, dataTable) => {
    TestUtils.logTestStep("Filling checkout information from table");
    const rows = dataTable.rows();
    const firstName = rows[0][1];
    const lastName = rows[1][1];
    const postalCode = rows[2][1];
    await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
  }
);

When("I continue to checkout overview", async ({ checkoutPage }) => {
  TestUtils.logTestStep("Continuing to checkout overview");
  await checkoutPage.continueToNextStep();
});

When("I finish the checkout process", async ({ checkoutOverviewPage }) => {
  TestUtils.logTestStep("Finishing checkout process");
  await checkoutOverviewPage.finishCheckout();
});

When(
  "I complete the checkout process with default information",
  async ({ checkoutPage, checkoutOverviewPage }) => {
    TestUtils.logTestStep("Completing checkout with default information");
    await checkoutPage.fillCheckoutInfoAndContinue();
    await checkoutOverviewPage.finishCheckout();
  }
);

// Then steps - Order summary validation
Then(
  "I should see the order summary with {string}",
  async ({ checkoutOverviewPage }, productName: string) => {
    TestUtils.logTestStep(`Verifying order summary contains "${productName}"`);
    await checkoutOverviewPage.validateItemInOrder(productName);
    TestUtils.logAssertion(`Order summary contains ${productName}`, true);
  }
);

Then(
  "I should see the order summary with all products",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep("Verifying order summary contains all products");
    const itemCount = await checkoutOverviewPage.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);
    TestUtils.logAssertion("Order summary contains all products", true);
  }
);

Then(
  "I should see the correct pricing calculations",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep("Verifying correct pricing calculations");
    await checkoutOverviewPage.validatePriceCalculation();
    await checkoutOverviewPage.validateSubtotalMatchesItemPrices();
    TestUtils.logAssertion("Pricing calculations are correct", true);
  }
);

Then(
  "the total price calculation should be accurate",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep("Verifying accurate price calculations");
    await checkoutOverviewPage.validatePriceCalculation();
    await checkoutOverviewPage.validateSubtotalMatchesItemPrices();
    TestUtils.logAssertion("Price calculations are accurate", true);
  }
);

// Then steps - Completion validation
Then(
  "I should see the order completion confirmation",
  async ({ checkoutCompletePage }) => {
    TestUtils.logTestStep("Verifying order completion confirmation");
    await checkoutCompletePage.validateSuccessfulOrderCompletion();
    TestUtils.logAssertion("Order completion confirmed", true);
  }
);

Then(
  "I should see the successful order completion",
  async ({ checkoutCompletePage }) => {
    TestUtils.logTestStep("Verifying successful order completion");
    await checkoutCompletePage.validateSuccessfulOrderCompletion();
    TestUtils.logAssertion("Successful order completion", true);
  }
);

// Duplicate step removed - see checkout.steps.ts for implementation

When("I return to products page", async ({ checkoutCompletePage }) => {
  TestUtils.logTestStep("Returning to products page");
  await checkoutCompletePage.backToProducts();
});

Then("I can return to the products page", async ({ checkoutCompletePage }) => {
  TestUtils.logTestStep("Verifying ability to return to products page");
  await checkoutCompletePage.backToProducts();
});
