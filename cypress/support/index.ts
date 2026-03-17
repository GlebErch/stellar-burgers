/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    setAuthTokens(): Chainable<void>;
    clearAuthTokens(): Chainable<void>;
  }
}