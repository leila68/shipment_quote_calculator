import { quoteModel } from '../models/quoteModel.js';
import { calculateRate } from '../utils/rateCalculator.js';

export const quoteController = {
  // Calculate and create quote
  async createQuote(req, res) {
    try {
      const { originCity, destinationCity, equipmentType, totalWeight, pickupDate } = req.body;

      // Validation
      if (!originCity || !destinationCity || !equipmentType || !totalWeight || !pickupDate) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['originCity', 'destinationCity', 'equipmentType', 'totalWeight', 'pickupDate']
        });
      }

      // Get lane
      const lane = quoteModel.getLaneByRoute(originCity, destinationCity);
      if (!lane) {
        return res.status(404).json({ 
          error: 'Lane not found',
          message: `No route found from ${originCity} to ${destinationCity}`
        });
      }

      // Get equipment multiplier
      const equipment = quoteModel.getEquipmentMultiplier(equipmentType);
      if (!equipment) {
        return res.status(404).json({ 
          error: 'Equipment type not found',
          message: `Invalid equipment type: ${equipmentType}`
        });
      }

      // Calculate rate
      const calculation = calculateRate(
        lane.base_rate,
        equipment.multiplier,
        totalWeight
      );

      // Create quote
      const quoteData = {
        lane_id: lane.id,
        equipment_type: equipmentType,
        total_weight: totalWeight,
        pickup_date: pickupDate,
        ...calculation
      };

      const quote = quoteModel.createQuote(quoteData);

      res.status(201).json({
        success: true,
        quote
      });
    } catch (error) {
      console.error('Error creating quote:', error);
      res.status(500).json({ error: 'Failed to create quote' });
    }
  },

  // Get all quotes with filters
  async getQuotes(req, res) {
    try {
      const { equipmentType, startDate, endDate, page = 1, limit = 50 } = req.query;

      const filters = {
        equipmentType,
        startDate,
        endDate,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      };

      const quotes = quoteModel.getAllQuotes(filters);
      const total = quoteModel.getQuoteCount(filters);

      res.json({
        success: true,
        data: quotes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching quotes:', error);
      res.status(500).json({ error: 'Failed to fetch quotes' });
    }
  },

  // Get single quote
  async getQuoteById(req, res) {
    try {
      const { id } = req.params;
      const quote = quoteModel.getQuoteById(id);

      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      res.json({
        success: true,
        quote
      });
    } catch (error) {
      console.error('Error fetching quote:', error);
      res.status(500).json({ error: 'Failed to fetch quote' });
    }
  },

  // Get available lanes
  async getLanes(req, res) {
    try {
      const lanes = quoteModel.getAllLanes();
      res.json({
        success: true,
        lanes
      });
    } catch (error) {
      console.error('Error fetching lanes:', error);
      res.status(500).json({ error: 'Failed to fetch lanes' });
    }
  }
};