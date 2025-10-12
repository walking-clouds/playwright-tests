import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Inventory Page Object for SauceDemo products page functionality
 * Handles all inventory-related interactions including product selection, sorting, and cart operations
 */
export class InventoryPage extends BasePage {
  // Page elements
  private readonly pageTitle: Locator;
  private readonly menuButton: Locator;
  private readonly cartButton: Locator;
  private readonly cartBadge: Locator;
  private readonly sortDropdown: Locator;
  private readonly inventoryContainer: Locator;
  private readonly inventoryItems: Locator;
  private readonly productImages: Locator;
  private readonly productTitles: Locator;
  private readonly productDescriptions: Locator;
  private readonly productPrices: Locator;
  private readonly addToCartButtons: Locator;
  private readonly removeButtons: Locator;
  private readonly footerText: Locator;

  // Individual product locators (for common products)
  private readonly backpackItem: Locator;
  private readonly bikeLightItem: Locator;
  private readonly boltTshirtItem: Locator;
  private readonly fleeceJacketItem: Locator;
  private readonly onesieItem: Locator;
  private readonly redTshirtItem: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators following priority order (SauceDemo uses data-test attributes)
    this.pageTitle = this.getByText("Products");
    this.menuButton = this.getByRole("button", { name: "Open Menu" });
    this.cartButton = this.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = this.locator(".shopping_cart_badge");
    this.sortDropdown = this.locator('[data-test="product-sort-container"]');
    this.inventoryContainer = this.locator('[data-test="inventory-container"]');
    this.inventoryItems = this.locator('[data-test="inventory-item"]');
    this.productImages = this.locator(".inventory_item_img");
    this.productTitles = this.locator(".inventory_item_name");
    this.productDescriptions = this.locator(".inventory_item_desc");
    this.productPrices = this.locator(".inventory_item_price");
    this.addToCartButtons = this.locator('button[id^="add-to-cart"]');
    this.removeButtons = this.locator('button[id^="remove"]');
    this.footerText = this.locator(".footer_copy");

    // Individual product item locators
    this.backpackItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: "Sauce Labs Backpack",
    });
    this.bikeLightItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: "Sauce Labs Bike Light",
    });
    this.boltTshirtItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: "Sauce Labs Bolt T-Shirt",
    });
    this.fleeceJacketItem = this.locator('[data-test="inventory-item"]').filter(
      { hasText: "Sauce Labs Fleece Jacket" }
    );
    this.onesieItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: "Sauce Labs Onesie",
    });
    this.redTshirtItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: "Test.allTheThings() T-Shirt (Red)",
    });
  }

  // Navigation methods
  async navigateToInventory(): Promise<void> {
    await this.goto("/inventory.html");
    await this.waitForPageLoad();
  }

  async openMenu(): Promise<void> {
    await this.clickElement(this.menuButton);
  }

  async goToCart(): Promise<void> {
    await this.clickElement(this.cartButton);
  }

  async clickProductTitle(productName: string): Promise<void> {
    const productTitle = this.locator(".inventory_item_name").filter({
      hasText: productName,
    });
    await this.clickElement(productTitle);
  }

  async clickProductImage(productName: string): Promise<void> {
    const productItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const productImage = productItem.locator(".inventory_item_img img");
    await this.clickElement(productImage);
  }

  // Product interaction methods
  async addProductToCart(productName: string): Promise<void> {
    // Use direct button selector for Sauce Labs Backpack
    if (productName === "Sauce Labs Backpack") {
      const addButton = this.locator(
        '[data-test="add-to-cart-sauce-labs-backpack"]'
      );
      await this.clickElement(addButton);
    } else {
      // Fallback for other products
      const productItem = this.locator('[data-test="inventory-item"]').filter({
        hasText: productName,
      });
      const addButton = productItem.locator('button[id^="add-to-cart"]');
      await this.clickElement(addButton);
    }
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const productItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const removeButton = productItem.locator('button[id^="remove"]');
    await this.clickElement(removeButton);
  }

  async addMultipleProductsToCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  async addAllProductsToCart(): Promise<void> {
    // Keep adding items until no more "Add to cart" buttons are available
    let addedCount = 0;
    const maxProducts = 6; // SauceDemo has 6 products

    while (addedCount < maxProducts) {
      const availableButtons = this.locator('button[id^="add-to-cart"]');
      const count = await availableButtons.count();

      if (count === 0) {
        // No more "Add to cart" buttons available
        break;
      }

      // Click the first available "Add to cart" button
      const firstButton = availableButtons.first();
      await this.clickElement(firstButton);
      addedCount++;

      // Small delay to allow DOM to update
      await this.page.waitForTimeout(200);
    }
  }

  // Specific product methods
  async addBackpackToCart(): Promise<void> {
    const addButton = this.backpackItem.locator('button[id^="add-to-cart"]');
    await this.clickElement(addButton);
  }

  async addBikeLightToCart(): Promise<void> {
    const addButton = this.bikeLightItem.locator('button[id^="add-to-cart"]');
    await this.clickElement(addButton);
  }

  async addBoltTshirtToCart(): Promise<void> {
    const addButton = this.boltTshirtItem.locator('button[id^="add-to-cart"]');
    await this.clickElement(addButton);
  }

  async addFleeceJacketToCart(): Promise<void> {
    const addButton = this.fleeceJacketItem.locator(
      'button[id^="add-to-cart"]'
    );
    await this.clickElement(addButton);
  }

  async addOnesieToCart(): Promise<void> {
    const addButton = this.onesieItem.locator('button[id^="add-to-cart"]');
    await this.clickElement(addButton);
  }

  async addRedTshirtToCart(): Promise<void> {
    const addButton = this.redTshirtItem.locator('button[id^="add-to-cart"]');
    await this.clickElement(addButton);
  }

  // Sorting methods
  async sortProducts(option: string): Promise<void> {
    await this.selectOption(this.sortDropdown, option);
  }

  async sortByNameAscending(): Promise<void> {
    await this.sortProducts("az");
  }

  async sortByNameDescending(): Promise<void> {
    await this.sortProducts("za");
  }

  async sortByPriceLowToHigh(): Promise<void> {
    await this.sortProducts("lohi");
  }

  async sortByPriceHighToLow(): Promise<void> {
    await this.sortProducts("hilo");
  }

  // Getter methods
  async getCartItemCount(): Promise<number> {
    if (await this.isElementVisible(this.cartBadge)) {
      const badgeText = await this.getElementText(this.cartBadge);
      return parseInt(badgeText) || 0;
    }
    return 0;
  }

  async getProductTitles(): Promise<string[]> {
    return await this.getAllElementsText(this.productTitles);
  }

  async getProductPrices(): Promise<string[]> {
    return await this.getAllElementsText(this.productPrices);
  }

  async getProductDescriptions(): Promise<string[]> {
    return await this.getAllElementsText(this.productDescriptions);
  }

  async getProductCount(): Promise<number> {
    return await this.getElementCount(this.inventoryItems);
  }

  async getProductPrice(productName: string): Promise<string> {
    const productItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const priceElement = productItem.locator(".inventory_item_price");
    return await this.getElementText(priceElement);
  }

  async getProductDescription(productName: string): Promise<string> {
    const productItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const descElement = productItem.locator(".inventory_item_desc");
    return await this.getElementText(descElement);
  }

  async getCurrentSortOption(): Promise<string> {
    return await this.getElementValue(this.sortDropdown);
  }

  // State check methods
  async isInventoryPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle, 10000);
      await this.waitForElement(this.inventoryContainer, 10000);
      return true;
    } catch {
      return false;
    }
  }

  async isProductInCart(productName: string): Promise<boolean> {
    // Use direct data-test locator for remove button based on product name
    const productNameSlug = productName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "")
      .replace(/\./g, "");
    const removeButton = this.locator(
      `[data-test="remove-${productNameSlug}"]`
    );
    return await this.isElementVisible(removeButton);
  }

  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cartBadge);
  }

  async areAllProductsInCart(): Promise<boolean> {
    const removeButtonCount = await this.getElementCount(this.removeButtons);
    const totalProducts = await this.getProductCount();
    return removeButtonCount === totalProducts;
  }

  // Validation methods
  async validateInventoryPageElements(): Promise<void> {
    await this.expectElementToBeVisible(this.pageTitle);
    await this.expectElementToBeVisible(this.menuButton);
    await this.expectElementToBeVisible(this.cartButton);
    await this.expectElementToBeVisible(this.sortDropdown);
    await this.expectElementToBeVisible(this.inventoryContainer);
  }

  async validateProductCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getProductCount();
    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} products, but found ${actualCount}`
      );
    }
  }

  async validateCartItemCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartItemCount();
    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} items in cart, but found ${actualCount}`
      );
    }
  }

  async validateProductInCart(productName: string): Promise<void> {
    const isInCart = await this.isProductInCart(productName);
    if (!isInCart) {
      throw new Error(`Product "${productName}" is not in cart`);
    }
  }

  async validateProductNotInCart(productName: string): Promise<void> {
    const isInCart = await this.isProductInCart(productName);
    if (isInCart) {
      throw new Error(`Product "${productName}" should not be in cart`);
    }
  }

  async validateSortingByName(ascending: boolean = true): Promise<void> {
    const titles = await this.getProductTitles();
    const sortedTitles = [...titles].sort();
    if (!ascending) {
      sortedTitles.reverse();
    }

    for (let i = 0; i < titles.length; i++) {
      if (titles[i] !== sortedTitles[i]) {
        throw new Error(
          `Products are not sorted by name ${
            ascending ? "ascending" : "descending"
          }`
        );
      }
    }
  }

  async validateSortingByPrice(lowToHigh: boolean = true): Promise<void> {
    const priceTexts = await this.getProductPrices();
    const prices = priceTexts.map((price) =>
      parseFloat(price.replace("$", ""))
    );
    const sortedPrices = [...prices].sort((a, b) =>
      lowToHigh ? a - b : b - a
    );

    for (let i = 0; i < prices.length; i++) {
      if (prices[i] !== sortedPrices[i]) {
        throw new Error(
          `Products are not sorted by price ${
            lowToHigh ? "low to high" : "high to low"
          }`
        );
      }
    }
  }

  // Utility methods
  async getRandomProduct(): Promise<string> {
    const titles = await this.getProductTitles();
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
  }

  async getMostExpensiveProduct(): Promise<{ name: string; price: string }> {
    const titles = await this.getProductTitles();
    const priceTexts = await this.getProductPrices();
    const prices = priceTexts.map((price) =>
      parseFloat(price.replace("$", ""))
    );

    let maxPrice = Math.max(...prices);
    let maxIndex = prices.indexOf(maxPrice);

    return {
      name: titles[maxIndex],
      price: priceTexts[maxIndex],
    };
  }

  async getCheapestProduct(): Promise<{ name: string; price: string }> {
    const titles = await this.getProductTitles();
    const priceTexts = await this.getProductPrices();
    const prices = priceTexts.map((price) =>
      parseFloat(price.replace("$", ""))
    );

    let minPrice = Math.min(...prices);
    let minIndex = prices.indexOf(minPrice);

    return {
      name: titles[minIndex],
      price: priceTexts[minIndex],
    };
  }

  async searchProductByPartialName(partialName: string): Promise<string[]> {
    const titles = await this.getProductTitles();
    return titles.filter((title) =>
      title.toLowerCase().includes(partialName.toLowerCase())
    );
  }

  async takeInventoryScreenshot(
    name: string = "inventory-page"
  ): Promise<void> {
    await this.takePageScreenshot(name);
  }

  // Advanced interaction methods
  async hoverOverProduct(productName: string): Promise<void> {
    const productItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    await this.hoverElement(productItem);
  }

  async scrollToProduct(productName: string): Promise<void> {
    const productItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    await this.scrollIntoView(productItem);
  }

  async addProductsInSequence(
    productNames: string[],
    delay: number = 1000
  ): Promise<void> {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
      await this.page.waitForTimeout(delay);
    }
  }
}
