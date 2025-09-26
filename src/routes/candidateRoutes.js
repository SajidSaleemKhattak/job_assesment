const express = require('express');
const candidateController = require('../controllers/candidateController');

const router = express.Router();

router.get('/', candidateController.getCandidates);
router.post('/parse', candidateController.parseResumes);

module.exports = router;