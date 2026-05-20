import type { QueueItem } from '../../core/types'
import type { IQueueRepository } from '../../domain/repositories/QueueRepository'
import { mockQueueItems } from '../mock'

export class MockQueueRepository implements IQueueRepository {
  private items: QueueItem[] = [...mockQueueItems]

  async getAll(): Promise<QueueItem[]> {
    await this.simulateDelay()
    return this.items
  }

  async getById(id: string): Promise<QueueItem | undefined> {
    await this.simulateDelay()
    return this.items.find((item) => item.id === id)
  }

  async getByType(type: string): Promise<QueueItem[]> {
    await this.simulateDelay()
    return this.items.filter((item) => item.type === type)
  }

  async create(item: Omit<QueueItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<QueueItem> {
    await this.simulateDelay()
    const now = new Date().toISOString()
    const newItem: QueueItem = {
      ...item,
      id: `qi-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    this.items.unshift(newItem)
    return newItem
  }

  async update(id: string, updates: Partial<QueueItem>): Promise<QueueItem> {
    await this.simulateDelay()
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error(`Queue item ${id} not found`)

    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.items[index]
  }

  async delete(id: string): Promise<void> {
    await this.simulateDelay()
    this.items = this.items.filter((item) => item.id !== id)
  }

  async search(query: string): Promise<QueueItem[]> {
    await this.simulateDelay()
    const lowerQuery = query.toLowerCase()
    return this.items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  private async simulateDelay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))
  }
}
