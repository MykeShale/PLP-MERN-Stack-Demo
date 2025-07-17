// client/cypress/e2e/sample_e2e.cy.js

describe('Health Check E2E', () => {
  it('should load the health check endpoint and display status', () => {
    // Adjust the URL as needed for your dev server
    cy.request('http://localhost:3001/api/health').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status', 'ok');
    });
  });
}); 