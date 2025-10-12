import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Cart Page Object for SauceDemo shopping cart functionality
 * Handles all cart-related interactions including item management and checkout navigation
 */
export class CartPage extends BasePage {
  // Page elements
  private readonly pageTitle: Locator;
  private readonly cartList: Locator;
  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemDescriptions: Locator;
  private readonly cartItemPrices: Locator;
  private readonly cartItemQuantities: Locator;
  private readonly removeButtons: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;
  private readonly cartBadge: Locator;
  private readonly menuButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators following priority order (SauceDemo uses data-test attributes)
    this.pageTitle = this.getByText("Your Cart");
    this.cartList = this.locator('[data-test="cart-list"]');
    this.cartItems = this.locator('[data-test="inventory-item"]');
    this.cartItemNames = this.locator('[data-test="inventory-item-name"]');
    this.cartItemDescriptions = this.locator(
      '[data-test="inventory-item-desc"]'
    );
    this.cartItemPrices = this.locator('[data-test="inventory-item-price"]');
    this.cartItemQuantities = this.locator(".cart_quantity");
    this.removeButtons = this.locator('button[id^="remove"]');
    this.continueShoppingButton = this.locator(
      '[data-test="continue-shopping"]'
    );
    this.checkoutButton = this.locator('[data-test="checkout"]');
    this.cartBadge = this.locator(".shopping_cart_badge");
    this.menuButton = this.getByRole("button", { name: "Open Menu" });
  }

  // Navigation methods
  async navigateToCart(): Promise<void> {
    await this.goto("/cart.html");
    await this.waitForPageLoad();
  }

  async continueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }

  async openMenu(): Promise<void> {
    await this.clickElement(this.menuButton);
  }

  // Item management methods
  async removeItemFromCart(productName: string): Promise<void> {
    const cartItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const removeButton = cartItem.locator('button[id^="remove"]');
    await this.clickElement(removeButton);
  }

  async removeAllItemsFromCart(): Promise<void> {
    const removeButtonCount = await this.getElementCount(this.removeButtons);

    // Remove items in reverse order to avoid index issues
    for (let i = removeButtonCount - 1; i >= 0; i--) {
      const removeButton = this.getElementByIndex(this.removeButtons, i);
      await this.clickElement(removeButton);
    }
  }

  async removeItemByIndex(index: number): Promise<void> {
    const removeButton = this.getElementByIndex(this.removeButtons, index);
    await this.clickElement(removeButton);
  }

  async removeFirstItem(): Promise<void> {
    await this.removeItemByIndex(0);
  }

  async removeLastItem(): Promise<void> {
    const count = await this.getElementCount(this.removeButtons);
    await this.removeItemByIndex(count - 1);
  }

  // Getter methods
  async getCartItemCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.isElementVisible(this.cartBadge)) {
      const badgeText = await this.getElementText(this.cartBadge);
      return parseInt(badgeText) || 0;
    }
    return 0;
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.getAllElementsText(this.cartItemNames);
  }

  async getCartItemPrices(): Promise<string[]> {
    return await this.getAllElementsText(this.cartItemPrices);
  }

  async getCartItemDescriptions(): Promise<string[]> {
    return await this.getAllElementsText(this.cartItemDescriptions);
  }

  async getCartItemQuantities(): Promise<string[]> {
    return await this.getAllElementsText(this.cartItemQuantities);
  }

  async getItemPrice(productName: string): Promise<string> {
    const cartItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const priceElement = cartItem.locator(".inventory_item_price");
    return await this.getElementText(priceElement);
  }

  async getItemDescription(productName: string): Promise<string> {
    const cartItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const descElement = cartItem.locator(".inventory_item_desc");
    return await this.getElementText(descElement);
  }

  async getItemQuantity(productName: string): Promise<string> {
    const cartItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const quantityElement = cartItem.locator(".cart_quantity");
    return await this.getElementText(quantityElement);
  }

  async getTotalItemsPrice(): Promise<number> {
    const priceTexts = await this.getCartItemPrices();
    let total = 0;

    for (const priceText of priceTexts) {
      const price = parseFloat(priceText.replace("$", ""));
      total += price;
    }

    return total;
  }

  // State check methods
  async isCartPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle, 10000);
      return true;
    } catch {
      return false;
    }
  }

  async isCartEmpty(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  async isItemInCart(productName: string): Promise<boolean> {
    try {
      // Wait for the cart content to be loaded
      await this.page.waitForTimeout(500);

      // Use the working locator strategy
      const cartItems = this.locator('[data-test="inventory-item"]');
      const count = await cartItems.count();

      for (let i = 0; i < count; i++) {
        const item = cartItems.nth(i);
        const text = await item.textContent();
        if (text && text.includes(productName)) {
          return await item.isVisible();
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.continueShoppingButton);
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.checkoutButton);
  }

  async isCheckoutButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.checkoutButton);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cartBadge);
  }

  // Validation methods
  async validateCartPageElements(): Promise<void> {
    await this.expectElementToBeVisible(this.pageTitle);
    await this.expectElementToBeVisible(this.continueShoppingButton);
    await this.expectElementToBeVisible(this.checkoutButton);
  }

  async validateCartItemCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartItemCount();
    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} items in cart, but found ${actualCount}`
      );
    }
  }

  async validateCartBadgeCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartBadgeCount();
    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected cart badge to show ${expectedCount}, but found ${actualCount}`
      );
    }
  }

  async validateItemInCart(productName: string): Promise<void> {
    const isInCart = await this.isItemInCart(productName);
    if (!isInCart) {
      throw new Error(`Product "${productName}" is not in the cart`);
    }
  }

  async validateItemNotInCart(productName: string): Promise<void> {
    const isInCart = await this.isItemInCart(productName);
    if (isInCart) {
      throw new Error(`Product "${productName}" should not be in the cart`);
    }
  }

  async validateItemPrice(
    productName: string,
    expectedPrice: string
  ): Promise<void> {
    const actualPrice = await this.getItemPrice(productName);
    if (actualPrice !== expectedPrice) {
      throw new Error(
        `Expected price for "${productName}" to be ${expectedPrice}, but found ${actualPrice}`
      );
    }
  }

  async validateItemQuantity(
    productName: string,
    expectedQuantity: string
  ): Promise<void> {
    const actualQuantity = await this.getItemQuantity(productName);
    if (actualQuantity !== expectedQuantity) {
      throw new Error(
        `Expected quantity for "${productName}" to be ${expectedQuantity}, but found ${actualQuantity}`
      );
    }
  }

  async validateEmptyCart(): Promise<void> {
    const isEmpty = await this.isCartEmpty();
    if (!isEmpty) {
      throw new Error("Cart should be empty but contains items");
    }
  }

  async validateCartIsNotEmpty(): Promise<void> {
    const isEmpty = await this.isCartEmpty();
    if (isEmpty) {
      throw new Error("Cart should contain items but is empty");
    }
  }

  async validateCartItemsOrder(expectedOrder: string[]): Promise<void> {
    const actualOrder = await this.getCartItemNames();

    if (actualOrder.length !== expectedOrder.length) {
      throw new Error(
        `Expected ${expectedOrder.length} items, but found ${actualOrder.length}`
      );
    }

    for (let i = 0; i < expectedOrder.length; i++) {
      if (actualOrder[i] !== expectedOrder[i]) {
        throw new Error(
          `Expected item at position ${i} to be "${expectedOrder[i]}", but found "${actualOrder[i]}"`
        );
      }
    }
  }

  // Utility methods
  async getCartSummary(): Promise<{
    itemCount: number;
    items: Array<{
      name: string;
      price: string;
      description: string;
      quantity: string;
    }>;
    totalPrice: number;
  }> {
    const names = await this.getCartItemNames();
    const prices = await this.getCartItemPrices();
    const descriptions = await this.getCartItemDescriptions();
    const quantities = await this.getCartItemQuantities();

    const items = names.map((name, index) => ({
      name,
      price: prices[index],
      description: descriptions[index],
      quantity: quantities[index],
    }));

    const totalPrice = await this.getTotalItemsPrice();

    return {
      itemCount: names.length,
      items,
      totalPrice,
    };
  }

  async findItemByName(productName: string): Promise<{
    name: string;
    price: string;
    description: string;
    quantity: string;
  } | null> {
    const summary = await this.getCartSummary();
    const item = summary.items.find((item) => item.name === productName);
    return item || null;
  }

  async findMostExpensiveItem(): Promise<{
    name: string;
    price: string;
    description: string;
    quantity: string;
  } | null> {
    const summary = await this.getCartSummary();
    if (summary.items.length === 0) return null;

    let maxPrice = 0;
    let expensiveItem = summary.items[0];

    for (const item of summary.items) {
      const price = parseFloat(item.price.replace("$", ""));
      if (price > maxPrice) {
        maxPrice = price;
        expensiveItem = item;
      }
    }

    return expensiveItem;
  }

  async findCheapestItem(): Promise<{
    name: string;
    price: string;
    description: string;
    quantity: string;
  } | null> {
    const summary = await this.getCartSummary();
    if (summary.items.length === 0) return null;

    let minPrice = Infinity;
    let cheapestItem = summary.items[0];

    for (const item of summary.items) {
      const price = parseFloat(item.price.replace("$", ""));
      if (price < minPrice) {
        minPrice = price;
        cheapestItem = item;
      }
    }

    return cheapestItem;
  }

  async takeCartScreenshot(name: string = "cart-page"): Promise<void> {
    await this.takePageScreenshot(name);
  }

  // Advanced interaction methods
  async hoverOverItem(productName: string): Promise<void> {
    const cartItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    await this.hoverElement(cartItem);
  }

  async scrollToItem(productName: string): Promise<void> {
    const cartItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    await this.scrollIntoView(cartItem);
  }

  async removeItemsInSequence(
    productNames: string[],
    delay: number = 1000
  ): Promise<void> {
    for (const productName of productNames) {
      await this.removeItemFromCart(productName);
      await this.page.waitForTimeout(delay);
    }
  }

  async clearCartWithDelay(delay: number = 500): Promise<void> {
    while (!(await this.isCartEmpty())) {
      await this.removeFirstItem();
      await this.page.waitForTimeout(delay);
    }
  }

  // Cart item interaction methods
  async clickItemName(productName: string): Promise<void> {
    const cartItem = this.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });
    const nameElement = cartItem.locator(".inventory_item_name");
    await this.clickElement(nameElement);
  }

  async getItemPosition(productName: string): Promise<number> {
    const names = await this.getCartItemNames();
    return names.indexOf(productName);
  }

  async swapItemPositions(
    firstItem: string,
    secondItem: string
  ): Promise<void> {
    // Note: This would require drag and drop functionality if supported by the application
    throw new Error(
      "Item position swapping is not supported in the current implementation"
    );
  }
}
