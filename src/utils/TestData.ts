/**
 * Test data utilities for SauceDemo application
 * Contains static test data and helper methods for generating test data
 *
 * Required Environment Variables:
 * - SAUCE_PASSWORD: Password for all SauceDemo users (REQUIRED)
 *
 * Optional Environment Variables:
 * - BASE_URL: Base URL for the application (default: https://www.saucedemo.com)
 * - TIMEOUT: Test timeout in milliseconds (default: 60000)
 * - HEADLESS: Run tests in headless mode (default: false)
 * - BROWSER: Browser to use for testing (default: chromium)
 *
 * Setup Instructions:
 * 1. Set locally: export SAUCE_PASSWORD
 * 2. Or add to .env file: SAUCE_PASSWORD
 * 3. For GitHub Actions: Add SAUCE_PASSWORD to repository secrets
 */

export class TestData {
  // Get password from environment variable - throws error if not set
  private static getPassword(): string {
    const password = process.env.SAUCE_PASSWORD;

    if (!password) {
      throw new Error(`❌ SAUCE_PASSWORD environment variable is not set!`);
    }

    return password;
  } // User credentials - using getter to ensure environment variables are read at runtime
  static get users() {
    return {
      standard: {
        username: "standard_user",
        password: TestData.getPassword(),
      },
      locked: {
        username: "locked_out_user",
        password: TestData.getPassword(),
      },
      problem: {
        username: "problem_user",
        password: TestData.getPassword(),
      },
      performance: {
        username: "performance_glitch_user",
        password: TestData.getPassword(),
      },
      error: {
        username: "error_user",
        password: TestData.getPassword(),
      },
      visual: {
        username: "visual_user",
        password: TestData.getPassword(),
      },
    };
  }

  // Invalid credentials for negative testing
  static readonly invalidCredentials = {
    username: "invalid_user",
    password: "invalid_password", // Keep this as hardcoded invalid password
  };

  // Product information
  static readonly products = {
    backpack: {
      name: "Sauce Labs Backpack",
      description:
        "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
      price: "$29.99",
    },
    bikeLight: {
      name: "Sauce Labs Bike Light",
      description:
        "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
      price: "$9.99",
    },
    boltTshirt: {
      name: "Sauce Labs Bolt T-Shirt",
      description:
        "Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather grey with red bolt.",
      price: "$15.99",
    },
    fleeceJacket: {
      name: "Sauce Labs Fleece Jacket",
      description:
        "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
      price: "$49.99",
    },
    onesie: {
      name: "Sauce Labs Onesie",
      description:
        "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
      price: "$7.99",
    },
    redTshirt: {
      name: "Test.allTheThings() T-Shirt (Red)",
      description:
        "This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton blend slim fit you'll love what you're wearing.",
      price: "$15.99",
    },
  };

  // Checkout information
  static readonly checkoutInfo = {
    valid: {
      firstName: "John",
      lastName: "Doe",
      postalCode: "12345",
    },
    alternative: {
      firstName: "Jane",
      lastName: "Smith",
      postalCode: "54321",
    },
    international: {
      firstName: "Carlos",
      lastName: "Rodriguez",
      postalCode: "M5H 2N2",
    },
  };

  // Error messages
  static readonly errorMessages = {
    lockedUser: "Epic sadface: Sorry, this user has been locked out.",
    invalidCredentials:
      "Epic sadface: Username and password do not match any user in this service",
    emptyUsername: "Epic sadface: Username is required",
    emptyPassword: "Epic sadface: Password is required",
    emptyFirstName: "Error: First Name is required",
    emptyLastName: "Error: Last Name is required",
    emptyPostalCode: "Error: Postal Code is required",
  };

  // Success messages
  static readonly successMessages = {
    orderComplete: "Thank you for your order!",
    orderDispatched:
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
  };

  // Sort options
  static readonly sortOptions = {
    nameAZ: "az",
    nameZA: "za",
    priceLowHigh: "lohi",
    priceHighLow: "hilo",
  };

  // Helper methods
  static getUserCredentials(userType: string) {
    switch (userType.toLowerCase()) {
      case "standard":
        return this.users.standard;
      case "locked":
      case "locked_out":
        return this.users.locked;
      case "problem":
        return this.users.problem;
      case "performance":
      case "performance_glitch":
        return this.users.performance;
      case "error":
        return this.users.error;
      case "visual":
        return this.users.visual;
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }
  }

  static getProductByName(productName: string) {
    const product = Object.values(this.products).find(
      (p) => p.name === productName
    );
    if (!product) {
      throw new Error(`Product not found: ${productName}`);
    }
    return product;
  }

  static getAllProductNames(): string[] {
    return Object.values(this.products).map((p) => p.name);
  }

  static getRandomProduct() {
    const products = Object.values(this.products);
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  }

  static getRandomCheckoutInfo() {
    const infos = [
      this.checkoutInfo.valid,
      this.checkoutInfo.alternative,
      this.checkoutInfo.international,
    ];
    const randomIndex = Math.floor(Math.random() * infos.length);
    return infos[randomIndex];
  }

  // Validation helpers
  static isValidUserType(userType: string): boolean {
    const validTypes = [
      "standard",
      "locked",
      "locked_out",
      "problem",
      "performance",
      "performance_glitch",
      "error",
      "visual",
    ];
    return validTypes.includes(userType.toLowerCase());
  }

  static isValidSortOption(sortOption: string): boolean {
    return Object.values(this.sortOptions).includes(sortOption);
  }

  // Price helpers
  static parsePrice(priceString: string): number {
    return parseFloat(priceString.replace("$", ""));
  }

  static formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  static calculateTax(subtotal: number, taxRate: number = 0.08): number {
    return subtotal * taxRate;
  }

  static calculateTotal(subtotal: number, tax: number): number {
    return subtotal + tax;
  }

  // Test environment helpers
  static getBaseUrl(): string {
    return process.env.BASE_URL || "https://www.saucedemo.com";
  }

  static getTimeout(): number {
    return parseInt(process.env.TIMEOUT || "60000");
  }

  static isHeadless(): boolean {
    return process.env.HEADLESS === "true";
  }

  static getBrowser(): string {
    return process.env.BROWSER || "chromium";
  }

  // Security helpers
  static getSaucePassword(): string {
    return TestData.getPassword();
  }

  static isPasswordFromEnv(): boolean {
    return !!process.env.SAUCE_PASSWORD;
  }

  static validateEnvironment(): void {
    // This will throw an error if SAUCE_PASSWORD is not set
    TestData.getPassword();
  }

  // Date and time helpers
  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  static generateUniqueId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Screenshot helpers
  static getScreenshotPath(testName: string): string {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    return `screenshots/${testName}-${timestamp}.png`;
  }

  // Performance helpers
  static getPerformanceTimeout(): number {
    return this.getTimeout() * 2; // Double timeout for performance glitch user
  }

  static getSlowTypingDelay(): number {
    return 100; // milliseconds
  }
}
