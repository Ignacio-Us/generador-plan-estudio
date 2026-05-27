const generateStudyPlan = (req, res) => {
    const { topics, weeks, weekly_dedication, restrictions } = req.body;

    // 2. Esquema de Salida (Mock / Datos simulados)
    // Este es el contrato exacto que el LLM deberá respetar en la Fase 3.
    const mockResponse = {
        metadata: {
            source: "llm",
            generated_at: new Date().toISOString()
        },
        plan: [
            {
                week_number: 1,
                objectives: [
                    "Comprender los conceptos básicos del primer tema.",
                    "Establecer el entorno de estudio."
                ],
                activities: [
                    "Leer documentación oficial del tema 1.",
                    "Realizar un ejercicio práctico inicial."
                ],
                estimated_hours: weekly_dedication || 10,
                topics_covered: topics ? [topics[0]] : ["Tema de ejemplo"]
            },
        ]
    };

    res.status(200).json(mockResponse);
};

module.exports = {
    generateStudyPlan
};