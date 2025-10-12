/**
 * Step definitions index file
 * Imports all step definition classes to register them with the BDD framework
 */

// Import all step definition files
import "./login.steps";
import "./inventory.steps";
import "./cart.steps";
import "./checkout.steps";
import "./cart-management.steps";
import "./additional-cart.steps";
import "./purchase-flow.steps";

// Export the test fixtures
export * from "../fixtures/fixtures";
