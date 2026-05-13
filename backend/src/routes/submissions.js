import express from 'express';
import {
  submitExtension,
  getSubmissionStatus,
  getRecentSubmissions
} from '../controllers/submissionsController.js';

const router = express.Router();

// Submit new extension
router.post('/', submitExtension);

// Get recent submissions (public)
router.get('/recent', getRecentSubmissions);

// Get submission status by ID
router.get('/:id', getSubmissionStatus);

export default router;
