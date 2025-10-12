import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Checkout Complete Page Object for SauceDemo order completion functionality
 * Handles order confirmation and completion messaging
 */
export class CheckoutCompletePage extends BasePage {
  // Page elements
  private readonly pageTitle: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly ponyExpressImage: Locator;
  private readonly backHomeButton: Locator;
  private readonly checkmarkImage: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators following priority order (SauceDemo uses data-test attributes)
    this.pageTitle = this.getByText("Checkout: Complete!");
    this.completeHeader = this.locator('[data-test="complete-header"]');
    this.completeText = this.locator('[data-test="complete-text"]');
    this.ponyExpressImage = this.locator(".pony_express");
    this.backHomeButton = this.locator('[data-test="back-to-products"]');
    this.checkmarkImage = this.locator(".complete-checkmark");
  }

  // Navigation methods
  async navigateToComplete(): Promise<void> {
    await this.goto("/checkout-complete.html");
    await this.waitForPageLoad();
  }

  async backToProducts(): Promise<void> {
    await this.clickElement(this.backHomeButton);
  }

  // Getter methods
  async getCompleteHeader(): Promise<string> {
    return await this.getElementText(this.completeHeader);
  }

  async getCompleteText(): Promise<string> {
    return await this.getElementText(this.completeText);
  }

  async getBackHomeButtonText(): Promise<string> {
    return await this.getElementText(this.backHomeButton);
  }

  // State check methods
  async isCheckoutCompletePageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle, 10000);
      await this.waitForElement(this.completeHeader, 10000);
      return true;
    } catch {
      return false;
    }
  }

  async isCompleteHeaderVisible(): Promise<boolean> {
    return await this.isElementVisible(this.completeHeader);
  }

  async isCompleteTextVisible(): Promise<boolean> {
    return await this.isElementVisible(this.completeText);
  }

  async isBackHomeButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.backHomeButton);
  }

  async isBackHomeButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.backHomeButton);
  }

  async isPonyExpressImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.ponyExpressImage);
  }

  async isCheckmarkImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.checkmarkImage);
  }

  // Validation methods
  async validateCheckoutCompletePageElements(): Promise<void> {
    await this.expectElementToBeVisible(this.pageTitle);
    await this.expectElementToBeVisible(this.completeHeader);
    await this.expectElementToBeVisible(this.completeText);
    await this.expectElementToBeVisible(this.backHomeButton);
    await this.expectElementToBeEnabled(this.backHomeButton);
  }

  async validateSuccessfulOrderCompletion(): Promise<void> {
    await this.expectPageToHaveURL(/.*\/checkout-complete\.html/);
    await this.validateCheckoutCompletePageElements();
  }

  async validateCompleteHeader(
    expectedHeader: string = "Thank you for your order!"
  ): Promise<void> {
    const actualHeader = await this.getCompleteHeader();
    if (actualHeader !== expectedHeader) {
      throw new Error(
        `Expected header to be "${expectedHeader}", but found "${actualHeader}"`
      );
    }
  }

  async validateCompleteText(
    expectedText: string = "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
  ): Promise<void> {
    const actualText = await this.getCompleteText();
    if (actualText !== expectedText) {
      throw new Error(
        `Expected text to be "${expectedText}", but found "${actualText}"`
      );
    }
  }

  async validateReturnToProducts(): Promise<void> {
    await this.expectPageToHaveURL(/.*\/inventory\.html/);
  }

  async validateOrderCompletionFlow(): Promise<void> {
    await this.validateCheckoutCompletePageElements();
    await this.validateCompleteHeader();
    await this.validateCompleteText();
  }

  // Utility methods
  async getCompletionMessage(): Promise<{
    header: string;
    text: string;
    hasCheckmark: boolean;
    hasPonyImage: boolean;
  }> {
    return {
      header: await this.getCompleteHeader(),
      text: await this.getCompleteText(),
      hasCheckmark: await this.isCheckmarkImageVisible(),
      hasPonyImage: await this.isPonyExpressImageVisible(),
    };
  }

  async takeCompletionScreenshot(
    name: string = "order-completion"
  ): Promise<void> {
    await this.takePageScreenshot(name);
  }

  async celebrateOrderCompletion(): Promise<void> {
    const message = await this.getCompletionMessage();

    console.log("🎉 ORDER COMPLETED SUCCESSFULLY! 🎉");
    console.log(`Header: ${message.header}`);
    console.log(`Message: ${message.text}`);
    console.log(`Checkmark visible: ${message.hasCheckmark}`);
    console.log(`Pony image visible: ${message.hasPonyImage}`);
  }

  async highlightSuccessElements(): Promise<void> {
    if (await this.isCheckmarkImageVisible()) {
      await this.checkmarkImage.highlight();
    }

    if (await this.isPonyExpressImageVisible()) {
      await this.ponyExpressImage.highlight();
    }
  }

  // Advanced interaction methods
  async waitForOrderProcessing(timeout: number = 5000): Promise<void> {
    // Simulate waiting for order processing animation if any
    await this.page.waitForTimeout(timeout);
    await this.validateCheckoutCompletePageElements();
  }

  async verifyOrderNotification(): Promise<void> {
    // Check if there are any notification elements or success indicators
    const elements = [
      this.checkmarkImage,
      this.completeHeader,
      this.completeText,
      this.ponyExpressImage,
    ];

    for (const element of elements) {
      if (await this.isElementVisible(element)) {
        console.log(`✓ Success indicator found: ${element}`);
      }
    }
  }

  async scrollToSuccessMessage(): Promise<void> {
    await this.scrollIntoView(this.completeHeader);
  }

  async focusOnBackButton(): Promise<void> {
    await this.clickElement(this.backHomeButton);
  }

  // Accessibility validation methods
  async validatePageAccessibility(): Promise<void> {
    // Basic accessibility checks
    await this.expectElementToHaveAttribute(
      this.backHomeButton,
      "type",
      "button"
    );

    // Check if images have proper alt text (if applicable)
    if (await this.isCheckmarkImageVisible()) {
      const altText = await this.getElementAttribute(
        this.checkmarkImage,
        "alt"
      );
      if (!altText) {
        console.warn("Checkmark image missing alt text");
      }
    }
  }

  // Performance validation methods
  async measurePageLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.isCheckoutCompletePageLoaded();
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    console.log(`Checkout complete page loaded in ${loadTime}ms`);
    return loadTime;
  }

  // Integration methods for complete checkout flow
  async completeOrderAndReturn(): Promise<void> {
    await this.validateOrderCompletionFlow();
    await this.takeCompletionScreenshot();
    await this.celebrateOrderCompletion();
    await this.backToProducts();
    await this.validateReturnToProducts();
  }

  async verifyOrderCompletionDetails(): Promise<{
    isSuccessful: boolean;
    loadTime: number;
    completionMessage: {
      header: string;
      text: string;
      hasCheckmark: boolean;
      hasPonyImage: boolean;
    };
  }> {
    const startTime = Date.now();
    const isLoaded = await this.isCheckoutCompletePageLoaded();
    const loadTime = Date.now() - startTime;

    let completionMessage = {
      header: "",
      text: "",
      hasCheckmark: false,
      hasPonyImage: false,
    };

    if (isLoaded) {
      completionMessage = await this.getCompletionMessage();
    }

    return {
      isSuccessful: isLoaded,
      loadTime,
      completionMessage,
    };
  }
}
