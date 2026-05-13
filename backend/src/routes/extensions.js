import express from 'express';
import {
  getExtensions,
  getExtensionById,
  getFilters,
  getStats
} from '../controllers/extensionsController.js';

const router = express.Router();

// Get all extensions with optional filters
router.get('/', getExtensions);

// Get filters available
router.get('/filters', getFilters);

// Get marketplace statistics
router.get('/stats', getStats);

// Get single extension
router.get('/:id', getExtensionById);

export default router;
