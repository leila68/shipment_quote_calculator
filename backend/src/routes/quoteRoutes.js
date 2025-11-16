import express from 'express';
import { quoteController } from '../controllers/quoteController.js';

const router = express.Router();

// GET /api/quotes/meta/lanes - Get available lanes (MUST come before /:id)
router.get('/meta/lanes', quoteController.getLanes);

// POST /api/quotes/calculate
router.post("/calculate", quoteController.createQuote);

// POST /api/quotes - Create new quote
router.post('/', quoteController.createQuote);

// GET /api/quotes - Get all quotes with filters
router.get('/', quoteController.getQuotes);

// PATCH /api/quotes/:id/status - Update quote status
router.patch('/:id/status', quoteController.updateQuoteStatus);

// GET /api/quotes/:id - Get single quote (MUST come after specific routes)
router.get('/:id', quoteController.getQuoteById);

export default router;