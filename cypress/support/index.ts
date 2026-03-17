/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientName: string): Chainable<void>;
    checkIngredientModal(ingredientName: string, nutrition: {
      calories?: string;
      proteins?: string;
      fat?: string;
      carbohydrates?: string;
    }): Chainable<void>;
  }
}