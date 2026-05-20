import type { QueueItem } from '../../core/types'
import type { IQueueRepository } from '../repositories/QueueRepository'

export function createGetQueueItemsUseCase(queueRepository: IQueueRepository) {
  return async function execute(filter?: { queueType?: string; priority?: string; status?: string }): Promise<QueueItem[]> {
    let items = await queueRepository.getAll()

    if (filter?.queueType) {
      items = items.filter((item) => item.type === filter.queueType)
    }
    if (filter?.priority) {
      items = items.filter((item) => item.priority === filter.priority)
    }
    if (filter?.status) {
      items = items.filter((item) => item.status === filter.status)
    }

    return items.sort((a, b) => {
      const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, none: 4 }
      return (priorityOrder[a.priority] ?? 5) - (priorityOrder[b.priority] ?? 5)
    })
  }
}

export function createSearchQueueItemsUseCase(queueRepository: IQueueRepository) {
  return async function execute(query: string): Promise<QueueItem[]> {
    if (!query.trim()) return []
    return queueRepository.search(query)
  }
}

export function createUpdateQueueItemStatusUseCase(queueRepository: IQueueRepository) {
  return async function execute(id: string, status: QueueItem['status']): Promise<QueueItem> {
    return queueRepository.update(id, { status })
  }
}

export function createAssignQueueItemUseCase(queueRepository: IQueueRepository) {
  return async function execute(id: string, assigneeId: string): Promise<QueueItem> {
    return queueRepository.update(id, { assignee: { id: assigneeId } as QueueItem['assignee'] })
  }
}
