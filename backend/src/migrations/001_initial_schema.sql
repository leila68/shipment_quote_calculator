-- Initial Database Schema for Shipment Quote Calculator
-- PostgreSQL Migration

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for better type safety
CREATE TYPE quote_status AS ENUM ('created', 'sent', 'accepted');

-- Table: lanes
-- Stores shipping lane information (origin to destination routes)
CREATE TABLE lanes (
  id SERIAL PRIMARY KEY,
  origin_city VARCHAR(100) NOT NULL,
  origin_province VARCHAR(2) NOT NULL,
  origin_postal VARCHAR(10) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  destination_province VARCHAR(2) NOT NULL,
  destination_postal VARCHAR(10) NOT NULL,
  base_rate NUMERIC(10,2) NOT NULL CHECK (base_rate >= 0),
  distance_km NUMERIC(8,2) NOT NULL CHECK (distance_km >= 0),
  transit_days INTEGER NOT NULL CHECK (transit_days > 0),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table: equipment_types
-- Stores equipment types and their price multipliers
CREATE TABLE equipment_types (
  id SERIAL PRIMARY KEY,
  equipment_type VARCHAR(50) UNIQUE NOT NULL,
  multiplier NUMERIC(4,2) NOT NULL CHECK (multiplier > 0),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table: quotes
-- Stores generated shipping quotes
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  lane_id INTEGER REFERENCES lanes(id) ON DELETE SET NULL,
  equipment_type VARCHAR(50) NOT NULL,
  total_weight NUMERIC(10,2) NOT NULL CHECK (total_weight > 0),
  pickup_date DATE NOT NULL,
  base_rate NUMERIC(10,2) NOT NULL,
  equipment_multiplier NUMERIC(4,2) NOT NULL,
  weight_surcharge NUMERIC(10,2) NOT NULL DEFAULT 0,
  fuel_surcharge NUMERIC(10,2),
  total_quote NUMERIC(10,2) NOT NULL CHECK (total_quote >= 0),
  status quote_status DEFAULT 'created',

  -- Additional service flags
  liftgate_service BOOLEAN DEFAULT FALSE,
  appointment_delivery BOOLEAN DEFAULT FALSE,
  residential_delivery BOOLEAN DEFAULT FALSE,
  accessories_total NUMERIC(10,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_lanes_origin_city ON lanes(origin_city);
CREATE INDEX idx_lanes_destination_city ON lanes(destination_city);
CREATE INDEX idx_lanes_route ON lanes(origin_city, destination_city);

CREATE INDEX idx_equipment_types_type ON equipment_types(equipment_type);

CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_lane_id ON quotes(lane_id);
CREATE INDEX idx_quotes_pickup_date ON quotes(pickup_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_lanes_updated_at BEFORE UPDATE ON lanes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_types_updated_at BEFORE UPDATE ON equipment_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE lanes IS 'Shipping lanes with origin and destination information';
COMMENT ON TABLE equipment_types IS 'Equipment types with pricing multipliers';
COMMENT ON TABLE quotes IS 'Generated shipping quotes with all details and pricing breakdown';
COMMENT ON COLUMN quotes.status IS 'Quote workflow status: created, sent, or accepted';
