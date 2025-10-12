Feature: Shopping Cart Management
  As a customer
  I want to manage products in my shopping cart
  So that I can review and modify my selections before checkout

  Background:
    Given I am logged in as standard user
    And I am on the inventory page

  @smoke @cart @add-items
  Scenario: Add single product to cart
    When I add "Sauce Labs Backpack" to the cart
    Then I should see the cart badge shows "1"
    And the "Sauce Labs Backpack" should show "Remove" button
    When I navigate to the cart page
    Then I should see "Sauce Labs Backpack" in the cart
    And the cart should show 1 item

  @smoke @cart @add-items
  Scenario: Add multiple products to cart
    When I add the following products to the cart:
      | Product Name                    |
      | Sauce Labs Backpack             |
      | Sauce Labs Bike Light           |
      | Sauce Labs Bolt T-Shirt         |
    Then I should see the cart badge shows "3"
    When I navigate to the cart page
    Then I should see all selected products in the cart
    And the cart should show 3 items

  @regression @cart @remove-items
  Scenario: Remove single product from inventory page
    Given I have added "Sauce Labs Backpack" to the cart
    When I remove "Sauce Labs Backpack" from the cart on inventory page
    Then I should see the cart badge disappears
    And the "Sauce Labs Backpack" should show "Add to cart" button

  @regression @cart @remove-items
  Scenario: Remove product from cart page
    Given I have added "Sauce Labs Backpack" to the cart
    When I navigate to the cart page
    And I remove "Sauce Labs Backpack" from the cart
    Then I should see the cart is empty
    And I should not see any cart badge

  @regression @cart @remove-items
  Scenario: Remove multiple products from cart
    Given I have added multiple products to the cart:
      | Product Name                    |
      | Sauce Labs Backpack             |
      | Sauce Labs Bike Light           |
      | Sauce Labs Bolt T-Shirt         |
    When I navigate to the cart page
    And I remove "Sauce Labs Bike Light" from the cart
    Then I should see the cart badge shows "2"
    And I should see "Sauce Labs Backpack" in the cart
    And I should see "Sauce Labs Bolt T-Shirt" in the cart
    But I should not see "Sauce Labs Bike Light" in the cart

  @regression @cart @clear-cart
  Scenario: Clear entire cart
    Given I have added all available products to the cart
    When I navigate to the cart page
    And I remove all items from the cart
    Then I should see the cart is empty
    And I should not see any cart badge

  @regression @cart @navigation
  Scenario: Continue shopping from cart
    Given I have added "Sauce Labs Backpack" to the cart
    When I navigate to the cart page
    And I click "Continue Shopping" button
    Then I should be back on the inventory page
    And I should still see the cart badge shows "1"

  @edge-case @cart @maximum-items
  Scenario: Add all available products to cart
    When I add all available products to the cart
    Then I should see the cart badge shows the total number of products
    When I navigate to the cart page
    Then I should see all products listed in the cart
    And each product should have quantity "1"

  @validation @cart @product-details
  Scenario: Verify product details in cart match inventory
    Given I note the details of "Sauce Labs Backpack" on inventory page
    When I add "Sauce Labs Backpack" to the cart
    And I navigate to the cart page
    Then the product details in cart should match inventory details
    And the price should be identical
    And the description should be identical

  @performance @cart
  Scenario Outline: Cart operations with performance considerations
    Given I am logged in as performance glitch user
    When I add products to cart with patience
    | product                         |
    | Sauce Labs Backpack             |
    | Sauce Labs Bike Light           |
    | Sauce Labs Bolt T-Shirt         |
    And I navigate to the cart page
    Then the cart operations should complete eventually with cart count <cartCount>
    And the cart should show <cartCount> items

    Examples:
      | cartCount                         |
      | 3                                 |


  @boundary @cart
  Scenario Outline: Cart operations with different products
    When I add "<product>" to the cart
    Then I should see the cart badge shows "1"
    When I navigate to the cart page
    Then I should see "<product>" in the cart
    And I should see the correct price for "<product>"
    
    Examples:
      | product                         |
      | Sauce Labs Backpack             |
      | Sauce Labs Bike Light           |
      | Sauce Labs Bolt T-Shirt         |
      | Sauce Labs Fleece Jacket        |
      | Sauce Labs Onesie               |
      | Test.allTheThings() T-Shirt (Red)|