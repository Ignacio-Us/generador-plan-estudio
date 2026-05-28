const generatePlanFromLLM = async (topics, weeks, weekly_dedication, restrictions) => {
    const apiKey = process.env.LLM_API_KEY;
    
    const systemPrompt = `
      Eres un experto en diseño curricular y planificación académica.
      Tu objetivo es crear un plan de estudio estructurado estrictamente en formato JSON.
      
      REGLAS DE NEGOCIO:
      1. Debes generar exactamente ${weeks} semanas.
      2. Debes incluir todos los siguientes temas a lo largo del plan: ${topics.join(", ")}.
      3. La carga horaria semanal (estimated_hours) debe ser cercana a ${weekly_dedication} horas (tolerancia de +/- 10%).
      4. Obligatorio: Al menos una semana debe incluir en sus objetivos o actividades una instancia explícita de "repaso", "evaluación" o "examen".
      5. Restricciones adicionales a considerar: ${JSON.stringify(restrictions || {})}.
  
      FORMATO DE SALIDA (ESTRICTO JSON):
      Debes devolver ÚNICAMENTE un objeto JSON con la siguiente estructura, sin texto en markdown adicional ni explicaciones:
      {
        "plan": [
          {
            "week_number": 1,
            "objectives": ["string"],
            "activities": ["string"],
            "estimated_hours": number,
            "topics_covered": ["string"]
          }
        ]
      }
    `;
  
    const payload = {
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Genera el plan de estudio requerido." }
      ],
      response_format: { type: "json_object" }
    };
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "API Generador de Planes de Estudio",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        // Cancela la peticion si el LLM tarda mas de 35 segundos
        signal: AbortSignal.timeout(35000) 
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error de OpenRouter: ${response.status} - ${errorData}`);
      }
  
      const data = await response.json();
      
      let llmContent = data.choices[0].message.content;
          
      // Limpia etiquetas markdown si el LLM las incluye por error
      llmContent = llmContent.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedContent = JSON.parse(llmContent);
      
      // Valida que el objeto no sea nulo y contenga la propiedad requerida
      if (!parsedContent || !parsedContent.plan) {
        console.error("Estructura JSON invalida recibida:", parsedContent);
        throw new Error("El LLM no devolvio la estructura esperada (falta la propiedad 'plan').");
      }
      
      return parsedContent.plan;
      
    } catch (error) {
      // Maneja especificamente el error por tiempo de espera
      if (error.name === 'TimeoutError') {
         throw new Error("OpenRouter tardo demasiado en responder.");
      }
      console.error("Error en generatePlanFromLLM:", error.message);
      throw error;
    }
  };
  
  module.exports = { generatePlanFromLLM };