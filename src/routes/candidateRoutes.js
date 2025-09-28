const express = require('express');
const candidateController = require('../controllers/candidateController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

const router = express.Router();

router.get('/', candidateController.getCandidates);
router.post('/parse', candidateController.parseResumes);

// Headless CMS CRUD endpoints
router.get('/items', candidateController.list);
router.get('/items/:id', candidateController.getById);
router.post('/items', apiKeyAuth, candidateController.create);
router.put('/items/:id', apiKeyAuth, candidateController.update);
router.delete('/items/:id', apiKeyAuth, candidateController.remove);

// Import/Export
router.get('/export', candidateController.export);
router.post('/import', apiKeyAuth, candidateController.import);

module.exports = router;