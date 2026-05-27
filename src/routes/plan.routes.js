const express = require('express');
const router = express.Router();
const { generateStudyPlan } = require('../controllers/plan.controller.js');

router.post('/study-plan', generateStudyPlan);

module.exports = router;