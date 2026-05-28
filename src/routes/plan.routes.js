const express = require('express');
const router = express.Router();
const { generateStudyPlan } = require('../controllers/plan.controller.js');
const { validatePlanRequest } = require('../middlewares/validate.middleware.js');

router.post('/study-plan', validatePlanRequest, generateStudyPlan);

module.exports = router;