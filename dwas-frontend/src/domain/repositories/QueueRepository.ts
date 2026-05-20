import type { QueueItem } from '../../core/types'

export interface IQueueRepository {
  getAll(): Promise<QueueItem[]>
  getById(id: string): Promise<QueueItem | undefined>
  getByType(type: string): Promise<QueueItem[]>
  create(item: Omit<QueueItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<QueueItem>
  update(id: string, updates: Partial<QueueItem>): Promise<QueueItem>
  delete(id: string): Promise<void>
  search(query: string): Promise<QueueItem[]>
}
