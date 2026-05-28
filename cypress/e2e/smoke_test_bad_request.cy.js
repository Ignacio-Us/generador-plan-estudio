describe('Smoke Test - Bad Request (Entradas Inválidas)', () => {
  const baseUrl = 'http://localhost:3000';

  it('POST /study-plan retorna 400 con mensajes claros ante datos inválidos', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/v1/study-plan`,
      failOnStatusCode: false, // Evita que Cypress falle la prueba al recibir un 4xx
      body: { 
        topics: [], // Inválido: vacío
        weeks: -1   // Inválido: negativo
      } 
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
      expect(response.body.detalles.length).to.be.greaterThan(0);
    });
  });
});