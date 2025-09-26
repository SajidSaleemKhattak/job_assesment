const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const Job = require('../models/Job');
const config = require('../config/config');

class ScraperService {
  constructor() {
    this.targetUrl = config.targetUrl;
    this.outputPath = path.join(__dirname, '../../data/jobs/jobs.json');
  }

  async scrapeJobs() {
    logger.info('Starting job scraping process');
    
    try {
      // Try to scrape from the real website first
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      try {
        await page.goto(this.targetUrl, { waitUntil: 'networkidle', timeout: 15000 });
        logger.info('Page loaded successfully');
        
        // Wait for job listings to load
        await page.waitForSelector('.vacancy-item', { timeout: 10000 });
        
        // Extract job data
        const jobs = await page.evaluate(() => {
          const jobElements = document.querySelectorAll('.vacancy-item');
          return Array.from(jobElements).map((el, index) => {
            const titleElement = el.querySelector('.vacancy-item__title');
            const locationElement = el.querySelector('.vacancy-item__location');
            const companyElement = el.querySelector('.vacancy-item__company');
            const applyLinkElement = el.querySelector('a.vacancy-item__link');
            
            return {
              id: `job-${index + 1}`,
              title: titleElement ? titleElement.textContent.trim() : '',
              location: locationElement ? locationElement.textContent.trim() : '',
              company: companyElement ? companyElement.textContent.trim() : '',
              applyLink: applyLinkElement ? applyLinkElement.href : '',
              salary: '', // Not always available, would need specific selector
              description: '', // Would need to visit individual job pages
              requirements: []
            };
          });
        });
        
        // Convert to Job models
        const jobModels = jobs.map(job => Job.fromScrapedData(job));
        
        // Save to file
        await this.saveJobs(jobModels);
        
        logger.info(`Successfully scraped ${jobs.length} jobs`);
        await browser.close();
        return jobModels;
        
      } catch (scrapingError) {
        await browser.close();
        logger.warn(`Real scraping failed: ${scrapingError.message}, falling back to sample data`);
        
        // Fall back to sample data
        return await this.loadSampleJobs();
      }
    } catch (error) {
      logger.error(`Error in scraping process: ${error.message}`);
      // Fall back to sample data
      return await this.loadSampleJobs();
    }
  }

  async loadSampleJobs() {
    try {
      const samplePath = path.join(__dirname, '../../data/jobs/sample-jobs.json');
      const data = await fs.readFile(samplePath, 'utf8');
      const sampleJobs = JSON.parse(data);
      
      // Convert to Job models
      const jobModels = sampleJobs.map(job => new Job(job));
      
      // Save to the regular jobs file
      await this.saveJobs(jobModels);
      
      logger.info(`Loaded ${jobModels.length} sample jobs`);
      return jobModels;
    } catch (error) {
      logger.error(`Error loading sample jobs: ${error.message}`);
      throw error;
    }
  }

  async saveJobs(jobs) {
    try {
      const jobsJson = JSON.stringify(jobs.map(job => job.toJSON()), null, 2);
      await fs.writeFile(this.outputPath, jobsJson);
      logger.info(`Jobs saved to ${this.outputPath}`);
    } catch (error) {
      logger.error(`Error saving jobs: ${error.message}`);
      throw error;
    }
  }

  async getScrapedJobs() {
    try {
      const data = await fs.readFile(this.outputPath, 'utf8');
      const jobs = JSON.parse(data);
      return jobs.map(job => new Job(job));
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.warn('No scraped jobs found, returning empty array');
        return [];
      }
      logger.error(`Error reading scraped jobs: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ScraperService();