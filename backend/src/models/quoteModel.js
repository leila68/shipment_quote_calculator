import { db } from '../config/database.js';

export const quoteModel = {
  // Get all lanes
  getAllLanes() {
    return db.prepare('SELECT * FROM lanes').all();
  },

  // Get lane by origin and destination
  getLaneByRoute(originCity, destinationCity) {
    return db.prepare(`
      SELECT * FROM lanes 
      WHERE origin_city = ? AND destination_city = ?
    `).get(originCity, destinationCity);
  },

  // Get equipment multiplier
  getEquipmentMultiplier(equipmentType) {
    return db.prepare(`
      SELECT multiplier FROM equipment_types WHERE equipment_type = ?
    `).get(equipmentType);
  },

  // Create new quote
  createQuote(quoteData) {
    const stmt = db.prepare(`
      INSERT INTO quotes (
        lane_id, equipment_type, total_weight, pickup_date,
        base_rate, equipment_multiplier, weight_surcharge, total_quote
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      quoteData.lane_id,
      quoteData.equipment_type,
      quoteData.total_weight,
      quoteData.pickup_date,
      quoteData.base_rate,
      quoteData.equipment_multiplier,
      quoteData.weight_surcharge,
      quoteData.total_quote
    );

    return this.getQuoteById(info.lastInsertRowid);
  },

  // Get quote by ID
  getQuoteById(id) {
    return db.prepare(`
      SELECT q.*, 
        l.origin_city, l.origin_province, l.destination_city, l.destination_province,
        l.distance_km, l.transit_days
      FROM quotes q
      LEFT JOIN lanes l ON q.lane_id = l.id
      WHERE q.id = ?
    `).get(id);
  },

  // Get all quotes with pagination and filtering
  getAllQuotes(filters = {}) {
    let query = `
      SELECT q.*, 
        l.origin_city, l.origin_province, l.destination_city, l.destination_province,
        l.distance_km, l.transit_days
      FROM quotes q
      LEFT JOIN lanes l ON q.lane_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.equipmentType) {
      query += ' AND q.equipment_type = ?';
      params.push(filters.equipmentType);
    }

    if (filters.startDate) {
      query += ' AND q.pickup_date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND q.pickup_date <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY q.created_at DESC LIMIT ? OFFSET ?';
    params.push(filters.limit || 50, filters.offset || 0);

    return db.prepare(query).all(...params);
  },

  // Get quote count for pagination
  getQuoteCount(filters = {}) {
    let query = 'SELECT COUNT(*) as count FROM quotes WHERE 1=1';
    const params = [];

    if (filters.equipmentType) {
      query += ' AND equipment_type = ?';
      params.push(filters.equipmentType);
    }

    if (filters.startDate) {
      query += ' AND pickup_date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND pickup_date <= ?';
      params.push(filters.endDate);
    }

    return db.prepare(query).get(...params).count;
  }
};