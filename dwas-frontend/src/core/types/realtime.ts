import type { User } from '../../core/types'

export interface RealtimeEvent {
  id: string
  type: RealtimeEventType
  timestamp: string
  userId?: string
  user?: User
  payload: Record<string, unknown>
  queueType?: string
  itemId?: string
}

export type RealtimeEventType =
  | 'queue_item_created'
  | 'queue_item_updated'
  | 'queue_item_deleted'
  | 'queue_item_assigned'
  | 'queue_item_status_changed'
  | 'queue_item_priority_changed'
  | 'thread_created'
  | 'thread_message'
  | 'thread_status_changed'
  | 'approval_requested'
  | 'approval_responded'
  | 'dispatch_started'
  | 'dispatch_delayed'
  | 'dispatch_delivered'
  | 'escalation_raised'
  | 'escalation_resolved'
  | 'sla_warning'
  | 'sla_breached'
  | 'ai_recommendation'
  | 'ai_review_completed'
  | 'vendor_response'
  | 'user_joined'
  | 'user_left'
  | 'user_typing'
  | 'user_status_changed'
  | 'system_sync'
  | 'system_error'

export interface PresenceState {
  userId: string
  user: User
  status: 'online' | 'away' | 'busy' | 'offline'
  lastActive: string
  currentView?: string
  currentItemId?: string
  typingIn?: string
}

export interface OperationalNotification {
  id: string
  type: 'low' | 'normal' | 'warning' | 'critical'
  category: 'queue' | 'dispatch' | 'approval' | 'escalation' | 'sla' | 'ai' | 'system' | 'assignment' | 'procurement' | 'vendor'
  title: string
  message: string
  createdAt: string
  read: boolean
  actionUrl?: string
  sourceUserId?: string
  sourceUser?: User
  relatedItemId?: string
  relatedQueueType?: string
  metadata?: Record<string, string | number | boolean>
}

export interface AssignmentEvent {
  id: string
  itemId: string
  itemTitle: string
  assignedBy: User
  assignedTo: User
  queueType: string
  timestamp: string
  reason?: string
}

export interface AuditEntry {
  id: string
  action: string
  actor: User
  target: string
  targetType: 'queue_item' | 'thread' | 'approval' | 'dispatch' | 'vendor' | 'system'
  timestamp: string
  details?: string
  oldValue?: string
  newValue?: string
}

export interface SyncState {
  status: 'connected' | 'connecting' | 'disconnected' | 'error'
  lastSyncAt: string
  pendingEvents: number
  reconnectAttempts: number
  latency: number
}
