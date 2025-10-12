import { createBdd, DataTable } from "playwright-bdd";
import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { TestUtils } from "../utils/TestUtils";

const { Given, When, Then } = createBdd(test);

// Remove product from cart on inventory page
When(
  "I remove {string} from the cart on inventory page",
  async ({ inventoryPage }, productName: string) => {
    TestUtils.logTestStep(
      `Removing ${productName} from cart on inventory page`
    );
    await inventoryPage.removeProductFromCart(productName);
  }
);

// Cart badge visibility checks
Then("I should see the cart badge disappears", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Verifying cart badge disappears");
  const badgeVisible = await inventoryPage.isCartBadgeVisible();
  expect(badgeVisible).toBe(false);
  TestUtils.logAssertion("Cart badge disappeared", true);
});

Then("I should not see any cart badge", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Verifying no cart badge is visible");
  const badgeVisible = await inventoryPage.isCartBadgeVisible();
  expect(badgeVisible).toBe(false);
  TestUtils.logAssertion("No cart badge visible", true);
});

// Remove product from cart
When(
  "I remove {string} from the cart",
  async ({ cartPage }, productName: string) => {
    TestUtils.logTestStep(`Removing ${productName} from cart`);
    await cartPage.removeItemFromCart(productName);
  }
);

// Cart empty validation
Then("I should see the cart is empty", async ({ cartPage }) => {
  TestUtils.logTestStep("Verifying cart is empty");
  const isEmpty = await cartPage.isCartEmpty();
  expect(isEmpty).toBe(true);
  TestUtils.logAssertion("Cart is empty", true);
});

// Product not in cart validation
Then(
  "I should not see {string} in the cart",
  async ({ cartPage }, productName: string) => {
    TestUtils.logTestStep(`Verifying ${productName} is not in cart`);
    const cartItems = await cartPage.getCartItemNames();
    const isInCart = cartItems.includes(productName);
    expect(isInCart).toBe(false);
    TestUtils.logAssertion(`${productName} not in cart`, true);
  }
);

// Add multiple products using data table
Given(
  "I have added multiple products to the cart:",
  async ({ inventoryPage }, dataTable: any) => {
    TestUtils.logTestStep("Adding multiple products to cart");
    const products = dataTable.rows().map((row: any) => row[0]);
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
  }
);

// Add all available products
Given(
  "I have added all available products to the cart",
  async ({ inventoryPage }) => {
    TestUtils.logTestStep("Adding all available products to cart");
    // Add all 6 products from SauceDemo
    const products = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Fleece Jacket",
      "Sauce Labs Onesie",
      "Test.allTheThings() T-Shirt (Red)",
    ];
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
  }
);

// Remove all items from cart
When("I remove all items from the cart", async ({ cartPage }) => {
  TestUtils.logTestStep("Removing all items from cart");
  await cartPage.removeAllItemsFromCart();
});

// Generic button clicks
When("I click {string} button", async ({ page }, buttonName: string) => {
  TestUtils.logTestStep(`Clicking ${buttonName} button`);

  // Map button names to selectors
  const buttonSelectors: Record<string, string> = {
    "Continue Shopping": '[data-test="continue-shopping"]',
    Checkout: '[data-test="checkout"]',
    Continue: '[data-test="continue"]',
    Finish: '[data-test="finish"]',
    "Back Home": '[data-test="back-to-products"]',
  };

  const selector = buttonSelectors[buttonName];
  if (!selector) {
    throw new Error(`Unknown button: ${buttonName}`);
  }

  await page.locator(selector).click();
});
