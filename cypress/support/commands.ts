Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'test-access-token');
  localStorage.setItem('refreshToken', 'test-refresh-token');
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookie('accessToken');
  localStorage.removeItem('refreshToken');
});
