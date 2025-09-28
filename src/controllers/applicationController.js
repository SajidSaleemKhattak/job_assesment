const applicationService = require('../services/ApplicationService');
const matchingService = require('../services/MatchingService');
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');
const ApplicationRepository = require('../repositories/ApplicationRepository');
const webhook = require('../utils/webhook');

class ApplicationController {
  // Get all matches between candidates and jobs
  getMatches = errorHandler.asyncHandler(async (req, res) => {
    const matches = await matchingService.matchCandidatesToJobs();
    
    return res.status(200).json({
      status: 'success',
      count: matches.length,
      data: matches
    });
  });

  // Apply to jobs for matched candidates
  applyToJobs = errorHandler.asyncHandler(async (req, res) => {
    const results = await applicationService.applyToJobs();
    
    return res.status(200).json({
      status: 'success',
      message: 'Job applications completed',
      count: results.length,
      data: results
    });
  });

  // CRUD: List stored applications
  list = errorHandler.asyncHandler(async (req, res) => {
    const all = await ApplicationRepository.findAll();
    return res.status(200).json({ status: 'success', count: all.length, data: all });
  });

  // Headless CMS: Export all applications (alias of list)
  export = errorHandler.asyncHandler(async (req, res) => {
    const all = await ApplicationRepository.findAll();
    return res.status(200).json({ status: 'success', count: all.length, data: all });
  });

  // Headless CMS: Import (bulk replace) applications
  import = errorHandler.asyncHandler(async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : (req.body?.items || []);
    const replaced = await ApplicationRepository.replaceAll(items);
    return res.status(200).json({ status: 'success', count: replaced.length, data: replaced });
  });

  // CRUD: Get application by ID
  getById = errorHandler.asyncHandler(async (req, res) => {
    const item = await ApplicationRepository.findById(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Application not found' });
    return res.status(200).json({ status: 'success', data: item });
  });

  // CRUD: Create application
  create = errorHandler.asyncHandler(async (req, res) => {
    const created = await ApplicationRepository.create(req.body || {});
    webhook.notify('created', 'application', created);
    return res.status(201).json({ status: 'success', data: created });
  });

  // CRUD: Update application
  update = errorHandler.asyncHandler(async (req, res) => {
    const updated = await ApplicationRepository.update(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ status: 'error', message: 'Application not found' });
    webhook.notify('updated', 'application', updated);
    return res.status(200).json({ status: 'success', data: updated });
  });

  // CRUD: Delete application
  remove = errorHandler.asyncHandler(async (req, res) => {
    const ok = await ApplicationRepository.remove(req.params.id);
    if (!ok) return res.status(404).json({ status: 'error', message: 'Application not found' });
    webhook.notify('deleted', 'application', { id: req.params.id });
    return res.status(204).send();
  });
}

module.exports = new ApplicationController();