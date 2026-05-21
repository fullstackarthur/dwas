import type {
  RFQ,
  RFQItem,
  RFQTimelineEvent,
  RFQDocument,
  RFQRequirement,
  AIVendorRecommendation,
  VendorQuote,
  RFQStage,
  RFQPriority,
  SLAStatus,
} from '../../core/types/rfq'
import type { User } from '../../core/types'

export function mapDbUserToUser(dbUser: {
  id: string
  name: string
  email: string
  role: string
  avatar_url?: string | null
  status?: string | null
  last_active?: string | null
}): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as User['role'],
    avatarUrl: dbUser.avatar_url || undefined,
    status: (dbUser.status as User['status']) || 'offline',
    lastActive: dbUser.last_active ? new Date(dbUser.last_active).toISOString() : new Date().toISOString(),
  }
}

export function mapDbItemToRFQItem(row: Record<string, unknown>): RFQItem {
  return {
    id: (row.id as string) || '',
    rfqId: (row.rfq_id as string) || (row.rfqId as string) || '',
    materialDescription: (row.material_description as string) || (row.materialDescription as string) || '',
    quantity: Number(row.quantity ?? 0),
    unit: (row.unit as string) || '',
    specifications: (row.specifications as Record<string, string>) || undefined,
    requiredDate: row.required_date ? new Date(row.required_date as string).toISOString() : (row.requiredDate ? new Date(row.requiredDate as string).toISOString() : undefined),
    deliveryLocation: (row.delivery_location as string) || (row.deliveryLocation as string) || undefined,
  }
}

export function mapDbTimelineEvent(row: Record<string, unknown>): RFQTimelineEvent {
  return {
    id: (row.id as string) || '',
    rfqId: (row.rfq_id as string) || (row.rfqId as string) || '',
    type: (row.event_type as RFQTimelineEvent['type']) || (row.type as RFQTimelineEvent['type']) || 'system',
    title: (row.title as string) || '',
    description: (row.description as string) || undefined,
    actor: row.actor
      ? mapDbUserToUser({
          id: (row.actor as Record<string, unknown>).id as string,
          name: (row.actor as Record<string, unknown>).name as string,
          email: (row.actor as Record<string, unknown>).email as string,
          role: (row.actor as Record<string, unknown>).role as string,
        })
      : undefined,
    timestamp: row.timestamp ? new Date(row.timestamp as string).toISOString() : new Date().toISOString(),
    previousStage: (row.previous_stage as RFQStage) || (row.previousStage as RFQStage) || undefined,
    newStage: (row.new_stage as RFQStage) || (row.newStage as RFQStage) || undefined,
    metadata: (row.metadata as Record<string, string | number | boolean>) || undefined,
  }
}

export function mapDbDocument(row: Record<string, unknown>): RFQDocument {
  return {
    id: (row.id as string) || '',
    rfqId: (row.rfq_id as string) || (row.rfqId as string) || '',
    name: (row.name as string) || '',
    type: (row.type as RFQDocument['type']) || 'other',
    size: Number(row.file_size ?? row.size ?? 0),
    url: (row.storage_url as string) || (row.url as string) || `/documents/${row.id}`,
    uploadedAt: row.uploaded_at ? new Date(row.uploaded_at as string).toISOString() : (row.uploadedAt ? new Date(row.uploadedAt as string).toISOString() : new Date().toISOString()),
    ocrProcessed: Boolean(row.ocr_processed ?? row.ocrProcessed),
    ocrConfidence: row.ocr_confidence_score ? Number(row.ocr_confidence_score) : (row.ocrConfidence ? Number(row.ocrConfidence) : undefined),
  }
}

export function mapDbRequirement(row: Record<string, unknown>): RFQRequirement {
  return {
    id: (row.id as string) || '',
    rfqId: (row.rfq_id as string) || (row.rfqId as string) || '',
    category: (row.category as RFQRequirement['category']) || 'other',
    label: (row.label as string) || '',
    value: (row.value as string) || '',
    confidence: Number(row.confidence_score ?? row.confidence ?? 0),
    validationStatus: (row.validation_status as RFQRequirement['validationStatus']) || (row.validationStatus as RFQRequirement['validationStatus']) || 'uncertain',
    sourceDocumentId: (row.source_document_id as string) || (row.sourceDocumentId as string) || undefined,
  }
}

export function mapDbVendorRecommendation(row: Record<string, unknown>): AIVendorRecommendation {
  const vendorObj = row.vendors as Record<string, unknown> | undefined
  const rawReasons = row.match_reasons ?? row.matchReasons
  let matchReasons: string[] = []
  if (Array.isArray(rawReasons)) {
    matchReasons = rawReasons as string[]
  } else if (typeof rawReasons === 'string') {
    try {
      const parsed = JSON.parse(rawReasons)
      matchReasons = Array.isArray(parsed) ? parsed : [rawReasons]
    } catch {
      matchReasons = [rawReasons]
    }
  }

  return {
    id: (row.id as string) || '',
    rfqId: (row.rfq_id as string) || (row.rfqId as string) || '',
    vendorId: (row.vendor_id as string) || '',
    vendorName: (row.vendorName as string) || (row.vendor_name as string) || (vendorObj?.name as string) || 'Unknown',
    vendorLocation: (row.vendorLocation as string) || (row.vendor_location as string) || (vendorObj?.location as string) || '',
    score: Number(row.match_score ?? row.score ?? 0),
    confidence: (row.confidence_level as AIVendorRecommendation['confidence']) || (row.confidence as AIVendorRecommendation['confidence']) || 'low',
    matchReasons,
    regionCompatibility: (row.region_compatibility as AIVendorRecommendation['regionCompatibility']) || (row.regionCompatibility as AIVendorRecommendation['regionCompatibility']) || 'remote',
    suggestedContacts: (row.suggested_contacts as string[]) || undefined,
    isSelected: Boolean(row.is_selected ?? row.isSelected),
  }
}

export function mapDbVendorQuote(row: Record<string, unknown>): VendorQuote {
  const vendorObj = row.vendors as Record<string, unknown> | undefined
  return {
    id: (row.id as string) || '',
    rfqId: (row.rfq_id as string) || (row.rfqId as string) || '',
    vendorId: (row.vendor_id as string) || '',
    vendorName: (row.vendorName as string) || (row.vendor_name as string) || (vendorObj?.name as string) || 'Unknown',
    pricePerUnit: Number(row.price_per_unit ?? row.pricePerUnit ?? 0),
    totalPrice: Number(row.total_price ?? row.totalPrice ?? 0),
    currency: (row.currency as string) || 'INR',
    validUntil: row.valid_until ? new Date(row.valid_until as string).toISOString() : (row.validUntil ? new Date(row.validUntil as string).toISOString() : new Date().toISOString()),
    deliveryDate: row.delivery_date ? new Date(row.delivery_date as string).toISOString() : (row.deliveryDate ? new Date(row.deliveryDate as string).toISOString() : new Date().toISOString()),
    paymentTerms: (row.payment_terms as string) || (row.paymentTerms as string) || '',
    notes: (row.notes as string) || undefined,
    status: (row.status as VendorQuote['status']) || 'submitted',
    counterOfferPrice: row.counter_offer_price ? Number(row.counter_offer_price) : undefined,
    counterOfferNotes: (row.counter_offer_notes as string) || undefined,
    createdAt: row.created_at ? new Date(row.created_at as string).toISOString() : (row.createdAt ? new Date(row.createdAt as string).toISOString() : new Date().toISOString()),
  }
}

export function mapCompleteRfqJsonToRFQ(
  json: Record<string, unknown>,
  reporter: User,
  assignee?: User,
  timeline?: RFQTimelineEvent[],
  metadata?: Record<string, string | number | boolean>,
  unreadUpdates?: number
): RFQ {
  const rawItems = (json.items as Record<string, unknown>[]) || []
  const tags = (json.tags as string[]) || []
  const rawDocuments = (json.documents as Record<string, unknown>[]) || []
  const rawRequirements = (json.requirements as Record<string, unknown>[]) || []
  const rawRecommendations = (json.recommendations as Record<string, unknown>[]) || []
  const rawQuotes = (json.quotes as Record<string, unknown>[]) || []

  const items = rawItems.map(mapDbItemToRFQItem)
  const documents = rawDocuments.map(mapDbDocument)
  const requirements = rawRequirements.map(mapDbRequirement)
  const recommendations = rawRecommendations.map(mapDbVendorRecommendation)
  const quotations = rawQuotes.map(mapDbVendorQuote)

  return {
    id: (json.id as string) || '',
    rfqNumber: (json.rfqNumber as string) || (json.rfq_number as string) || '',
    clientName: (json.clientName as string) || '',
    clientContact: (json.clientContact as string) || undefined,
    clientEmail: (json.clientEmail as string) || undefined,
    items,
    totalQuantity: Number(json.totalQuantity ?? json.total_quantity ?? 0),
    priority: (json.priority as RFQPriority) || 'medium',
    stage: (json.stage as RFQStage) || 'new',
    status: (json.status as RFQ['status']) || 'open',
    assignee,
    reporter,
    createdAt: json.createdAt ? new Date(json.createdAt as string).toISOString() : (json.created_at ? new Date(json.created_at as string).toISOString() : new Date().toISOString()),
    updatedAt: json.updatedAt ? new Date(json.updatedAt as string).toISOString() : (json.updated_at ? new Date(json.updated_at as string).toISOString() : new Date().toISOString()),
    lastActivityAt: json.lastActivityAt ? new Date(json.lastActivityAt as string).toISOString() : (json.last_activity_at ? new Date(json.last_activity_at as string).toISOString() : new Date().toISOString()),
    dueDate: json.dueDate ? new Date(json.dueDate as string).toISOString() : (json.due_date ? new Date(json.due_date as string).toISOString() : undefined),
    slaDeadline: json.slaDeadline ? new Date(json.slaDeadline as string).toISOString() : (json.sla_deadline ? new Date(json.sla_deadline as string).toISOString() : undefined),
    slaStatus: (json.slaStatus as SLAStatus) || (json.sla_status as SLAStatus) || 'no_sla',
    unreadUpdates: Number(unreadUpdates ?? json.unread_updates ?? 0),
    aiVendorMatchCount: recommendations.length,
    aiConfidence: Number(json.aiConfidenceScore ?? json.ai_confidence_score ?? 0),
    deliveryLocation: (json.deliveryLocation as string) || (json.delivery_location as string) || '',
    tags,
    notes: (json.notes as string) || undefined,
    timeline: timeline || [],
    documents,
    requirements,
    vendorRecommendations: recommendations,
    quotations,
    selectedVendorId: (json.selectedVendorId as string) || (json.selected_vendor_id as string) || null,
    acceptedQuoteId: (json.acceptedQuoteId as string) || (json.accepted_quote_id as string) || null,
    metadata: metadata || {},
  }
}

export function mapRfqSummaryRowToRFQ(row: Record<string, unknown>): RFQ {
  return {
    id: row.id as string,
    rfqNumber: row.rfq_number as string,
    clientName: row.client_name as string,
    clientContact: undefined,
    clientEmail: undefined,
    items: [],
    totalQuantity: Number(row.total_quantity ?? 0),
    priority: (row.priority as RFQPriority) || 'medium',
    stage: (row.stage as RFQStage) || 'new',
    status: (row.status as RFQ['status']) || 'open',
    reporter: {
      id: (row.reporter_id as string) || '',
      name: (row.reporter_name as string) || 'Unknown',
      email: '',
      role: 'operator',
      status: 'offline',
      lastActive: new Date().toISOString(),
    },
    assignee: row.assignee_name
      ? {
          id: (row.assignee_id as string) || '',
          name: row.assignee_name as string,
          email: '',
          role: 'operator',
          status: 'offline',
          lastActive: new Date().toISOString(),
        }
      : undefined,
    createdAt: row.created_at ? new Date(row.created_at as string).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at as string).toISOString() : new Date().toISOString(),
    lastActivityAt: row.last_activity_at ? new Date(row.last_activity_at as string).toISOString() : new Date().toISOString(),
    slaStatus: (row.sla_status as SLAStatus) || 'no_sla',
    slaDeadline: row.sla_deadline ? new Date(row.sla_deadline as string).toISOString() : undefined,
    unreadUpdates: Number(row.unread_updates ?? 0),
    aiVendorMatchCount: Number(row.recommendation_count ?? 0),
    aiConfidence: Number(row.ai_confidence_score ?? 0),
    deliveryLocation: (row.delivery_location as string) || '',
    tags: [],
    timeline: [],
    documents: [],
    requirements: [],
    vendorRecommendations: [],
    quotations: [],
    selectedVendorId: (row.selected_vendor_id as string) || null,
    acceptedQuoteId: (row.accepted_quote_id as string) || null,
    metadata: {},
  }
}
