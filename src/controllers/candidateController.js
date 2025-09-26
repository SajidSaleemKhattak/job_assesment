const resumeParserService = require('../services/ResumeParserService');
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');

class CandidateController {
  // Get all parsed candidates
  getCandidates = errorHandler.asyncHandler(async (req, res) => {
    const candidates = await resumeParserService.getParsedCandidates();
    
    if (candidates.length === 0) {
      logger.info('No parsed candidates found, initiating parsing');
      const newCandidates = await resumeParserService.parseResumes();
      return res.status(200).json({
        status: 'success',
        count: newCandidates.length,
        data: newCandidates
      });
    }
    
    return res.status(200).json({
      status: 'success',
      count: candidates.length,
      data: candidates
    });
  });

  // Force a new parse of resumes
  parseResumes = errorHandler.asyncHandler(async (req, res) => {
    const candidates = await resumeParserService.parseResumes();
    
    return res.status(200).json({
      status: 'success',
      message: 'Resumes parsed successfully',
      count: candidates.length,
      data: candidates
    });
  });
}

module.exports = new CandidateController();