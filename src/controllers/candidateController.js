const resumeParserService = require('../services/ResumeParserService');
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');
const CandidateRepository = require('../repositories/CandidateRepository');
const webhook = require('../utils/webhook');

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

  // CRUD: List stored candidates
  list = errorHandler.asyncHandler(async (req, res) => {
    const all = await CandidateRepository.findAll();
    return res.status(200).json({ status: 'success', count: all.length, data: all });
  });

  // Headless CMS: Export all candidates (alias of list)
  export = errorHandler.asyncHandler(async (req, res) => {
    const all = await CandidateRepository.findAll();
    return res.status(200).json({ status: 'success', count: all.length, data: all });
  });

  // Headless CMS: Import (bulk replace) candidates
  import = errorHandler.asyncHandler(async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : (req.body?.items || []);
    const replaced = await CandidateRepository.replaceAll(items);
    return res.status(200).json({ status: 'success', count: replaced.length, data: replaced });
  });

  // CRUD: Get candidate by ID
  getById = errorHandler.asyncHandler(async (req, res) => {
    const item = await CandidateRepository.findById(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Candidate not found' });
    return res.status(200).json({ status: 'success', data: item });
  });

  // CRUD: Create candidate
  create = errorHandler.asyncHandler(async (req, res) => {
    const created = await CandidateRepository.create(req.body || {});
    webhook.notify('created', 'candidate', created);
    return res.status(201).json({ status: 'success', data: created });
  });

  // CRUD: Update candidate
  update = errorHandler.asyncHandler(async (req, res) => {
    const updated = await CandidateRepository.update(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ status: 'error', message: 'Candidate not found' });
    webhook.notify('updated', 'candidate', updated);
    return res.status(200).json({ status: 'success', data: updated });
  });

  // CRUD: Delete candidate
  remove = errorHandler.asyncHandler(async (req, res) => {
    const ok = await CandidateRepository.remove(req.params.id);
    if (!ok) return res.status(404).json({ status: 'error', message: 'Candidate not found' });
    webhook.notify('deleted', 'candidate', { id: req.params.id });
    return res.status(204).send();
  });
}

module.exports = new CandidateController();