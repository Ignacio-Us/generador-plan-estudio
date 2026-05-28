const { z } = require('zod');

// 1. Definir el esquema estricto esperado
const planRequestSchema = z.object({
  topics: z
    .array(z.string({ required_error: "El campo 'topics' es obligatorio y debe ser un arreglo de textos." }))
    .min(1, "Debes incluir al menos un tema en el arreglo 'topics'."),
  
  weeks: z
    .number({ required_error: "El campo 'weeks' es obligatorio." })
    .int("La cantidad de semanas debe ser un número entero.")
    .positive("La cantidad de semanas debe ser mayor a 0."),
  
  weekly_dedication: z
    .number({ required_error: "El campo 'weekly_dedication' es obligatorio." })
    .positive("La dedicación semanal debe ser mayor a 0."),
    
  restrictions: z
    .any()
    .optional() // Es opcional
});

const validatePlanRequest = (req, res, next) => {
  try {
    // Intentamos validar el cuerpo de la petición
    planRequestSchema.parse(req.body);
    next();
  } catch (error) {
    // 1. Verificamos si es un error propio de Zod
    if (error instanceof z.ZodError || error.name === 'ZodError') {
      
      // 2. Extraemos el arreglo usando 'issues' o 'errors' de forma segura
      const validationErrors = error.issues || error.errors || [];
      
      // 3. Ahora el map() no fallará porque garantizamos que sea un arreglo
      const errorMessages = validationErrors.map(err => ({
        campo: err.path.join('.'),
        mensaje: err.message
      }));

      return res.status(400).json({
        error: "Solicitud inválida. Revisa los parámetros enviados.",
        detalles: errorMessages
      });
    }
    
    // Si el error NO es de Zod (ej. error interno del servidor)
    console.error("Error no controlado en validación:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor durante la validación." 
    });
  }
};
module.exports = { validatePlanRequest };

