import type { User, QueueItem, Thread, ThreadMessage, Notification, AIRecommendation } from '../../core/types'

export class UserEntity implements User {
  id: string
  name: string
  email: string
  role: User['role']
  avatarUrl?: string
  status: User['status']
  lastActive: string

  constructor(data: User) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.role = data.role
    this.avatarUrl = data.avatarUrl
    this.status = data.status
    this.lastActive = data.lastActive
  }

  get initials(): string {
    return this.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  get isOnline(): boolean {
    return this.status === 'online'
  }
}

export class QueueItemEntity implements QueueItem {
  id: string
  title: string
  type: QueueItem['type']
  priority: QueueItem['priority']
  status: QueueItem['status']
  assignee?: UserEntity
  reporter: UserEntity
  createdAt: string
  updatedAt: string
  dueDate?: string
  tags: string[]
  metadata: Record<string, string | number | boolean>
  threadId?: string

  constructor(data: QueueItem) {
    this.id = data.id
    this.title = data.title
    this.type = data.type
    this.priority = data.priority
    this.status = data.status
    this.assignee = data.assignee ? new UserEntity(data.assignee) : undefined
    this.reporter = new UserEntity(data.reporter)
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.dueDate = data.dueDate
    this.tags = data.tags
    this.metadata = data.metadata
    this.threadId = data.threadId
  }

  get isOverdue(): boolean {
    if (!this.dueDate) return false
    return new Date(this.dueDate) < new Date() && this.status !== 'resolved' && this.status !== 'closed'
  }

  get ageHours(): number {
    return Math.floor((Date.now() - new Date(this.createdAt).getTime()) / (1000 * 60 * 60))
  }
}

export class ThreadMessageEntity implements ThreadMessage {
  id: string
  threadId: string
  author: UserEntity
  content: string
  createdAt: string
  isAiGenerated: boolean
  attachments?: ThreadMessage['attachments']
  reactions?: ThreadMessage['reactions']

  constructor(data: ThreadMessage) {
    this.id = data.id
    this.threadId = data.threadId
    this.author = new UserEntity(data.author)
    this.content = data.content
    this.createdAt = data.createdAt
    this.isAiGenerated = data.isAiGenerated
    this.attachments = data.attachments
    this.reactions = data.reactions
  }
}

export class ThreadEntity implements Thread {
  id: string
  subject: string
  queueType: Thread['queueType']
  status: Thread['status']
  priority: Thread['priority']
  participants: UserEntity[]
  messages: ThreadMessageEntity[]
  createdAt: string
  updatedAt: string
  lastActivity: string
  queueItemId?: string
  metadata: Record<string, string | number | boolean>

  constructor(data: Thread) {
    this.id = data.id
    this.subject = data.subject
    this.queueType = data.queueType
    this.status = data.status
    this.priority = data.priority
    this.participants = data.participants.map(p => new UserEntity(p))
    this.messages = data.messages.map(m => new ThreadMessageEntity(m))
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.lastActivity = data.lastActivity
    this.queueItemId = data.queueItemId
    this.metadata = data.metadata
  }

  get messageCount(): number {
    return this.messages.length
  }

  get lastMessage(): ThreadMessageEntity | undefined {
    return this.messages[this.messages.length - 1]
  }
}

export class NotificationEntity implements Notification {
  id: string
  type: Notification['type']
  title: string
  message: string
  createdAt: string
  read: boolean
  actionUrl?: string
  source?: string

  constructor(data: Notification) {
    this.id = data.id
    this.type = data.type
    this.title = data.title
    this.message = data.message
    this.createdAt = data.createdAt
    this.read = data.read
    this.actionUrl = data.actionUrl
    this.source = data.source
  }
}

export class AIRecommendationEntity implements AIRecommendation {
  id: string
  type: AIRecommendation['type']
  confidence: number
  title: string
  description: string
  suggestedAction?: string
  relatedItemId?: string
  createdAt: string

  constructor(data: AIRecommendation) {
    this.id = data.id
    this.type = data.type
    this.confidence = data.confidence
    this.title = data.title
    this.description = data.description
    this.suggestedAction = data.suggestedAction
    this.relatedItemId = data.relatedItemId
    this.createdAt = data.createdAt
  }
}
