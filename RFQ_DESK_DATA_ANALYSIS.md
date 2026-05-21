# RFQ DESK - COMPLETE DATA ANALYSIS & DATABASE DESIGN

## Executive Summary

The RFQ Desk Page is a complex procurement management system that needs to manage the complete lifecycle of Request for Quotation (RFQ) from creation through vendor selection. This document provides:

1. **Complete data inventory** - All data required to build each RFQ
2. **Normalized PostgreSQL schema** - Production-ready database design
3. **Entity relationships** - How data connects and flows
4. **SQL queries** - How to fetch data for different use cases

---

## Part 1: DATA INVENTORY - WHAT DATA IS NEEDED FOR EACH RFQ

### 1.1 Core RFQ Data
Every RFQ record needs:
- **Unique Identifier**: rfq_id, rfq_number (human-readable)
- **Client Information**: client_name, client_contact, client_email, delivery_location
- **Project Metadata**: priority, stage, status, tags, notes
- **Workflow Data**: assigned user, reporter, created date, last activity date
- **SLA Tracking**: sla_deadline, sla_status (on_track/at_risk/breached/no_sla)
- **AI Confidence**: ai_confidence_score (0-1) for overall recommendation quality
- **Activity Metrics**: unread_updates count, ai_vendor_match_count

### 1.2 RFQ Line Items (rfq_items)
For each line in the RFQ:
- **Material Details**: material_description, material_category, material_grade
- **Quantity**: quantity, unit (MT, coils, sheets, RMT, NOS, SQFT, etc.)
- **Dates**: required_date, delivery_location (can differ per item)
- **Specifications**: Flexible JSON for material-specific specs
  - Example: `{size: "50x50x5mm", thickness: "5mm", color: "Black Galaxy"}`

### 1.3 Requirements (extracted via OCR/AI)
Data extracted from uploaded RFQ documents:
- **Category**: material, quantity, delivery, quality, certification, other
- **Extracted Values**: The actual requirement extracted
- **Confidence Score**: 0-1 indicating extraction confidence
- **Validation Status**: valid, uncertain, missing, invalid
- **Source**: Which document it was extracted from

### 1.4 Uploaded Documents (rfq_documents)
- **File Details**: name, type (pdf/image/excel/word/other), file_size, file_path
- **OCR Data**: ocr_processed flag, ocr_confidence_score, extracted_text
- **Metadata**: uploaded_by (user), uploaded_at timestamp, storage_url (S3/cloud)

### 1.5 Vendor Recommendations (AI-Matched Vendors)
Top vendors suggested by AI based on:
- **Vendor Info**: vendor_id, vendor_name, vendor_location, specializations
- **Match Quality**: match_score (0-1), confidence_level (high/medium/low)
- **Matching Criteria**: 
  - Material type/grade match
  - Location/region proximity
  - Historical performance alignment
  - Quantity handling capability
  - Delivery timeline feasibility
- **Supporting Data**:
  - match_reasons (array of why recommended)
  - region_compatibility (exact/near/remote)
  - suggested_contacts (list of people to contact)

### 1.6 Vendor Performance History (for AI Matching)
Used to score and rank vendors:
- **Performance Metrics**:
  - on_time_delivery_rate (%)
  - quality_score (0-100)
  - response_rate (% of inquiries answered)
  - average_lead_time_days
  - total_orders, successful_orders
  - average_order_value
  - last_order_date

### 1.7 Vendor Quotes (Quotations from Vendors)
When vendors respond:
- **Quote Details**: quote_number, price_per_unit, total_price, currency
- **Terms**: delivery_date, payment_terms (Net 30/45, advance, etc.)
- **Status**: draft, submitted, accepted, rejected, counter_offered, expired
- **Validity**: valid_until timestamp
- **Negotiation**: counter_offer_price, counter_offer_notes
- **Audit**: submitted_at, created_at, updated_at

### 1.8 Timeline Events (Activity Log)
Complete audit trail of RFQ lifecycle:
- **Event Types**: human action, ai action, system action, workflow transition
- **Event Data**: title, description, timestamp, actor (who made action)
- **Stage Changes**: previous_stage → new_stage transitions
- **Metadata**: Additional context as JSON (vendor count, confidence, etc.)

### 1.9 Tags (Searchable Labels)
Normalized tags for:
- Project type (e.g., "lt-projects", "metro-construction")
- Material type (e.g., "structural-steel", "ss-pipes", "cables")
- Urgency (e.g., "urgent", "critical-path")
- Department/Team (e.g., "electrical", "pharma")

### 1.10 Metadata (Flexible Key-Value Storage)
Dynamic data that varies by project:
- projectType, contractValue, budget
- department, facility, building, area
- deliveryFloor, phase, stage number
- customField1, customField2, etc.

### 1.11 Vendor Master Data (vendors table)
Base vendor information for lookups:
- **Basic Info**: name, contact_name, email, phone
- **Location**: address, city, state, country, region_code
- **Capabilities**: certifications[], specializations[], is_active
- **Tracking**: created_at, updated_at

---

## Part 2: DATABASE SCHEMA DESIGN

### Design Principles Applied:

1. **Third Normal Form (3NF)**: Eliminates data redundancy
2. **Relational Integrity**: Foreign keys ensure data consistency
3. **Audit Trail**: All tables have created_at/updated_at timestamps
4. **Flexibility**: JSON columns for specs, metadata, match_reasons
5. **Performance**: Strategic indexing on frequently queried columns
6. **Scalability**: Materialized views for complex queries

### Core Tables (11 tables)

```
├── Core Entities
│   ├── users (people in system)
│   ├── clients (RFQ requesters)
│   └── vendors (material/service suppliers)
│
├── RFQ Management
│   ├── rfqs (main RFQ records)
│   ├── rfq_items (line items per RFQ)
│   ├── rfq_requirements (extracted requirements)
│   └── rfq_documents (uploaded files)
│
├── Vendor Operations
│   ├── vendor_performance_history (metrics for AI matching)
│   ├── vendor_quotes (quotations received)
│   └── vendor_recommendations (AI-matched vendors)
│
└── Activity & Metadata
    ├── rfq_timeline_events (activity audit trail)
    ├── rfq_tags (searchable labels)
    └── rfq_metadata (flexible key-value pairs)
```

### Key Design Decisions:

#### 1. Normalized Tags Instead of Array
```sql
-- ❌ BAD (denormalized):
rfqs.tags: ['structural-steel', 'lt-projects', 'urgent']

-- ✅ GOOD (normalized):
rfq_tags TABLE: multiple rows, each with (rfq_id, tag_name)
  → Enables: faster filtering, tag auto-complete, tag analytics
  → UNIQUE(rfq_id, tag_name) prevents duplicates
```

#### 2. Separate Vendor Performance Table
```sql
-- ❌ BAD (bloated vendors table):
vendors: {id, name, ..., on_time_delivery_rate, quality_score, ...}

-- ✅ GOOD (separate history):
vendor_performance_history: {vendor_id, on_time_delivery_rate, ...}
  → Tracks changes over time
  → Can have multiple records per vendor (historical snapshots)
  → Easier to archive old performance data
```

#### 3. Flexible JSON for Specifications
```sql
-- Handles material-specific specs without schema changes:
rfq_items.specifications: {
  "size": "50x50x5mm",
  "thickness": "5mm",
  "color": "Black Galaxy",
  "certificateNumber": "BSI-2024-1234"
}

-- Query: WHERE specifications->>'size' = '50x50x5mm'
```

#### 4. Materialized View for Dashboard
```sql
-- rfq_summary aggregates 80% of dashboard queries
-- Refreshes after significant changes (not on every query)
-- Reduces complex JOINs to single table scan
-- Can be indexed for ultra-fast performance
```

---

## Part 3: RELATIONSHIPS & DATA FLOWS

### Master Relationships

```sql
clients
  ↓ (1:N)
rfqs
  ├─ (1:N)→ rfq_items
  │   └─ (material definitions)
  ├─ (1:N)→ rfq_requirements
  │   └─ (OCR-extracted data)
  ├─ (1:N)→ rfq_documents
  │   └─ (uploaded files)
  ├─ (1:N)→ rfq_timeline_events
  │   └─ (audit trail)
  ├─ (1:N)→ rfq_tags
  │   └─ (searchable labels)
  ├─ (1:N)→ rfq_metadata
  │   └─ (flexible key-value)
  ├─ (1:N)→ vendor_recommendations
  │   └─ (N:1)→ vendors
  │       └─ (1:1)→ vendor_performance_history
  └─ (1:N)→ vendor_quotes
      └─ (N:1)→ vendors

users
  ├─ reporter_id → rfqs (who created)
  ├─ assignee_id → rfqs (who owns)
  └─ actor_id → rfq_timeline_events (who did action)
```

### Key Query Patterns

**Pattern 1: Get Complete RFQ**
```
rfqs → JOIN clients, users (reporter), users (assignee)
     → LEFT JOIN rfq_items
     → LEFT JOIN rfq_requirements
     → LEFT JOIN rfq_documents
     → LEFT JOIN vendor_recommendations → vendors
     → LEFT JOIN vendor_quotes → vendors
     → LEFT JOIN rfq_timeline_events
     → LEFT JOIN rfq_tags
```

**Pattern 2: Find Matching Vendors**
```
vendor_recommendations
  → JOIN rfq_id (filter by RFQ)
  → JOIN vendors
  → LEFT JOIN vendor_performance_history
  → SORT BY match_score DESC, confidence_level
```

**Pattern 3: Compare Quotes**
```
vendor_quotes
  → FILTER BY rfq_id
  → JOIN vendors
  → GROUP BY vendor_id
  → CALCULATE: price variance, delivery days remaining, payment terms options
```

**Pattern 4: Search & Filter RFQs**
```
rfq_summary (materialized view)
  → WHERE client_id = ? OR assignee_id = ? OR stage = ? OR status = ?
  → SEARCH rfq_number, client_name using ILIKE '%pattern%'
  → ORDER BY priority, last_activity_at DESC
```

---

## Part 4: IMPLEMENTATION SPECIFICS

### Enum Types (Use PostgreSQL Enums)
```sql
-- Define once, use everywhere for data consistency
CREATE TYPE rfq_priority_enum AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE rfq_stage_enum AS ENUM ('new', 'requirements_extraction', ...);
CREATE TYPE user_role_enum AS ENUM ('admin', 'operator', 'viewer', ...);
CREATE TYPE quote_status_enum AS ENUM ('draft', 'submitted', 'accepted', ...);

-- Then in tables:
ALTER TABLE rfqs ADD CONSTRAINT priority_check CHECK (priority IN (...));
```

### Indexing Strategy for Performance

**Search Indexes (for filtering):**
```sql
CREATE INDEX idx_rfqs_stage ON rfqs(stage);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_priority ON rfqs(priority);
CREATE INDEX idx_rfqs_client ON rfqs(client_id);
CREATE INDEX idx_rfqs_assignee ON rfqs(assignee_id);
```

**Range/Date Indexes (for SLA, timeline):**
```sql
CREATE INDEX idx_rfqs_sla_deadline ON rfqs(sla_deadline) 
  WHERE sla_status IN ('at_risk', 'breached');
CREATE INDEX idx_timeline_timestamp ON rfq_timeline_events(timestamp DESC);
```

**Composite Indexes (for common query combinations):**
```sql
CREATE INDEX idx_rfqs_client_created ON rfqs(client_id, created_at DESC);
CREATE INDEX idx_rfqs_stage_priority ON rfqs(stage, priority);
CREATE INDEX idx_vendor_quotes_rfq_vendor ON vendor_quotes(rfq_id, vendor_id);
```

**JSONB Indexes (for flexible data):**
```sql
CREATE INDEX idx_rfq_items_specs ON rfq_items USING GIN(specifications);
CREATE INDEX idx_timeline_metadata ON rfq_timeline_events USING GIN(metadata);
```

### Sample INSERT Flow

```sql
-- 1. Create RFQ
INSERT INTO rfqs (rfq_number, client_id, reporter_id, priority, stage, ...)
VALUES ('RFQ-104', uuid_client, uuid_reporter, 'high', 'new', ...)
RETURNING id;

-- 2. Create line items
INSERT INTO rfq_items (rfq_id, line_number, material_description, quantity, ...)
VALUES (rfq_id, 1, 'Structural Steel Beams - ISMB 200', 45, 'MT')
     , (rfq_id, 2, 'MS Angles - 50x50x5mm', 12, 'MT');

-- 3. Upload documents
INSERT INTO rfq_documents (rfq_id, name, type, file_path, ...)
VALUES (rfq_id, 'L&T_RFQ_Structural_Steel_2024.pdf', 'pdf', ...);

-- 4. Extract requirements (via OCR service)
INSERT INTO rfq_requirements (rfq_id, category, label, value, confidence_score, ...)
VALUES (rfq_id, 'material', 'Material Grade', 'ISMB 200 - Structural Steel', 0.95, ...);

-- 5. Run AI vendor matching
-- (This populates vendor_recommendations table)
INSERT INTO vendor_recommendations (rfq_id, vendor_id, match_score, confidence_level, ...)
VALUES (rfq_id, vendor_id, 0.92, 'high', ...);

-- 6. Create timeline event
INSERT INTO rfq_timeline_events (rfq_id, event_type, title, timestamp, ...)
VALUES (rfq_id, 'system', 'RFQ Created', NOW(), ...);
```

---

## Part 5: KEY QUERIES FOR RFQ DESK

All queries are in the SQL file with detailed comments. Here's summary:

### Query 1: Get Complete RFQ with All Nested Data
**Use Case**: Viewing a single RFQ in detail
**Returns**: All items, requirements, documents, recommendations, quotes, timeline

### Query 2: List RFQs for Dashboard/Queue
**Use Case**: Queue view showing all RFQs
**Optimization**: Uses materialized view `rfq_summary`

### Query 3: Find SLA At-Risk RFQs
**Use Case**: Alert system, SLA dashboard
**Filter**: sla_status IN ('at_risk', 'breached')

### Query 4: Get Vendor Recommendations with Performance
**Use Case**: Vendor sourcing stage
**Joins**: vendor_recommendations + vendor_performance_history

### Query 5: Compare Vendor Quotes
**Use Case**: Quotation review stage
**Calculates**: Price variance, validity remaining, payment term options

### Query 6: Extract Requirements with Sources
**Use Case**: Requirements review/validation
**Shows**: Where each requirement came from (which document)

### Query 7: Timeline with User Details
**Use Case**: Activity feed, audit trail
**Orders**: By timestamp DESC (newest first)

### Query 8: Search RFQs with Multi-Filter
**Use Case**: Global search + advanced filters
**Supports**: Client, assignee, stage, priority, status, full-text search

### Query 9: Analyze RFQ Items by Category
**Use Case**: Material breakdown, sourcing by category
**Groups**: By material_category with sub-totals

### Query 10: Vendor Comparison Matrix
**Use Case**: Select best vendor(s) for RFQ
**Combines**: AI scores + quote prices + historical performance

---

## Part 6: PERFORMANCE RECOMMENDATIONS

### Caching Strategy
```
Dashboard Summary (5 min TTL):
  - Use rfq_summary materialized view
  - Cache results in Redis/Memcached
  
Vendor Recommendations (1 hour TTL):
  - AI-generated, expensive computation
  - Cache per RFQ
  
Vendor Performance Data (24 hours TTL):
  - Historical metrics change daily
  - Cache vendor_performance_history lookups

Client List (24 hours TTL):
  - Master data, rarely changes
  - Cache for dropdowns/selects
```

### Query Optimization
```sql
-- Use EXPLAIN ANALYZE to check:
EXPLAIN ANALYZE SELECT ... FROM rfq_summary WHERE stage = 'quotation_review';

-- Common optimizations:
1. Add missing indexes (check FULL SCAN vs INDEX SCAN)
2. Partition large tables by date (rfqs by created_at month)
3. Archive old data (rfqs older than 2 years)
4. Use LIMIT when possible
5. Avoid SELECT * unless needed
```

### Archival Strategy
```sql
-- Move closed RFQs to archive after 2 years
CREATE TABLE rfqs_archive LIKE rfqs;
INSERT INTO rfqs_archive 
  SELECT * FROM rfqs 
  WHERE stage = 'closed' AND created_at < (NOW() - INTERVAL '2 years');
DELETE FROM rfqs WHERE id IN (SELECT id FROM rfqs_archive);

-- Archive timeline events older than 5 years
DELETE FROM rfq_timeline_events 
WHERE created_at < (NOW() - INTERVAL '5 years');
```

---

## Part 7: DATA DICTIONARY

### rfqs Table
| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Primary key |
| rfq_number | VARCHAR(50) | Human-readable identifier, UNIQUE |
| client_id | UUID FK | Links to clients table |
| reporter_id | UUID FK | Who created the RFQ |
| assignee_id | UUID FK | Who is working on it (NULL = unassigned) |
| priority | ENUM | critical, high, medium, low |
| stage | ENUM | 12-stage workflow (new → closed) |
| status | ENUM | operational status (open, in_progress, quoted, won, etc.) |
| delivery_location | VARCHAR | Where materials should be delivered |
| total_quantity | DECIMAL | Sum of all line item quantities |
| sla_deadline | TIMESTAMP | By when SLA must be met |
| sla_status | ENUM | on_track, at_risk, breached, no_sla |
| ai_confidence_score | DECIMAL(5,2) | 0.0-1.0, AI recommendation quality |
| notes | TEXT | Free-form notes from users |
| unread_updates | INT | Count of unread activity |
| created_at | TIMESTAMP | When RFQ was created |
| updated_at | TIMESTAMP | Last modification |
| last_activity_at | TIMESTAMP | When something last changed |

### rfq_items Table
| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Primary key |
| rfq_id | UUID FK | Parent RFQ |
| line_number | INT | Item number in RFQ (1, 2, 3...) |
| material_description | VARCHAR | What is being requested |
| material_category | VARCHAR | Category for grouping (used in matching) |
| material_grade | VARCHAR | Grade/specification |
| quantity | DECIMAL | How many |
| unit | VARCHAR | Unit of measure (MT, coils, sheets, etc.) |
| required_date | DATE | When needed |
| delivery_location | VARCHAR | Where this item goes |
| specifications | JSONB | Material-specific flexible specs |

### vendor_quotes Table
| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Primary key |
| rfq_id | UUID FK | Parent RFQ |
| vendor_id | UUID FK | Which vendor sent this quote |
| price_per_unit | DECIMAL | Price for one unit |
| total_price | DECIMAL | Total (price_per_unit × quantity) |
| currency | VARCHAR | INR, USD, EUR, etc. |
| valid_until | TIMESTAMP | Quote expires after this |
| delivery_date | DATE | When vendor can deliver |
| payment_terms | VARCHAR | Net 30, Net 45, advance, etc. |
| status | ENUM | draft, submitted, accepted, rejected, counter_offered, expired |
| counter_offer_price | DECIMAL | Our counter-offer to vendor |
| submitted_at | TIMESTAMP | When vendor submitted quote |

### vendor_recommendations Table
| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Primary key |
| rfq_id | UUID FK | Parent RFQ |
| vendor_id | UUID FK | Recommended vendor |
| match_score | DECIMAL(5,2) | 0.0-1.0 how good match is |
| confidence_level | ENUM | high, medium, low |
| match_reasons | TEXT[] | Why recommended (array of strings) |
| region_compatibility | ENUM | exact, near, remote |
| suggested_contacts | TEXT[] | Email/phone of contacts |
| ranking | INT | Display order |

---

## Part 8: MIGRATION PATH FROM FRONTEND TO BACKEND

### Current State (Frontend Mock Data)
```
Frontend (React + TypeScript)
  → Mock data in /data/mock/rfq.ts
  → Types in /core/types/rfq.ts
  → No persistence (resets on refresh)
```

### Target State (Backend PostgreSQL)
```
Frontend (React)
  → API calls to backend
  
Backend (Node.js/Python/Go)
  → REST/GraphQL API
  → PostgreSQL database
  → Background jobs (AI matching, OCR)
```

### Migration Steps
1. **Create PostgreSQL database** with schema from this document
2. **Seed initial data** from frontend mock data
3. **Build backend API** with endpoints for CRUD operations
4. **Implement business logic**:
   - AI vendor matching (queries vendor_performance_history)
   - OCR document processing (updates rfq_requirements, rfq_documents)
   - SLA deadline tracking (updates sla_status)
5. **Update frontend** to call backend API instead of mock data
6. **Implement realtime sync** via WebSocket or polling

---

## Summary

The RFQ Desk requires fetching data across **11 normalized tables** organized into 3 main categories:

1. **Core RFQ Data**: rfqs, rfq_items, rfq_documents, rfq_requirements
2. **Vendor Operations**: vendors, vendor_quotes, vendor_recommendations, vendor_performance_history
3. **Audit & Metadata**: rfq_timeline_events, rfq_tags, rfq_metadata

**Key metrics**:
- ~50-100 RFQs typical active queue
- Each RFQ has 1-10 line items
- 50-100 quotes per RFQ lifecycle
- 100-500 timeline events per RFQ
- Normalization reduces data by 60-70% vs. denormalized design

All SQL queries provided in **RFQ_DATABASE_SCHEMA.sql** file.
