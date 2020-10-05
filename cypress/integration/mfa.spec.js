/// <reference types="cypress" />

Cypress.Cookies.debug(true)
Cypress.Cookies.preserveOnce('remember_device')

context('MFA', () => {
  const username = 'me@russbrooks.com'
  const password = 'test'
  const mfaCode = '1111'

  before(() => {
    cy.visit('http://localhost:3002')
    cy.clearCookie('remember_device').should('be.null')
  })

  it('Signs up for an account.', () => {
    cy.signup(username, password);
  })

  it('Logs a user in on a non-remembered device.', () => {
    cy.clearCookie('remember_device').should('be.null')

    cy.get('#nav').contains('Login').click()

    // Shouldn't have to set focus first or use these "force" options.
    // React's form elements are sometimes invisible to Cypress.
    // https://github.com/cypress-io/cypress/issues/7084

    cy.get('input[name="remember_device"]').focus()
    cy.get('input[name="remember_device"]').check({ force: true }).should('be.checked')
    cy.get('input[name="email"]').focus()
    cy.get('input[name="email"]').type(`${username}`)
    cy.get('input[name="password"]').focus()
    cy.get('input[name="password"]').type(`${password}{enter}`)

    cy.url().should('include', '/pin')

    cy.get('input[name="pin"]').focus()
    cy.get('input[name="pin"]').type(`${mfaCode}{enter}`)

    cy.url().should('include', '/users')

    cy.getCookie('remember_device').should('exist')

    cy.get('#nav').contains('Logout').click()
  })

  it('Logs a user in on remembered device.', () => {
    cy.get('#nav').contains('Login').click()

    cy.get('input[name="email"]').focus()
    cy.get('input[name="email"]').type(`${username}`)
    cy.get('input[name="password"]').focus()
    cy.get('input[name="password"]').type(`${password}{enter}`)

    cy.url().should('include', '/users')

    cy.getCookie('remember_device').should('exist')

    cy.get('#nav').contains('Logout').click()
  })

  it('MFA page Cancel button functions as expected.', () => {
    cy.get('#nav').contains('Login').click()
    cy.clearCookie('remember_device')

    cy.get('input[name="email"]').focus()
    cy.get('input[name="email"]').type(`${username}`)
    cy.get('input[name="password"]').focus()
    cy.get('input[name="password"]').type(`${password}{enter}`)

    cy.url().should('include', '/pin')

    cy.get('button').contains('Cancel').click()

    cy.url().should('include', '/login')
  })

  after(() => {
    cy.clearCookie('remember_device')
  })
})
