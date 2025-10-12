Feature: User Authentication and Login
  As a customer
  I want to be able to login to the SauceDemo application
  So that I can access the shopping features

  Background:
    Given I am on the SauceDemo login page
    And the login page elements are properly displayed

  @smoke @login @authentication
  Scenario: Successful login with standard user
    When I enter valid standard user credentials
    And I click the login button
    Then I should be redirected to the inventory page
    And I should see the products page title

  @smoke @login @authentication
  Scenario: Successful login with problem user
    When I enter valid problem user credentials
    And I click the login button
    Then I should be redirected to the inventory page
    And I should see the products page title

  @smoke @login @authentication
  Scenario: Successful login with performance glitch user
    When I enter valid performance glitch user credentials
    And I click the login button
    Then I should be redirected to the inventory page eventually
    And I should see the products page title

  @negative @login @validation
  Scenario: Failed login with locked out user
    When I enter locked out user credentials
    And I click the login button
    Then I should see a locked out error message
    And I should remain on the login page

  @negative @login @validation
  Scenario: Failed login with invalid credentials
    When I enter invalid username "invalid_user"
    And I enter invalid password "invalid_password"
    And I click the login button
    Then I should see an invalid credentials error message
    And I should remain on the login page

  @negative @login @validation
  Scenario: Failed login with empty username
    When I leave the username field empty
    And I enter valid password
    And I click the login button
    Then I should see a username required error message
    And I should remain on the login page

  @negative @login @validation
  Scenario: Failed login with empty password
    When I enter valid username
    And I leave the password field empty
    And I click the login button
    Then I should see a password required error message
    And I should remain on the login page

  @negative @login @validation
  Scenario: Failed login with both fields empty
    When I leave both username and password fields empty
    And I click the login button
    Then I should see a username required error message
    And I should remain on the login page


  @visual @login
  Scenario: Login with visual user to check UI consistency
    When I enter valid visual user credentials
    And I click the login button
    Then I should be redirected to the inventory page
    And I should see the products page title

  @boundary @login
  Scenario Outline: Login with various user types
    When I login as "<user_type>" user
    Then I should see the appropriate login result for "<user_type>"
    
    Examples:
      | user_type         |
      | standard          |
      | locked_out        |
      | problem           |
      | performance_glitch|
      | error             |
      | visual            |