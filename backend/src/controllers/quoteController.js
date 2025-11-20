import { quoteModel } from '../models/quoteModel.js';
import { calculateRate } from '../utils/rateCalculator.js';

export const quoteController = {
  // Calculate quote WITHOUT saving to database
  async calculateQuote(req, res) {
    try {
      console.log('🧮 Calculating quote (no save):', req.body);
      
      const { originCity, destinationCity, equipmentType, totalWeight, pickupDate, accessorials } = req.body;

      // Validation
      if (!originCity || !destinationCity || !equipmentType || !totalWeight || !pickupDate) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['originCity', 'destinationCity', 'equipmentType', 'totalWeight', 'pickupDate'],
          received: req.body
        });
      }

      console.log('🔍 Looking for lane:', originCity, '->', destinationCity);
      
      // Get lane
      const lane = quoteModel.getLaneByRoute(originCity, destinationCity);
      console.log('📍 Lane found:', lane);
      
      if (!lane) {
        console.log('❌ Lane not found');
        return res.status(404).json({ 
          error: 'Lane not found',
          message: `No route found from ${originCity} to ${destinationCity}`
        });
      }

      console.log('🚛 Looking for equipment type:', equipmentType);
      
      // Get equipment multiplier
      const equipment = quoteModel.getEquipmentMultiplier(equipmentType);
      console.log('🔧 Equipment found:', equipment);
      
      if (!equipment) {
        console.log('❌ Equipment type not found');
        return res.status(404).json({ 
          error: 'Equipment type not found',
          message: `Invalid equipment type: ${equipmentType}`
        });
      }

      console.log('🧮 Calculating rate...');
      
      // Calculate rate with distance for fuel surcharge
      const calculation = calculateRate(
        lane.base_rate,
        equipment.multiplier,
        totalWeight,
        lane.distance_km,
        accessorials
      );
      console.log('💰 Calculation result:', calculation);

      // Return ONLY the calculation, DO NOT save to database
      res.json({
        success: true,
        calculation
      });
      
      console.log('✅ Quote calculated (not saved)');
      
    } catch (error) {
      console.error('❌ Error calculating quote:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        error: 'Internal server error'
      });
    }
  },

  // Calculate and create quote (SAVES TO DATABASE)
  async createQuote(req, res) {
    try {
      console.log('📝 Received quote request:', req.body);
      
      const { originCity, destinationCity, equipmentType, totalWeight, pickupDate, accessorials } = req.body;

      // Validation
      if (!originCity || !destinationCity || !equipmentType || !totalWeight || !pickupDate) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['originCity', 'destinationCity', 'equipmentType', 'totalWeight', 'pickupDate'],
          received: req.body
        });
      }

      console.log('🔍 Looking for lane:', originCity, '->', destinationCity);
      
      // Get lane
      const lane = quoteModel.getLaneByRoute(originCity, destinationCity);
      console.log('📍 Lane found:', lane);
      
      if (!lane) {
        console.log('❌ Lane not found');
        return res.status(404).json({ 
          error: 'Lane not found',
          message: `No route found from ${originCity} to ${destinationCity}`
        });
      }

      console.log('🚛 Looking for equipment type:', equipmentType);
      
      // Get equipment multiplier
      const equipment = quoteModel.getEquipmentMultiplier(equipmentType);
      console.log('🔧 Equipment found:', equipment);
      
      if (!equipment) {
        console.log('❌ Equipment type not found');
        return res.status(404).json({ 
          error: 'Equipment type not found',
          message: `Invalid equipment type: ${equipmentType}`
        });
      }

      console.log('🧮 Calculating rate...');
      
      // Calculate rate with distance for fuel surcharge
      const calculation = calculateRate(
        lane.base_rate,
        equipment.multiplier,
        totalWeight,
        lane.distance_km,
        accessorials
      );
      console.log('💰 Calculation result:', calculation);

      // Create quote - Map camelCase to snake_case for database
      const quoteData = {
        lane_id: lane.id,
        equipment_type: equipmentType,
        total_weight: totalWeight,
        pickup_date: pickupDate,
        base_rate: calculation.baseRate,
        equipment_multiplier: calculation.equipmentMultiplier,
        weight_surcharge: calculation.weightSurcharge,
        fuel_surcharge: calculation.fuelSurcharge,
        total_quote: calculation.totalQuote,
        liftgate_service: accessorials?.liftgate || false,
        appointment_delivery: accessorials?.appointment || false,
        residential_delivery: accessorials?.residential || false,
        accessories_total: calculation.accessoriesTotal || 0.00
      };
      
      console.log('💾 Saving quote:', quoteData);

      const quote = quoteModel.createQuote(quoteData);
      console.log('✅ Quote created:', quote);

      res.json({
        success: true,
        quote,
        calculation
      });
    } catch (error) {
      console.error('❌ Error creating quote:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        error: 'Internal server error'
      });
    }
  },

  // Get all quotes with filters
  async getQuotes(req, res) {
    try {
      const { originCity, destinationCity, equipmentType, status, startDate, endDate, page = 1, limit = 50 } = req.query;

     // normalize/filter case-insensitive
     let eqType = equipmentType;
     let st = status;
     if (equipmentType) eqType = equipmentType.toLowerCase();
     if (status) st = status.toLowerCase();

    const filters = {
    originCity,
    destinationCity,
    equipmentType,
    status,
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

  // Update quote status
  async updateQuoteStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ 
          error: 'Status is required',
          validStatuses: ['created', 'sent', 'accepted']
        });
      }

      const quote = quoteModel.updateQuoteStatus(id, status);

      res.json({
        success: true,
        quote,
        message: `Quote status updated to '${status}'`
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      if (error.message.includes('Invalid status')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Quote not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to update quote status' });
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