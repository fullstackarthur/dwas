import type { User } from './index'

export type RFQStage =
  | 'new'
  | 'requirements_extraction'
  | 'vendor_sourcing'
  | 'vendor_coordination'
  | 'quotation_received'
  | 'quotation_review'
  | 'client_presentation'
  | 'negotiation'
  | 'order_confirmation'
  | 'po_generated'
  | 'closed'
  | 'cancelled'

export type RFQPriority = 'critical' | 'high' | 'medium' | 'low'

export interface ClientDetails {
  name: string
  contactName?: string
  email?: string
  phone?: string
  city?: string
}

export type SLAStatus = 'on_track' | 'at_risk' | 'breached' | 'no_sla'

export type AIVendorMatchConfidence = 'high' | 'medium' | 'low'

export interface RFQItem {
  id: string
  rfqId: string
  materialDescription: string
  quantity: number
  unit: string
  specifications?: Record<string, string>
  requiredDate?: string
  deliveryLocation?: string
}

export type VendorQuoteStatus = 'draft' | 'submitted' | 'accepted' | 'rejected' | 'counter_offered' | 'expired'

export interface VendorQuote {
  id: string
  vendorId: string
  vendorName: string
  rfqId: string
  pricePerUnit: number
  totalPrice: number
  currency: string
  validUntil: string
  deliveryDate: string
  paymentTerms: string
  notes?: string
  status: VendorQuoteStatus
  counterOfferPrice?: number
  counterOfferNotes?: string
  createdAt: string
}

export interface RFQTimelineEvent {
  id: string
  rfqId: string
  type: 'human' | 'ai' | 'system' | 'workflow_transition'
  title: string
  description?: string
  actor?: User
  timestamp: string
  metadata?: Record<string, string | number | boolean>
  previousStage?: RFQStage
  newStage?: RFQStage
}

export interface RFQDocument {
  id: string
  rfqId: string
  name: string
  type: 'pdf' | 'image' | 'excel' | 'word' | 'other'
  size: number
  url: string
  uploadedBy?: User
  uploadedAt: string
  ocrProcessed: boolean
  ocrConfidence?: number
  extractedRequirements?: string[]
}

export interface AIVendorRecommendation {
  id: string
  rfqId: string
  vendorId: string
  vendorName: string
  vendorLocation: string
  score: number
  confidence: AIVendorMatchConfidence
  matchReasons: string[]
  historicalPerformance?: {
    onTimeDeliveryRate: number
    qualityScore: number
    responseRate: number
    averageLeadTime: number
  }
  pricingHistory?: {
    averagePrice: number
    marketAverage: number
    competitivenessScore: number
  }
  regionCompatibility: 'exact' | 'near' | 'remote'
  suggestedContacts?: string[]
  isSelected: boolean
}

export interface RFQRequirement {
  id: string
  rfqId: string
  category: 'material' | 'quantity' | 'delivery' | 'quality' | 'certification' | 'other'
  label: string
  value: string
  confidence: number
  sourceDocumentId?: string
  validationStatus: 'valid' | 'uncertain' | 'missing' | 'invalid'
}

export interface RFQ {
  id: string
  rfqNumber: string
  clientId?: string
  clientName: string
  clientContact?: string
  clientEmail?: string
  items: RFQItem[]
  totalQuantity: number
  priority: RFQPriority
  stage: RFQStage
  status: 'open' | 'in_progress' | 'awaiting_response' | 'quoted' | 'won' | 'lost' | 'cancelled'
  assignee?: User
  reporter: User
  createdAt: string
  updatedAt: string
  lastActivityAt: string
  dueDate?: string
  slaDeadline?: string
  slaStatus: SLAStatus
  unreadUpdates: number
  aiVendorMatchCount: number
  aiConfidence: number
  deliveryLocation: string
  tags: string[]
  notes?: string
  timeline: RFQTimelineEvent[]
  documents: RFQDocument[]
  requirements: RFQRequirement[]
  vendorRecommendations: AIVendorRecommendation[]
  quotations: VendorQuote[]
  selectedVendorId: string | null
  acceptedQuoteId: string | null
  metadata: Record<string, string | number | boolean>
}

export interface RFQFilter {
  stage?: RFQStage[]
  priority?: RFQPriority[]
  status?: RFQ['status'][]
  assigneeId?: string
  slaStatus?: SLAStatus[]
  searchQuery?: string
  dateRange?: {
    start: string
    end: string
  }
}

export interface RFQDeskState {
  rfqs: RFQ[]
  selectedRfqId: string | null
  filters: RFQFilter
  queueRailCollapsed: boolean
  loading: boolean
  realtimeConnected: boolean
  setRfqs: (rfqs: RFQ[]) => void
  selectRfq: (id: string | null) => void
  setFilters: (filters: Partial<RFQFilter>) => void
  clearFilters: () => void
  toggleQueueRail: () => void
  setLoading: (loading: boolean) => void
  markAsRead: (rfqId: string) => void
  updateRfqStage: (rfqId: string, stage: RFQStage) => void
  selectVendor: (rfqId: string, vendorRecommendationId: string) => Promise<void>
  acceptQuote: (rfqId: string, quoteId: string) => Promise<void>
  rejectQuote: (rfqId: string, quoteId: string) => Promise<void>
  sendToVendor: (rfqId: string, vendorId: string) => Promise<void>
  updateClientDetails: (rfqId: string, data: ClientDetails) => Promise<void>
  getSelectedRfq: () => RFQ | undefined
  getFilteredRfqs: () => RFQ[]
}

export interface OperationalFilterOption {
  id: string
  label: string
  count: number
  color?: string
}