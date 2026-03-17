/// <reference types="cypress" />

Cypress.Commands.add('addIngredient', (ingredientName: string) => {
  cy.contains(ingredientName)
    .closest('li')
    .find('button')
    .contains('Добавить')
    .click();
});

Cypress.Commands.add('checkIngredientModal', (ingredientName: string, nutrition: any) => {
  cy.get('[data-cy="modal"]').within(() => {
    cy.contains(ingredientName).should('be.visible');
    if (nutrition.calories) cy.contains(nutrition.calories).scrollIntoView().should('be.visible');
    if (nutrition.proteins) cy.contains(nutrition.proteins).should('be.visible');
    if (nutrition.fat) cy.contains(nutrition.fat).should('be.visible');
    if (nutrition.carbohydrates) cy.contains(nutrition.carbohydrates).should('be.visible');
  });
});

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: ingredients
      }).as('getIngredients');
    });

    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: {
        success: true,
        order: {
          number: 12345
        }
      }
    }).as('createOrder');

    window.localStorage.setItem('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="constructor"]').as('constructor');
    cy.get('[data-cy="constructor-ingredients"]').as('ingredientsList');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('должен загружать ингредиенты с сервера', () => {
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Флюоресцентная булка R2-D3')
      .scrollIntoView()
      .should('be.visible');
    cy.contains('Соус Spicy-X').scrollIntoView().should('be.visible');
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку', () => {
      cy.addIngredient('Краторная булка N-200i');

      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i (верх)').should('be.visible');
        cy.contains('Краторная булка N-200i (низ)').should('be.visible');
      });
    });

    it('должен добавлять начинку', () => {
      cy.addIngredient('Мясо бессмертных моллюсков Protostomia');

      cy.get('@ingredientsList').within(() => {
        cy.contains('Мясо бессмертных моллюсков Protostomia').should('be.visible');
      });
    });

    it('должен добавлять соус', () => {
      cy.addIngredient('Соус Spicy-X');

      cy.get('@ingredientsList').within(() => {
        cy.contains('Соус Spicy-X').should('be.visible');
      });
    });

    it('должен добавлять несколько ингредиентов', () => {
      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Мясо бессмертных моллюсков Protostomia');
      cy.addIngredient('Соус Spicy-X');

      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i (верх)').should('be.visible');
        cy.contains('Краторная булка N-200i (низ)').should('be.visible');
      });
      
      cy.get('@ingredientsList').within(() => {
        cy.contains('Мясо бессмертных моллюсков Protostomia').should('be.visible');
        cy.contains('Соус Spicy-X').should('be.visible');
      });
    });
  });

  describe('Модальные окна', () => {
    describe('Открытие модального окна', () => {
      it('должен открывать модальное окно при клике на булку', () => {
        cy.contains('Краторная булка N-200i').click();
        cy.get('[data-cy="modal"]').as('modal');
        
        cy.checkIngredientModal('Краторная булка N-200i', {
          calories: '420',
          proteins: '80',
          fat: '24',
          carbohydrates: '53'
        });
      });

      it('должен открывать модальное окно при клике на начинку', () => {
        cy.contains('Мясо бессмертных моллюсков Protostomia').click();
        cy.get('[data-cy="modal"]').as('modal');
        
        cy.checkIngredientModal('Мясо бессмертных моллюсков Protostomia', {
          calories: '420',
          proteins: '433',
          fat: '244',
          carbohydrates: '33'
        });
      });

      it('должен открывать модальное окно при клике на соус', () => {
        cy.contains('Соус Spicy-X').click();
        cy.get('[data-cy="modal"]').as('modal');
        
        cy.checkIngredientModal('Соус Spicy-X', {
          calories: '30'
        });
      });
    });

    describe('Закрытие модального окна', () => {
      beforeEach(() => {
        cy.contains('Краторная булка N-200i').click();
        cy.get('[data-cy="modal"]').as('modal');
        cy.get('[data-cy="modal-close-button"]').as('closeButton');
      });

      it('должен закрывать по крестику', () => {
        cy.get('@closeButton').click();
        cy.get('@modal').should('not.exist');
      });

      it('должен закрывать по оверлею', () => {
        cy.get('[data-cy="modal-overlay"]').click({ force: true });
        cy.get('@modal').should('not.exist');
      });

      it('должен закрывать по Escape', () => {
        cy.get('body').type('{esc}');
        cy.get('@modal').should('not.exist');
      });
    });
  });

  describe('Создание заказа', () => {
    it('должен создавать заказ', () => {
      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Мясо бессмертных моллюсков Protostomia');

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').as('modal').within(() => {
        cy.contains('12345').should('be.visible');
      });
    });

    it('должен закрывать модальное окно заказа', () => {
      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Мясо бессмертных моллюсков Protostomia');

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').as('modal').within(() => {
        cy.contains('12345').should('be.visible');
      });

      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('@modal').should('not.exist');
    });

    it('должен очищать конструктор', () => {
      cy.addIngredient('Краторная булка N-200i');
      cy.addIngredient('Мясо бессмертных моллюсков Protostomia');

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal-close-button"]').click();

      cy.get('@constructor').within(() => {
        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');
      });
    });

    it('должен требовать авторизацию', () => {
      cy.intercept('GET', 'api/auth/user', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Unauthorized'
        }
      }).as('getUserUnauthorized');

      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');

      cy.reload();
      cy.wait('@getIngredients');
      cy.wait('@getUserUnauthorized');

      cy.addIngredient('Краторная булка N-200i');

      cy.contains('button', 'Оформить заказ').click();
      cy.url().should('include', '/login');
    });
  });
});