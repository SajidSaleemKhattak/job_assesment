const scraperService = require('../services/ScraperService');
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');
const JobRepository = require('../repositories/JobRepository');
const webhook = require('../utils/webhook');

class JobController {
  // Headless CMS: List stored jobs (from repository)
  list = errorHandler.asyncHandler(async (req, res) => {
    const all = await JobRepository.findAll();
    return res.status(200).json({ status: 'success', count: all.length, data: all });
  });

  // Headless CMS: Export all jobs (alias of list)
  export = errorHandler.asyncHandler(async (req, res) => {
    const all = await JobRepository.findAll();
    return res.status(200).json({ status: 'success', count: all.length, data: all });
  });

  // Headless CMS: Import (bulk replace) jobs
  import = errorHandler.asyncHandler(async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : (req.body?.items || []);
    const replaced = await JobRepository.replaceAll(items);
    return res.status(200).json({ status: 'success', count: replaced.length, data: replaced });
  });

  // Get all jobs (either from cache or scrape new ones)
  getJobs = errorHandler.asyncHandler(async (req, res) => {
    const jobs = await scraperService.getScrapedJobs();
    
    if (jobs.length === 0) {
      logger.info('No cached jobs found, initiating scraping');
      const newJobs = await scraperService.scrapeJobs();
      return res.status(200).json({
        status: 'success',
        count: newJobs.length,
        data: newJobs
      });
    }
    
    return res.status(200).json({
      status: 'success',
      count: jobs.length,
      data: jobs
    });
  });

  // Force a new scrape
  scrapeJobs = errorHandler.asyncHandler(async (req, res) => {
    const jobs = await scraperService.scrapeJobs();
    
    return res.status(200).json({
      status: 'success',
      message: 'Jobs scraped successfully',
      count: jobs.length,
      data: jobs
    });
  });

  // CRUD: Get a job by ID
  getJobById = errorHandler.asyncHandler(async (req, res) => {
    const job = await JobRepository.findById(req.params.id);
    if (!job) return res.status(404).json({ status: 'error', message: 'Job not found' });
    return res.status(200).json({ status: 'success', data: job });
  });

  // CRUD: Create a new job
  createJob = errorHandler.asyncHandler(async (req, res) => {
    const created = await JobRepository.create(req.body || {});
    webhook.notify('created', 'job', created);
    return res.status(201).json({ status: 'success', data: created });
  });

  // CRUD: Update a job
  updateJob = errorHandler.asyncHandler(async (req, res) => {
    const updated = await JobRepository.update(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ status: 'error', message: 'Job not found' });
    webhook.notify('updated', 'job', updated);
    return res.status(200).json({ status: 'success', data: updated });
  });

  // CRUD: Delete a job
  deleteJob = errorHandler.asyncHandler(async (req, res) => {
    const ok = await JobRepository.remove(req.params.id);
    if (!ok) return res.status(404).json({ status: 'error', message: 'Job not found' });
    webhook.notify('deleted', 'job', { id: req.params.id });
    return res.status(204).send();
  });
}

module.exports = new JobController();