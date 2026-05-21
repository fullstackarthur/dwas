-- ============================================================================
-- RFQ DESK COMPLETE DATABASE SCHEMA
-- Fully Normalized PostgreSQL Schema for DWAS RFQ Management System
-- ============================================================================

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Users/Employees Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'operator', 'viewer', 'dispatcher', 'procurement_lead', 'ai')),
  avatar_url VARCHAR(500),
  status VARCHAR(20) NOT NULL CHECK (status IN ('online', 'away', 'offline', 'busy')) DEFAULT 'offline',
  last_active TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Clients Table
CREATE TABLE clients (
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
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_email (email)
);

-- Vendors Table
CREATE TABLE vendors (
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
  certifications TEXT[], -- Array of certifications (BSI, ISO, FDA, etc)
  specializations TEXT[], -- Array of material types/categories they specialize in
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_location (location),
  INDEX idx_region (region_code),
  INDEX idx_active (is_active)
);

-- Vendor Performance History Table (for AI matching)
CREATE TABLE vendor_performance_history (
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
  INDEX idx_vendor (vendor_id),
  UNIQUE(vendor_id)
);

-- ============================================================================
-- RFQ CORE TABLES
-- ============================================================================

-- Main RFQ Table
CREATE TABLE rfqs (
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
  last_activity_at TIMESTAMP WITH TIME ZONE,
  INDEX idx_rfq_number (rfq_number),
  INDEX idx_client (client_id),
  INDEX idx_stage (stage),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_assignee (assignee_id),
  INDEX idx_created_at (created_at),
  INDEX idx_sla_status (sla_status)
);

-- RFQ Items (Line Items) Table
CREATE TABLE rfq_items (
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
  specifications JSONB, -- Store flexible specs like {size: "50x50x5mm", thickness: "5mm", etc}
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq (rfq_id),
  INDEX idx_material_category (material_category),
  UNIQUE(rfq_id, line_number)
);

-- ============================================================================
-- REQUIREMENTS & SPECIFICATIONS
-- ============================================================================

-- RFQ Requirements (extracted via AI/OCR)
CREATE TABLE rfq_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('material', 'quantity', 'delivery', 'quality', 'certification', 'other')),
  label VARCHAR(255) NOT NULL,
  value VARCHAR(1000) NOT NULL,
  confidence_score DECIMAL(5, 2) CHECK (confidence_score BETWEEN 0 AND 1),
  validation_status VARCHAR(20) NOT NULL CHECK (validation_status IN ('valid', 'uncertain', 'missing', 'invalid')) DEFAULT 'uncertain',
  source_document_id UUID REFERENCES rfq_documents(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq (rfq_id),
  INDEX idx_category (category),
  INDEX idx_validation_status (validation_status)
);

-- ============================================================================
-- DOCUMENTS & ATTACHMENTS
-- ============================================================================

-- RFQ Documents Table
CREATE TABLE rfq_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('pdf', 'image', 'excel', 'word', 'other')),
  file_size INTEGER NOT NULL, -- in bytes
  file_path VARCHAR(1000) NOT NULL,
  uploaded_by_id UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ocr_processed BOOLEAN DEFAULT FALSE,
  ocr_confidence_score DECIMAL(5, 2),
  extracted_text TEXT, -- Full extracted OCR text
  storage_url VARCHAR(500), -- S3/cloud storage URL
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq (rfq_id),
  INDEX idx_type (type),
  INDEX idx_ocr_processed (ocr_processed)
);

-- ============================================================================
-- VENDOR QUOTES & RECOMMENDATIONS
-- ============================================================================

-- Vendor Quotes Table
CREATE TABLE vendor_quotes (
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
  INDEX idx_rfq (rfq_id),
  INDEX idx_vendor (vendor_id),
  INDEX idx_status (status),
  INDEX idx_valid_until (valid_until),
  UNIQUE(rfq_id, vendor_id) -- One vendor, one quote per RFQ
);

-- AI Vendor Recommendations Table
CREATE TABLE vendor_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  match_score DECIMAL(5, 2) NOT NULL CHECK (match_score BETWEEN 0 AND 1),
  confidence_level VARCHAR(20) NOT NULL CHECK (confidence_level IN ('high', 'medium', 'low')),
  match_reasons TEXT[], -- Array of reasons why this vendor was recommended
  region_compatibility VARCHAR(20) NOT NULL CHECK (region_compatibility IN ('exact', 'near', 'remote')),
  suggested_contacts TEXT[], -- Array of contact emails/persons
  ranking INTEGER, -- Used for ordering recommendations
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq (rfq_id),
  INDEX idx_vendor (vendor_id),
  INDEX idx_match_score (match_score),
  INDEX idx_confidence (confidence_level),
  INDEX idx_ranking (ranking)
);

-- ============================================================================
-- TIMELINE & ACTIVITY
-- ============================================================================

-- RFQ Timeline Events Table
CREATE TABLE rfq_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('human', 'ai', 'system', 'workflow_transition')),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  actor_id UUID REFERENCES users(id), -- who made the action (human) or NULL for system/ai
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  previous_stage VARCHAR(50),
  new_stage VARCHAR(50),
  metadata JSONB, -- Flexible storage for additional event data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq (rfq_id),
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_actor (actor_id)
);

-- ============================================================================
-- TAGS & METADATA
-- ============================================================================

-- RFQ Tags Table (normalized from denormalized array)
CREATE TABLE rfq_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq (rfq_id),
  INDEX idx_tag_name (tag_name),
  UNIQUE(rfq_id, tag_name)
);

-- RFQ Metadata Table (key-value store for flexible data)
CREATE TABLE rfq_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rfq (rfq_id),
  INDEX idx_key (key),
  UNIQUE(rfq_id, key)
);

-- ============================================================================
-- INDEXES FOR COMMON QUERIES
-- ============================================================================

-- Composite indexes for frequently used queries
CREATE INDEX idx_rfqs_client_created ON rfqs(client_id, created_at DESC);
CREATE INDEX idx_rfqs_assignee_status ON rfqs(assignee_id, status);
CREATE INDEX idx_rfqs_stage_priority ON rfqs(stage, priority);
CREATE INDEX idx_rfqs_sla_deadline ON rfqs(sla_deadline) WHERE sla_status IN ('at_risk', 'breached');
CREATE INDEX idx_rfq_items_rfq_category ON rfq_items(rfq_id, material_category);
CREATE INDEX idx_vendor_quotes_rfq_vendor ON vendor_quotes(rfq_id, vendor_id);
CREATE INDEX idx_vendor_recommendations_rfq_score ON vendor_recommendations(rfq_id, match_score DESC);

-- ============================================================================
-- MATERIALIZED VIEWS FOR COMMON QUERIES
-- ============================================================================

-- RFQ Summary View (denormalized for faster reads)
CREATE MATERIALIZED VIEW rfq_summary AS
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

CREATE INDEX idx_rfq_summary_client ON rfq_summary(client_id);
CREATE INDEX idx_rfq_summary_assignee ON rfq_summary(assignee_id);
CREATE INDEX idx_rfq_summary_stage ON rfq_summary(stage);

-- ============================================================================
-- SAMPLE QUERIES FOR RFQ DESK
-- ============================================================================

-- Query 1: Get complete RFQ with all related data (single RFQ view)
-- ============================================================================
/*
SELECT 
  r.*,
  c.name as client_name,
  c.contact_name,
  c.email as client_email,
  reporter.name as reporter_name,
  assignee.name as assignee_name,
  -- Aggregate items
  json_agg(DISTINCT jsonb_build_object(
    'id', i.id,
    'lineNumber', i.line_number,
    'material', i.material_description,
    'category', i.material_category,
    'quantity', i.quantity,
    'unit', i.unit,
    'requiredDate', i.required_date,
    'specifications', i.specifications
  )) FILTER (WHERE i.id IS NOT NULL) as items,
  -- Aggregate tags
  json_agg(DISTINCT rt.tag_name) FILTER (WHERE rt.tag_name IS NOT NULL) as tags,
  -- Aggregate documents
  json_agg(DISTINCT jsonb_build_object(
    'id', doc.id,
    'name', doc.name,
    'type', doc.type,
    'size', doc.file_size,
    'url', doc.storage_url,
    'uploadedAt', doc.uploaded_at,
    'ocrProcessed', doc.ocr_processed,
    'ocrConfidence', doc.ocr_confidence_score
  )) FILTER (WHERE doc.id IS NOT NULL) as documents,
  -- Aggregate requirements
  json_agg(DISTINCT jsonb_build_object(
    'id', req.id,
    'category', req.category,
    'label', req.label,
    'value', req.value,
    'confidence', req.confidence_score,
    'validationStatus', req.validation_status
  )) FILTER (WHERE req.id IS NOT NULL) as requirements,
  -- Aggregate vendor recommendations
  json_agg(DISTINCT jsonb_build_object(
    'id', vrec.id,
    'vendorId', vrec.vendor_id,
    'vendorName', v.name,
    'vendorLocation', v.location,
    'score', vrec.match_score,
    'confidence', vrec.confidence_level,
    'matchReasons', vrec.match_reasons,
    'regionCompatibility', vrec.region_compatibility
  )) FILTER (WHERE vrec.id IS NOT NULL) as vendorRecommendations,
  -- Aggregate quotes
  json_agg(DISTINCT jsonb_build_object(
    'id', vq.id,
    'vendorId', vq.vendor_id,
    'vendorName', vend.name,
    'pricePerUnit', vq.price_per_unit,
    'totalPrice', vq.total_price,
    'currency', vq.currency,
    'validUntil', vq.valid_until,
    'deliveryDate', vq.delivery_date,
    'paymentTerms', vq.payment_terms,
    'status', vq.status,
    'submittedAt', vq.submitted_at
  )) FILTER (WHERE vq.id IS NOT NULL) as quotations,
  -- Aggregate timeline
  json_agg(DISTINCT jsonb_build_object(
    'id', evt.id,
    'type', evt.event_type,
    'title', evt.title,
    'description', evt.description,
    'actor', jsonb_build_object('id', u_evt.id, 'name', u_evt.name),
    'timestamp', evt.timestamp,
    'previousStage', evt.previous_stage,
    'newStage', evt.new_stage,
    'metadata', evt.metadata
  ) ORDER BY evt.timestamp DESC) FILTER (WHERE evt.id IS NOT NULL) as timeline
FROM rfqs r
LEFT JOIN clients c ON r.client_id = c.id
LEFT JOIN users reporter ON r.reporter_id = reporter.id
LEFT JOIN users assignee ON r.assignee_id = assignee.id
LEFT JOIN rfq_items i ON r.id = i.rfq_id
LEFT JOIN rfq_tags rt ON r.id = rt.rfq_id
LEFT JOIN rfq_documents doc ON r.id = doc.rfq_id
LEFT JOIN rfq_requirements req ON r.id = req.rfq_id
LEFT JOIN vendor_recommendations vrec ON r.id = vrec.rfq_id
LEFT JOIN vendors v ON vrec.vendor_id = v.id
LEFT JOIN vendor_quotes vq ON r.id = vq.rfq_id
LEFT JOIN vendors vend ON vq.vendor_id = vend.id
LEFT JOIN rfq_timeline_events evt ON r.id = evt.rfq_id
LEFT JOIN users u_evt ON evt.actor_id = u_evt.id
WHERE r.id = $1
GROUP BY r.id, c.id, reporter.id, assignee.id;
*/

-- Query 2: List all RFQs with summary for queue view
-- ============================================================================
/*
SELECT *
FROM rfq_summary
WHERE status IN ('open', 'in_progress', 'awaiting_response', 'quoted')
ORDER BY 
  CASE priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    ELSE 4
  END,
  last_activity_at DESC
LIMIT 50;
*/

-- Query 3: Get RFQs with SLA risk
-- ============================================================================
/*
SELECT 
  r.id,
  r.rfq_number,
  r.client_id,
  c.name as client_name,
  r.priority,
  r.stage,
  r.sla_deadline,
  r.sla_status,
  EXTRACT(EPOCH FROM (r.sla_deadline - NOW())) / 3600 as hours_remaining
FROM rfqs r
LEFT JOIN clients c ON r.client_id = c.id
WHERE r.sla_status IN ('at_risk', 'breached')
ORDER BY r.sla_deadline ASC;
*/

-- Query 4: Get vendor recommendations with performance data for an RFQ
-- ============================================================================
/*
SELECT 
  vrec.id,
  vrec.rfq_id,
  v.id as vendor_id,
  v.name as vendor_name,
  v.location,
  v.specializations,
  vrec.match_score,
  vrec.confidence_level,
  vrec.match_reasons,
  vrec.region_compatibility,
  vph.on_time_delivery_rate,
  vph.quality_score,
  vph.response_rate,
  vph.average_lead_time_days,
  vph.total_orders,
  vph.successful_orders,
  vph.average_order_value
FROM vendor_recommendations vrec
JOIN vendors v ON vrec.vendor_id = v.id
LEFT JOIN vendor_performance_history vph ON v.id = vph.vendor_id
WHERE vrec.rfq_id = $1
ORDER BY vrec.match_score DESC;
*/

-- Query 5: Get all quotes for an RFQ with vendor info
-- ============================================================================
/*
SELECT 
  vq.id,
  vq.rfq_id,
  vq.vendor_id,
  v.name as vendor_name,
  v.location,
  v.email as vendor_email,
  vq.price_per_unit,
  vq.total_price,
  vq.currency,
  vq.valid_until,
  vq.delivery_date,
  vq.payment_terms,
  vq.status,
  vq.counter_offer_price,
  vq.submitted_at,
  -- Calculate days remaining for validity
  EXTRACT(DAY FROM (vq.valid_until - NOW())) as validity_days_remaining,
  -- Calculate price per unit difference from average
  ROUND(vq.price_per_unit - 
    (SELECT AVG(price_per_unit) FROM vendor_quotes vq2 WHERE vq2.rfq_id = $1 AND vq2.status != 'rejected'),
    2) as price_variance_from_avg
FROM vendor_quotes vq
JOIN vendors v ON vq.vendor_id = v.id
WHERE vq.rfq_id = $1
ORDER BY vq.price_per_unit ASC;
*/

-- Query 6: Get extracted requirements with source documents
-- ============================================================================
/*
SELECT 
  req.id,
  req.rfq_id,
  req.category,
  req.label,
  req.value,
  req.confidence_score,
  req.validation_status,
  doc.name as source_document_name,
  doc.type as source_document_type
FROM rfq_requirements req
LEFT JOIN rfq_documents doc ON req.source_document_id = doc.id
WHERE req.rfq_id = $1
ORDER BY req.confidence_score DESC, req.category;
*/

-- Query 7: Get timeline with user details
-- ============================================================================
/*
SELECT 
  evt.id,
  evt.rfq_id,
  evt.event_type,
  evt.title,
  evt.description,
  evt.timestamp,
  evt.previous_stage,
  evt.new_stage,
  u.id as actor_id,
  u.name as actor_name,
  u.email as actor_email,
  evt.metadata
FROM rfq_timeline_events evt
LEFT JOIN users u ON evt.actor_id = u.id
WHERE evt.rfq_id = $1
ORDER BY evt.timestamp DESC;
*/

-- Query 8: Search RFQs with filters
-- ============================================================================
/*
SELECT rs.* 
FROM rfq_summary rs
WHERE 
  ($1::UUID IS NULL OR rs.client_id = $1)
  AND ($2::UUID IS NULL OR rs.assignee_id = $2)
  AND ($3::VARCHAR IS NULL OR rs.stage = $3)
  AND ($4::VARCHAR IS NULL OR rs.priority = $4)
  AND ($5::VARCHAR[] IS NULL OR rs.status = ANY($5))
  AND (
    $6::VARCHAR IS NULL 
    OR rs.rfq_number ILIKE '%' || $6 || '%'
    OR rs.client_name ILIKE '%' || $6 || '%'
  )
ORDER BY 
  CASE rs.priority
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    ELSE 4
  END,
  rs.last_activity_at DESC;
*/

-- Query 9: Get RFQ items with category analysis
-- ============================================================================
/*
SELECT 
  material_category,
  COUNT(*) as item_count,
  SUM(quantity) as total_quantity,
  json_agg(jsonb_build_object(
    'id', id,
    'description', material_description,
    'grade', material_grade,
    'quantity', quantity,
    'unit', unit,
    'specs', specifications
  )) as items
FROM rfq_items
WHERE rfq_id = $1
GROUP BY material_category
ORDER BY item_count DESC;
*/

-- Query 10: Vendor comparison for RFQ (best match candidates)
-- ============================================================================
/*
SELECT 
  v.id,
  v.name,
  v.location,
  v.city,
  v.specializations,
  COALESCE(vrec.match_score, 0) as ai_match_score,
  COALESCE(vrec.confidence_level, 'N/A') as confidence,
  COALESCE(vq.price_per_unit, NULL) as quote_price,
  COALESCE(vq.status, 'no_quote') as quote_status,
  COALESCE(vph.on_time_delivery_rate, 0) as on_time_rate,
  COALESCE(vph.quality_score, 0) as quality_score,
  COALESCE(vph.response_rate, 0) as response_rate,
  RANK() OVER (ORDER BY COALESCE(vrec.match_score, 0) DESC) as overall_rank
FROM vendors v
LEFT JOIN vendor_recommendations vrec ON v.id = vrec.vendor_id AND vrec.rfq_id = $1
LEFT JOIN vendor_quotes vq ON v.id = vq.vendor_id AND vq.rfq_id = $1
LEFT JOIN vendor_performance_history vph ON v.id = vph.vendor_id
WHERE v.is_active = TRUE
ORDER BY overall_rank
LIMIT 10;
*/

-- ============================================================================
-- HELPFUL FUNCTIONS
-- ============================================================================

-- Function to get RFQ with all nested data as JSON
CREATE OR REPLACE FUNCTION get_rfq_complete(rfq_id UUID)
RETURNS JSON AS $$
DECLARE
  v_rfq JSON;
BEGIN
  SELECT json_build_object(
    'id', r.id,
    'rfqNumber', r.rfq_number,
    'client', json_build_object(
      'id', c.id,
      'name', c.name,
      'contact', c.contact_name,
      'email', c.email,
      'phone', c.phone
    ),
    'reporter', json_build_object('id', rep.id, 'name', rep.name, 'email', rep.email),
    'assignee', json_build_object('id', ass.id, 'name', ass.name, 'email', ass.email),
    'priority', r.priority,
    'stage', r.stage,
    'status', r.status,
    'slaStatus', r.sla_status,
    'slaDeadline', r.sla_deadline,
    'items', (
      SELECT json_agg(json_build_object(
        'id', id,
        'lineNumber', line_number,
        'material', material_description,
        'category', material_category,
        'quantity', quantity,
        'unit', unit,
        'specifications', specifications
      ))
      FROM rfq_items WHERE rfq_id = r.id
    ),
    'requirements', (
      SELECT json_agg(json_build_object(
        'id', id,
        'category', category,
        'label', label,
        'value', value,
        'confidence', confidence_score
      ))
      FROM rfq_requirements WHERE rfq_id = r.id
    ),
    'documents', (
      SELECT json_agg(json_build_object(
        'id', id,
        'name', name,
        'type', type,
        'size', file_size,
        'url', storage_url,
        'uploadedAt', uploaded_at
      ))
      FROM rfq_documents WHERE rfq_id = r.id
    ),
    'recommendations', (
      SELECT json_agg(json_build_object(
        'id', vrec.id,
        'vendor', json_build_object(
          'id', v.id,
          'name', v.name,
          'location', v.location
        ),
        'score', vrec.match_score,
        'confidence', vrec.confidence_level
      ))
      FROM vendor_recommendations vrec
      JOIN vendors v ON vrec.vendor_id = v.id
      WHERE vrec.rfq_id = r.id
      ORDER BY vrec.match_score DESC
      LIMIT 5
    ),
    'quotes', (
      SELECT json_agg(json_build_object(
        'id', vq.id,
        'vendor', v.name,
        'price', vq.total_price,
        'currency', vq.currency,
        'deliveryDate', vq.delivery_date,
        'status', vq.status
      ))
      FROM vendor_quotes vq
      JOIN vendors v ON vq.vendor_id = v.id
      WHERE vq.rfq_id = r.id
    ),
    'tags', (
      SELECT json_agg(tag_name) FROM rfq_tags WHERE rfq_id = r.id
    ),
    'createdAt', r.created_at,
    'updatedAt', r.updated_at,
    'lastActivityAt', r.last_activity_at
  ) INTO v_rfq
  FROM rfqs r
  LEFT JOIN clients c ON r.client_id = c.id
  LEFT JOIN users rep ON r.reporter_id = rep.id
  LEFT JOIN users ass ON r.assignee_id = ass.id
  WHERE r.id = rfq_id;
  
  RETURN v_rfq;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PERFORMANCE OPTIMIZATION NOTES
-- ============================================================================
/*

1. INDEXING STRATEGY:
   - Primary: (client_id, created_at DESC) for listing RFQs by client
   - Primary: (stage, priority) for dashboard filtering
   - Primary: (assignee_id, status) for user's queue
   - Primary: (sla_deadline) for SLA tracking
   - Compound: (rfq_id, vendor_id) for vendor operations

2. QUERY OPTIMIZATION:
   - Use materialized view rfq_summary for dashboard queries
   - Refresh materialized view after significant RFQ changes
   - Use json_agg for nested data to reduce number of queries
   - Denormalize frequently accessed metrics (item count, quote count)

3. PARTITIONING (for large datasets):
   - Partition rfqs by created_at RANGE (monthly)
   - Partition rfq_timeline_events by rfq_id (improves archive queries)
   - Partition vendor_quotes by created_at (historical analysis)

4. CACHING RECOMMENDATIONS:
   - Cache RFQ summary data for 5 minutes
   - Cache vendor recommendations for 1 hour (AI-generated)
   - Cache vendor performance data for 24 hours
   - Cache client list for 24 hours

5. ARCHIVAL STRATEGY:
   - Archive closed RFQs older than 2 years to separate table
   - Archive timeline events older than 5 years
   - Keep active RFQs in main tables for fast access

*/
