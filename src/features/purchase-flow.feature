Feature: E2E Product Purchase Flow
  As a customer of SauceDemo
  I want to be able to browse and purchase products
  So that I can complete my shopping journey successfully

  Background:
    Given I am on the SauceDemo login page
    And the login page is properly loaded

  @smoke @e2e @purchase
  Scenario: Complete purchase of a single product with standard user
    Given I login with standard user credentials
    When I should be redirected to the inventory page
    And I add "Sauce Labs Backpack" to the cart
    Then I should see the cart badge shows "1"
    When I navigate to the cart page
    Then I should see "Sauce Labs Backpack" in the cart
    And I should see the correct price for "Sauce Labs Backpack"
    When I proceed to checkout
    And I fill in the checkout information with valid data
    And I continue to checkout overview
    Then I should see the order summary with "Sauce Labs Backpack"
    And I should see the correct pricing calculations
    When I finish the checkout process
    Then I should see the order completion confirmation
    And I should see "Thank you for your order!" message
    When I return to products page
    Then I should be back on the inventory page

  @smoke @e2e @purchase
  Scenario: Complete purchase of multiple products
    Given I login with standard user credentials
    When I should be redirected to the inventory page
    And I add the following products to the cart:
      | Product Name                    |
      | Sauce Labs Backpack             |
      | Sauce Labs Bike Light           |
      | Sauce Labs Bolt T-Shirt         |
    Then I should see the cart badge shows "3"
    When I navigate to the cart page
    Then I should see all selected products in the cart
    When I proceed to checkout
    And I fill in the checkout information:
      | Field       | Value     |
      | First Name  | John      |
      | Last Name   | Doe       |
      | Postal Code | 12345     |
    And I continue to checkout overview
    Then I should see the order summary with all products
    And the total price calculation should be accurate
    When I finish the checkout process
    Then I should see the successful order completion
    And I can return to the products page



  @regression @sorting @purchase
  Scenario: Purchase after sorting products by price (low to high)
    Given I login with standard user credentials
    When I should be redirected to the inventory page
    And I sort products by price from low to high
    Then I should see products sorted by price correctly
    When I add the first product to the cart
    And I navigate to the cart page
    And I proceed to checkout
    When I enter valid checkout information
    And I click continue on checkout
    When I click finish to complete the purchase
    Then I should see the order confirmation

  @regression @sorting @purchase
  Scenario: Purchase after sorting products by name (A to Z)
    Given I login with standard user credentials
    When I should be redirected to the inventory page
    And I sort products by name from A to Z
    Then I should see products sorted alphabetically
    When I add the last product to the cart
    And I proceed through the purchase flow
        When I click finish to complete the purchase
    Then I should see the order confirmation

  @edge-case @purchase @validation
  Scenario: Attempt purchase with all products in cart
    Given I login with standard user credentials
    When I should be redirected to the inventory page
    And I add all available products to the cart
    Then I should see the cart badge shows all product count
    When I navigate to the cart page
    Then I should see all six products listed in the cart
    When I complete the checkout with valid information
    Then I should see the successful completion for all products

  @performance @purchase
  Scenario: Purchase with performance glitch user
    Given I am on the SauceDemo login page
    When I login with performance glitch user credentials
    Then I should eventually be redirected to the inventory page
    When I add "Sauce Labs Onesie" to the cart with patience
    And I complete the purchase flow with performance considerations
    Then I should see the successful order completion

  @visual @purchase
  Scenario: Purchase with visual user to test UI consistency
    Given I am on the SauceDemo login page
    When I login with visual user credentials
    And I should be redirected to the inventory page
    When I add "Test.allTheThings() T-Shirt (Red)" to the cart
    And I navigate through the purchase process
    Then I should complete the purchase despite any visual discrepancies
    And the functionality should remain intact

  @boundary @validation
  Scenario Outline: Purchase validation with different user types
    Given I am on the SauceDemo login page
    When I login with "<user_type>" user credentials
    And I should be redirected to the inventory page
    When I add "<product>" to the cart
    And I complete the purchase process
    Then I should see the successful order completion
    
    Examples:
      | user_type         | product                         |
      | standard          | Sauce Labs Backpack             |
      | performance_glitch| Sauce Labs Bolt T-Shirt         |
      | visual           | Sauce Labs Fleece Jacket        |