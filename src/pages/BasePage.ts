import { Page, Locator, expect } from "@playwright/test";

/**
 * Base Page class containing common functionality for all page objects
 * Provides reusable methods and properties that all pages can inherit
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || "https://www.saucedemo.com";
  }

  // Navigation methods
  async goto(path: string = ""): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  // Locator methods following priority order: roles, text, label, types, placeholder, title, testid, css, xpath
  protected getByRole(
    role: string,
    options?: { name?: string | RegExp; exact?: boolean }
  ): Locator {
    return this.page.getByRole(role as any, options);
  }

  protected getByText(
    text: string | RegExp,
    options?: { exact?: boolean }
  ): Locator {
    return this.page.getByText(text, options);
  }

  protected getByLabel(
    text: string | RegExp,
    options?: { exact?: boolean }
  ): Locator {
    return this.page.getByLabel(text, options);
  }

  protected getByPlaceholder(
    text: string | RegExp,
    options?: { exact?: boolean }
  ): Locator {
    return this.page.getByPlaceholder(text, options);
  }

  protected getByTitle(
    text: string | RegExp,
    options?: { exact?: boolean }
  ): Locator {
    return this.page.getByTitle(text, options);
  }

  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  // Wait methods
  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState("networkidle", { timeout });
  }

  async waitForElement(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ timeout, state: "visible" });
  }

  async waitForElementToDisappear(
    locator: Locator,
    timeout: number = 10000
  ): Promise<void> {
    await locator.waitFor({ timeout, state: "hidden" });
  }

  // Action methods
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  async doubleClickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.dblclick();
  }

  async rightClickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click({ button: "right" });
  }

  async fillElement(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  async typeElement(
    locator: Locator,
    text: string,
    delay?: number
  ): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.type(text, { delay });
  }

  async selectOption(
    locator: Locator,
    option: string | { label?: string; value?: string; index?: number }
  ): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption(option);
  }

  async checkElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.check();
  }

  async uncheckElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.uncheck();
  }

  async hoverElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.hover();
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  // Text and attribute methods
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || "";
  }

  async getElementValue(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.inputValue();
  }

  async getElementAttribute(
    locator: Locator,
    attribute: string
  ): Promise<string | null> {
    await this.waitForElement(locator);
    return await locator.getAttribute(attribute);
  }

  async getAllElementsText(locator: Locator): Promise<string[]> {
    await locator.first().waitFor({ state: "visible" });
    return await locator.allTextContents();
  }

  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  // State check methods
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isElementHidden(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "hidden", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isElementEnabled(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isEnabled();
  }

  async isElementDisabled(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isDisabled();
  }

  async isElementChecked(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isChecked();
  }

  async isElementEditable(locator: Locator): Promise<boolean> {
    await this.waitForElement(locator);
    return await locator.isEditable();
  }

  // Screenshot methods
  async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.screenshot({ path: `screenshots/${name}.png` });
  }

  async takePageScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }

  // Assertion methods
  async expectElementToBeVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectElementToBeHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  async expectElementToContainText(
    locator: Locator,
    text: string | RegExp
  ): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async expectElementToHaveText(
    locator: Locator,
    text: string | RegExp
  ): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async expectElementToHaveValue(
    locator: Locator,
    value: string | RegExp
  ): Promise<void> {
    await expect(locator).toHaveValue(value);
  }

  async expectElementToHaveAttribute(
    locator: Locator,
    attribute: string,
    value: string | RegExp
  ): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, value);
  }

  async expectElementToBeEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  async expectElementToBeDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  async expectElementToBeChecked(locator: Locator): Promise<void> {
    await expect(locator).toBeChecked();
  }

  async expectElementToBeUnchecked(locator: Locator): Promise<void> {
    await expect(locator).not.toBeChecked();
  }

  async expectPageToHaveTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async expectPageToHaveURL(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  // Utility methods
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async pressKeys(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.page.keyboard.press(key);
    }
  }

  async acceptDialog(): Promise<void> {
    this.page.on("dialog", (dialog) => dialog.accept());
  }

  async dismissDialog(): Promise<void> {
    this.page.on("dialog", (dialog) => dialog.dismiss());
  }

  async handleDialog(
    message: string,
    action: "accept" | "dismiss" = "accept"
  ): Promise<void> {
    this.page.on("dialog", async (dialog) => {
      expect(dialog.message()).toBe(message);
      if (action === "accept") {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  // Multiple elements handling
  async clickElementByIndex(locator: Locator, index: number): Promise<void> {
    const element = locator.nth(index);
    await this.clickElement(element);
  }

  getElementByIndex(locator: Locator, index: number): Locator {
    return locator.nth(index);
  }

  // Wait for multiple conditions
  async waitForAnyElementToBeVisible(
    locators: Locator[],
    timeout: number = 10000
  ): Promise<number> {
    const promises = locators.map((locator, index) =>
      locator.waitFor({ state: "visible", timeout }).then(() => index)
    );

    try {
      return await Promise.race(promises);
    } catch {
      throw new Error("None of the elements became visible within the timeout");
    }
  }

  // Advanced selector methods for complex scenarios
  protected getElementByTextAndRole(
    text: string | RegExp,
    role: string
  ): Locator {
    return this.page.getByRole(role as any).filter({ hasText: text });
  }

  protected getElementByTextNear(
    text: string | RegExp,
    nearSelector: string
  ): Locator {
    return this.page.locator(nearSelector).locator("..").getByText(text);
  }

  protected getElementByMultipleConditions(conditions: {
    role?: string;
    text?: string | RegExp;
    testId?: string;
    css?: string;
    hasText?: string | RegExp;
  }): Locator {
    let locator: Locator;

    if (conditions.role) {
      locator = this.page.getByRole(conditions.role as any);
    } else if (conditions.text) {
      locator = this.page.getByText(conditions.text);
    } else if (conditions.testId) {
      locator = this.page.getByTestId(conditions.testId);
    } else if (conditions.css) {
      locator = this.page.locator(conditions.css);
    } else {
      throw new Error("At least one condition must be provided");
    }

    if (conditions.hasText) {
      locator = locator.filter({ hasText: conditions.hasText });
    }

    return locator;
  }
}
