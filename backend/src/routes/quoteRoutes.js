import express from 'express';
import { quoteController } from '../controllers/quoteController.js';

const router = express.Router();

// POST /api/quotes - Create new quote
router.post('/', quoteController.createQuote);

// GET /api/quotes - Get all quotes with filters
router.get('/', quoteController.getQuotes);

// GET /api/quotes/:id - Get single quote
router.get('/:id', quoteController.getQuoteById);

// GET /api/quotes/lanes - Get available lanes
router.get('/meta/lanes', quoteController.getLanes);

export default router;