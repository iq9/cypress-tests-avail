// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("signup", (username, password) => {
  cy.visit('http://localhost:3002')

  // Factory a user. (Bug: Keeps creating new ones. No dupe-user defense.)
  cy.get('#nav').contains('Signup').click()
  cy.get('input[name="email"]').focus()
  cy.get('input[name="email"]').type(`${username}`)
  cy.get('input[name="password"]').focus()
  cy.get('input[name="password"]').type(`${password}{enter}`)

  cy.url().should('include', '/users')
  cy.get('#nav').contains('Logout').click()
})