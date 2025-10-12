import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestData } from "../utils/TestData";

/**
 * Login Page Object for SauceDemo login functionality
 * Handles all login-related interactions and validations
 */
export class LoginPage extends BasePage {
  // Page elements using priority locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorButton: Locator;
  private readonly loginForm: Locator;
  private readonly loginLogo: Locator;
  private readonly acceptedUsernames: Locator;
  private readonly password: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators following priority order (SauceDemo uses data-test attributes)
    this.usernameInput = this.locator('[data-test="username"]');
    this.passwordInput = this.locator('[data-test="password"]');
    this.loginButton = this.locator('[data-test="login-button"]');
    this.errorMessage = this.locator('[data-test="error"]');
    this.errorButton = this.locator('[data-test="error-button"]');
    this.loginForm = this.locator(".login_wrapper");
    this.loginLogo = this.locator(".login_logo");
    this.acceptedUsernames = this.locator("#login_credentials");
    this.password = this.locator(".login_password");
  }

  // Navigation methods
  async navigateToLogin(): Promise<void> {
    await this.goto("/");
    await this.waitForPageLoad();
  }

  // Action methods
  async enterUsername(username: string): Promise<void> {
    await this.fillElement(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillElement(this.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }

  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  async clearForm(): Promise<void> {
    await this.clearUsername();
    await this.clearPassword();
  }

  async dismissError(): Promise<void> {
    if (await this.isElementVisible(this.errorButton)) {
      await this.clickElement(this.errorButton);
    }
  }

  // Combined action methods
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async loginWithStandardUser(): Promise<void> {
    const credentials = TestData.users.standard;
    await this.login(credentials.username, credentials.password);
  }

  async loginWithLockedUser(): Promise<void> {
    const credentials = TestData.users.locked;
    await this.login(credentials.username, credentials.password);
  }

  async loginWithProblemUser(): Promise<void> {
    const credentials = TestData.users.problem;
    await this.login(credentials.username, credentials.password);
  }

  async loginWithPerformanceUser(): Promise<void> {
    const credentials = TestData.users.performance;
    await this.login(credentials.username, credentials.password);
  }

  async loginWithErrorUser(): Promise<void> {
    const credentials = TestData.users.error;
    await this.login(credentials.username, credentials.password);
  }

  async loginWithVisualUser(): Promise<void> {
    const credentials = TestData.users.visual;
    await this.login(credentials.username, credentials.password);
  }

  async loginWithInvalidCredentials(
    username: string = TestData.invalidCredentials.username,
    password: string = TestData.invalidCredentials.password
  ): Promise<void> {
    await this.login(username, password);
  }

  // Getter methods
  async getUsername(): Promise<string> {
    return await this.getElementValue(this.usernameInput);
  }

  async getPassword(): Promise<string> {
    return await this.getElementValue(this.passwordInput);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getElementText(this.errorMessage);
    }
    return "";
  }

  async getAcceptedUsernames(): Promise<string> {
    return await this.getElementText(this.acceptedUsernames);
  }

  async getPasswordText(): Promise<string> {
    return await this.getElementText(this.password);
  }

  async getLoginButtonText(): Promise<string> {
    return await this.getElementText(this.loginButton);
  }

  // State check methods
  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.isElementVisible(this.usernameInput);
  }

  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.isElementVisible(this.passwordInput);
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.loginButton);
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.loginButton);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  async isErrorButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorButton);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.loginForm);
  }

  async isLoginPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.loginLogo, 10000);
      await this.waitForElement(this.usernameInput, 10000);
      await this.waitForElement(this.passwordInput, 10000);
      await this.waitForElement(this.loginButton, 10000);
      return true;
    } catch {
      return false;
    }
  }

  // Validation methods
  async validateLoginPageElements(): Promise<void> {
    await this.expectElementToBeVisible(this.loginLogo);
    await this.expectElementToBeVisible(this.usernameInput);
    await this.expectElementToBeVisible(this.passwordInput);
    await this.expectElementToBeVisible(this.loginButton);
    await this.expectElementToBeEnabled(this.loginButton);
  }

  async validateSuccessfulLogin(): Promise<void> {
    await this.expectPageToHaveURL(/.*\/inventory\.html/);
  }

  async validateLoginError(expectedError: string): Promise<void> {
    await this.expectElementToBeVisible(this.errorMessage);
    await this.expectElementToContainText(this.errorMessage, expectedError);
  }

  async validateLockedUserError(): Promise<void> {
    await this.validateLoginError(
      "Epic sadface: Sorry, this user has been locked out."
    );
  }

  async validateInvalidCredentialsError(): Promise<void> {
    await this.validateLoginError(
      "Epic sadface: Username and password do not match any user in this service"
    );
  }

  async validateEmptyUsernameError(): Promise<void> {
    await this.validateLoginError("Epic sadface: Username is required");
  }

  async validateEmptyPasswordError(): Promise<void> {
    await this.validateLoginError("Epic sadface: Password is required");
  }

  // Utility methods
  async getAvailableUsernames(): Promise<string[]> {
    const usernamesText = await this.getAcceptedUsernames();
    const lines = usernamesText.split("\n");
    const usernames: string[] = [];

    for (const line of lines) {
      if (line.includes("_user")) {
        usernames.push(line.trim());
      }
    }

    return usernames;
  }

  async takeLoginPageScreenshot(name: string = "login-page"): Promise<void> {
    await this.takePageScreenshot(name);
  }

  async highlightLoginForm(): Promise<void> {
    await this.loginForm.highlight();
  }

  // Advanced interaction methods
  async typeUsernameSlowly(
    username: string,
    delay: number = 100
  ): Promise<void> {
    await this.typeElement(this.usernameInput, username, delay);
  }

  async typePasswordSlowly(
    password: string,
    delay: number = 100
  ): Promise<void> {
    await this.typeElement(this.passwordInput, password, delay);
  }

  async loginWithKeyboardNavigation(
    username: string,
    password: string
  ): Promise<void> {
    await this.clickElement(this.usernameInput);
    await this.typeElement(this.usernameInput, username);
    await this.pressKey("Tab");
    await this.typeElement(this.passwordInput, password);
    await this.pressKey("Enter");
  }

  async focusOnUsernameField(): Promise<void> {
    await this.clickElement(this.usernameInput);
  }

  async focusOnPasswordField(): Promise<void> {
    await this.clickElement(this.passwordInput);
  }

  async tabToLoginButton(): Promise<void> {
    await this.focusOnPasswordField();
    await this.pressKey("Tab");
  }
}
