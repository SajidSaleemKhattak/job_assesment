const express = require('express');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router.get('/matches', applicationController.getMatches);
router.post('/apply', applicationController.applyToJobs);

module.exports = router;