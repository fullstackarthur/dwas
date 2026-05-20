import type { User } from '../../core/types'

export interface VendorResponse {
  id: string
  vendorName: string
  rfqId: string
  rfqTitle: string
  submittedAt: string
  status: 'submitted' | 'pending' | 'overdue' | 'declined'
  pricing?: number
  currency?: string
  leadTime?: string
  message?: string
}

export interface ApprovalRequest {
  id: string
  title: string
  type: 'po' | 'dispatch' | 'payment' | 'contract' | 'reroute'
  requester: User
  requestedAt: string
  amount?: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'approved' | 'rejected'
  dueDate?: string
  description?: string
}

export interface DispatchRecord {
  id: string
  poNumber: string
  destination: string
  vehicleNumber: string
  driverName: string
  material: string
  weight: string
  status: 'loading' | 'in_transit' | 'delivered' | 'delayed' | 'returned'
  dispatchedAt: string
  eta?: string
  actualDelivery?: string
  delayReason?: string
}

export interface TransportRecord {
  id: string
  vehicleNumber: string
  driverName: string
  route: string
  status: 'available' | 'en_route' | 'loading' | 'maintenance' | 'offline'
  currentLoad?: string
  destination?: string
  eta?: string
  lastUpdate: string
}

export interface OperationalEvent {
  id: string
  type: 'dispatch' | 'procurement' | 'escalation' | 'approval' | 'ai_review' | 'system'
  title: string
  description: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical'
  source?: string
  relatedId?: string
}

export interface WorkloadEntry {
  userId: string
  userName: string
  activeItems: number
  completedToday: number
  overdueItems: number
  status: 'online' | 'away' | 'offline' | 'busy'
}

export interface OperationalHealthMetric {
  id: string
  label: string
  status: 'healthy' | 'degraded' | 'critical'
  value?: string
  detail?: string
}

export interface EscalationRecord {
  id: string
  title: string
  reason: string
  raisedBy: User
  raisedAt: string
  priority: 'critical' | 'high' | 'medium'
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  assignedTo?: User
  relatedItemId?: string
  slaDeadline?: string
}

export interface TallyRecord {
  id: string
  poNumber: string
  material: string
  expectedWeight: string
  actualWeight: string
  discrepancy: string
  status: 'matched' | 'discrepancy' | 'pending'
  recordedAt: string
  recordedBy: string
}

export interface DriverUpdate {
  id: string
  driverName: string
  vehicleNumber: string
  updateType: 'location' | 'delay' | 'arrival' | 'departure' | 'issue'
  message: string
  timestamp: string
  location?: string
  relatedDispatchId?: string
}

export interface RFQRecord {
  id: string
  title: string
  material: string
  quantity: string
  vendorCount: number
  responseCount: number
  status: 'open' | 'closing_soon' | 'closed' | 'awarded'
  deadline: string
  createdAt: string
}

export interface InboxItem {
  id: string
  type: 'queue_item' | 'thread' | 'approval' | 'dispatch_alert' | 'vendor_response' | 'ai_insight' | 'escalation'
  title: string
  description?: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: string
  createdAt: string
  updatedAt: string
  assignee?: User
  queueType?: string
  relatedId?: string
  read: boolean
  metadata?: Record<string, string | number | boolean>
}
