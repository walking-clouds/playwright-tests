import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { TestUtils } from "../utils/TestUtils";
import { TestData } from "../utils/TestData";

const { Given, When, Then } = createBdd(test);

// ===== LOGIN STEPS FOR DIFFERENT USER TYPES =====

When(
  "I login with performance glitch user credentials",
  async ({ loginPage }) => {
    TestUtils.logTestStep("Logging in with performance glitch user");
    await loginPage.loginWithPerformanceUser();
  }
);

When("I login with visual user credentials", async ({ loginPage }) => {
  TestUtils.logTestStep("Logging in with visual user");
  await loginPage.loginWithVisualUser();
});

When("I login with problem user credentials", async ({ loginPage }) => {
  TestUtils.logTestStep("Logging in with problem user");
  await loginPage.loginWithProblemUser();
});

When(
  "I login with {string} user credentials",
  async ({ loginPage }, userType: string) => {
    TestUtils.logTestStep(`Logging in with ${userType} user`);
    const cleanUserType = userType.toLowerCase().replace(" ", "_");

    switch (cleanUserType) {
      case "standard":
        await loginPage.loginWithStandardUser();
        break;
      case "problem":
        await loginPage.loginWithProblemUser();
        break;
      case "performance_glitch":
        await loginPage.loginWithPerformanceUser();
        break;
      case "visual":
        await loginPage.loginWithVisualUser();
        break;
      case "error":
        await loginPage.loginWithErrorUser();
        break;
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }
  }
);

// ===== REDIRECT VALIDATION STEPS =====

Then(
  "I should eventually be redirected to the inventory page",
  async ({ loginPage }) => {
    TestUtils.logTestStep(
      "Verifying eventual redirect to inventory page (with patience)"
    );
    await TestUtils.retry(
      async () => await loginPage.validateSuccessfulLogin(),
      5,
      3000
    );
    TestUtils.logAssertion("Eventually redirected to inventory page", true);
  }
);

// ===== PRODUCT INTERACTION STEPS =====

When("I add the first product to the cart", async ({ inventoryPage }) => {
  TestUtils.logTestStep(
    "Adding first product to cart (cheapest after sorting)"
  );
  await inventoryPage.sortByPriceLowToHigh();
  await TestUtils.wait(500); // Wait for sorting to complete
  const cheapestProduct = await inventoryPage.getCheapestProduct();
  await inventoryPage.addProductToCart(cheapestProduct.name);
});

When("I add the last product to the cart", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Adding last product to cart (alphabetically last)");
  await inventoryPage.sortByNameAscending();
  await TestUtils.wait(500); // Wait for sorting to complete
  const products = await inventoryPage.getProductTitles();
  const lastProduct = products[products.length - 1];
  await inventoryPage.addProductToCart(lastProduct);
});

When(
  "I add {string} to the cart with patience",
  async ({ inventoryPage }, productName: string) => {
    TestUtils.logTestStep(
      `Adding "${productName}" to cart with patience for performance glitch user`
    );
    await inventoryPage.addProductToCart(productName);
    await TestUtils.wait(2000); // Extra wait for performance glitch user
  }
);

// ===== CART VALIDATION STEPS =====

Then(
  "I should see the cart badge shows all product count",
  async ({ inventoryPage }) => {
    TestUtils.logTestStep("Verifying cart badge shows all product count");
    const productCount = await inventoryPage.getProductCount();
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(productCount);
    TestUtils.logAssertion(`Cart badge shows ${productCount} products`, true);
  }
);

Then(
  "I should see all six products listed in the cart",
  async ({ cartPage }) => {
    TestUtils.logTestStep("Verifying all six products are listed in cart");
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(6); // SauceDemo has 6 products
    TestUtils.logAssertion("All 6 products listed in cart", true);
  }
);

// ===== CHECKOUT FLOW STEPS =====

When(
  "I complete the checkout with valid information",
  async ({ cartPage, checkoutPage, checkoutOverviewPage }) => {
    TestUtils.logTestStep("Completing checkout with valid information");
    // Navigate to checkout from cart
    await cartPage.proceedToCheckout();
    // Fill checkout information and continue
    await checkoutPage.fillCheckoutInformation("John", "Doe", "12345");
    await checkoutPage.continueToNextStep();
    // Finish the checkout
    await checkoutOverviewPage.finishCheckout();
  }
);

When(
  "I proceed through the purchase flow",
  async ({ inventoryPage, cartPage, checkoutPage }) => {
    TestUtils.logTestStep("Proceeding through complete purchase flow");
    // First navigate to cart if not there already
    await inventoryPage.goToCart();
    await TestUtils.wait(500); // Wait for cart page to load
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInformation("John", "Doe", "12345");
    await checkoutPage.continueToNextStep();
  }
);

When(
  "I complete the purchase flow with performance considerations",
  async ({ inventoryPage, cartPage, checkoutPage, checkoutOverviewPage }) => {
    TestUtils.logTestStep(
      "Completing purchase flow with performance considerations"
    );
    await inventoryPage.goToCart(); // Navigate to cart first
    await TestUtils.wait(1000); // Extra wait for performance glitch user
    await cartPage.proceedToCheckout();
    await TestUtils.wait(1000); // Extra wait for performance glitch user
    await checkoutPage.fillCheckoutInformation("Perf", "User", "12345");
    await TestUtils.wait(1000);
    await checkoutPage.continueToNextStep();
    await TestUtils.wait(1000); // Extra wait for performance glitch user
    await checkoutOverviewPage.finishCheckout(); // Complete the purchase
    await TestUtils.wait(1000);
  }
);

When(
  "I navigate through the purchase process",
  async ({ inventoryPage, cartPage, checkoutPage, checkoutOverviewPage }) => {
    TestUtils.logTestStep("Navigating through purchase process");
    await inventoryPage.goToCart(); // Navigate to cart first
    await TestUtils.wait(500);
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInformation("Visual", "User", "54321");
    await checkoutPage.continueToNextStep();
    await TestUtils.wait(500);
    await checkoutOverviewPage.finishCheckout(); // Complete the purchase
  }
);

When(
  "I complete the purchase process",
  async ({ inventoryPage, cartPage, checkoutPage, checkoutOverviewPage }) => {
    TestUtils.logTestStep("Completing purchase process");
    await inventoryPage.goToCart(); // Navigate to cart first
    await TestUtils.wait(500);
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInformation("Test", "User", "12345");
    await checkoutPage.continueToNextStep();
    await TestUtils.wait(1000); // Extra wait for page transition
    await checkoutOverviewPage.finishCheckout(); // Complete the purchase
  }
);

// ===== ORDER COMPLETION VALIDATION STEPS =====

Then(
  "I should see the successful completion for all products",
  async ({ checkoutCompletePage }) => {
    TestUtils.logTestStep("Verifying successful completion for all products");
    await checkoutCompletePage.validateSuccessfulOrderCompletion();
    const actualHeader = await checkoutCompletePage.getCompleteHeader();
    const actualText = await checkoutCompletePage.getCompleteText();

    // Check both header and text for the expected message
    const expectedMessage = "Thank you for your order!";
    const headerContains = actualHeader.includes(expectedMessage);
    const textContains = actualText.includes(expectedMessage);

    expect(headerContains || textContains).toBe(true);
    TestUtils.logAssertion("Successful completion for all products", true);
  }
);

Then(
  "the total amount should reflect all product prices plus tax",
  async ({ checkoutOverviewPage }) => {
    TestUtils.logTestStep(
      "Verifying total amount reflects all product prices plus tax"
    );
    await checkoutOverviewPage.validatePriceCalculation();
    const subtotal = await checkoutOverviewPage.getSubtotalAmount();
    const tax = await checkoutOverviewPage.getTaxAmount();
    const total = await checkoutOverviewPage.getTotalAmount();

    // Verify tax is approximately 8% of subtotal
    const expectedTax = Math.round(subtotal * 0.08 * 100) / 100;
    expect(Math.abs(tax - expectedTax)).toBeLessThanOrEqual(0.01);

    // Verify total equals subtotal + tax
    expect(total).toBeCloseTo(subtotal + tax, 2);
    TestUtils.logAssertion("Total amount reflects all prices plus tax", true);
  }
);

Then(
  "I should complete the purchase despite any visual discrepancies",
  async ({ checkoutCompletePage }) => {
    TestUtils.logTestStep(
      "Verifying purchase completion despite visual discrepancies"
    );
    await checkoutCompletePage.validateSuccessfulOrderCompletion();
    TestUtils.logAssertion("Purchase completed despite visual issues", true);
  }
);

Then(
  "the functionality should remain intact",
  async ({ checkoutCompletePage }) => {
    TestUtils.logTestStep("Verifying functionality remains intact");
    const completeText = await checkoutCompletePage.getCompleteText();
    expect(completeText).toBeTruthy();
    TestUtils.logAssertion("Functionality remains intact", true);
  }
);

// ===== SCENARIO OUTLINE SUPPORT STEPS =====
// Note: "I login as {string} user" step is already defined in login.steps.ts
