import { create } from 'zustand'
import type { User, QueueType } from '../../core/types'

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



export const mockOperationalNotifications: OperationalNotification[] = []



export const mockAssignmentEvents: AssignmentEvent[] = []

export const mockAuditEntries: AuditEntry[] = []

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
