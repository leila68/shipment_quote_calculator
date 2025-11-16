import express from 'express';
import { quoteController } from '../controllers/quoteController.js';

const router = express.Router();

// POST /api/quotes - Create new quote
router.post('/', quoteController.createQuote);

// POST /api/quotes/calculate
router.post("/calculate", quoteController.createQuote);

// GET /api/quotes - Get all quotes with filters
router.get('/', quoteController.getQuotes);

// GET /api/quotes/:id - Get single quote
router.get('/:id', quoteController.getQuoteById);

// PATCH /api/quotes/:id/status - Update quote status
router.patch('/:id/status', quoteController.updateQuoteStatus);

// GET /api/quotes/lanes - Get available lanes
router.get('/meta/lanes', quoteController.getLanes);

export default router;