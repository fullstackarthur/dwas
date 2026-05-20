import type { RealtimeEvent, RealtimeEventType } from '../../core/types/realtime'
import { useSyncStore, useRealtimeEventStore, usePresenceStore } from '../../presentation/stores/realtimeStore'
import { useNotificationStore } from '../../presentation/stores/notificationStore'
import { generateId } from '../../core/utils'

class WebSocketEngine {
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private mockEventTimer: ReturnType<typeof setInterval> | null = null
  private isRunning = false

  connect() {
    if (this.isRunning) return
    this.isRunning = true

    const syncStore = useSyncStore.getState()
    syncStore.setSyncState({ status: 'connected', lastSyncAt: new Date().toISOString(), latency: Math.floor(Math.random() * 30) + 30 })

    this.startHeartbeat()
    this.startMockEvents()
  }

  disconnect() {
    this.isRunning = false
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)
    if (this.mockEventTimer) clearInterval(this.mockEventTimer)

    useSyncStore.getState().setSyncState({ status: 'disconnected' })
  }

  private startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer)

    this.heartbeatTimer = setInterval(() => {
      if (!this.isRunning) return

      const syncStore = useSyncStore.getState()
      const latency = Math.floor(Math.random() * 30) + 20
      syncStore.setSyncState({
        latency,
        lastSyncAt: new Date().toISOString(),
      })
    }, 10000)
  }

  private startMockEvents() {
    if (this.mockEventTimer) clearInterval(this.mockEventTimer)

    const mockEvents = [
      { type: 'user_status_changed' as RealtimeEventType, delay: 15000 },
      { type: 'queue_item_updated' as RealtimeEventType, delay: 25000 },
      { type: 'thread_message' as RealtimeEventType, delay: 35000 },
      { type: 'dispatch_delayed' as RealtimeEventType, delay: 45000 },
      { type: 'sla_warning' as RealtimeEventType, delay: 55000 },
      { type: 'ai_review_completed' as RealtimeEventType, delay: 65000 },
    ]

    let index = 0
    const emitNext = () => {
      if (!this.isRunning) return
      const mock = mockEvents[index % mockEvents.length]
      this.emitMockEvent(mock.type)
      index++
      this.mockEventTimer = setTimeout(emitNext, mock.delay + Math.random() * 10000)
    }

    this.mockEventTimer = setTimeout(emitNext, 10000)
  }

  private emitMockEvent(type: RealtimeEventType) {
    const event: RealtimeEvent = {
      id: generateId('rt'),
      type,
      timestamp: new Date().toISOString(),
      payload: this.getMockPayload(type),
    }

    useRealtimeEventStore.getState().addEvent(event)

    if (this.shouldCreateNotification(type)) {
      const notification = this.createNotificationFromEvent(event)
      if (notification) {
        useNotificationStore.getState().addNotification(notification)
      }
    }
  }

  private getMockPayload(type: RealtimeEventType): Record<string, unknown> {
    switch (type) {
      case 'user_status_changed':
        return { userId: 'u2', status: 'busy', view: '/queues/dispatch' }
      case 'queue_item_updated':
        return { itemId: 'qi-1', field: 'status', value: 'in_transit' }
      case 'thread_message':
        return { threadId: 'th-1', author: 'Priya Sharma', preview: 'Transport confirmed...' }
      case 'dispatch_delayed':
        return { itemId: 'qi-3', reason: 'Traffic delay on NH16', eta: '+2 hours' }
      case 'sla_warning':
        return { slaId: 'sla-3', label: 'Vendor Response', remaining: '4 hours' }
      case 'ai_review_completed':
        return { itemId: 'qi-5', result: 'approved', confidence: 0.95 }
      default:
        return {}
    }
  }

  private shouldCreateNotification(type: RealtimeEventType): boolean {
    return ['dispatch_delayed', 'sla_warning', 'ai_review_completed', 'queue_item_updated'].includes(type)
  }

  private createNotificationFromEvent(event: RealtimeEvent) {
    const { payload } = event

    switch (event.type) {
      case 'dispatch_delayed':
        return {
          id: generateId('rn'),
          type: 'warning' as const,
          category: 'dispatch' as const,
          title: 'Dispatch delay detected',
          message: `Item ${payload.itemId || 'unknown'} delayed: ${payload.reason || 'Unknown reason'}`,
          createdAt: event.timestamp,
          read: false,
          relatedItemId: payload.itemId as string | undefined,
          relatedQueueType: 'dispatch',
        }
      case 'sla_warning':
        return {
          id: generateId('rn'),
          type: 'warning' as const,
          category: 'sla' as const,
          title: `SLA warning - ${payload.label || 'Unknown'}`,
          message: `Deadline approaching: ${payload.remaining || 'Unknown'}`,
          createdAt: event.timestamp,
          read: false,
        }
      case 'ai_review_completed':
        return {
          id: generateId('rn'),
          type: 'low' as const,
          category: 'ai' as const,
          title: 'AI review completed',
          message: `Item ${payload.itemId || 'unknown'} reviewed. Result: ${payload.result || 'complete'}`,
          createdAt: event.timestamp,
          read: false,
          relatedItemId: payload.itemId as string | undefined,
          relatedQueueType: 'ai_review',
        }
      default:
        return null
    }
  }

  emitEvent(type: RealtimeEventType, payload: Record<string, unknown>, userId?: string) {
    const event: RealtimeEvent = {
      id: generateId('rt'),
      type,
      timestamp: new Date().toISOString(),
      userId,
      payload,
    }

    useRealtimeEventStore.getState().addEvent(event)
  }

  updatePresence(userId: string, updates: { status?: 'online' | 'away' | 'busy' | 'offline'; currentView?: string; currentItemId?: string; typingIn?: string }) {
    usePresenceStore.getState().setPresence(userId, updates)
  }
}

export const websocketEngine = new WebSocketEngine()

export function useRealtimeConnection() {
  const connect = () => websocketEngine.connect()
  const disconnect = () => websocketEngine.disconnect()
  const emitEvent = (type: RealtimeEventType, payload: Record<string, unknown>, userId?: string) =>
    websocketEngine.emitEvent(type, payload, userId)
  const updatePresence = (userId: string, updates: { status?: 'online' | 'away' | 'busy' | 'offline'; currentView?: string; currentItemId?: string; typingIn?: string }) =>
    websocketEngine.updatePresence(userId, updates)

  return { connect, disconnect, emitEvent, updatePresence }
}
