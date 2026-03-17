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
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });

    it('должен добавлять начинку', () => {
      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Мясо бессмертных моллюсков Protostomia').should(
        'be.visible'
      );
    });

    it('должен добавлять соус', () => {
      cy.contains('Соус Spicy-X')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Соус Spicy-X').should('be.visible');
    });

    it('должен добавлять несколько ингредиентов', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Соус Spicy-X')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
      cy.contains('Мясо бессмертных моллюсков Protostomia').should(
        'be.visible'
      );
      cy.contains('Соус Spicy-X').should('be.visible');
    });
  });

  describe('Модальные окна', () => {
    describe('Открытие модального окна', () => {
      it('должен открывать модальное окно при клике на ингредиент', () => {
        cy.contains('Краторная булка N-200i').click();
        cy.get('#modals').find('div').should('be.visible');
      });

      it('должен открывать модальное окно для другого ингредиента', () => {
        cy.contains('Мясо бессмертных моллюсков Protostomia').click();
        cy.get('#modals').find('div').should('be.visible');
      });
    });

    describe('Закрытие модального окна', () => {
      beforeEach(() => {
        cy.contains('Краторная булка N-200i').click();
        cy.get('#modals').find('div').should('be.visible');
      });

      it('должен закрывать по крестику', () => {
        cy.get('#modals button[type="button"]').click();
        cy.get('#modals').find('div').should('not.exist');
      });

      it('должен закрывать по оверлею', () => {
        cy.get('body').click(100, 100);
        cy.get('#modals').find('div').should('not.exist');
      });

      it('должен закрывать по Escape', () => {
        cy.get('body').type('{esc}');
        cy.get('#modals').find('div').should('not.exist');
      });
    });
  });

  describe('Создание заказа', () => {
    it('должен создавать заказ', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('#modals').find('div').should('be.visible');
      cy.contains('12345').should('be.visible');
    });

    it('должен закрывать модальное окно заказа', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('#modals').find('div').should('be.visible');
      cy.contains('12345').should('be.visible');

      cy.get('#modals button[type="button"]').click();
      cy.get('#modals').find('div').should('not.exist');
    });

    it('должен очищать конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('#modals button[type="button"]').click();

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
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

      cy.contains('Краторная булка N-200i')
        .closest('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.url().should('include', '/login');
    });
  });
});