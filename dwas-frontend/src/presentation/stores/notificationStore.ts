import { create } from 'zustand'
import type { User, QueueType } from '../../core/types'
import { mockUsers } from '../../data/mock'

interface OperationalNotification {
  id: string
  type: 'critical' | 'warning' | 'normal' | 'low'
  category: string
  title: string
  message: string
  createdAt: string
  read: boolean
  sourceUser?: User
  relatedItemId?: string
  relatedQueueType?: QueueType
}

interface AssignmentEvent {
  id: string
  itemId: string
  itemTitle: string
  assignedBy: User
  assignedTo: User
  queueType: QueueType
  timestamp: string
  reason?: string
}

interface AuditEntry {
  id: string
  action: string
  actor: User
  target: string
  targetType: string
  timestamp: string
  oldValue?: string
  newValue?: string
  details?: string
}

export const mockOperationalNotifications: OperationalNotification[] = [
  {
    id: 'rn-1',
    type: 'critical',
    category: 'dispatch',
    title: 'Dispatch delayed - PO#48283',
    message: 'Vehicle breakdown on NH48. Delivery delayed by 6+ hours. Replacement arranged.',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    read: false,
    sourceUser: mockUsers[3],
    relatedItemId: 'qi-3',
    relatedQueueType: 'logistics',
  },
  {
    id: 'rn-2',
    type: 'warning',
    category: 'sla',
    title: 'SLA at risk - SAIL quotation',
    message: 'Response deadline in 4 hours. No response received from SAIL.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    relatedQueueType: 'procurement',
  },
  {
    id: 'rn-3',
    type: 'normal',
    category: 'assignment',
    title: 'Assigned to you - PO#48295 dispatch',
    message: 'GI Pipe dispatch to Essar Surat has been assigned to you.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    sourceUser: mockUsers[1],
    relatedItemId: 'qi-9',
    relatedQueueType: 'dispatch',
  },
  {
    id: 'rn-4',
    type: 'normal',
    category: 'approval',
    title: 'Approval requested - Re-route SH-9921',
    message: 'Priya Sharma has requested your approval for shipment re-route.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    sourceUser: mockUsers[1],
    relatedQueueType: 'logistics',
  },
  {
    id: 'rn-5',
    type: 'low',
    category: 'ai',
    title: 'AI review completed - PO#48287',
    message: 'Dispatch documentation validated. All fields complete.',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    read: true,
    relatedQueueType: 'ai_review',
  },
  {
    id: 'rn-6',
    type: 'warning',
    category: 'escalation',
    title: 'Escalation raised - Essar payment',
    message: 'Payment escalation raised. 18.4L overdue by 12 days.',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    read: true,
    sourceUser: mockUsers[1],
    relatedQueueType: 'escalations',
  },
  {
    id: 'rn-7',
    type: 'low',
    category: 'system',
    title: 'Queue sync completed',
    message: 'All operational queues synchronized. 8 active items.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    read: false,
  },
  {
    id: 'rn-8',
    type: 'normal',
    category: 'vendor',
    title: 'Vendor response received - JSW Steel',
    message: 'JSW Steel submitted quotation for HRC November contract.',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    read: true,
    relatedQueueType: 'procurement',
  },
]

export const mockAssignmentEvents: AssignmentEvent[] = [
  {
    id: 'ae-1',
    itemId: 'qi-1',
    itemTitle: 'Steel coil dispatch - PO#48291',
    assignedBy: mockUsers[0],
    assignedTo: mockUsers[1],
    queueType: 'dispatch',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    reason: 'Transport coordination required',
  },
  {
    id: 'ae-2',
    itemId: 'qi-3',
    itemTitle: 'Transport allocation - Vizag port',
    assignedBy: mockUsers[1],
    assignedTo: mockUsers[3],
    queueType: 'logistics',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'ae-3',
    itemId: 'qi-6',
    itemTitle: 'Escalation - Essar payment',
    assignedBy: mockUsers[1],
    assignedTo: mockUsers[0],
    queueType: 'escalations',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    reason: 'Management approval required',
  },
]

export const mockAuditEntries: AuditEntry[] = [
  { id: 'au-1', action: 'Status changed', actor: mockUsers[1], target: 'PO#48291 dispatch', targetType: 'queue_item', timestamp: new Date(Date.now() - 3600000).toISOString(), oldValue: 'in_progress', newValue: 'in_transit' },
  { id: 'au-2', action: 'Priority changed', actor: mockUsers[0], target: 'Essar escalation', targetType: 'queue_item', timestamp: new Date(Date.now() - 10800000).toISOString(), oldValue: 'high', newValue: 'critical' },
  { id: 'au-3', action: 'Approval granted', actor: mockUsers[0], target: 'PO#48291 dispatch', targetType: 'approval', timestamp: new Date(Date.now() - 6500000).toISOString(), details: 'Dispatch approval granted' },
  { id: 'au-4', action: 'Assigned', actor: mockUsers[0], target: 'PO#48291 dispatch', targetType: 'queue_item', timestamp: new Date(Date.now() - 7200000).toISOString(), oldValue: 'Unassigned', newValue: 'Priya Sharma' },
  { id: 'au-5', action: 'Created', actor: mockUsers[2], target: 'PO#48291 procurement request', targetType: 'queue_item', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'au-6', action: 'Comment added', actor: mockUsers[5], target: 'PO#48291 thread', targetType: 'thread', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'AI review completed' },
  { id: 'au-7', action: 'Document uploaded', actor: mockUsers[1], target: 'Gate pass GP-48291-001', targetType: 'dispatch', timestamp: new Date(Date.now() - 1800000).toISOString() },
]

interface NotificationStore {
  notifications: OperationalNotification[]
  unreadCount: number
  criticalCount: number
  warningCount: number
  setNotifications: (notifications: OperationalNotification[]) => void
  addNotification: (notification: OperationalNotification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismiss: (id: string) => void
  getUnreadByCategory: (category: string) => OperationalNotification[]
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: mockOperationalNotifications,
  unreadCount: mockOperationalNotifications.filter((n) => !n.read).length,
  criticalCount: mockOperationalNotifications.filter((n) => n.type === 'critical' && !n.read).length,
  warningCount: mockOperationalNotifications.filter((n) => n.type === 'warning' && !n.read).length,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      criticalCount: notifications.filter((n) => n.type === 'critical' && !n.read).length,
      warningCount: notifications.filter((n) => n.type === 'warning' && !n.read).length,
    }),
  addNotification: (notification) =>
    set((s) => {
      const updated = [notification, ...s.notifications]
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
        criticalCount: updated.filter((n) => n.type === 'critical' && !n.read).length,
        warningCount: updated.filter((n) => n.type === 'warning' && !n.read).length,
      }
    }),
  markAsRead: (id) =>
    set((s) => {
      const updated = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
        criticalCount: updated.filter((n) => n.type === 'critical' && !n.read).length,
        warningCount: updated.filter((n) => n.type === 'warning' && !n.read).length,
      }
    }),
  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
      criticalCount: 0,
      warningCount: 0,
    })),
  dismiss: (id) =>
    set((s) => {
      const updated = s.notifications.filter((n) => n.id !== id)
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
        criticalCount: updated.filter((n) => n.type === 'critical' && !n.read).length,
        warningCount: updated.filter((n) => n.type === 'warning' && !n.read).length,
      }
    }),
  getUnreadByCategory: (category) => {
    const { notifications } = get()
    return notifications.filter((n) => n.category === category && !n.read)
  },
}))

interface CollaborationStore {
  assignmentEvents: AssignmentEvent[]
  auditEntries: AuditEntry[]
  typingUsers: Record<string, string>
  setAssignmentEvents: (events: AssignmentEvent[]) => void
  addAssignmentEvent: (event: AssignmentEvent) => void
  setAuditEntries: (entries: AuditEntry[]) => void
  addAuditEntry: (entry: AuditEntry) => void
  setTypingUser: (userId: string, threadId: string) => void
  removeTypingUser: (userId: string) => void
  getTypingInThread: (threadId: string) => string[]
}

export const useCollaborationStore = create<CollaborationStore>((set, get) => ({
  assignmentEvents: mockAssignmentEvents,
  auditEntries: mockAuditEntries,
  typingUsers: {},
  setAssignmentEvents: (events) => set({ assignmentEvents: events }),
  addAssignmentEvent: (event) =>
    set((s) => ({ assignmentEvents: [event, ...s.assignmentEvents] })),
  setAuditEntries: (entries) => set({ auditEntries: entries }),
  addAuditEntry: (entry) =>
    set((s) => ({ auditEntries: [entry, ...s.auditEntries] })),
  setTypingUser: (userId, threadId) =>
    set((s) => ({
      typingUsers: { ...s.typingUsers, [userId]: threadId },
    })),
  removeTypingUser: (userId) =>
    set((s) => {
      const users = { ...s.typingUsers }
      delete users[userId]
      return { typingUsers: users }
    }),
  getTypingInThread: (threadId) => {
    const { typingUsers } = get()
    return Object.entries(typingUsers)
      .filter(([, tid]) => tid === threadId)
      .map(([uid]) => uid)
  },
}))
