import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Checkout Information Page Object for SauceDemo checkout step one functionality
 * Handles customer information input during checkout process
 */
export class CheckoutPage extends BasePage {
  // Page elements
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorButton: Locator;
  private readonly checkoutForm: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators following priority order (SauceDemo uses data-test attributes)
    this.pageTitle = this.getByText("Checkout: Your Information");
    this.firstNameInput = this.locator('[data-test="firstName"]');
    this.lastNameInput = this.locator('[data-test="lastName"]');
    this.postalCodeInput = this.locator('[data-test="postalCode"]');
    this.continueButton = this.locator('[data-test="continue"]');
    this.cancelButton = this.locator('[data-test="cancel"]');
    this.errorMessage = this.locator('[data-test="error"]');
    this.errorButton = this.locator('[data-test="error-button"]');
    this.checkoutForm = this.locator(".checkout_info");
  }

  // Navigation methods
  async navigateToCheckout(): Promise<void> {
    await this.goto("/checkout-step-one.html");
    await this.waitForPageLoad();
  }

  async continueToNextStep(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  async cancelCheckout(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  // Form interaction methods
  async enterFirstName(firstName: string): Promise<void> {
    await this.fillElement(this.firstNameInput, firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.fillElement(this.lastNameInput, lastName);
  }

  async enterPostalCode(postalCode: string): Promise<void> {
    await this.fillElement(this.postalCodeInput, postalCode);
  }

  async clearFirstName(): Promise<void> {
    await this.firstNameInput.clear();
  }

  async clearLastName(): Promise<void> {
    await this.lastNameInput.clear();
  }

  async clearPostalCode(): Promise<void> {
    await this.postalCodeInput.clear();
  }

  async clearAllFields(): Promise<void> {
    await this.clearFirstName();
    await this.clearLastName();
    await this.clearPostalCode();
  }

  async dismissError(): Promise<void> {
    if (await this.isElementVisible(this.errorButton)) {
      await this.clickElement(this.errorButton);
    }
  }

  // Combined action methods
  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
  }

  async fillAndContinue(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.continueToNextStep();
  }

  async fillCheckoutInfoWithValidData(): Promise<void> {
    await this.fillCheckoutInformation("John", "Doe", "12345");
  }

  async fillCheckoutInfoAndContinue(): Promise<void> {
    await this.fillCheckoutInfoWithValidData();
    await this.continueToNextStep();
  }

  // Getter methods
  async getFirstName(): Promise<string> {
    return await this.getElementValue(this.firstNameInput);
  }

  async getLastName(): Promise<string> {
    return await this.getElementValue(this.lastNameInput);
  }

  async getPostalCode(): Promise<string> {
    return await this.getElementValue(this.postalCodeInput);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getElementText(this.errorMessage);
    }
    return "";
  }

  async getFormData(): Promise<{
    firstName: string;
    lastName: string;
    postalCode: string;
  }> {
    return {
      firstName: await this.getFirstName(),
      lastName: await this.getLastName(),
      postalCode: await this.getPostalCode(),
    };
  }

  // State check methods
  async isCheckoutPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.pageTitle, 10000);
      await this.waitForElement(this.firstNameInput, 10000);
      return true;
    } catch {
      return false;
    }
  }

  async isFirstNameFieldVisible(): Promise<boolean> {
    return await this.isElementVisible(this.firstNameInput);
  }

  async isLastNameFieldVisible(): Promise<boolean> {
    return await this.isElementVisible(this.lastNameInput);
  }

  async isPostalCodeFieldVisible(): Promise<boolean> {
    return await this.isElementVisible(this.postalCodeInput);
  }

  async isContinueButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.continueButton);
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.continueButton);
  }

  async isCancelButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cancelButton);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  async isErrorButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorButton);
  }

  async areAllFieldsEmpty(): Promise<boolean> {
    const formData = await this.getFormData();
    return (
      formData.firstName === "" &&
      formData.lastName === "" &&
      formData.postalCode === ""
    );
  }

  async areAllFieldsFilled(): Promise<boolean> {
    const formData = await this.getFormData();
    return (
      formData.firstName !== "" &&
      formData.lastName !== "" &&
      formData.postalCode !== ""
    );
  }

  // Validation methods
  async validateCheckoutPageElements(): Promise<void> {
    await this.expectElementToBeVisible(this.pageTitle);
    await this.expectElementToBeVisible(this.firstNameInput);
    await this.expectElementToBeVisible(this.lastNameInput);
    await this.expectElementToBeVisible(this.postalCodeInput);
    await this.expectElementToBeVisible(this.continueButton);
    await this.expectElementToBeVisible(this.cancelButton);
  }

  async validateSuccessfulContinue(): Promise<void> {
    await this.expectPageToHaveURL(/.*\/checkout-step-two\.html/);
  }

  async validateCheckoutError(expectedError: string): Promise<void> {
    await this.expectElementToBeVisible(this.errorMessage);
    await this.expectElementToContainText(this.errorMessage, expectedError);
  }

  async validateFirstNameRequiredError(): Promise<void> {
    await this.validateCheckoutError("Error: First Name is required");
  }

  async validateLastNameRequiredError(): Promise<void> {
    await this.validateCheckoutError("Error: Last Name is required");
  }

  async validatePostalCodeRequiredError(): Promise<void> {
    await this.validateCheckoutError("Error: Postal Code is required");
  }

  async validateFormData(expectedData: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }): Promise<void> {
    const actualData = await this.getFormData();

    if (actualData.firstName !== expectedData.firstName) {
      throw new Error(
        `Expected first name to be "${expectedData.firstName}", but found "${actualData.firstName}"`
      );
    }

    if (actualData.lastName !== expectedData.lastName) {
      throw new Error(
        `Expected last name to be "${expectedData.lastName}", but found "${actualData.lastName}"`
      );
    }

    if (actualData.postalCode !== expectedData.postalCode) {
      throw new Error(
        `Expected postal code to be "${expectedData.postalCode}", but found "${actualData.postalCode}"`
      );
    }
  }

  // Error testing methods
  async testFirstNameRequiredError(): Promise<void> {
    await this.clearAllFields();
    await this.enterLastName("Doe");
    await this.enterPostalCode("12345");
    await this.continueToNextStep();
    await this.validateFirstNameRequiredError();
  }

  async testLastNameRequiredError(): Promise<void> {
    await this.clearAllFields();
    await this.enterFirstName("John");
    await this.enterPostalCode("12345");
    await this.continueToNextStep();
    await this.validateLastNameRequiredError();
  }

  async testPostalCodeRequiredError(): Promise<void> {
    await this.clearAllFields();
    await this.enterFirstName("John");
    await this.enterLastName("Doe");
    await this.continueToNextStep();
    await this.validatePostalCodeRequiredError();
  }

  async testAllFieldsRequiredError(): Promise<void> {
    await this.clearAllFields();
    await this.continueToNextStep();
    await this.validateFirstNameRequiredError();
  }

  // Utility methods
  async takeCheckoutScreenshot(name: string = "checkout-page"): Promise<void> {
    await this.takePageScreenshot(name);
  }

  async focusOnFirstNameField(): Promise<void> {
    await this.clickElement(this.firstNameInput);
  }

  async focusOnLastNameField(): Promise<void> {
    await this.clickElement(this.lastNameInput);
  }

  async focusOnPostalCodeField(): Promise<void> {
    await this.clickElement(this.postalCodeInput);
  }

  async tabThroughFields(): Promise<void> {
    await this.focusOnFirstNameField();
    await this.pressKey("Tab");
    await this.pressKey("Tab");
    await this.pressKey("Tab");
  }

  async fillWithKeyboardNavigation(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.focusOnFirstNameField();
    await this.typeElement(this.firstNameInput, firstName);
    await this.pressKey("Tab");
    await this.typeElement(this.lastNameInput, lastName);
    await this.pressKey("Tab");
    await this.typeElement(this.postalCodeInput, postalCode);
    await this.pressKey("Tab");
    await this.pressKey("Enter");
  }

  // Advanced validation methods
  async validateFieldLengthLimits(): Promise<void> {
    const longText = "A".repeat(1000);

    await this.fillElement(this.firstNameInput, longText);
    await this.fillElement(this.lastNameInput, longText);
    await this.fillElement(this.postalCodeInput, longText);

    // Check if fields accept the long text or truncate it
    const actualFirstName = await this.getFirstName();
    const actualLastName = await this.getLastName();
    const actualPostalCode = await this.getPostalCode();

    console.log(`First Name length: ${actualFirstName.length}`);
    console.log(`Last Name length: ${actualLastName.length}`);
    console.log(`Postal Code length: ${actualPostalCode.length}`);
  }

  async validateSpecialCharacters(): Promise<void> {
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    await this.fillElement(this.firstNameInput, specialChars);
    await this.fillElement(this.lastNameInput, specialChars);
    await this.fillElement(this.postalCodeInput, specialChars);

    const actualFirstName = await this.getFirstName();
    const actualLastName = await this.getLastName();
    const actualPostalCode = await this.getPostalCode();

    console.log(`First Name with special chars: "${actualFirstName}"`);
    console.log(`Last Name with special chars: "${actualLastName}"`);
    console.log(`Postal Code with special chars: "${actualPostalCode}"`);
  }

  async validateNumericInputs(): Promise<void> {
    await this.fillElement(this.firstNameInput, "12345");
    await this.fillElement(this.lastNameInput, "67890");
    await this.fillElement(this.postalCodeInput, "ABCDE");

    const formData = await this.getFormData();
    console.log("Numeric inputs test:", formData);
  }
}
