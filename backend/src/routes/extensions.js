import express from 'express';
import {
  getExtensions,
  getExtensionById,
  getFilters,
  getStats,
  incrementVisitors,
  chatWithCerebras
} from '../controllers/extensionsController.js';

const router = express.Router();

// Get all extensions with optional filters
router.get('/', getExtensions);

// Get filters available
router.get('/filters', getFilters);

// Get marketplace statistics
router.get('/stats', getStats);

// Chat with Cerebras AI (secure backend proxy)
router.post('/chat', chatWithCerebras);

// Increment visitor count
router.post('/visitors/track', incrementVisitors);

// Get single extension
router.get('/:id', getExtensionById);

export default router;
