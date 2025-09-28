const express = require('express');
const applicationController = require('../controllers/applicationController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

const router = express.Router();

router.get('/matches', applicationController.getMatches);
router.post('/apply', applicationController.applyToJobs);

// Headless CMS CRUD endpoints
router.get('/items', applicationController.list);
router.get('/items/:id', applicationController.getById);
router.post('/items', apiKeyAuth, applicationController.create);
router.put('/items/:id', apiKeyAuth, applicationController.update);
router.delete('/items/:id', apiKeyAuth, applicationController.remove);

// Import/Export
router.get('/export', applicationController.export);
router.post('/import', apiKeyAuth, applicationController.import);

module.exports = router;