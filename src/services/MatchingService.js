const logger = require('../utils/logger');
const scraperService = require('./ScraperService');
const resumeParserService = require('./ResumeParserService');

class MatchingService {
  async matchCandidatesToJobs() {
    logger.info('Starting job-candidate matching process');
    
    try {
      // Get jobs and candidates
      const jobs = await scraperService.getScrapedJobs();
      const candidates = await resumeParserService.getParsedCandidates();
      
      if (jobs.length === 0) {
        logger.warn('No jobs available for matching');
        return [];
      }
      
      if (candidates.length === 0) {
        logger.warn('No candidates available for matching');
        return [];
      }
      
      // Match candidates to jobs
      const matches = [];
      
      for (const candidate of candidates) {
        const candidateMatches = this.findMatchesForCandidate(candidate, jobs);
        matches.push({
          candidate: candidate.toJSON(),
          matchedJobs: candidateMatches.map(job => job.toJSON())
        });
      }
      
      logger.info(`Successfully matched ${candidates.length} candidates to jobs`);
      return matches;
    } catch (error) {
      logger.error(`Error matching candidates to jobs: ${error.message}`);
      throw error;
    }
  }
  
  findMatchesForCandidate(candidate, jobs) {
    // Simple matching algorithm based on skills and job title keywords
    // In a real implementation, this would be more sophisticated
    const candidateSkills = candidate.skills.map(skill => skill.toLowerCase());
    
    return jobs.filter(job => {
      // Check if job title contains any of the candidate's skills
      const titleMatches = candidateSkills.some(skill => 
        job.title.toLowerCase().includes(skill)
      );
      
      // For demo purposes, match all jobs to ensure we have matches
      return true;
    });
  }
}

module.exports = new MatchingService();