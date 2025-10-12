import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Checkout Overview Page Object for SauceDemo checkout step two functionality
 * Handles order review and final checkout completion
 */
export class CheckoutOverviewPage extends BasePage {
  // Page elements
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemDescriptions: Locator;
  private readonly cartItemPrices: Locator;
  private readonly cartItemQuantities: Locator;
  private readonly paymentInfo: Locator;
  private readonly shippingInfo: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly summaryContainer: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators following priority order (SauceDemo uses data-test attributes)
    this.pageTitle = this.getByText("Checkout: Overview");
    this.cartItems = this.locator('[data-test="inventory-item"]');
    this.cartItemNames = this.locator('[data-test="inventory-item-name"]');
    this.cartItemDescriptions = this.locator(
      '[data-test="inventory-item-desc"]'
    );
    this.cartItemPrices = this.locator('[data-test="inventory-item-price"]');
    this.cartItemQuantities = this.locator(".cart_quantity");
    this.paymentInfo = this.locator('[data-test="payment-info-value"]');
    this.shippingInfo = this.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = this.locator('[data-test="subtotal-label"]');
    this.taxLabel = this.locator('[data-test="tax-label"]');
    this.totalLabel = this.locator('[data-test="total-label"]');
    this.finishButton = this.locator('[data-test="finish"]');
    this.cancelButton = this.locator('[data-test="cancel"]');
    this.summaryContainer = this.locator(".cart_list");
  }

  // Navigation methods
  async navigateToCheckoutOverview(): Promise<void> {
    await this.goto("/checkout-step-two.html");
    await this.waitForPageLoad();
  }

  async finishCheckout(): Promise<void> {
    await this.clickElement(this.finishButton);
  }

  async cancelCheckout(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  // Getter methods
  async getCartItemCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
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

  async getPaymentInfo(): Promise<string> {
    return await this.getElementText(this.paymentInfo);
  }

  async getShippingInfo(): Promise<string> {
    return await this.getElementText(this.shippingInfo);
  }

  async getSubtotal(): Promise<string> {
    const subtotalText = await this.getElementText(this.subtotalLabel);
    return subtotalText.replace("Item total: $", "");
  }

  async getTax(): Promise<string> {
    const taxText = await this.getElementText(this.taxLabel);
    return taxText.replace("Tax: $", "");
  }

  async getTotal(): Promise<string> {
    const totalText = await this.getElementText(this.totalLabel);
    return totalText.replace("Total: $", "");
  }

  async getSubtotalAmount(): Promise<number> {
    const subtotal = await this.getSubtotal();
    return parseFloat(subtotal);
  }

  async getTaxAmount(): Promise<number> {
    const tax = await this.getTax();
    return parseFloat(tax);
  }

  async getTotalAmount(): Promise<number> {
    const total = await this.getTotal();
    return parseFloat(total);
  }

  async getItemPrice(productName: string): Promise<string> {
    const cartItem = this.cartItems.filter({
      hasText: productName,
    });
    const priceElement = cartItem.locator('[data-test="inventory-item-price"]');
    return await this.getElementText(priceElement);
  }

  async getItemDescription(productName: string): Promise<string> {
    const cartItem = this.cartItems.filter({
      hasText: productName,
    });
    const descElement = cartItem.locator('[data-test="inventory-item-desc"]');
    return await this.getElementText(descElement);
  }

  async getItemQuantity(productName: string): Promise<string> {
    const cartItem = this.cartItems.filter({
      hasText: productName,
    });
    const quantityElement = cartItem.locator(".cart_quantity");
    return await this.getElementText(quantityElement);
  }

  // State check methods
  async isCheckoutOverviewPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle, 10000);
      await this.waitForElement(this.summaryContainer, 10000);
      return true;
    } catch {
      return false;
    }
  }

  async isItemInOrder(productName: string): Promise<boolean> {
    const cartItem = this.cartItems.filter({
      hasText: productName,
    });
    return await this.isElementVisible(cartItem);
  }

  async isFinishButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.finishButton);
  }

  async isFinishButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.finishButton);
  }

  async isCancelButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cancelButton);
  }

  async isPaymentInfoVisible(): Promise<boolean> {
    return await this.isElementVisible(this.paymentInfo);
  }

  async isShippingInfoVisible(): Promise<boolean> {
    return await this.isElementVisible(this.shippingInfo);
  }

  async isPricingSummaryVisible(): Promise<boolean> {
    return (
      (await this.isElementVisible(this.subtotalLabel)) &&
      (await this.isElementVisible(this.taxLabel)) &&
      (await this.isElementVisible(this.totalLabel))
    );
  }

  // Validation methods
  async validateCheckoutOverviewPageElements(): Promise<void> {
    await this.expectElementToBeVisible(this.pageTitle);
    await this.expectElementToBeVisible(this.summaryContainer);
    await this.expectElementToBeVisible(this.finishButton);
    await this.expectElementToBeVisible(this.cancelButton);
    await this.expectElementToBeVisible(this.paymentInfo);
    await this.expectElementToBeVisible(this.shippingInfo);
    await this.expectElementToBeVisible(this.subtotalLabel);
    await this.expectElementToBeVisible(this.taxLabel);
    await this.expectElementToBeVisible(this.totalLabel);
  }

  async validateSuccessfulCheckout(): Promise<void> {
    await this.expectPageToHaveURL(/.*\/checkout-complete\.html/);
  }

  async validateItemCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartItemCount();
    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} items in order, but found ${actualCount}`
      );
    }
  }

  async validateItemInOrder(productName: string): Promise<void> {
    const isInOrder = await this.isItemInOrder(productName);
    if (!isInOrder) {
      throw new Error(`Product "${productName}" is not in the order summary`);
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

  async validatePriceCalculation(): Promise<void> {
    const subtotal = await this.getSubtotalAmount();
    const tax = await this.getTaxAmount();
    const total = await this.getTotalAmount();

    const calculatedTotal = subtotal + tax;
    const roundedCalculatedTotal = Math.round(calculatedTotal * 100) / 100;

    if (Math.abs(total - roundedCalculatedTotal) > 0.01) {
      throw new Error(
        `Price calculation error: Subtotal (${subtotal}) + Tax (${tax}) = ${calculatedTotal}, ` +
          `but Total shows ${total}`
      );
    }
  }

  async validateSubtotalMatchesItemPrices(): Promise<void> {
    const itemPrices = await this.getCartItemPrices();
    let calculatedSubtotal = 0;

    for (const priceText of itemPrices) {
      const price = parseFloat(priceText.replace("$", ""));
      calculatedSubtotal += price;
    }

    const displayedSubtotal = await this.getSubtotalAmount();

    if (Math.abs(calculatedSubtotal - displayedSubtotal) > 0.01) {
      throw new Error(
        `Subtotal mismatch: Sum of item prices is ${calculatedSubtotal}, ` +
          `but subtotal shows ${displayedSubtotal}`
      );
    }
  }

  async validateTaxRate(): Promise<void> {
    const subtotal = await this.getSubtotalAmount();
    const tax = await this.getTaxAmount();
    const taxRate = (tax / subtotal) * 100;

    // Assuming 8% tax rate (common in many states)
    const expectedTaxRate = 8.0;
    const tolerance = 0.5; // 0.5% tolerance

    if (Math.abs(taxRate - expectedTaxRate) > tolerance) {
      console.warn(
        `Tax rate appears to be ${taxRate.toFixed(
          2
        )}%, expected around ${expectedTaxRate}%`
      );
    }
  }

  async validateOrderSummary(
    expectedItems: Array<{
      name: string;
      price: string;
      quantity?: string;
    }>
  ): Promise<void> {
    await this.validateItemCount(expectedItems.length);

    for (const expectedItem of expectedItems) {
      await this.validateItemInOrder(expectedItem.name);
      await this.validateItemPrice(expectedItem.name, expectedItem.price);

      if (expectedItem.quantity) {
        await this.validateItemQuantity(
          expectedItem.name,
          expectedItem.quantity
        );
      }
    }

    await this.validateSubtotalMatchesItemPrices();
    await this.validatePriceCalculation();
  }

  // Utility methods
  async getOrderSummary(): Promise<{
    itemCount: number;
    items: Array<{
      name: string;
      price: string;
      description: string;
      quantity: string;
    }>;
    paymentInfo: string;
    shippingInfo: string;
    subtotal: number;
    tax: number;
    total: number;
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

    return {
      itemCount: names.length,
      items,
      paymentInfo: await this.getPaymentInfo(),
      shippingInfo: await this.getShippingInfo(),
      subtotal: await this.getSubtotalAmount(),
      tax: await this.getTaxAmount(),
      total: await this.getTotalAmount(),
    };
  }

  async takeOrderSummaryScreenshot(
    name: string = "order-summary"
  ): Promise<void> {
    await this.takePageScreenshot(name);
  }

  async scrollToOrderSummary(): Promise<void> {
    await this.scrollIntoView(this.summaryContainer);
  }

  async scrollToPricingSummary(): Promise<void> {
    await this.scrollIntoView(this.subtotalLabel);
  }

  async hoverOverItem(productName: string): Promise<void> {
    const cartItem = this.cartItems.filter({
      hasText: productName,
    });
    await this.hoverElement(cartItem);
  }

  async highlightFinishButton(): Promise<void> {
    await this.finishButton.highlight();
  }

  // Advanced validation methods
  async validatePaymentMethod(
    expectedPaymentMethod: string = "SauceCard #31337"
  ): Promise<void> {
    const actualPaymentInfo = await this.getPaymentInfo();
    if (actualPaymentInfo !== expectedPaymentMethod) {
      throw new Error(
        `Expected payment method to be "${expectedPaymentMethod}", ` +
          `but found "${actualPaymentInfo}"`
      );
    }
  }

  async validateShippingMethod(
    expectedShippingMethod: string = "Free Pony Express Delivery!"
  ): Promise<void> {
    const actualShippingInfo = await this.getShippingInfo();
    if (actualShippingInfo !== expectedShippingMethod) {
      throw new Error(
        `Expected shipping method to be "${expectedShippingMethod}", ` +
          `but found "${actualShippingInfo}"`
      );
    }
  }

  async validateCompleteOrderFlow(): Promise<void> {
    await this.validateCheckoutOverviewPageElements();
    await this.validateSubtotalMatchesItemPrices();
    await this.validatePriceCalculation();
    await this.validatePaymentMethod();
    await this.validateShippingMethod();
  }

  // Interaction methods
  async clickItemName(productName: string): Promise<void> {
    const cartItem = this.cartItems.filter({
      hasText: productName,
    });
    const nameElement = cartItem.locator('[data-test="inventory-item-name"]');
    await this.clickElement(nameElement);
  }

  async reviewOrderDetails(): Promise<void> {
    const summary = await this.getOrderSummary();

    console.log("=== ORDER REVIEW ===");
    console.log(`Items: ${summary.itemCount}`);
    console.log(`Payment: ${summary.paymentInfo}`);
    console.log(`Shipping: ${summary.shippingInfo}`);
    console.log(`Subtotal: $${summary.subtotal}`);
    console.log(`Tax: $${summary.tax}`);
    console.log(`Total: $${summary.total}`);
    console.log("\nItems in order:");

    summary.items.forEach((item, index) => {
      console.log(
        `${index + 1}. ${item.name} - ${item.price} (Qty: ${item.quantity})`
      );
    });
  }
}
