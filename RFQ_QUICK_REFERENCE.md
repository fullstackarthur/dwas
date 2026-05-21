# RFQ DESK - QUICK REFERENCE GUIDE

## What Data Is Needed to Build Each RFQ?

### Data Fetching Checklist

When building/displaying an RFQ on the desk, you need to fetch:

```
✓ CORE RFQ DATA
  └─ RFQ basic info (id, rfq_number, priority, stage, status, sla_status)
  └─ Client info (name, contact, email)
  └─ Assignee info (user name, email, role)
  └─ Reporter info (who created it)
  └─ Dates (created_at, due_date, sla_deadline, last_activity_at)
  └─ AI confidence score (0-1 for recommendation quality)

✓ LINE ITEMS (1-10 per RFQ)
  └─ Material description
  └─ Category (for vendor matching)
  └─ Quantity + unit
  └─ Grade/specification
  └─ Required date
  └─ Delivery location (can vary per item)

✓ DOCUMENTS (1-5 per RFQ)
  └─ File name, type (pdf/image/excel/word)
  └─ Size, upload timestamp
  └─ OCR processed status + confidence
  └─ Storage URL (S3/cloud link)

✓ REQUIREMENTS (5-20 extracted per RFQ)
  └─ Category (material/quantity/delivery/quality/certification)
  └─ Label + Value
  └─ Confidence score (how certain the AI was)
  └─ Validation status (valid/uncertain/missing/invalid)

✓ VENDOR RECOMMENDATIONS (Top 3-10 per RFQ)
  └─ Vendor name, location, specializations
  └─ Match score (0-1)
  └─ Confidence level (high/medium/low)
  └─ Why matched (reasons array)
  └─ Historical performance (on-time %, quality score, response rate)

✓ VENDOR QUOTES (0-15 per RFQ)
  └─ Vendor name, email, location
  └─ Price per unit, total price, currency
  └─ Delivery date, payment terms
  └─ Quote status (submitted/accepted/rejected/counter-offered)
  └─ Validity end date

✓ TIMELINE/AUDIT TRAIL (10-100 events per RFQ)
  └─ Event type (human/ai/system/workflow_transition)
  └─ Title, description
  └─ Actor (who did action)
  └─ Timestamp, previous stage → new stage
  └─ Additional metadata

✓ TAGS & METADATA
  └─ Tags (array: 'structural-steel', 'urgent', 'lt-projects', etc)
  └─ Flexible metadata (projectType, budget, department, etc)

✓ ACTIVITY METRICS
  └─ Unread updates count
  └─ AI vendor match count
```

---

## Database Tables to Query

### Core Tables (Always needed):
1. **rfqs** - Main RFQ record
2. **clients** - Client information
3. **users** - Assignee/reporter details
4. **rfq_items** - Line items
5. **rfq_documents** - Uploaded files
6. **rfq_requirements** - Extracted requirements
7. **rfq_tags** - Searchable labels
8. **vendor_recommendations** - AI-matched vendors
9. **vendors** - Vendor master data
10. **vendor_performance_history** - Vendor metrics
11. **vendor_quotes** - Quotations received
12. **rfq_timeline_events** - Activity audit trail

### Optional Tables:
- **rfq_metadata** - For custom project data

### Pre-computed View (for speed):
- **rfq_summary** - Materialized view combining most data

---

## SQL Query Examples

### Get Complete RFQ (Single View)
```sql
SELECT get_rfq_complete('rfq-id'::UUID) AS rfq_data;
```

### List All RFQs (Dashboard)
```sql
SELECT * FROM rfq_summary
WHERE status IN ('open', 'in_progress', 'awaiting_response', 'quoted')
ORDER BY CASE priority
  WHEN 'critical' THEN 1
  WHEN 'high' THEN 2
  WHEN 'medium' THEN 3
  ELSE 4
END,
last_activity_at DESC
LIMIT 50;
```

### Get RFQs with SLA Risk
```sql
SELECT * FROM rfq_summary
WHERE sla_status IN ('at_risk', 'breached')
ORDER BY sla_deadline ASC;
```

### Find Best Vendors for RFQ
```sql
SELECT 
  v.name,
  vrec.match_score,
  vph.on_time_delivery_rate,
  vph.quality_score,
  COALESCE(vq.total_price, 0) AS quote_price
FROM vendor_recommendations vrec
JOIN vendors v ON vrec.vendor_id = v.id
LEFT JOIN vendor_performance_history vph ON v.id = vph.vendor_id
LEFT JOIN vendor_quotes vq ON vrec.rfq_id = vq.rfq_id AND vrec.vendor_id = vq.vendor_id
WHERE vrec.rfq_id = 'rfq-id'::UUID
ORDER BY vrec.match_score DESC;
```

### Get Vendor Quotes for RFQ
```sql
SELECT 
  v.name,
  vq.price_per_unit,
  vq.total_price,
  vq.currency,
  vq.delivery_date,
  vq.payment_terms,
  vq.status
FROM vendor_quotes vq
JOIN vendors v ON vq.vendor_id = v.id
WHERE vq.rfq_id = 'rfq-id'::UUID
ORDER BY vq.price_per_unit ASC;
```

### Get Timeline with Details
```sql
SELECT 
  evt.title,
  evt.description,
  u.name AS actor_name,
  evt.timestamp,
  evt.previous_stage,
  evt.new_stage
FROM rfq_timeline_events evt
LEFT JOIN users u ON evt.actor_id = u.id
WHERE evt.rfq_id = 'rfq-id'::UUID
ORDER BY evt.timestamp DESC;
```

---

## Data Volume & Performance Expectations

### Typical Numbers:
- **Active RFQs**: 50-100 at any time
- **RFQ Items per RFQ**: 1-10 (avg 3)
- **Documents per RFQ**: 1-5 (avg 2)
- **Requirements per RFQ**: 5-20 (avg 10)
- **Vendor Recommendations**: 3-10 (avg 5)
- **Quotes per RFQ**: 0-15 (avg 3-5 when in quotation stage)
- **Timeline Events**: 10-100 (avg 30)

### Query Performance:
| Query | Typical Time | Notes |
|-------|-------------|-------|
| Get single RFQ complete | 50-100ms | Uses JOINs + aggregations |
| List all RFQs (50 items) | 10-20ms | Uses materialized view |
| Find SLA at-risk | 5-10ms | Index on sla_status |
| Get best vendors | 20-30ms | Multiple JOINs |
| Search RFQs | 15-50ms | Full-text if indexed |

**Optimization**: Use `rfq_summary` materialized view for dashboard queries (pre-computed, instant).

---

## Implementation Roadmap

### Phase 1: Database Setup
- [ ] Create PostgreSQL database with schema
- [ ] Set up indexes
- [ ] Create materialized view
- [ ] Seed initial data from mock

### Phase 2: Backend API
- [ ] Build REST endpoints for CRUD
- [ ] Implement search/filter endpoints
- [ ] Add pagination
- [ ] Implement caching

### Phase 3: Business Logic Services
- [ ] AI vendor matching service
- [ ] OCR document processing
- [ ] SLA deadline tracking
- [ ] Quote comparison engine

### Phase 4: Frontend Integration
- [ ] Connect React to backend API
- [ ] Implement realtime sync
- [ ] Add error handling
- [ ] Performance monitoring

---

## File References

### Documentation Files:
1. **RFQ_DESK_DATA_ANALYSIS.md** ← READ THIS FIRST
   - Complete data structure analysis
   - Normalization approach
   - Entity relationships
   - Design decisions

2. **RFQ_DATABASE_SCHEMA.sql**
   - Complete DDL (CREATE TABLE statements)
   - All indexes
   - Materialized views
   - Sample queries (commented out)
   - Helper functions

3. **RFQ_DATABASE_SETUP.sql**
   - Ready-to-run migration script
   - Sample data insertion
   - Verification queries
   - Helper function implementation

### Related Frontend Files:
- `src/core/types/rfq.ts` - TypeScript type definitions
- `src/data/mock/rfq.ts` - Mock data (source for seeding)
- `src/presentation/rfq-desk/` - React UI components
- `src/domain/repositories/` - Repository interfaces

---

## Key Design Principles

### ✅ Normalization (3NF)
- No redundant data
- Separate tables for different entities
- Foreign keys maintain referential integrity

### ✅ Flexibility
- JSONB columns for material specs
- JSONB for event metadata
- metadata table for project-specific data

### ✅ Audit Trail
- created_at, updated_at on all tables
- Complete timeline_events table
- Actor tracking for all changes

### ✅ Performance
- Strategic indexing on search columns
- Composite indexes for common query patterns
- Materialized view for dashboard queries
- Pagination support for large result sets

### ✅ Scalability
- Can partition by date (rfqs by month)
- Archive old data separately
- JSON storage for extensible specs

---

## Critical Indexes for Performance

```sql
-- Must have:
CREATE INDEX idx_rfqs_stage ON rfqs(stage);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_priority ON rfqs(priority);
CREATE INDEX idx_rfqs_sla_status ON rfqs(sla_status);

-- For common queries:
CREATE INDEX idx_rfqs_client_created ON rfqs(client_id, created_at DESC);
CREATE INDEX idx_rfqs_stage_priority ON rfqs(stage, priority);
CREATE INDEX idx_rfqs_sla_deadline ON rfqs(sla_deadline) 
  WHERE sla_status IN ('at_risk', 'breached');

-- For searches:
CREATE INDEX idx_rfq_items_specs ON rfq_items USING GIN(specifications);
CREATE INDEX idx_timeline_metadata ON rfq_timeline_events USING GIN(metadata);
```

---

## Testing Checklist

- [ ] Can insert RFQ with all nested data
- [ ] Can retrieve complete RFQ in < 100ms
- [ ] Can list 50 RFQs in < 20ms
- [ ] Can search RFQs with text + filters
- [ ] Vendor recommendations rank correctly
- [ ] Quote comparison calculates variance
- [ ] Timeline shows events in order
- [ ] Tags are searchable
- [ ] SLA status updates correctly
- [ ] Materializ view refreshes on changes

---

## Next Steps

1. **Copy RFQ_DATABASE_SETUP.sql** and run against PostgreSQL:
   ```bash
   psql -U postgres -d dwas_rfq -f RFQ_DATABASE_SETUP.sql
   ```

2. **Verify schema** was created:
   ```bash
   psql -d dwas_rfq -c "\dt"  # List tables
   psql -d dwas_rfq -c "SELECT COUNT(*) FROM rfq_summary;"
   ```

3. **Build backend API** to wrap SQL queries

4. **Connect frontend** to backend endpoints instead of mock data

5. **Implement realtime** sync via WebSocket for live updates

---

## Common Issues & Solutions

### "Views depend on tables" during migration
→ Drop views before dropping tables

### Slow dashboard queries
→ Refresh materialized view with: `REFRESH MATERIALIZED VIEW rfq_summary;`

### Vendor recommendations not showing
→ Check vendor_performance_history is populated

### Timeline out of order
→ Add `ORDER BY timestamp DESC` to query

### Foreign key constraints preventing deletes
→ Set `ON DELETE CASCADE` for dependent records

---

## Contact & Support

For questions about the schema:
- See **RFQ_DESK_DATA_ANALYSIS.md** for complete documentation
- Review **RFQ_DATABASE_SCHEMA.sql** for DDL details
- Check **RFQ_DATABASE_SETUP.sql** for working examples
