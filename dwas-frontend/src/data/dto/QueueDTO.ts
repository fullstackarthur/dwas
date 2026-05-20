import type { QueueItem } from '../../core/types'

export interface QueueItemDTO {
  id: string
  title: string
  type: QueueItem['type']
  priority: QueueItem['priority']
  status: QueueItem['status']
  assigneeId?: string
  reporterId: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags: string[]
  metadata: Record<string, string | number | boolean>
  threadId?: string
}

export interface CreateQueueItemDTO {
  title: string
  type: QueueItem['type']
  priority: QueueItem['priority']
  reporterId: string
  assigneeId?: string
  dueDate?: string
  tags?: string[]
  metadata?: Record<string, string | number | boolean>
  threadId?: string
}

export interface UpdateQueueItemDTO {
  title?: string
  priority?: QueueItem['priority']
  status?: QueueItem['status']
  assigneeId?: string
  dueDate?: string
  tags?: string[]
  metadata?: Record<string, string | number | boolean>
}

export interface QueueFilterDTO {
  queueType?: string
  priority?: string
  status?: string
  assigneeId?: string
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'dueDate'
  sortOrder?: 'asc' | 'desc'
}
