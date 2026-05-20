export const APP_NAME = 'DWAS'
export const APP_FULL_NAME = 'Dynamic Workflow Augmentation System'

export const ROUTES = {
  DASHBOARD: '/dashboard',
  INBOX: '/inbox',
  QUEUES: '/queues',
  QUEUES_DETAIL: '/queues/:queueId',
  THREADS: '/threads',
  THREAD_DETAIL: '/threads/:threadId',
  DISPATCH: '/dispatch',
  AI_ASSISTANT: '/ai',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const

export const QUEUE_LABELS: Record<string, string> = {
  dispatch: 'Dispatch Queue',
  procurement: 'Procurement Queue',
  vendor_communication: 'Vendor Communication',
  logistics: 'Logistics Queue',
  ai_review: 'AI Review Queue',
  escalations: 'Escalations',
}

export const PRIORITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
}

export const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  awaiting_review: 'Awaiting Review',
  awaiting_approval: 'Awaiting Approval',
  resolved: 'Resolved',
  closed: 'Closed',
  cancelled: 'Cancelled',
}

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_SIDEBAR: 'ctrl+b',
  OPEN_COMMAND_PALETTE: 'ctrl+k',
  OPEN_SEARCH: 'ctrl+/',
  NEXT_QUEUE_ITEM: 'j',
  PREV_QUEUE_ITEM: 'k',
  OPEN_ITEM: 'enter',
  CLOSE_PANEL: 'escape',
  MARK_READ: 'm',
  ASSIGN_TO_ME: 'i',
  NEW_THREAD: 'n',
  RELOAD: 'r',
} as const

export const SYNC_INTERVAL_MS = 30000
export const AI_RESPONSE_TIMEOUT_MS = 15000
export const NOTIFICATION_AUTO_DISMISS_MS = 5000
