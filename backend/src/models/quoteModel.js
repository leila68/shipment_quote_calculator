import { getDatabase } from '../config/database.js';

/**
 * Quote Model - PostgreSQL implementation
 * All database operations for lanes, equipment types, and quotes
 */
export const quoteModel = {
  /**
   * Get all lanes
   * @returns {Promise<Array>} Array of lane objects
   */
  async getAllLanes() {
    const pool = getDatabase();
    const result = await pool.query('SELECT * FROM lanes ORDER BY origin_city, destination_city');
    return result.rows;
  },

  /**
   * Get lane by origin and destination
   * @param {string} originCity - Origin city name
   * @param {string} destinationCity - Destination city name
   * @returns {Promise<Object|null>} Lane object or null
   */
  async getLaneByRoute(originCity, destinationCity) {
    const pool = getDatabase();
    const query = `
      SELECT * FROM lanes
      WHERE origin_city = $1 AND destination_city = $2
    `;
    const result = await pool.query(query, [originCity, destinationCity]);
    return result.rows[0] || null;
  },

  /**
   * Get equipment multiplier by type
   * @param {string} equipmentType - Equipment type name
   * @returns {Promise<Object|null>} Equipment type object with multiplier
   */
  async getEquipmentMultiplier(equipmentType) {
    const pool = getDatabase();
    const query = `
      SELECT multiplier FROM equipment_types WHERE equipment_type = $1
    `;
    const result = await pool.query(query, [equipmentType]);
    return result.rows[0] || null;
  },

  /**
   * Get quote by ID with joined lane information
   * @param {number} id - Quote ID
   * @returns {Promise<Object|null>} Quote object with lane details
   */
  async getQuoteById(id) {
    const pool = getDatabase();
    const query = `
      SELECT
        q.*,
        l.origin_city,
        l.origin_province,
        l.destination_city,
        l.destination_province,
        l.distance_km,
        l.transit_days
      FROM quotes q
      LEFT JOIN lanes l ON q.lane_id = l.id
      WHERE q.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Create new quote
   * @param {Object} quoteData - Quote data object
   * @returns {Promise<Object>} Created quote with full details
   */
  async createQuote(quoteData) {
    const pool = getDatabase();
    const query = `
      INSERT INTO quotes (
        lane_id, equipment_type, total_weight, pickup_date,
        base_rate, equipment_multiplier, weight_surcharge, fuel_surcharge, total_quote, status,
        liftgate_service, appointment_delivery, residential_delivery, accessories_total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `;

    const values = [
      quoteData.lane_id,
      quoteData.equipment_type,
      parseFloat(quoteData.total_weight),
      quoteData.pickup_date,
      parseFloat(quoteData.base_rate),
      parseFloat(quoteData.equipment_multiplier),
      parseFloat(quoteData.weight_surcharge),
      quoteData.fuel_surcharge ? parseFloat(quoteData.fuel_surcharge) : null,
      parseFloat(quoteData.total_quote),
      quoteData.status || 'created',
      quoteData.liftgate_service || false,
      quoteData.appointment_delivery || false,
      quoteData.residential_delivery || false,
      parseFloat(quoteData.accessories_total || 0)
    ];

    const result = await pool.query(query, values);
    const newQuoteId = result.rows[0].id;

    // Fetch and return the complete quote with lane details
    return await this.getQuoteById(newQuoteId);
  },

  /**
   * Update quote status
   * @param {number} id - Quote ID
   * @param {string} status - New status (created, sent, accepted)
   * @returns {Promise<Object>} Updated quote
   */
  async updateQuoteStatus(id, status) {
    const validStatuses = ['created', 'sent', 'accepted'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const pool = getDatabase();
    const query = `
      UPDATE quotes
      SET status = $1
      WHERE id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      throw new Error('Quote not found');
    }

    return await this.getQuoteById(id);
  },

  /**
   * Get all quotes with pagination and filtering
   * @param {Object} filters - Filter options (originCity, destinationCity, equipmentType, status, pickupDate, limit, offset)
   * @returns {Promise<Array>} Array of quote objects with lane details
   */
  async getAllQuotes(filters = {}) {
    const pool = getDatabase();
    let query = `
      SELECT
        q.*,
        l.origin_city,
        l.origin_province,
        l.destination_city,
        l.destination_province,
        l.distance_km,
        l.transit_days
      FROM quotes q
      LEFT JOIN lanes l ON q.lane_id = l.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.originCity) {
      query += ` AND l.origin_city ILIKE $${paramCount}`;
      params.push(`%${filters.originCity}%`);
      paramCount++;
    }

    if (filters.destinationCity) {
      query += ` AND l.destination_city ILIKE $${paramCount}`;
      params.push(`%${filters.destinationCity}%`);
      paramCount++;
    }

    if (filters.equipmentType) {
      query += ` AND q.equipment_type = $${paramCount}`;
      params.push(filters.equipmentType);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND q.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.pickupDate) {
      query += ` AND q.pickup_date = $${paramCount}`;
      params.push(filters.pickupDate);
      paramCount++;
    }

    query += ` ORDER BY q.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(filters.limit || 50, filters.offset || 0);

    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Get quote count for pagination
   * @param {Object} filters - Filter options (same as getAllQuotes)
   * @returns {Promise<number>} Total count of quotes matching filters
   */
  async getQuoteCount(filters = {}) {
    const pool = getDatabase();
    let query = `
      SELECT COUNT(*) as count
      FROM quotes q
      LEFT JOIN lanes l ON q.lane_id = l.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.originCity) {
      query += ` AND l.origin_city ILIKE $${paramCount}`;
      params.push(`%${filters.originCity}%`);
      paramCount++;
    }

    if (filters.destinationCity) {
      query += ` AND l.destination_city ILIKE $${paramCount}`;
      params.push(`%${filters.destinationCity}%`);
      paramCount++;
    }

    if (filters.equipmentType) {
      query += ` AND q.equipment_type = $${paramCount}`;
      params.push(filters.equipmentType);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND q.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.pickupDate) {
      query += ` AND q.pickup_date = $${paramCount}`;
      params.push(filters.pickupDate);
      paramCount++;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  },

  /**
   * Search origin cities by query prefix (for autocomplete)
   * @param {string} query - Search query string
   * @returns {Promise<Array>} Array of matching city objects
   */
  async searchOriginCities(query) {
    const pool = getDatabase();
    const sqlQuery = `
      SELECT DISTINCT origin_city
      FROM lanes
      WHERE LOWER(origin_city) LIKE LOWER($1)
      ORDER BY origin_city
      LIMIT 5
    `;
    const result = await pool.query(sqlQuery, [`${query}%`]);
    return result.rows;
  },

  /**
   * Get all equipment types
   * @returns {Promise<Array>} Array of equipment type objects
   */
  async getAllEquipmentTypes() {
    const pool = getDatabase();
    const result = await pool.query('SELECT * FROM equipment_types ORDER BY equipment_type');
    return result.rows;
  }
};
