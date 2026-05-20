import type { User } from '../../core/types'
import { mockUsers } from './index'

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

export const mockTimelineEvents: TimelineEvent[] = [
  { id: 'te-1', threadId: 'th-1', type: 'human_activity', timestamp: new Date(Date.now() - 7200000).toISOString(), author: mockUsers[2], title: 'Created procurement request', description: 'Submitted requirement for 24.5 MT HR Coil from Tata Steel for JSW Nagarjuna dispatch.', metadata: { poNumber: 'PO#48291', material: 'HR Coil', quantity: '24.5 MT' } },
  { id: 'te-2', threadId: 'th-1', type: 'system_event', timestamp: new Date(Date.now() - 7100000).toISOString(), title: 'Thread auto-created', description: 'Operational thread created from procurement request. Queue: Dispatch, Priority: Critical.', metadata: { queueType: 'dispatch', priority: 'critical' } },
  { id: 'te-3', threadId: 'th-1', type: 'ai_activity', timestamp: new Date(Date.now() - 7000000).toISOString(), title: 'AI vendor matching completed', description: 'Matched 3 potential vendors based on material grade, quantity, and delivery location. Tata Steel recommended with 94% confidence.', metadata: { vendorCount: 3, topVendor: 'Tata Steel', confidence: 0.94 }, aiGenerated: true, confidence: 0.94 },
  { id: 'te-4', threadId: 'th-1', type: 'human_activity', timestamp: new Date(Date.now() - 6800000).toISOString(), author: mockUsers[1], title: 'Assigned transport allocation', description: 'Allocated 3 trucks for dispatch. Route: Plant to JSW Nagarjuna (320 km).', metadata: { truckCount: 3, route: 'Plant-Nagarjuna', distance: '320 km' } },
  { id: 'te-5', threadId: 'th-1', type: 'approval_event', timestamp: new Date(Date.now() - 6500000).toISOString(), author: mockUsers[0], title: 'Dispatch approval granted', description: 'Approved dispatch for PO#48291. Gate pass authorized.', metadata: { poNumber: 'PO#48291', approvalType: 'dispatch' } },
  { id: 'te-6', threadId: 'th-1', type: 'dispatch_event', timestamp: new Date(Date.now() - 5400000).toISOString(), author: mockUsers[1], title: 'Loading started at Gate 3', description: '24.5 MT HR Coil loading initiated. Vehicle AP-28-B-4521 assigned.', metadata: { gate: 'Gate 3', vehicleNumber: 'AP-28-B-4521', material: 'HR Coil' } },
  { id: 'te-7', threadId: 'th-1', type: 'ai_activity', timestamp: new Date(Date.now() - 5000000).toISOString(), title: 'AI documentation review completed', description: 'All dispatch documents validated. Weight certificate, quality certificate, and gate pass verified. No discrepancies found.', metadata: { documentsChecked: 3, discrepancies: 0 }, aiGenerated: true, confidence: 0.97 },
  { id: 'te-8', threadId: 'th-1', type: 'dispatch_event', timestamp: new Date(Date.now() - 3600000).toISOString(), author: mockUsers[1], title: 'Vehicle departed', description: 'AP-28-B-4521 departed for JSW Nagarjuna. ETA: Tomorrow 14:00.', metadata: { vehicleNumber: 'AP-28-B-4521', destination: 'JSW Nagarjuna' } },
  { id: 'te-9', threadId: 'th-1', type: 'workflow_transition', timestamp: new Date(Date.now() - 3600000).toISOString(), title: 'Status changed: In Progress → In Transit', description: 'Thread status updated based on dispatch departure event.', metadata: { from: 'in_progress', to: 'in_transit' } },
  { id: 'te-10', threadId: 'th-1', type: 'document_event', timestamp: new Date(Date.now() - 1800000).toISOString(), author: mockUsers[1], title: 'Gate pass uploaded', description: 'Gate pass #GP-48291-001 uploaded and attached to thread.', metadata: { documentType: 'gate_pass', documentNumber: 'GP-48291-001' } },
]

export const mockApprovalSteps: ApprovalStep[] = [
  { id: 'as-1', title: 'Dispatch Authorization', approver: mockUsers[0], status: 'approved', requestedAt: new Date(Date.now() - 6500000).toISOString(), respondedAt: new Date(Date.now() - 6400000).toISOString(), comment: 'Approved. Ensure gate pass is generated before loading.' },
  { id: 'as-2', title: 'Weight Certificate Verification', approver: mockUsers[5], status: 'approved', requestedAt: new Date(Date.now() - 5400000).toISOString(), respondedAt: new Date(Date.now() - 5200000).toISOString(), comment: 'Weight matches PO. Certificate valid.' },
  { id: 'as-3', title: 'Quality Certificate Review', approver: mockUsers[5], status: 'approved', requestedAt: new Date(Date.now() - 5000000).toISOString(), respondedAt: new Date(Date.now() - 4800000).toISOString(), comment: 'AI-verified. All quality parameters within spec.' },
  { id: 'as-4', title: 'Final Delivery Confirmation', approver: mockUsers[0], status: 'pending', requestedAt: new Date(Date.now() - 1800000).toISOString() },
]

export const mockDispatchInfo: DispatchInfo[] = [
  { id: 'di-1', poNumber: 'PO#48291', material: 'HR Coil', weight: '24.5 MT', destination: 'JSW Nagarjuna', vehicleNumber: 'AP-28-B-4521', driverName: 'Ramesh Kumar', status: 'in_transit', dispatchedAt: new Date(Date.now() - 3600000).toISOString(), eta: new Date(Date.now() + 86400000).toISOString(), gatePassNumber: 'GP-48291-001' },
]

export const mockVendorQuotations: VendorQuotation[] = [
  { id: 'vq-1', vendorName: 'Tata Steel', submittedAt: new Date(Date.now() - 86400000).toISOString(), pricing: 52400, currency: 'INR/MT', leadTime: '7-10 days', validityDays: 15, terms: 'Payment within 30 days. Free delivery within 200km.', status: 'accepted' },
  { id: 'vq-2', vendorName: 'JSW Steel', submittedAt: new Date(Date.now() - 72000000).toISOString(), pricing: 51800, currency: 'INR/MT', leadTime: '5-7 days', validityDays: 10, terms: 'Advance payment required. Volume discount above 300 MT.', status: 'under_review', counterOffer: 51200 },
  { id: 'vq-3', vendorName: 'SAIL', submittedAt: new Date(Date.now() - 43200000).toISOString(), pricing: 53100, currency: 'INR/MT', leadTime: '10-14 days', validityDays: 20, status: 'rejected' },
]

export const mockAttachments: Attachment[] = [
  { id: 'att-1', name: 'PO#48291_Dispatch_Order.pdf', type: 'pdf', size: 245000, uploadedAt: new Date(Date.now() - 7200000).toISOString(), uploadedBy: mockUsers[2], ocrExtracted: true, aiReviewed: true },
  { id: 'att-2', name: 'Weight_Certificate_HR_Coil.pdf', type: 'pdf', size: 180000, uploadedAt: new Date(Date.now() - 5400000).toISOString(), uploadedBy: mockUsers[1], ocrExtracted: true, aiReviewed: true },
  { id: 'att-3', name: 'Quality_Certificate_Tata_Steel.pdf', type: 'pdf', size: 320000, uploadedAt: new Date(Date.now() - 5000000).toISOString(), uploadedBy: mockUsers[1], ocrExtracted: true, aiReviewed: true },
  { id: 'att-4', name: 'Gate_Pass_GP-48291-001.pdf', type: 'pdf', size: 95000, uploadedAt: new Date(Date.now() - 1800000).toISOString(), uploadedBy: mockUsers[1], ocrExtracted: false, aiReviewed: false },
  { id: 'att-5', name: 'Tata_Steel_Quotation.xlsx', type: 'excel', size: 52000, uploadedAt: new Date(Date.now() - 86400000).toISOString(), uploadedBy: mockUsers[2], ocrExtracted: false, aiReviewed: true },
]

export const mockSLAInfo: SLAInfo[] = [
  { id: 'sla-1', label: 'Dispatch Completion', target: '24 hours', deadline: new Date(Date.now() + 86400000).toISOString(), status: 'on_track', remainingHours: 22 },
  { id: 'sla-2', label: 'Documentation Review', target: '4 hours', deadline: new Date(Date.now() - 1800000).toISOString(), status: 'met' },
  { id: 'sla-3', label: 'Vendor Response', target: '48 hours', deadline: new Date(Date.now() + 172800000).toISOString(), status: 'on_track', remainingHours: 46 },
  { id: 'sla-4', label: 'Payment Processing', target: '7 days', deadline: new Date(Date.now() + 604800000).toISOString(), status: 'on_track', remainingHours: 166 },
]

export const mockRequirements: RequirementDetail[] = [
  { id: 'req-1', label: 'Material', value: 'HR Coil', source: 'PO#48291' },
  { id: 'req-2', label: 'Quantity', value: '24.5', unit: 'MT', source: 'PO#48291' },
  { id: 'req-3', label: 'Grade', value: 'IS 513 CR2', source: 'Specification Sheet', confidence: 0.95 },
  { id: 'req-4', label: 'Thickness', value: '2.5', unit: 'mm', source: 'OCR Extracted', confidence: 0.92 },
  { id: 'req-5', label: 'Width', value: '1250', unit: 'mm', source: 'OCR Extracted', confidence: 0.89 },
  { id: 'req-6', label: 'Destination', value: 'JSW Nagarjuna', source: 'PO#48291' },
  { id: 'req-7', label: 'Delivery Deadline', value: new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), source: 'PO#48291' },
]

export const mockFinancialEntries: FinancialEntry[] = [
  { id: 'fe-1', type: 'po_value', amount: 1284000, currency: 'INR', status: 'processed', reference: 'PO#48291' },
  { id: 'fe-2', type: 'freight', amount: 48500, currency: 'INR', status: 'pending', reference: 'Transport AP-28-B-4521' },
  { id: 'fe-3', type: 'invoice', amount: 1284000, currency: 'INR', status: 'pending', dueDate: new Date(Date.now() + 259200000).toISOString(), reference: 'INV-TATA-48291' },
]

export const mockOperationalNotes: OperationalNote[] = [
  { id: 'on-1', content: 'Buyer has requested delivery before 14:00. Coordinate with transport team for early morning loading.', author: mockUsers[2], createdAt: new Date(Date.now() - 7200000).toISOString(), isInternal: false, tags: ['delivery-time', 'coordination'] },
  { id: 'on-2', content: 'Quality certificate from Tata Steel shows minor deviation in carbon content (0.08% vs 0.10% spec). Within acceptable tolerance per IS 513.', author: mockUsers[5], createdAt: new Date(Date.now() - 5000000).toISOString(), isInternal: true, tags: ['quality', 'tolerance'] },
  { id: 'on-3', content: 'Gate 3 loading bay will be under maintenance tomorrow 06:00-08:00. Schedule loading before or after this window.', author: mockUsers[1], createdAt: new Date(Date.now() - 3600000).toISOString(), isInternal: false, tags: ['gate', 'maintenance'] },
]

export const mockAIRecommendations: AIRecommendation[] = [
  { id: 'air-1', type: 'vendor_suggestion', confidence: 0.94, title: 'Tata Steel recommended for HR Coil', description: 'Based on material grade match, proximity to destination, and historical delivery performance. Tata Steel has 98% on-time delivery rate for this route.', suggestedAction: 'Proceed with Tata Steel quotation', createdAt: new Date(Date.now() - 7000000).toISOString() },
  { id: 'air-2', type: 'transport_suggestion', confidence: 0.87, title: 'Route optimization via NH16', description: 'Current route via NH44 adds 45 minutes. NH16 route is faster and has better road conditions for heavy vehicles.', suggestedAction: 'Update route preference to NH16', alternatives: ['NH44 (current)', 'NH16 (recommended)', 'State Highway 23'], createdAt: new Date(Date.now() - 5400000).toISOString() },
  { id: 'air-3', type: 'margin_estimation', confidence: 0.82, title: 'Estimated margin: 8.2%', description: 'Based on current procurement price of ₹52,400/MT and buyer rate of ₹56,700/MT. After freight and handling costs, net margin is approximately 8.2%.', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'air-4', type: 'risk_alert', confidence: 0.91, title: 'Weather risk on NH16 route', description: 'Heavy rainfall forecast for coastal Andhra Pradesh tomorrow. May cause 2-3 hour delays on NH16 section between Vijayawada and Nuzvid.', suggestedAction: 'Consider dispatching tonight to avoid weather window', createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'air-5', type: 'followup_suggestion', confidence: 0.78, title: 'Follow up with JSW Nagarjuna on receiving bay availability', description: 'Previous deliveries to this location experienced 1-2 hour waiting time at receiving bay. Pre-coordination recommended.', suggestedAction: 'Send advance notification to JSW Nagarjuna receiving team', createdAt: new Date(Date.now() - 900000).toISOString() },
  { id: 'air-6', type: 'anomaly_alert', confidence: 0.85, title: 'Weight discrepancy detected', description: 'Tally weight (24.5 MT) matches PO but is 0.3 MT below the standard coil weight for this grade. Verify with supplier.', suggestedAction: 'Request weight verification from Tata Steel', createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: 'air-7', type: 'executive_summary', confidence: 0.96, title: 'Thread Summary: PO#48291 Dispatch', description: '24.5 MT HR Coil dispatch to JSW Nagarjuna. Vendor: Tata Steel (₹52,400/MT). Transport: 3 trucks allocated. Status: In transit. ETA: Tomorrow 14:00. All documents verified. Estimated margin: 8.2%. Risk: Weather delay on NH16.', createdAt: new Date(Date.now() - 300000).toISOString() },
]

export const mockParticipants: ParticipantEntry[] = [
  { user: mockUsers[2], role: 'requester', joinedAt: new Date(Date.now() - 7200000).toISOString(), lastActive: new Date(Date.now() - 7200000).toISOString(), contributionCount: 1 },
  { user: mockUsers[1], role: 'assignee', joinedAt: new Date(Date.now() - 6800000).toISOString(), lastActive: new Date(Date.now() - 1800000).toISOString(), contributionCount: 4 },
  { user: mockUsers[0], role: 'approver', joinedAt: new Date(Date.now() - 6500000).toISOString(), lastActive: new Date(Date.now() - 6400000).toISOString(), contributionCount: 1 },
  { user: mockUsers[5], role: 'ai', joinedAt: new Date(Date.now() - 7000000).toISOString(), lastActive: new Date(Date.now() - 600000).toISOString(), contributionCount: 3 },
  { user: mockUsers[3], role: 'observer', joinedAt: new Date(Date.now() - 5400000).toISOString(), lastActive: new Date(Date.now() - 5400000).toISOString(), contributionCount: 0 },
]

export const mockWorkflowState: WorkflowState = {
  currentState: 'in_transit',
  history: [
    { state: 'open', timestamp: new Date(Date.now() - 7200000).toISOString(), triggeredBy: 'Ravi Kumar' },
    { state: 'in_progress', timestamp: new Date(Date.now() - 6500000).toISOString(), triggeredBy: 'Arjun Mehta' },
    { state: 'in_transit', timestamp: new Date(Date.now() - 3600000).toISOString(), triggeredBy: 'Priya Sharma' },
  ],
  availableTransitions: [
    { target: 'delivered', label: 'Mark Delivered' },
    { target: 'delayed', label: 'Report Delay', requiresApproval: false },
    { target: 'awaiting_review', label: 'Send for Review', requiresApproval: true },
  ],
}
