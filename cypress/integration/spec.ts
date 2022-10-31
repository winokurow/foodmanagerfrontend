describe('happy path', () => {
  it('Visits the login page', () => {
    cy.visit('/')
    cy
    .get('[data-cy=login-button]')
    .should('be.visible');
    cy.get('[data-cy=register-link]').click();
    cy.get('[data-cy=register-button]').should('be.visible');
  })
})
