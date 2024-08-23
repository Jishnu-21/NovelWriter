const express = require('express');
const { reportStory } = require('../controller/ReportController');
const authenticate = require('../middleware/AuthMiddleware');
const router = express.Router();

router.post('/:storyId/report', authenticate, reportStory);

module.exports = router;
