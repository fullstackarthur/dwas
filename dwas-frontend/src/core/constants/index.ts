export const APP_NAME = 'DWAS'
export const APP_FULL_NAME = 'Dynamic Workflow Augmentation System'

export const ROUTES = {
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  OPERATIONS: {
    RFQ_DESK: '/operations/rfq-desk',
    VENDOR_COORDINATION: '/operations/vendor-coordination',
    CLIENT_QUOTATIONS: '/operations/client-quotations',
    PURCHASE_ORDERS: '/operations/purchase-orders',
    LOGISTICS: '/operations/logistics',
    DISPATCH_TRACKING: '/operations/dispatch-tracking',
    DELIVERIES: '/operations/deliveries',
    PAYMENTS_TALLY: '/operations/payments-tally',
  },
} as const

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
  CLOSE_PANEL: 'escape',
  RELOAD: 'r',
} as const

export const SYNC_INTERVAL_MS = 30000
export const AI_RESPONSE_TIMEOUT_MS = 15000
export const NOTIFICATION_AUTO_DISMISS_MS = 5000
