import type { Thread } from '../../core/types'

export interface IThreadRepository {
  getAll(): Promise<Thread[]>
  getById(id: string): Promise<Thread | undefined>
  create(thread: Omit<Thread, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity'>): Promise<Thread>
  addMessage(threadId: string, message: Omit<Thread['messages'][0], 'id' | 'createdAt'>): Promise<Thread>
  updateStatus(id: string, status: Thread['status']): Promise<Thread>
  search(query: string): Promise<Thread[]>
}
