import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { TestData } from "../utils/TestData";
import { TestUtils } from "../utils/TestUtils";

const { Given, When, Then } = createBdd(test);

// Given steps
Given(
  "I am logged in as standard user",
  async ({ loginPage, inventoryPage }) => {
    TestUtils.logTestStep(
      "Logging in as standard user and navigating to inventory"
    );
    await loginPage.navigateToLogin();
    await loginPage.loginWithStandardUser();
    await inventoryPage.validateInventoryPageElements();
  }
);

Given("I am on the inventory page", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Verifying user is on inventory page");
  await inventoryPage.validateInventoryPageElements();
});

// Add product to cart
When(
  "I add {string} to cart",
  async ({ inventoryPage }, productName: string) => {
    TestUtils.logTestStep(`Adding ${productName} to cart`);
    await inventoryPage.addProductToCart(productName);
  }
);

// Navigate to cart
When("I navigate to cart", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Navigating to cart");
  await inventoryPage.goToCart();
});

// When steps - Product interactions
When(
  "I add {string} to the cart",
  async ({ inventoryPage }, productName: string) => {
    TestUtils.logTestStep(`Adding "${productName}" to cart`);
    await inventoryPage.addProductToCart(productName);
  }
);

When(
  "I add the following products to the cart:",
  async ({ inventoryPage }, dataTable) => {
    TestUtils.logTestStep("Adding multiple products to cart");
    const products = dataTable.hashes();
    for (const product of products) {
      await inventoryPage.addProductToCart(product["Product Name"]);
      await TestUtils.wait(500); // Small delay between additions
    }
  }
);

When("I add all available products to the cart", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Adding all available products to cart");
  await inventoryPage.addAllProductsToCart();
});

// When steps - Navigation
When("I navigate to the cart page", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Navigating to cart page");
  await inventoryPage.goToCart();
});

// When steps - Sorting
When("I sort products by name from A to Z", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Sorting products by name A to Z");
  await inventoryPage.sortByNameAscending();
});

When("I sort products by price from low to high", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Sorting products by price low to high");
  await inventoryPage.sortByPriceLowToHigh();
});

// Then steps - Cart badge validation
Then(
  "I should see the cart badge shows {string}",
  async ({ inventoryPage }, expectedCount: string) => {
    TestUtils.logTestStep(`Verifying cart badge shows ${expectedCount}`);
    const actualCount = await inventoryPage.getCartItemCount();
    expect(actualCount).toBe(parseInt(expectedCount));
    TestUtils.logAssertion(`Cart badge shows ${expectedCount}`, true);
  }
);

// Then steps - Product button state validation
Then(
  "the {string} should show {string} button",
  async ({ inventoryPage }, productName: string, buttonType: string) => {
    TestUtils.logTestStep(
      `Verifying "${productName}" shows "${buttonType}" button`
    );
    if (buttonType.toLowerCase() === "remove") {
      const isInCart = await inventoryPage.isProductInCart(productName);
      expect(isInCart).toBe(true);
      TestUtils.logAssertion(`${productName} shows Remove button`, true);
    } else if (buttonType.toLowerCase().includes("add")) {
      const isInCart = await inventoryPage.isProductInCart(productName);
      expect(isInCart).toBe(false);
      TestUtils.logAssertion(`${productName} shows Add to cart button`, true);
    }
  }
);

// Then steps - Sorting validation
Then(
  "I should see products sorted by price correctly",
  async ({ inventoryPage }) => {
    TestUtils.logTestStep("Verifying products are sorted by price correctly");
    await inventoryPage.validateSortingByPrice(true);
    TestUtils.logAssertion("Products sorted by price (low to high)", true);
  }
);

Then(
  "I should see products sorted alphabetically",
  async ({ inventoryPage }) => {
    TestUtils.logTestStep("Verifying products are sorted alphabetically");
    await inventoryPage.validateSortingByName(true);
    TestUtils.logAssertion("Products sorted alphabetically (A to Z)", true);
  }
);

// Then steps - General validation
Then("I should be back on the inventory page", async ({ inventoryPage }) => {
  TestUtils.logTestStep("Verifying user is back on inventory page");
  await inventoryPage.validateInventoryPageElements();
  TestUtils.logAssertion("Back on inventory page", true);
});
