/**
 * Test utilities and helper functions
 * Contains common utility methods for test automation
 */

export class TestUtils {
  /**
   * Wait for a specified amount of time
   * @param ms - Time to wait in milliseconds
   */
  static async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry a function until it succeeds or max attempts are reached
   * @param fn - Function to retry
   * @param maxAttempts - Maximum number of attempts
   * @param delay - Delay between attempts in milliseconds
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        console.log(`Attempt ${attempt} failed: ${error}`);

        if (attempt < maxAttempts) {
          await this.wait(delay);
        }
      }
    }

    throw new Error(
      `Failed after ${maxAttempts} attempts. Last error: ${
        lastError?.message || "Unknown error"
      }`
    );
  }

  /**
   * Generate random string of specified length
   * @param length - Length of the string
   * @param chars - Character set to use
   */
  static generateRandomString(
    length: number = 10,
    chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  ): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email address
   */
  static generateRandomEmail(): string {
    const domains = ["example.com", "test.com", "demo.org"];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    return `test${this.generateRandomString(8)}@${randomDomain}`;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const centralOffice = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `${areaCode}-${centralOffice}-${lineNumber}`;
  }

  /**
   * Generate random postal code
   */
  static generateRandomPostalCode(): string {
    return Math.floor(Math.random() * 90000) + 10000 + "";
  }

  /**
   * Convert string to title case
   * @param str - String to convert
   */
  static toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Remove special characters from string
   * @param str - String to clean
   */
  static removeSpecialChars(str: string): string {
    return str.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  /**
   * Format currency value
   * @param amount - Amount to format
   * @param currency - Currency symbol
   */
  static formatCurrency(amount: number, currency: string = "$"): string {
    return `${currency}${amount.toFixed(2)}`;
  }

  /**
   * Parse currency string to number
   * @param currencyString - Currency string like "$29.99"
   */
  static parseCurrency(currencyString: string): number {
    return parseFloat(currencyString.replace(/[^0-9.-]+/g, ""));
  }

  /**
   * Calculate percentage
   * @param value - Value
   * @param total - Total value
   */
  static calculatePercentage(value: number, total: number): number {
    return (value / total) * 100;
  }

  /**
   * Round number to specified decimal places
   * @param num - Number to round
   * @param decimals - Number of decimal places
   */
  static roundToDecimals(num: number, decimals: number = 2): number {
    return (
      Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) /
      Math.pow(10, decimals)
    );
  }

  /**
   * Check if arrays are equal
   * @param arr1 - First array
   * @param arr2 - Second array
   */
  static arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
  }

  /**
   * Get unique values from array
   * @param arr - Array to process
   */
  static getUniqueValues<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  /**
   * Shuffle array elements
   * @param arr - Array to shuffle
   */
  static shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get random element from array
   * @param arr - Array to pick from
   */
  static getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Get multiple random elements from array
   * @param arr - Array to pick from
   * @param count - Number of elements to pick
   */
  static getRandomElements<T>(arr: T[], count: number): T[] {
    const shuffled = this.shuffleArray(arr);
    return shuffled.slice(0, Math.min(count, arr.length));
  }

  /**
   * Validate email format
   * @param email - Email to validate
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param phone - Phone number to validate
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate postal code format
   * @param postalCode - Postal code to validate
   */
  static isValidPostalCode(postalCode: string): boolean {
    const usPostalRegex = /^\d{5}(-\d{4})?$/;
    const caPostalRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    return usPostalRegex.test(postalCode) || caPostalRegex.test(postalCode);
  }

  /**
   * Get current date in specified format
   * @param format - Date format (YYYY-MM-DD, MM/DD/YYYY, etc.)
   */
  static getCurrentDate(format: string = "YYYY-MM-DD"): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    switch (format) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  /**
   * Get timestamp for file naming
   */
  static getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, "-");
  }

  /**
   * Create delay with progress logging
   * @param ms - Milliseconds to wait
   * @param message - Optional message to log
   */
  static async delayWithProgress(ms: number, message?: string): Promise<void> {
    if (message) {
      console.log(`${message} - waiting ${ms}ms...`);
    }
    await this.wait(ms);
  }

  /**
   * Log test step with timestamp
   * @param step - Step description
   * @param details - Optional details
   */
  static logTestStep(step: string, details?: string): void {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] STEP: ${step}${details ? ` - ${details}` : ""}`
    );
  }

  /**
   * Log test assertion
   * @param assertion - Assertion description
   * @param result - Assertion result
   */
  static logAssertion(assertion: string, result: boolean): void {
    const timestamp = new Date().toISOString();
    const status = result ? "✓ PASS" : "✗ FAIL";
    console.log(`[${timestamp}] ASSERT: ${assertion} - ${status}`);
  }

  /**
   * Create test data object with timestamp
   * @param baseData - Base test data
   */
  static createTestData<T>(
    baseData: T
  ): T & { timestamp: string; testId: string } {
    return {
      ...baseData,
      timestamp: this.getTimestamp(),
      testId: this.generateRandomString(8),
    };
  }

  /**
   * Safe string comparison (case-insensitive)
   * @param str1 - First string
   * @param str2 - Second string
   */
  static safeStringCompare(str1: string, str2: string): boolean {
    return str1?.toLowerCase().trim() === str2?.toLowerCase().trim();
  }

  /**
   * Extract numbers from string
   * @param str - String containing numbers
   */
  static extractNumbers(str: string): number[] {
    const matches = str.match(/\d+(\.\d+)?/g);
    return matches ? matches.map(Number) : [];
  }

  /**
   * Convert camelCase to kebab-case
   * @param str - CamelCase string
   */
  static camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
  }

  /**
   * Convert kebab-case to camelCase
   * @param str - Kebab-case string
   */
  static kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  /**
   * Measure execution time of a function
   * @param fn - Function to measure
   * @param label - Optional label for logging
   */
  static async measureExecutionTime<T>(
    fn: () => Promise<T>,
    label?: string
  ): Promise<{ result: T; executionTime: number }> {
    const startTime = Date.now();
    const result = await fn();
    const executionTime = Date.now() - startTime;

    if (label) {
      console.log(`${label} executed in ${executionTime}ms`);
    }

    return { result, executionTime };
  }

  /**
   * Enhanced retry function with mobile-specific optimizations
   * @param fn - Function to retry
   * @param maxAttempts - Maximum number of attempts
   * @param delay - Delay between attempts in milliseconds
   * @param isMobile - Whether running on mobile device
   */
  static async retryWithMobileOptimization<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000,
    isMobile: boolean = false
  ): Promise<T> {
    let lastError: Error | null = null;

    // Increase delay for mobile devices
    const adjustedDelay = isMobile ? delay * 1.5 : delay;
    const adjustedMaxAttempts = isMobile ? maxAttempts + 1 : maxAttempts;

    for (let attempt = 1; attempt <= adjustedMaxAttempts; attempt++) {
      try {
        // Add extra wait for mobile on first attempt
        if (isMobile && attempt === 1) {
          await this.wait(500);
        }
        return await fn();
      } catch (error) {
        lastError = error as Error;
        console.log(
          `Attempt ${attempt} failed${isMobile ? " (Mobile)" : ""}: ${error}`
        );

        if (attempt < adjustedMaxAttempts) {
          await this.wait(adjustedDelay);
        }
      }
    }

    throw new Error(
      `Failed after ${adjustedMaxAttempts} attempts${
        isMobile ? " on mobile device" : ""
      }. Last error: ${lastError?.message || "Unknown error"}`
    );
  }

  /**
   * Detect if current browser project is mobile
   * @param projectName - Playwright project name
   */
  static isMobileProject(projectName?: string): boolean {
    if (!projectName) return false;
    return projectName.toLowerCase().includes("mobile");
  }

  /**
   * Mobile-optimized wait with progressive delays
   * @param baseMs - Base wait time in milliseconds
   * @param isMobile - Whether running on mobile device
   */
  static async mobileOptimizedWait(
    baseMs: number,
    isMobile: boolean = false
  ): Promise<void> {
    const waitTime = isMobile ? baseMs * 1.5 : baseMs;
    await this.wait(waitTime);
  }
}
