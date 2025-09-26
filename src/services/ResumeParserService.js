const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const logger = require('../utils/logger');
const Candidate = require('../models/Candidate');

class ResumeParserService {
  constructor() {
    this.resumesPath = path.join(__dirname, '../../data/resumes');
    this.sampleDataPath = path.join(__dirname, '../../data/resumes/sample-resumes.json');
  }

  async parseResumes() {
    logger.info('Starting resume parsing process');
    
    try {
      // For demo purposes, load sample data
      const sampleData = await this.loadSampleData();
      
      // In a real implementation, you would scan the resumes directory
      // and parse actual PDF/DOCX files
      const candidates = sampleData.map(data => new Candidate(data));
      
      logger.info(`Successfully parsed ${candidates.length} resumes`);
      return candidates;
    } catch (error) {
      logger.error(`Error parsing resumes: ${error.message}`);
      throw error;
    }
  }

  async loadSampleData() {
    try {
      const data = await fs.readFile(this.sampleDataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Error loading sample resume data: ${error.message}`);
      throw error;
    }
  }

  async parsePdfResume(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      
      // Extract basic information from PDF text
      const text = data.text;
      const candidate = this.extractCandidateInfo(text, filePath);
      
      return new Candidate(candidate);
    } catch (error) {
      logger.error(`Error parsing PDF resume ${filePath}: ${error.message}`);
      throw error;
    }
  }

  extractCandidateInfo(text, filePath) {
    // Basic text extraction logic (would need more sophisticated parsing in production)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = text.match(emailRegex);
    
    // Extract phone
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const phoneMatch = text.match(phoneRegex);
    
    // Extract name (assume first line or first few words)
    const name = lines[0] || 'Unknown';
    
    // Extract skills (look for common skill keywords)
    const skillKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'Git'];
    const skills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      id: `candidate-${Date.now()}`,
      name: name,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : '',
      address: '',
      skills: skills,
      experience: [],
      education: [],
      resumePath: path.basename(filePath)
    };
  }

  async scanResumeDirectory() {
    try {
      const files = await fs.readdir(this.resumesPath);
      const resumeFiles = files.filter(file => 
        file.toLowerCase().endsWith('.pdf') || 
        file.toLowerCase().endsWith('.docx') || 
        file.toLowerCase().endsWith('.txt')
      );
      
      logger.info(`Found ${resumeFiles.length} resume files`);
      return resumeFiles.map(file => path.join(this.resumesPath, file));
    } catch (error) {
      logger.error(`Error scanning resume directory: ${error.message}`);
      return [];
    }
  }

  async getParsedCandidates() {
    try {
      // For demo purposes, return parsed sample data
      return await this.parseResumes();
    } catch (error) {
      logger.error(`Error getting parsed candidates: ${error.message}`);
      return [];
    }
  }
}

module.exports = new ResumeParserService();