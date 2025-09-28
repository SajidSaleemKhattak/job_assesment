const express = require('express');
const jobController = require('../controllers/jobController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

const router = express.Router();

router.get('/', jobController.getJobs);
router.post('/scrape', jobController.scrapeJobs);

// Headless CMS CRUD endpoints
router.get('/items', jobController.list);
router.get('/items/:id', jobController.getJobById);
router.post('/items', apiKeyAuth, jobController.createJob);
router.put('/items/:id', apiKeyAuth, jobController.updateJob);
router.delete('/items/:id', apiKeyAuth, jobController.deleteJob);

// Import/Export
router.get('/export', jobController.export);
router.post('/import', apiKeyAuth, jobController.import);

module.exports = router;