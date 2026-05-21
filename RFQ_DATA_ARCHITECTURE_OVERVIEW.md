# RFQ Desk - Data Architecture Overview

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RFQ DESK DATA STRUCTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘


                                    USERS
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                reporter_id      assignee_id        actor_id
                    │                 │                 │
                    ↓                 ↓                 ↓
              ┌──────────────────────────────────────────────────────┐
              │                     RFQS                             │
              │  (Main RFQ Records - Central Hub)                  │
              │                                                     │
              │  - rfq_number (human readable)                      │
              │  - priority, stage, status, sla_status             │
              │  - delivery_location, total_quantity               │
              │  - ai_confidence_score, notes                      │
              │  - created_at, updated_at, last_activity_at       │
              └──────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬──────────────┬──────────────┐
        │           │           │              │              │
        │           │           │              │              │
        ↓           ↓           ↓              ↓              ↓
    ┌────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐
    │CLIENTS │  │RFQ_     │  │RFQ_      │  │VENDOR_ │  │RFQ_      │
    │        │  │ITEMS    │  │DOCUMENTS │  │QUOTES  │  │TIMELINE_ │
    │        │  │         │  │          │  │        │  │EVENTS    │
    │ Name   │  │Material │  │ Files    │  │Price   │  │Activity  │
    │Contact │  │Category │  │ OCR Text │  │Status  │  │Audit     │
    │Email   │  │Quantity │  │ Storage  │  │Terms   │  │Trail     │
    └────────┘  │Unit     │  │          │  │        │  │          │
                │Spec     │  │          │  │        │  │          │
                │JSON     │  │          │  │        │  │          │
                └─────────┘  └──────────┘  └────────┘  └──────────┘
                    │            │              │
                    │            ↓              │
                    │    ┌────────────────┐     │
                    │    │RFQ_            │     │
                    │    │REQUIREMENTS    │     │
                    │    │                │     │
                    │    │Extracted via   │     │
                    │    │OCR/AI from     │     │
                    │    │documents       │     │
                    │    └────────────────┘     │
                    │                           │
                    ↓                           ↓
                ┌────────────────────────────────────────┐
                │    VENDOR_RECOMMENDATIONS              │
                │  (AI-Matched Vendors for RFQ)         │
                │                                        │
                │  - vendor_id (FK to vendors)           │
                │  - match_score (0-1)                   │
                │  - confidence_level (high/medium/low)  │
                │  - match_reasons[]                     │
                │  - region_compatibility                │
                │  - ranking                             │
                └────────────────────────────────────────┘
                            │
                            ↓
                    ┌──────────────────┐
                    │   VENDORS        │
                    │                  │
                    │ Name, Location   │
                    │ Specializations  │
                    │ Certifications   │
                    │ Is_Active        │
                    └──────────────────┘
                            │
                            ↓
                ┌─────────────────────────────────────┐
                │  VENDOR_PERFORMANCE_HISTORY         │
                │                                     │
                │  - on_time_delivery_rate (%)       │
                │  - quality_score (0-100)           │
                │  - response_rate (%)               │
                │  - average_lead_time_days          │
                │  - total_orders, successful_orders │
                │  - average_order_value             │
                └─────────────────────────────────────┘


        ┌─────────────────────────────────────────────────────┐
        │                   RFQ METADATA                       │
        │                                                     │
        │  Flexible key-value storage for project-specific  │
        │  data (projectType, budget, department, etc.)     │
        └─────────────────────────────────────────────────────┘

        ┌─────────────────────────────────────────────────────┐
        │                    RFQ_TAGS                          │
        │                                                     │
        │  Normalized tags (structural-steel, urgent, etc.)  │
        │  Enables fast filtering and auto-complete         │
        └─────────────────────────────────────────────────────┘


                    ┌──────────────────────────────┐
                    │    RFQ_SUMMARY               │
                    │  (Materialized View)         │
                    │                              │
                    │  Pre-computed denormalized  │
                    │  data for dashboard speed   │
                    │  (1-2ms queries)           │
                    └──────────────────────────────┘
```

---

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                    RFQ CREATION & DATA FLOW                            │
└────────────────────────────────────────────────────────────────────────┘

1. USER CREATES RFQ
   ↓
   INSERT INTO rfqs (...)
   └─→ Get back rfq_id

2. USER ADDS LINE ITEMS
   ↓
   INSERT INTO rfq_items (rfq_id, material_description, quantity, ...)
   │
   └─→ For each item:
       - material_category used for vendor matching
       - specifications (JSON) for material-specific data

3. USER UPLOADS DOCUMENTS
   ↓
   INSERT INTO rfq_documents (rfq_id, file_path, ...)
   │
   └─→ OCR Service processes file
       ├─→ Update rfq_documents.extracted_text
       ├─→ Update rfq_documents.ocr_processed = true
       ├─→ Update rfq_documents.ocr_confidence_score
       └─→ INSERT INTO rfq_requirements (extracted data)

4. AI MATCHING SERVICE RUNS
   ↓
   For each material_category in rfq_items:
   ├─→ Query vendor_performance_history for matching vendors
   ├─→ Score based on:
   │   - Category specialization match
   │   - Historical performance metrics
   │   - Location compatibility
   │   - Quantity handling capability
   └─→ INSERT INTO vendor_recommendations (top matches)

5. SYSTEM CREATES TIMELINE
   ↓
   INSERT INTO rfq_timeline_events (
     event_type: 'system|ai|human|workflow_transition',
     title: '...',
     actor_id: user_id,
     timestamp: NOW()
   )

6. VENDORS SUBMIT QUOTES
   ↓
   INSERT INTO vendor_quotes (
     rfq_id, vendor_id, price_per_unit, delivery_date, ...
   )

7. USER REVIEWS & DECIDES
   ↓
   UPDATE rfqs SET stage = 'next_stage', updated_at = NOW()
   INSERT INTO rfq_timeline_events (event_type: 'human', ...)
```

---

## Query Execution Paths

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMMON QUERY PATTERNS                            │
└─────────────────────────────────────────────────────────────────────┘

PATTERN 1: Get Single RFQ for Detail View
─────────────────────────────────────────
┌──────────┐
│ rfq_id   │ (input)
└────┬─────┘
     │
     ├─→ rfqs → clients
     ├─→ rfqs → users (reporter, assignee)
     ├─→ rfq_items → (material details)
     ├─→ rfq_documents → (with OCR data)
     ├─→ rfq_requirements → (extracted)
     ├─→ vendor_recommendations → vendors
     │   └─→ vendor_performance_history
     ├─→ vendor_quotes → vendors
     └─→ rfq_timeline_events → users (actor)
     
     RESULT: Complete RFQ JSON (~10-20 objects)
     TIME: 50-100ms (with proper indexes)
     OPTIMIZATION: Use get_rfq_complete() function

─────────────────────────────────────────

PATTERN 2: List RFQs for Dashboard/Queue
─────────────────────────────────────────
Use: rfq_summary (materialized view)
│
└─→ Pre-computed aggregations:
    - client_id, client_name
    - stage, priority, status
    - total_items (count)
    - quote_count, recommendation_count
    - pending_quotes (count)
    - last_activity_at (for sorting)

RESULT: 50 RFQs with summaries
TIME: 10-20ms (instant from view)
REFRESH: After significant changes
OPTIMIZATION: Cache in Redis for 5 min

─────────────────────────────────────────

PATTERN 3: Find Best Vendors for RFQ
─────────────────────────────────────
┌──────────┐
│ rfq_id   │ (input)
└────┬─────┘
     │
     ├─→ vendor_recommendations (WHERE rfq_id = ?)
     ├─→ JOIN vendors
     ├─→ LEFT JOIN vendor_performance_history
     ├─→ LEFT JOIN vendor_quotes (latest)
     └─→ RANK by match_score DESC
     
     RESULT: Ranked vendor list with scores & quotes
     TIME: 20-30ms
     OPTIMIZATION: Index on (rfq_id, match_score DESC)

─────────────────────────────────────────

PATTERN 4: Search RFQs with Filters
───────────────────────────────────
┌──────────────────────────────────┐
│ client_id, stage, priority, text │ (inputs)
└────┬─────────────────────────────┘
     │
     └─→ rfq_summary WHERE
         - client_id = ?
         - stage = ?
         - priority = ?
         - rfq_number ILIKE '%text%'
         - OR client_name ILIKE '%text%'
     
     RESULT: Filtered RFQ list
     TIME: 15-50ms depending on filters
     OPTIMIZATION: Use materialized view + partial indexes

─────────────────────────────────────

PATTERN 5: Get Extracted Requirements
──────────────────────────────────────
┌──────────┐
│ rfq_id   │ (input)
└────┬─────┘
     │
     ├─→ rfq_requirements (WHERE rfq_id = ?)
     ├─→ LEFT JOIN rfq_documents (source)
     └─→ GROUP BY category
     
     RESULT: Requirements grouped by category with source docs
     TIME: 10-15ms
     OPTIMIZATION: Index on (rfq_id, category)

─────────────────────────────────────

PATTERN 6: Compare Vendor Quotes
─────────────────────────────────
┌──────────┐
│ rfq_id   │ (input)
└────┬─────┘
     │
     ├─→ vendor_quotes (WHERE rfq_id = ?)
     ├─→ JOIN vendors
     ├─→ Calculate:
     │   - Price variance from average
     │   - Validity days remaining
     │   - Delivery date comparison
     └─→ ORDER BY price_per_unit ASC
     
     RESULT: Quote comparison matrix
     TIME: 15-25ms
     OPTIMIZATION: Window functions for ranking
```

---

## Data Volume & Impact Analysis

```
┌─────────────────────────────────────────────────────────┐
│          TYPICAL DATA VOLUMES                           │
└─────────────────────────────────────────────────────────┘

Active System (Day 1):
  - Clients: 10-50
  - Users: 5-20
  - Vendors: 50-200
  - Active RFQs: 20-50
  - RFQ Items: 50-200 (avg 4 per RFQ)
  - Documents: 30-100 (avg 2 per RFQ)
  - Requirements: 200-500 (avg 10 per RFQ)
  - Vendor Recommendations: 100-500 (avg 5-10 per RFQ)
  - Quotes: 50-200 (avg 3-5 when in quotation stage)
  - Timeline Events: 500-2000 (avg 30-50 per RFQ)
  - Tags: 50-100 unique tags
  
  → Total records: ~2,500-4,000

Mature System (1 Year):
  - Historical RFQs: 500-2000 (includes closed)
  - Archive records: Could be 10x larger
  
  → Need partitioning and archival strategy

┌─────────────────────────────────────────────────────────┐
│          DATABASE SIZE ESTIMATES                        │
└─────────────────────────────────────────────────────────┘

Initial Setup:        ~10 MB
After 1 Month:        ~50 MB
After 1 Year:         ~300 MB
After 5 Years:        ~1.5 GB

With large documents:  Could reach 10-20 GB
(Store large files in S3, URLs in DB)

┌─────────────────────────────────────────────────────────┐
│          QUERY PERFORMANCE TARGETS                      │
└─────────────────────────────────────────────────────────┘

Dashboard (list all RFQs):           < 20 ms
Single RFQ detail view:               < 100 ms
Search with filters:                  < 50 ms
Vendor recommendation lookup:          < 30 ms
Quote comparison:                      < 25 ms
Timeline/audit trail:                  < 50 ms
```

---

## Architecture Decisions Made

```
┌─────────────────────────────────────────────────────────┐
│          WHY THIS DESIGN?                               │
└─────────────────────────────────────────────────────────┘

DECISION 1: Normalized Tables (3NF) instead of Document Store
─────────────────────────────────────────────────────────────
✓ Enables complex queries (vendor matching, comparisons)
✓ Enforces data consistency with foreign keys
✓ Indexes work well for filtering/searching
✓ Easier to update individual fields (quote status, etc.)
✗ Requires JOINs for complete data
✗ More tables to manage

DECISION 2: Separate vendor_performance_history Table
──────────────────────────────────────────────────────
✓ Can track changes over time
✓ Can archive old performance data
✓ Doesn't bloat vendors table
✓ Dedicated for AI matching service
✗ Requires JOIN to get vendor metrics

DECISION 3: JSONB for Flexible Data
────────────────────────────────────
✓ Handle material-specific specs without schema changes
✓ Store variable metadata per project
✓ Can query JSON with WHERE clauses
✓ Extensible without migrations
✗ Can't use standard indexes (use GIN index)

DECISION 4: Materialized View for Dashboard
────────────────────────────────────────────
✓ Pre-computed aggregations (no JOINs on query)
✓ Ultra-fast queries (1-2ms for 50 items)
✓ Indexes on view for further optimization
✗ Needs refresh after changes
✗ Slightly stale data (refresh interval)

DECISION 5: Normalized Tags Table Instead of Array
──────────────────────────────────────────────────
✓ Can query individual tags
✓ Can build tag auto-complete
✓ UNIQUE constraint prevents duplicates
✓ Can analyze tag usage
✗ More rows in database

DECISION 6: Timeline Events Table for Audit
────────────────────────────────────────────
✓ Complete immutable audit trail
✓ Easy to query "what changed when"
✓ Can support compliance requirements
✓ Timestamps and actor tracking
✗ Large number of rows (100+ per RFQ)

DECISION 7: Store URLs, Not Files
─────────────────────────────────
✓ Database stays small and fast
✓ Files stored in S3/cloud (cheaper, scalable)
✓ Easy to move files without DB migration
✓ URL versioning / CDN caching possible
✗ External dependency on S3

```

---

## Index Strategy Summary

```
┌──────────────────────────────────────────────────────────┐
│          INDEXING STRATEGY                               │
└──────────────────────────────────────────────────────────┘

CRITICAL (MUST HAVE):
├─ Single-column search indexes:
│  ├─ rfqs(stage)
│  ├─ rfqs(status)
│  ├─ rfqs(priority)
│  ├─ rfqs(sla_status)
│  ├─ rfqs(client_id)
│  ├─ rfqs(assignee_id)
│  └─ vendor_quotes(status)
│
├─ Composite indexes (query combinations):
│  ├─ rfqs(client_id, created_at DESC)
│  ├─ rfqs(stage, priority)
│  ├─ rfqs(assignee_id, status)
│  └─ vendor_quotes(rfq_id, vendor_id)
│
└─ Partial indexes (frequently filtered):
   ├─ rfqs(sla_deadline) WHERE sla_status IN ('at_risk', 'breached')
   └─ vendors(name) WHERE is_active = TRUE

RECOMMENDED:
├─ Full-text search on rfq_number, client_name
├─ GIN indexes on JSONB columns
│  ├─ rfq_items(specifications)
│  └─ rfq_timeline_events(metadata)
└─ Date range indexes
   ├─ rfq_timeline_events(timestamp DESC)
   └─ vendor_quotes(valid_until)

TOTAL INDEXES: ~20-25 indexes
DB OVERHEAD: ~10-15% of data size
```

---

## Scalability Roadmap

```
┌──────────────────────────────────────────────────────────┐
│          SCALABILITY ROADMAP                             │
└──────────────────────────────────────────────────────────┘

PHASE 1: Single PostgreSQL Instance (0-1 Million Records)
──────────────────────────────────────────────────────────
Setup:
  - Standalone PostgreSQL server
  - Local or cloud-hosted (RDS)
  - SSD storage, 8GB+ RAM
  
Performance:
  - Dashboard queries: 10-20ms
  - Single RFQ: 50-100ms
  - Concurrent users: 50-100

PHASE 2: Read Replicas (1-10 Million Records)
──────────────────────────────────────────────
Setup:
  - Primary write database
  - 2-3 read replicas
  - Connection pooling
  - Materialized view refresh strategy
  
Performance:
  - Read-heavy queries on replicas
  - Writes still go to primary
  - Dashboard on replica (read-only)
  - Concurrent users: 100-500

PHASE 3: Partitioning & Archival (10+ Million Records)
──────────────────────────────────────────────────────
Setup:
  - Partition rfqs by created_at (monthly)
  - Archive closed RFQs to separate storage
  - Partition timeline_events by rfq_id
  - Shard by client_id for multi-tenant
  
Performance:
  - Faster indexes on smaller partitions
  - Queries on active RFQs remain fast
  - Historical data accessible but not slowing active queries
  - Concurrent users: 500-2000

PHASE 4: Distributed Database (100+ Million Records)
─────────────────────────────────────────────────────
Options:
  - PostgreSQL FDW (Foreign Data Wrapper)
  - TimescaleDB for time-series events
  - Sharded PostgreSQL clusters
  - Move to specialized data warehouse
  
Performance:
  - Geographically distributed
  - Multi-region deployment
  - Concurrent users: 1000+
```

---

## Security & Compliance

```
┌──────────────────────────────────────────────────────────┐
│          DATA SECURITY                                   │
└──────────────────────────────────────────────────────────┘

IMPLEMENTED:
✓ Audit trail (who did what, when)
✓ Foreign key constraints
✓ NOT NULL constraints
✓ Check constraints for enums
✓ Unique constraints

RECOMMENDED:
□ Encryption at rest (database-level)
□ Encryption in transit (TLS)
□ Row-level security (PostgreSQL RLS)
□ Access logging
□ Backup & disaster recovery
□ Data retention policy

COMPLIANCE:
□ GDPR: Right to deletion (hard with audit trail)
□ SOX: Immutable audit trail
□ ISO 27001: Data security
□ Data masking in dev/test environments
```

---

## Files Generated

1. **RFQ_DESK_DATA_ANALYSIS.md** - 👈 START HERE
   - Complete data structure analysis
   - 7 parts: Data inventory, schema design, relationships, implementation, queries, recommendations, data dictionary

2. **RFQ_DATABASE_SCHEMA.sql**
   - Production-ready DDL
   - All 12 tables with constraints
   - Indexes and views
   - 10 SQL query examples
   - Helper function

3. **RFQ_DATABASE_SETUP.sql**
   - Executable migration script
   - Sample data seeding
   - Verification queries
   - Ready to run: `psql -d dwas_rfq -f RFQ_DATABASE_SETUP.sql`

4. **RFQ_QUICK_REFERENCE.md**
   - Quick lookup guide
   - Data checklist
   - Query examples
   - Performance expectations
   - Implementation roadmap

5. **RFQ_DATA_ARCHITECTURE_OVERVIEW.md** (THIS FILE)
   - Visual entity relationships
   - Data flow diagrams
   - Query execution paths
   - Volume estimates
   - Design rationale

---

## Quick Start

```bash
# 1. Create database
createdb dwas_rfq

# 2. Run setup script
psql -d dwas_rfq -f RFQ_DATABASE_SETUP.sql

# 3. Verify
psql -d dwas_rfq -c "SELECT * FROM rfq_summary LIMIT 5;"

# 4. Read documentation
cat RFQ_DESK_DATA_ANALYSIS.md | less
```

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Tables** | 12 main + 1 materialized view |
| **Indexes** | 20-25 for performance |
| **Relationships** | 1:N (mostly) hierarchical |
| **Typical RFQ Size** | 10-20 KB (complete JSON) |
| **Dashboard Query Speed** | 10-20 ms |
| **Single RFQ Query Speed** | 50-100 ms |
| **Normalization Level** | 3NF (Third Normal Form) |
| **Flexibility** | JSONB for specs & metadata |
| **Scalability** | Single DB up to ~50M records |
| **Concurrent Users** | 50-100 initially, 500+ with replicas |

---

End of Architecture Overview
