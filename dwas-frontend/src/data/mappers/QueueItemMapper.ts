import type { QueueItem } from '../../core/types'

export class QueueItemMapper {
  static toDTO(entity: QueueItem): QueueItem {
    return { ...entity }
  }

  static fromDTO(dto: QueueItem): QueueItem {
    return {
      ...dto,
      metadata: dto.metadata || {},
      tags: dto.tags || [],
    }
  }

  static toDisplay(entity: QueueItem): {
    id: string
    title: string
    type: string
    priority: string
    status: string
    assigneeName?: string
    reporterName: string
    timeAgo: string
    isOverdue: boolean
  } {
    const now = Date.now()
    const updatedAt = new Date(entity.updatedAt).getTime()
    const diffMins = Math.floor((now - updatedAt) / 60000)

    let timeAgo: string
    if (diffMins < 1) timeAgo = 'just now'
    else if (diffMins < 60) timeAgo = `${diffMins}m ago`
    else if (diffMins < 1440) timeAgo = `${Math.floor(diffMins / 60)}h ago`
    else timeAgo = `${Math.floor(diffMins / 1440)}d ago`

    const isOverdue =
      !!entity.dueDate &&
      new Date(entity.dueDate) < new Date() &&
      entity.status !== 'resolved' &&
      entity.status !== 'closed'

    return {
      id: entity.id,
      title: entity.title,
      type: entity.type,
      priority: entity.priority,
      status: entity.status,
      assigneeName: entity.assignee?.name,
      reporterName: entity.reporter.name,
      timeAgo,
      isOverdue,
    }
  }
}
