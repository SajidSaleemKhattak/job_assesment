const scraperService = require('../services/ScraperService');
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');

class JobController {
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
}

module.exports = new JobController();