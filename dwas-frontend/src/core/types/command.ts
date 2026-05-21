export interface CommandDefinition {
  id: string
  label: string
  description?: string
  section: string
  icon?: string
  shortcut?: string
  action: () => void
  requiresSelection?: boolean
  keywords?: string[]
}

export interface SearchFilter {
  type?: string
  queueType?: string
  status?: string
  priority?: string
  dateRange?: { from: string; to: string }
  assignee?: string
}

export interface SearchResult {
  id: string
  type: 'queue_item' | 'thread' | 'document' | 'vendor' | 'driver' | 'dispatch' | 'user' | 'event'
  title: string
  subtitle?: string
  metadata?: Record<string, string | number | boolean>
  priority?: string
  status?: string
  score?: number
  relatedId?: string
}

export interface OfflineQueueItem {
  id: string
  type: string
  payload: Record<string, unknown>
  timestamp: string
  status: 'pending' | 'syncing' | 'synced' | 'failed'
  retryCount: number
}

export interface PWAState {
  isOnline: boolean
  isInstalled: boolean
  lastSyncAt: string
  pendingSyncCount: number
  cacheVersion: string
}
