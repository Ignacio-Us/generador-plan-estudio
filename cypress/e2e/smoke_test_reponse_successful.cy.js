describe('Smoke Test - Response Successful (Esquema y Coherencia)', () => {
  const baseUrl = 'http://localhost:3000';
  const payload = {
    topics: ["Bases de Datos", "APIs REST", "Despliegue"],
    weeks: 3,
    weekly_dedication: 10
  };

  it('1. Solicitud Válida: Retorna 2xx y el cuerpo cumple con el esquema documentado', {retries: 2 }, () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/v1/study-plan`,
      body: payload,
      timeout: 45000 
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('metadata');
      expect(response.body.metadata).to.have.property('source', 'llm');
      expect(response.body.metadata).to.have.property('generated_at');
      expect(response.body).to.have.property('plan');
      expect(response.body.plan).to.be.an('array');

      // Validación del esquema: Estructura interna de la primera semana
      const primeraSemana = response.body.plan[0];
      expect(primeraSemana).to.have.property('week_number').that.is.a('number');
      expect(primeraSemana).to.have.property('objectives').that.is.an('array');
      expect(primeraSemana).to.have.property('activities').that.is.an('array');
      expect(primeraSemana).to.have.property('estimated_hours').that.is.a('number');
      expect(primeraSemana).to.have.property('topics_covered').that.is.an('array');
    });
  });

  it('2. Coherencia del Plan: Semanas, tópicos, horas y repasos lógicos', {retries: 2 }, () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/v1/study-plan`,
      body: payload,
      timeout: 45000 
    }).then((response) => {
      const plan = response.body.plan;
      expect(plan).to.have.length(payload.weeks);

      let allTopicsCovered = [];
      let hasReview = false;

      plan.forEach((week) => {
        // 2.2: Actividades y estimaciones no deben estar vacías
        expect(week.activities.length).to.be.greaterThan(0);
        expect(week.estimated_hours).to.be.greaterThan(0);

        // 2.3: Tolerancia de horas (Aceptamos +/- 15% de margen para el LLM)
        const minHours = payload.weekly_dedication * 0.85;
        const maxHours = payload.weekly_dedication * 1.15;
        expect(week.estimated_hours).to.be.within(minHours, maxHours);

        // Recolectar temas
        allTopicsCovered = [...allTopicsCovered, ...(week.topics_covered || [])];

        // 2.4: Buscar si existe instancia de repaso o evaluación
        const contentText = (week.objectives.join(" ") + " " + week.activities.join(" ")).toLowerCase();
        if (
          contentText.includes('repaso') || 
          contentText.includes('evaluación') || 
          contentText.includes('evaluacion') || 
          contentText.includes('examen')
        ) {
          hasReview = true;
        }
      });

      // 2.5: Todos los tópicos aparecen planificados
      payload.topics.forEach(originalTopic => {
        const topicFound = allTopicsCovered.some(tc => 
          tc.toLowerCase().includes(originalTopic.toLowerCase())
        );
        expect(topicFound).to.be.true;
      });

      // 2.6: Existe al menos una instancia de repaso
      expect(hasReview).to.be.true;
    });
  });
});