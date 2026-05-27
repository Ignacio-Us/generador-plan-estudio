const baseUrl = 'http://localhost:3000';

describe('Smoke Test - Health Endpoint', () => {
  it('should return 200 status code', () => {
    cy.request('GET', `${baseUrl}/health`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('up');
      expect(response.body.message).to.eq('API esta funcionando correctamente');
      expect(response.body.llm_connection).to.eq('API key configurada correctamente');
    });
  });
});