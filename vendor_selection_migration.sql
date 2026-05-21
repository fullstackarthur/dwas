-- Add vendor selection tracking columns to rfqs table
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS selected_vendor_id UUID REFERENCES vendors(id);
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS accepted_quote_id UUID REFERENCES vendor_quotes(id);

-- Add status column to vendor_quotes if not exists
ALTER TABLE vendor_quotes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected', 'counter_offered', 'expired'));

-- Add is_selected column to vendor_recommendations
ALTER TABLE vendor_recommendations ADD COLUMN IF NOT EXISTS is_selected BOOLEAN DEFAULT FALSE;

-- Update get_rfq_complete RPC to include quote status and selection fields
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
    'selectedVendorId', r.selected_vendor_id,
    'acceptedQuoteId', r.accepted_quote_id,
    'reporterId', r.reporter_id,
    'assigneeId', r.assignee_id,
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
        'regionCompatibility', vrec.region_compatibility,
        'isSelected', vrec.is_selected
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
        'validUntil', vq.valid_until,
        'counterOfferPrice', vq.counter_offer_price,
        'counterOfferNotes', vq.counter_offer_notes
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
