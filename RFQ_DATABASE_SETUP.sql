-- ============================================================================
-- RFQ DATABASE - SETUP & MIGRATION SCRIPT
-- ============================================================================
-- This script:
-- 1. Creates all tables with proper constraints
-- 2. Creates indexes for performance
-- 3. Creates materialized views
-- 4. Includes data migration from mock data

-- ============================================================================
-- SETUP & PREPARATION
-- ============================================================================

-- Create database (if not exists)
-- In psql: CREATE DATABASE dwas_rfq;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For ILIKE searches

-- Set up search path
SET search_path TO public;

-- ============================================================================
-- STEP 1: DROP EXISTING OBJECTS (if doing fresh install)
-- ============================================================================

-- Comment out if doing incremental migration
/*
DROP MATERIALIZED VIEW IF EXISTS rfq_summary;
DROP TABLE IF EXISTS rfq_metadata;
DROP TABLE IF EXISTS rfq_tags;
DROP TABLE IF EXISTS rfq_timeline_events;
DROP TABLE IF EXISTS vendor_recommendations;
DROP TABLE IF EXISTS vendor_quotes;
DROP TABLE IF EXISTS rfq_requirements;
DROP TABLE IF EXISTS rfq_documents;
DROP TABLE IF EXISTS rfq_items;
DROP TABLE IF EXISTS rfqs;
DROP TABLE IF EXISTS vendor_performance_history;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;
*/

-- ============================================================================
-- STEP 2: CREATE MAIN TABLES
-- ============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operator', 'viewer', 'dispatcher', 'procurement_lead', 'ai')) DEFAULT 'operator',
  avatar_url VARCHAR(500),
  status VARCHAR(20) NOT NULL CHECK (status IN ('online', 'away', 'offline', 'busy')) DEFAULT 'offline',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert sample users (from mock data)
INSERT INTO users (id, name, email, role, status) VALUES
  ('00000000-0000-0000-0000-000000000001'::UUID, 'Arjun Mehta', 'arjun@dwas.io', 'admin', 'online'),
  ('00000000-0000-0000-0000-000000000002'::UUID, 'Priya Sharma', 'priya@dwas.io', 'dispatcher', 'online'),
  ('00000000-0000-0000-0000-000000000003'::UUID, 'Ravi Kumar', 'ravi@dwas.io', 'procurement_lead', 'busy'),
  ('00000000-0000-0000-0000-000000000004'::UUID, 'Sneha Patel', 'sneha@dwas.io', 'operator', 'away'),
  ('00000000-0000-0000-0000-000000000005'::UUID, 'Vikram Singh', 'vikram@dwas.io', 'operator', 'offline'),
  ('00000000-0000-0000-0000-000000000006'::UUID, 'DWAS AI', 'ai@dwas.io', 'viewer', 'online')
ON CONFLICT (email) DO NOTHING;

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Insert sample clients (from mock RFQ data)
INSERT INTO clients (id, name, contact_name, email, city) VALUES
  ('10000000-0000-0000-0000-000000000001'::UUID, 'L&T Hyderabad Metro', 'Rajesh Kumar', 'rajesh.kumar@ltmetro.in', 'Hyderabad'),
  ('10000000-0000-0000-0000-000000000002'::UUID, 'GMR Hyderabad Airport', 'Vijay Anand', 'vijay.anand@gmr.com', 'Hyderabad'),
  ('10000000-0000-0000-0000-000000000003'::UUID, 'Infosys Hyderabad Campus', 'Suresh Reddy', 'suresh.reddy@infosys.com', 'Hyderabad'),
  ('10000000-0000-0000-0000-000000000004'::UUID, 'Dr. Reddy''s Laboratories', 'Prasad Menon', 'prasad.menon@drreddys.com', 'Hyderabad'),
  ('10000000-0000-0000-0000-000000000005'::UUID, 'Kalyan Jewellers', 'Abhishek Sharma', 'abhishek.s@kalyanjewellers.net', 'Hyderabad'),
  ('10000000-0000-0000-0000-000000000006'::UUID, 'Sun Pharma Hyderabad', 'Krishna Murthy', 'krishna.m@sunpharma.com', 'Hyderabad'),
  ('10000000-0000-0000-0000-000000000007'::UUID, 'Tata Motors Gloat', 'Anil Kumar', 'anil.kumar@tatamotors.com', 'Hyderabad')
ON CONFLICT (name) DO NOTHING;

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  region_code VARCHAR(50),
  certifications TEXT[],
  specializations TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(name);
CREATE INDEX IF NOT EXISTS idx_vendors_location ON vendors(location);
CREATE INDEX IF NOT EXISTS idx_vendors_region ON vendors(region_code);
CREATE INDEX IF NOT EXISTS idx_vendors_active ON vendors(is_active);

-- Insert sample vendors
INSERT INTO vendors (id, name, location, city, specializations, certifications) VALUES
  ('20000000-0000-0000-0000-000000000001'::UUID, 'Tata Steel Distribution', 'Hyderabad', 'Hyderabad', ARRAY['structural-steel', 'steel-coils'], ARRAY['BSI', 'ISO']),
  ('20000000-0000-0000-0000-000000000002'::UUID, 'JSW Steel Ltd', 'Mumbai', 'Mumbai', ARRAY['structural-steel', 'plates'], ARRAY['ISO9001']),
  ('20000000-0000-0000-0000-000000000003'::UUID, 'SAIL Distributors', 'Secunderabad', 'Hyderabad', ARRAY['structural-steel', 'pipes'], ARRAY['BIS']),
  ('20000000-0000-0000-0000-000000000004'::UUID, 'Aludecor Industries', 'Hyderabad', 'Hyderabad', ARRAY['acp-panels', 'aluminum'], ARRAY['BSI']),
  ('20000000-0000-0000-0000-000000000005'::UUID, 'Jindal SS Tubes', 'Mumbai', 'Mumbai', ARRAY['ss-pipes', 'fittings'], ARRAY['FDA', 'ISO']),
  ('20000000-0000-0000-0000-000000000006'::UUID, 'Apex Piping Systems', 'Hyderabad', 'Hyderabad', ARRAY['ss-pipes', 'valves'], ARRAY['ISO']),
  ('20000000-0000-0000-0000-000000000007'::UUID, 'Cool Tech HVAC Solutions', 'Hyderabad', 'Hyderabad', ARRAY['hvac', 'ducting'], ARRAY['ISO9001']),
  ('20000000-0000-0000-0000-000000000008'::UUID, 'Asian Paints Industrial', 'Mumbai', 'Mumbai', ARRAY['industrial-paints'], ARRAY['ISO'])
ON CONFLICT (name) DO NOTHING;

-- Vendor Performance History Table
CREATE TABLE IF NOT EXISTS vendor_performance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  on_time_delivery_rate DECIMAL(5, 2) CHECK (on_time_delivery_rate BETWEEN 0 AND 100),
  quality_score DECIMAL(5, 2) CHECK (quality_score BETWEEN 0 AND 100),
  response_rate DECIMAL(5, 2) CHECK (response_rate BETWEEN 0 AND 100),
  average_lead_time_days INTEGER,
  total_orders INTEGER DEFAULT 0,
  successful_orders INTEGER DEFAULT 0,
  last_order_date DATE,
  average_order_value DECIMAL(15, 2),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_perf_vendor ON vendor_performance_history(vendor_id);

-- Main RFQ Table
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id),
  reporter_id UUID NOT NULL REFERENCES users(id),
  assignee_id UUID REFERENCES users(id),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  stage VARCHAR(50) NOT NULL CHECK (stage IN (
    'new', 'requirements_extraction', 'vendor_sourcing', 'vendor_coordination',
    'quotation_received', 'quotation_review', 'client_presentation', 'negotiation',
    'order_confirmation', 'po_generated', 'closed', 'cancelled'
  )) DEFAULT 'new',
  status VARCHAR(30) NOT NULL CHECK (status IN ('open', 'in_progress', 'awaiting_response', 'quoted', 'won', 'lost', 'cancelled')) DEFAULT 'open',
  delivery_location VARCHAR(500) NOT NULL,
  total_quantity DECIMAL(15, 2) NOT NULL,
  quantity_unit VARCHAR(50),
  sla_deadline TIMESTAMP WITH TIME ZONE,
  sla_status VARCHAR(20) CHECK (sla_status IN ('on_track', 'at_risk', 'breached', 'no_sla')) DEFAULT 'no_sla',
  due_date TIMESTAMP WITH TIME ZONE,
  ai_confidence_score DECIMAL(5, 2) CHECK (ai_confidence_score BETWEEN 0 AND 1),
  notes TEXT,
  unread_updates INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes on rfqs
CREATE INDEX IF NOT EXISTS idx_rfqs_number ON rfqs(rfq_number);
CREATE INDEX IF NOT EXISTS idx_rfqs_client ON rfqs(client_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_stage ON rfqs(stage);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
CREATE INDEX IF NOT EXISTS idx_rfqs_priority ON rfqs(priority);
CREATE INDEX IF NOT EXISTS idx_rfqs_assignee ON rfqs(assignee_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_created ON rfqs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rfqs_sla_status ON rfqs(sla_status);
CREATE INDEX IF NOT EXISTS idx_rfqs_client_created ON rfqs(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rfqs_assignee_status ON rfqs(assignee_id, status);
CREATE INDEX IF NOT EXISTS idx_rfqs_stage_priority ON rfqs(stage, priority);

-- RFQ Items Table
CREATE TABLE IF NOT EXISTS rfq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  material_description VARCHAR(500) NOT NULL,
  material_category VARCHAR(100),
  material_grade VARCHAR(100),
  quantity DECIMAL(15, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  required_date DATE,
  delivery_location VARCHAR(500),
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rfq_id, line_number)
);

CREATE INDEX IF NOT EXISTS idx_rfq_items_rfq ON rfq_items(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_items_category ON rfq_items(material_category);
CREATE INDEX IF NOT EXISTS idx_rfq_items_specs ON rfq_items USING GIN(specifications);

-- RFQ Documents Table
CREATE TABLE IF NOT EXISTS rfq_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('pdf', 'image', 'excel', 'word', 'other')),
  file_size INTEGER NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  uploaded_by_id UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ocr_processed BOOLEAN DEFAULT FALSE,
  ocr_confidence_score DECIMAL(5, 2),
  extracted_text TEXT,
  storage_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_docs_rfq ON rfq_documents(rfq_id);
CREATE INDEX IF NOT EXISTS idx_docs_type ON rfq_documents(type);
CREATE INDEX IF NOT EXISTS idx_docs_ocr ON rfq_documents(ocr_processed);

-- RFQ Requirements Table
CREATE TABLE IF NOT EXISTS rfq_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('material', 'quantity', 'delivery', 'quality', 'certification', 'other')),
  label VARCHAR(255) NOT NULL,
  value VARCHAR(1000) NOT NULL,
  confidence_score DECIMAL(5, 2) CHECK (confidence_score BETWEEN 0 AND 1),
  validation_status VARCHAR(20) NOT NULL CHECK (validation_status IN ('valid', 'uncertain', 'missing', 'invalid')) DEFAULT 'uncertain',
  source_document_id UUID REFERENCES rfq_documents(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_req_rfq ON rfq_requirements(rfq_id);
CREATE INDEX IF NOT EXISTS idx_req_category ON rfq_requirements(category);
CREATE INDEX IF NOT EXISTS idx_req_validation ON rfq_requirements(validation_status);

-- Vendor Quotes Table
CREATE TABLE IF NOT EXISTS vendor_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  quote_number VARCHAR(100),
  price_per_unit DECIMAL(15, 2) NOT NULL,
  total_price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_date DATE NOT NULL,
  payment_terms VARCHAR(500),
  notes TEXT,
  status VARCHAR(30) NOT NULL CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected', 'counter_offered', 'expired')) DEFAULT 'submitted',
  counter_offer_price DECIMAL(15, 2),
  counter_offer_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rfq_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_quotes_rfq ON vendor_quotes(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotes_vendor ON vendor_quotes(vendor_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON vendor_quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_valid ON vendor_quotes(valid_until);

-- AI Vendor Recommendations Table
CREATE TABLE IF NOT EXISTS vendor_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  match_score DECIMAL(5, 2) NOT NULL CHECK (match_score BETWEEN 0 AND 1),
  confidence_level VARCHAR(20) NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),
  match_reasons TEXT[],
  region_compatibility VARCHAR(20) NOT NULL CHECK (region_compatibility IN ('exact', 'near', 'remote')),
  suggested_contacts TEXT[],
  ranking INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rec_rfq ON vendor_recommendations(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rec_vendor ON vendor_recommendations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_rec_score ON vendor_recommendations(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_rec_confidence ON vendor_recommendations(confidence_level);

-- RFQ Timeline Events Table
CREATE TABLE IF NOT EXISTS rfq_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('human', 'ai', 'system', 'workflow_transition')),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  actor_id UUID REFERENCES users(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  previous_stage VARCHAR(50),
  new_stage VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_timeline_rfq ON rfq_timeline_events(rfq_id);
CREATE INDEX IF NOT EXISTS idx_timeline_type ON rfq_timeline_events(event_type);
CREATE INDEX IF NOT EXISTS idx_timeline_timestamp ON rfq_timeline_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_actor ON rfq_timeline_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_timeline_metadata ON rfq_timeline_events USING GIN(metadata);

-- RFQ Tags Table
CREATE TABLE IF NOT EXISTS rfq_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rfq_id, tag_name)
);

CREATE INDEX IF NOT EXISTS idx_tags_rfq ON rfq_tags(rfq_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON rfq_tags(tag_name);

-- RFQ Metadata Table
CREATE TABLE IF NOT EXISTS rfq_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rfq_id, key)
);

CREATE INDEX IF NOT EXISTS idx_metadata_rfq ON rfq_metadata(rfq_id);
CREATE INDEX IF NOT EXISTS idx_metadata_key ON rfq_metadata(key);

-- ============================================================================
-- STEP 3: CREATE MATERIALIZED VIEW
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS rfq_summary AS
SELECT 
  r.id,
  r.rfq_number,
  r.client_id,
  c.name AS client_name,
  r.reporter_id,
  reporter.name AS reporter_name,
  r.assignee_id,
  assignee.name AS assignee_name,
  r.priority,
  r.stage,
  r.status,
  r.sla_status,
  r.ai_confidence_score,
  COUNT(DISTINCT i.id) AS total_items,
  SUM(i.quantity) AS total_quantity,
  COUNT(DISTINCT q.id) AS quote_count,
  COUNT(DISTINCT rec.id) AS recommendation_count,
  COUNT(DISTINCT doc.id) AS document_count,
  COUNT(DISTINCT req.id) AS requirement_count,
  (SELECT COUNT(*) FROM vendor_quotes vq WHERE vq.rfq_id = r.id AND vq.status = 'submitted') AS pending_quotes,
  r.created_at,
  r.updated_at,
  r.last_activity_at
FROM rfqs r
LEFT JOIN clients c ON r.client_id = c.id
LEFT JOIN users reporter ON r.reporter_id = reporter.id
LEFT JOIN users assignee ON r.assignee_id = assignee.id
LEFT JOIN rfq_items i ON r.id = i.rfq_id
LEFT JOIN vendor_quotes q ON r.id = q.rfq_id
LEFT JOIN vendor_recommendations rec ON r.id = rec.rfq_id
LEFT JOIN rfq_documents doc ON r.id = doc.rfq_id
LEFT JOIN rfq_requirements req ON r.id = req.rfq_id
GROUP BY r.id, c.name, reporter.id, reporter.name, assignee.id, assignee.name;

CREATE INDEX IF NOT EXISTS idx_rfq_summary_client ON rfq_summary(client_id);
CREATE INDEX IF NOT EXISTS idx_rfq_summary_assignee ON rfq_summary(assignee_id);
CREATE INDEX IF NOT EXISTS idx_rfq_summary_stage ON rfq_summary(stage);

-- ============================================================================
-- STEP 4: INSERT SAMPLE RFQ DATA (from mock)
-- ============================================================================

-- Helper function to insert RFQ with all related data
-- This is a placeholder - implement based on your mock data structure
-- For production, you'd read from the TypeScript mock file and insert via API

INSERT INTO rfqs (
  id, rfq_number, client_id, reporter_id, assignee_id, priority, stage, status,
  delivery_location, total_quantity, quantity_unit, sla_deadline, sla_status,
  due_date, ai_confidence_score, notes, created_at, last_activity_at
) VALUES
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    'RFQ-104',
    '10000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000003'::UUID,
    'high',
    'vendor_coordination',
    'in_progress',
    'Hyderabad Metro Site, Gachibowli',
    57,
    'MT',
    NOW() + INTERVAL '36 hours',
    'at_risk',
    NOW() + INTERVAL '48 hours',
    0.89,
    'Government project - priority delivery required',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '12 minutes'
  ),
  (
    '30000000-0000-0000-0000-000000000002'::UUID,
    'RFQ-105',
    '10000000-0000-0000-0000-000000000002'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000002'::UUID,
    'critical',
    'requirements_extraction',
    'open',
    'RGIA Airport Cargo Zone, Shamshabad',
    270,
    'Coils',
    NOW() + INTERVAL '18 hours',
    'on_track',
    NULL,
    0.76,
    NULL,
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '1 hour'
  ),
  (
    '30000000-0000-0000-0000-000000000003'::UUID,
    'RFQ-106',
    '10000000-0000-0000-0000-000000000003'::UUID,
    '00000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000003'::UUID,
    'medium',
    'quotation_received',
    'quoted',
    'Infosys Campus, Gachibowli',
    500,
    'Sheets',
    NULL,
    'no_sla',
    NOW() + INTERVAL '96 hours',
    0.94,
    NULL,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '4 hours'
  )
ON CONFLICT (rfq_number) DO NOTHING;

-- Insert RFQ Items for RFQ-104
INSERT INTO rfq_items (rfq_id, line_number, material_description, material_category, material_grade, quantity, unit, required_date, delivery_location) VALUES
  ('30000000-0000-0000-0000-000000000001'::UUID, 1, 'Structural Steel Beams - ISMB 200', 'structural-steel', 'ISMB 200', 45, 'MT', NOW() + INTERVAL '72 hours', 'Hyderabad Metro Site, Gachibowli'),
  ('30000000-0000-0000-0000-000000000001'::UUID, 2, 'MS Angles - 50x50x5mm', 'structural-steel', 'MS', 12, 'MT', NOW() + INTERVAL '72 hours', 'Hyderabad Metro Site, Gachibowli')
ON CONFLICT DO NOTHING;

-- Insert RFQ Items for RFQ-105
INSERT INTO rfq_items (rfq_id, line_number, material_description, material_category, quantity, unit) VALUES
  ('30000000-0000-0000-0000-000000000002'::UUID, 1, 'Havells Cable 2.5mm sq', 'electrical-cable', 150, 'Coils'),
  ('30000000-0000-0000-0000-000000000002'::UUID, 2, 'Havells Cable 4mm sq', 'electrical-cable', 80, 'Coils'),
  ('30000000-0000-0000-0000-000000000002'::UUID, 3, 'Havells Cable 6mm sq', 'electrical-cable', 40, 'Coils')
ON CONFLICT DO NOTHING;

-- Insert RFQ Items for RFQ-106
INSERT INTO rfq_items (rfq_id, line_number, material_description, material_category, material_grade, quantity, unit) VALUES
  ('30000000-0000-0000-0000-000000000003'::UUID, 1, 'Aluminum Composite Panels 4mm', 'acp-panels', 'ACM 4mm', 500, 'Sheets')
ON CONFLICT DO NOTHING;

-- Insert tags
INSERT INTO rfq_tags (rfq_id, tag_name) VALUES
  ('30000000-0000-0000-0000-000000000001'::UUID, 'structural-steel'),
  ('30000000-0000-0000-0000-000000000001'::UUID, 'lt-projects'),
  ('30000000-0000-0000-0000-000000000001'::UUID, 'urgent'),
  ('30000000-0000-0000-0000-000000000002'::UUID, 'electrical'),
  ('30000000-0000-0000-0000-000000000002'::UUID, 'airport'),
  ('30000000-0000-0000-0000-000000000002'::UUID, 'cables'),
  ('30000000-0000-0000-0000-000000000003'::UUID, 'acp-panels'),
  ('30000000-0000-0000-0000-000000000003'::UUID, 'infosys'),
  ('30000000-0000-0000-0000-000000000003'::UUID, 'construction')
ON CONFLICT DO NOTHING;

-- Insert timeline events
INSERT INTO rfq_timeline_events (rfq_id, event_type, title, description, actor_id, timestamp) VALUES
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    'system',
    'RFQ Created',
    'L&T Hyderabad Metro RFQ created',
    NULL,
    NOW() - INTERVAL '3 days'
  ),
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    'ai',
    'AI extracted 8 requirements from document',
    NULL,
    '00000000-0000-0000-0000-000000000006'::UUID,
    NOW() - INTERVAL '2 days 23 hours'
  ),
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    'ai',
    'Matched 5 vendors for structural steel',
    NULL,
    '00000000-0000-0000-0000-000000000006'::UUID,
    NOW() - INTERVAL '2 days 22 hours'
  ),
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    'system',
    'SLA warning triggered - 36 hours remaining',
    NULL,
    NULL,
    NOW() - INTERVAL '2 hours'
  )
ON CONFLICT DO NOTHING;

-- Insert vendor recommendations for RFQ-104
INSERT INTO vendor_recommendations (rfq_id, vendor_id, match_score, confidence_level, match_reasons, region_compatibility, ranking) VALUES
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    '20000000-0000-0000-0000-000000000001'::UUID,
    0.92,
    'high',
    ARRAY['Preferred vendor for L&T projects', 'Excellent delivery track record', 'Competitive pricing for bulk orders'],
    'exact',
    1
  ),
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    '20000000-0000-0000-0000-000000000002'::UUID,
    0.85,
    'high',
    ARRAY['Direct manufacturer', 'Quality certified', 'Regional warehouse in Hyderabad'],
    'near',
    2
  ),
  (
    '30000000-0000-0000-0000-000000000001'::UUID,
    '20000000-0000-0000-0000-000000000003'::UUID,
    0.78,
    'medium',
    ARRAY['Government PSU supplier', 'Nearby distribution center'],
    'exact',
    3
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 5: REFRESH MATERIALIZED VIEW
-- ============================================================================

REFRESH MATERIALIZED VIEW rfq_summary;

-- ============================================================================
-- STEP 6: VERIFICATION QUERIES
-- ============================================================================

-- Verify data was inserted
SELECT 'Users' as entity, COUNT(*) FROM users
UNION ALL
SELECT 'Clients', COUNT(*) FROM clients
UNION ALL
SELECT 'Vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'RFQs', COUNT(*) FROM rfqs
UNION ALL
SELECT 'RFQ Items', COUNT(*) FROM rfq_items
UNION ALL
SELECT 'Vendor Quotes', COUNT(*) FROM vendor_quotes
UNION ALL
SELECT 'Vendor Recommendations', COUNT(*) FROM vendor_recommendations
UNION ALL
SELECT 'Timeline Events', COUNT(*) FROM rfq_timeline_events
UNION ALL
SELECT 'Tags', COUNT(*) FROM rfq_tags;

-- Sample: Get complete RFQ summary
SELECT * FROM rfq_summary WHERE status != 'closed' ORDER BY priority, last_activity_at DESC;

-- ============================================================================
-- STEP 7: HELPER FUNCTION
-- ============================================================================

-- Function to get complete RFQ JSON for API response
CREATE OR REPLACE FUNCTION get_rfq_complete(p_rfq_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'id', r.id,
    'rfqNumber', r.rfq_number,
    'clientName', c.name,
    'clientContact', c.contact_name,
    'clientEmail', c.email,
    'priority', r.priority,
    'stage', r.stage,
    'status', r.status,
    'slaStatus', r.sla_status,
    'slaDeadline', r.sla_deadline,
    'deliveryLocation', r.delivery_location,
    'totalQuantity', r.total_quantity,
    'quantityUnit', r.quantity_unit,
    'aiConfidenceScore', r.ai_confidence_score,
    'notes', r.notes,
    'createdAt', r.created_at,
    'updatedAt', r.updated_at,
    'lastActivityAt', r.last_activity_at,
    'items', (
      SELECT json_agg(json_build_object(
        'id', i.id,
        'lineNumber', i.line_number,
        'material', i.material_description,
        'category', i.material_category,
        'quantity', i.quantity,
        'unit', i.unit,
        'requiredDate', i.required_date,
        'specifications', i.specifications
      ) ORDER BY i.line_number)
      FROM rfq_items i WHERE i.rfq_id = p_rfq_id
    ),
    'tags', (
      SELECT json_agg(tag_name) FROM rfq_tags WHERE rfq_id = p_rfq_id
    ),
    'documents', (
      SELECT json_agg(json_build_object(
        'id', id,
        'name', name,
        'type', type,
        'size', file_size,
        'url', storage_url,
        'uploadedAt', uploaded_at
      )) FROM rfq_documents WHERE rfq_id = p_rfq_id
    ),
    'requirements', (
      SELECT json_agg(json_build_object(
        'id', id,
        'category', category,
        'label', label,
        'value', value,
        'confidence', confidence_score,
        'validationStatus', validation_status
      )) FROM rfq_requirements WHERE rfq_id = p_rfq_id
    ),
    'recommendations', (
      SELECT json_agg(json_build_object(
        'id', vrec.id,
        'vendorId', vrec.vendor_id,
        'vendorName', v.name,
        'vendorLocation', v.location,
        'score', vrec.match_score,
        'confidence', vrec.confidence_level,
        'matchReasons', vrec.match_reasons,
        'regionCompatibility', vrec.region_compatibility
      ) ORDER BY vrec.ranking)
      FROM vendor_recommendations vrec
      JOIN vendors v ON vrec.vendor_id = v.id
      WHERE vrec.rfq_id = p_rfq_id
    ),
    'quotes', (
      SELECT json_agg(json_build_object(
        'id', vq.id,
        'vendorName', v.name,
        'pricePerUnit', vq.price_per_unit,
        'totalPrice', vq.total_price,
        'currency', vq.currency,
        'deliveryDate', vq.delivery_date,
        'paymentTerms', vq.payment_terms,
        'status', vq.status,
        'validUntil', vq.valid_until
      ))
      FROM vendor_quotes vq
      JOIN vendors v ON vq.vendor_id = v.id
      WHERE vq.rfq_id = p_rfq_id
    )
  ) INTO v_result
  FROM rfqs r
  LEFT JOIN clients c ON r.client_id = c.id
  WHERE r.id = p_rfq_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT get_rfq_complete('30000000-0000-0000-0000-000000000001'::UUID);

-- ============================================================================
-- DONE!
-- ============================================================================
-- Database is now ready for RFQ management
-- Next steps:
-- 1. Build backend API endpoints
-- 2. Implement AI vendor matching service
-- 3. Implement OCR document processing
-- 4. Connect frontend to API
-- 5. Set up realtime sync via WebSocket
