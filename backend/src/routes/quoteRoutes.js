import express from 'express';
import { quoteController } from '../controllers/quoteController.js';

const router = express.Router();


// SPECIFIC ROUTES FIRST (before any :id routes)


// GET /api/quotes/meta/lanes - Get available lanes
router.get('/meta/lanes', quoteController.getLanes);

// GET /api/quotes/lanes/search - Search origin cities 
router.get('/lanes/search', quoteController.searchOriginCities);

// POST /api/quotes/calculate - Calculate WITHOUT saving
router.post("/calculate", quoteController.calculateQuote); 

// POST /api/quotes - Create new quote
router.post('/', quoteController.createQuote);

// GET /api/quotes - Get all quotes with filters
router.get('/', quoteController.getQuotes);

// PATCH /api/quotes/:id/status - Update quote status
router.patch('/:id/status', quoteController.updateQuoteStatus);


// DYNAMIC ROUTES LAST (/:id catches everything)

// GET /api/quotes/:id - Get single quote (MUST come LAST)
router.get('/:id', quoteController.getQuoteById);

export default router;