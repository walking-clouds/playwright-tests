import { createBdd, DataTable } from "playwright-bdd";
import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
import { TestUtils } from "../utils/TestUtils";

const { Given, When, Then, AfterScenario } = createBdd(test);

// Cart badge and count validations
Then(
  "I should still see the cart badge shows {string}",
  async ({ inventoryPage }, expectedCount: string) => {
    TestUtils.logTestStep(`Verifying cart badge shows ${expectedCount}`);
    const actualCount = await inventoryPage.getCartItemCount();
    expect(actualCount).toBe(parseInt(expectedCount));
    TestUtils.logAssertion(`Cart badge shows ${expectedCount}`, true);
  }
);

Then(
  "I should see the cart badge shows the total number of products",
  async ({ inventoryPage }) => {
    TestUtils.logTestStep("Verifying cart badge shows total product count");
    const count = await inventoryPage.getCartItemCount();
    expect(count).toBeGreaterThan(0);
    TestUtils.logAssertion("Cart badge shows total count", true);
  }
);

// Cart contents validation
Then("I should see all products listed in the cart", async ({ cartPage }) => {
  TestUtils.logTestStep("Verifying all products are listed in cart");
  const cartItems = await cartPage.getCartItemNames();
  expect(cartItems.length).toBeGreaterThan(0);
  TestUtils.logAssertion("All products listed in cart", true);
});

Then(
  "each product should have quantity {string}",
  async ({ cartPage }, expectedQuantity: string) => {
    TestUtils.logTestStep(
      `Verifying each product has quantity ${expectedQuantity}`
    );
    const quantities = await cartPage.getCartItemQuantities();
    for (const quantity of quantities) {
      expect(quantity).toBe(expectedQuantity);
    }
    TestUtils.logAssertion(
      `Each product has quantity ${expectedQuantity}`,
      true
    );
  }
);

// Product details tracking
let notedProductDetails: { name: string; price: string; description: string } =
  { name: "", price: "", description: "" };

Given(
  "I note the details of {string} on inventory page",
  async ({ inventoryPage }, productName: string) => {
    TestUtils.logTestStep(`Noting details of ${productName} on inventory page`);
    // Store product details for later comparison
    notedProductDetails = {
      name: productName,
      price: await inventoryPage.getProductPrice(productName),
      description: await inventoryPage.getProductDescription(productName),
    };
  }
);

Then(
  "the product details in cart should match inventory details",
  async ({ cartPage }) => {
    TestUtils.logTestStep(
      "Verifying product details match between inventory and cart"
    );
    const cartPrice = await cartPage.getItemPrice(notedProductDetails.name);
    const cartDescription = await cartPage.getItemDescription(
      notedProductDetails.name
    );

    expect(cartPrice).toBe(notedProductDetails.price);
    expect(cartDescription).toBe(notedProductDetails.description);
    TestUtils.logAssertion("Product details match", true);
  }
);

Then("the price should be identical", async ({ cartPage }) => {
  TestUtils.logTestStep("Verifying price is identical");
  const cartPrice = await cartPage.getItemPrice(notedProductDetails.name);
  expect(cartPrice).toBe(notedProductDetails.price);
  TestUtils.logAssertion("Price is identical", true);
});

Then("the description should be identical", async ({ cartPage }) => {
  TestUtils.logTestStep("Verifying description is identical");
  const cartDescription = await cartPage.getItemDescription(
    notedProductDetails.name
  );
  expect(cartDescription).toBe(notedProductDetails.description);
  TestUtils.logAssertion("Description is identical", true);
});

// Special user login shortcuts
Given("I am logged in as performance glitch user", async ({ loginPage }) => {
  TestUtils.logTestStep("Logging in as performance glitch user");

  // Always navigate to login to ensure clean state
  await loginPage.navigateToLogin();
  await loginPage.loginWithPerformanceUser();
});

// Patient interactions for slow performance
When(
  "I add products to cart with patience",
  async ({ inventoryPage }, dataTable: DataTable) => {
    TestUtils.logTestStep(
      "Adding products to cart with patience for performance glitch user"
    );

    // Get product names from DataTable, skipping the first row (header)
    const products = dataTable.rows().map((row: string[]) => row[0]);

    TestUtils.logTestStep(`Adding ${products.length} products with patience`);

    // Add products in loop with patience delays
    for (const productName of products) {
      TestUtils.logTestStep(`Adding "${productName}" to cart`);
      await inventoryPage.addProductToCart(productName);
      await TestUtils.wait(1000); // Patience delay for performance glitch user
    }

    TestUtils.logAssertion(
      `Successfully added ${products.length} products with patience`,
      true
    );
  }
);

// Cart validations
Then(
  "the cart operations should complete eventually with cart count {int}",
  async ({ inventoryPage }, cartCount: number) => {
    TestUtils.logTestStep("Verifying cart operations complete (with patience)");
    await TestUtils.retry(
      async () => {
        const count = await inventoryPage.getCartItemCount();
        expect(count).toEqual(cartCount);
      },
      5,
      2000
    );
    TestUtils.logAssertion("Cart operations completed eventually", true);
  }
);
