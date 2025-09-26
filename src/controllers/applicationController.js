const applicationService = require('../services/ApplicationService');
const matchingService = require('../services/MatchingService');
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');

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
}

module.exports = new ApplicationController();