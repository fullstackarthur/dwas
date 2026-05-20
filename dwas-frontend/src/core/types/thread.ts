import type { User } from '../../core/types'

export interface TimelineEvent {
  id: string
  threadId: string
  type: 'human_activity' | 'ai_activity' | 'system_event' | 'workflow_transition' | 'approval_event' | 'dispatch_event' | 'document_event'
  timestamp: string
  author?: User
  title: string
  description?: string
  metadata?: Record<string, string | number | boolean>
  relatedId?: string
  aiGenerated?: boolean
  confidence?: number
}

export interface ApprovalStep {
  id: string
  title: string
  approver: User
  status: 'pending' | 'approved' | 'rejected' | 'skipped'
  requestedAt: string
  respondedAt?: string
  comment?: string
  amount?: number
}

export interface DispatchInfo {
  id: string
  poNumber: string
  material: string
  weight: string
  destination: string
  vehicleNumber?: string
  driverName?: string
  status: 'pending' | 'loading' | 'in_transit' | 'delivered' | 'delayed'
  dispatchedAt?: string
  eta?: string
  actualDelivery?: string
  gatePassNumber?: string
}

export interface VendorQuotation {
  id: string
  vendorName: string
  submittedAt: string
  pricing: number
  currency: string
  leadTime: string
  validityDays: number
  terms?: string
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'counter_offered'
  counterOffer?: number
  documents?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: 'pdf' | 'image' | 'excel' | 'doc' | 'other'
  size: number
  uploadedAt: string
  uploadedBy: User
  url?: string
  ocrExtracted?: boolean
  aiReviewed?: boolean
}

export interface SLAInfo {
  id: string
  label: string
  target: string
  deadline: string
  status: 'on_track' | 'at_risk' | 'breached' | 'met'
  remainingHours?: number
}

export interface RequirementDetail {
  id: string
  label: string
  value: string
  unit?: string
  source?: string
  confidence?: number
}

export interface FinancialEntry {
  id: string
  type: 'po_value' | 'payment' | 'invoice' | 'credit_note' | 'freight'
  amount: number
  currency: string
  status: 'pending' | 'processed' | 'overdue' | 'completed'
  dueDate?: string
  reference?: string
}

export interface OperationalNote {
  id: string
  content: string
  author: User
  createdAt: string
  isInternal: boolean
  tags?: string[]
}

export interface AIRecommendation {
  id: string
  type: 'vendor_suggestion' | 'transport_suggestion' | 'margin_estimation' | 'risk_alert' | 'workflow_suggestion' | 'followup_suggestion' | 'anomaly_alert' | 'executive_summary'
  confidence: number
  title: string
  description: string
  suggestedAction?: string
  alternatives?: string[]
  relatedItemId?: string
  createdAt: string
  dismissed?: boolean
}

export interface ParticipantEntry {
  user: User
  role: 'requester' | 'assignee' | 'approver' | 'vendor' | 'driver' | 'observer' | 'ai'
  joinedAt: string
  lastActive: string
  contributionCount: number
}

export interface WorkflowState {
  currentState: string
  history: { state: string; timestamp: string; triggeredBy?: string }[]
  availableTransitions: { target: string; label: string; requiresApproval?: boolean }[]
}
