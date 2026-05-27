const { generatePlanFromLLM } = require('../services/openrouter.service');

const generateStudyPlan = async (req, res) => {
    try {
        const { topics, weeks, weekly_dedication, restrictions } = req.body;

        const planResult = await generatePlanFromLLM(topics, weeks, weekly_dedication, restrictions);

        const finalResponse = {
            metadata: {
                source: "llm",
                generated_at: new Date().toISOString()
            },
            plan: planResult
        };

        res.status(200).json(finalResponse);
    } catch (error) {
        res.status(502).json({
            error: "Error al comunicarse con el proveedor del LLM.",
            details: error.message
        });
    }
};

module.exports = {
    generateStudyPlan
};