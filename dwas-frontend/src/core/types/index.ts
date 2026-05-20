export type Priority = 'critical' | 'high' | 'medium' | 'low' | 'none'

export type Status =
  | 'open'
  | 'in_progress'
  | 'awaiting_review'
  | 'awaiting_approval'
  | 'resolved'
  | 'closed'
  | 'cancelled'

export type QueueType =
  | 'dispatch'
  | 'procurement'
  | 'vendor_communication'
  | 'logistics'
  | 'ai_review'
  | 'escalations'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'viewer' | 'dispatcher' | 'procurement_lead'
  avatarUrl?: string
  status: 'online' | 'away' | 'offline' | 'busy'
  lastActive: string
}

export interface QueueItem {
  id: string
  title: string
  type: QueueType
  priority: Priority
  status: Status
  assignee?: User
  reporter: User
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags: string[]
  metadata: Record<string, string | number | boolean>
  threadId?: string
}

export interface Thread {
  id: string
  subject: string
  queueType: QueueType
  status: Status
  priority: Priority
  participants: User[]
  messages: ThreadMessage[]
  createdAt: string
  updatedAt: string
  lastActivity: string
  queueItemId?: string
  metadata: Record<string, string | number | boolean>
}

export interface ThreadMessage {
  id: string
  threadId: string
  author: User
  content: string
  createdAt: string
  isAiGenerated: boolean
  attachments?: Attachment[]
  reactions?: ThreadReaction[]
}

export interface Attachment {
  id: string
  name: string
  size: number
  mimeType: string
  url: string
}

export interface ThreadReaction {
  userId: string
  emoji: string
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success' | 'system'
  title: string
  message: string
  createdAt: string
  read: boolean
  actionUrl?: string
  source?: string
}

export interface AIRecommendation {
  id: string
  type: 'priority_adjustment' | 'routing_suggestion' | 'risk_alert' | 'summary' | 'action_item'
  confidence: number
  title: string
  description: string
  suggestedAction?: string
  relatedItemId?: string
  createdAt: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: number | string
  delta?: number
  trend?: 'up' | 'down' | 'stable'
  unit?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
  active?: boolean
}

export type PanelType =
  | 'queue'
  | 'thread'
  | 'detail'
  | 'ai'
  | 'metadata'
  | 'activity'
  | 'notification'
  | 'dashboard'
  | 'dispatch'
  | 'settings'

export type {
  VendorResponse,
  ApprovalRequest,
  DispatchRecord,
  TransportRecord,
  OperationalEvent,
  WorkloadEntry,
  OperationalHealthMetric,
  EscalationRecord,
  TallyRecord,
  DriverUpdate,
  RFQRecord,
  InboxItem,
} from './operational'

export type {
  TimelineEvent,
  ApprovalStep,
  DispatchInfo,
  VendorQuotation,
  SLAInfo,
  RequirementDetail,
  FinancialEntry,
  OperationalNote,
  AIRecommendation as WorkspaceAIRecommendation,
  ParticipantEntry,
  WorkflowState,
} from './thread'

export type { Attachment as ThreadAttachment } from './thread'

export type {
  RealtimeEvent,
  RealtimeEventType,
  PresenceState,
  OperationalNotification,
  AssignmentEvent,
  AuditEntry,
  SyncState,
} from './realtime'

export type {
  CommandDefinition,
  SearchFilter,
  SearchResult,
  WorkspacePanel,
  WorkspaceState,
  OfflineQueueItem,
  PWAState,
} from './command'
