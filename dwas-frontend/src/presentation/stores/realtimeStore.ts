import { create } from 'zustand'
import type { PresenceState, SyncState, RealtimeEvent, RealtimeEventType } from '../../core/types/realtime'
import { mockUsers } from '../../data/mock'

interface PresenceStore {
  presenceMap: Record<string, PresenceState>
  setPresence: (userId: string, presence: Partial<PresenceState>) => void
  removePresence: (userId: string) => void
  getOnlineUsers: () => PresenceState[]
  getUserPresence: (userId: string) => PresenceState | undefined
}

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  presenceMap: {
    u1: { userId: 'u1', user: mockUsers[0], status: 'online', lastActive: new Date().toISOString(), currentView: '/dashboard' },
    u2: { userId: 'u2', user: mockUsers[1], status: 'online', lastActive: new Date().toISOString(), currentView: '/queues/dispatch', currentItemId: 'qi-1' },
    u3: { userId: 'u3', user: mockUsers[2], status: 'busy', lastActive: new Date().toISOString(), currentView: '/queues/procurement', currentItemId: 'qi-2' },
    u4: { userId: 'u4', user: mockUsers[3], status: 'away', lastActive: new Date(Date.now() - 3600000).toISOString(), currentView: '/queues/logistics' },
    u5: { userId: 'u5', user: mockUsers[4], status: 'offline', lastActive: new Date(Date.now() - 7200000).toISOString() },
  },
  setPresence: (userId, presence) =>
    set((s) => ({
      presenceMap: {
        ...s.presenceMap,
        [userId]: {
          ...s.presenceMap[userId],
          ...presence,
          lastActive: new Date().toISOString(),
        },
      },
    })),
  removePresence: (userId) =>
    set((s) => {
      const map = { ...s.presenceMap }
      delete map[userId]
      return { presenceMap: map }
    }),
  getOnlineUsers: () => {
    const { presenceMap } = get()
    return Object.values(presenceMap).filter((p) => p.status !== 'offline')
  },
  getUserPresence: (userId) => {
    const { presenceMap } = get()
    return presenceMap[userId]
  },
}))

interface SyncStore {
  syncState: SyncState
  setSyncState: (state: Partial<SyncState>) => void
  incrementPendingEvents: () => void
  decrementPendingEvents: () => void
  incrementReconnectAttempts: () => void
  resetReconnectAttempts: () => void
}

export const useSyncStore = create<SyncStore>((set) => ({
  syncState: {
    status: 'connected',
    lastSyncAt: new Date().toISOString(),
    pendingEvents: 0,
    reconnectAttempts: 0,
    latency: 45,
  },
  setSyncState: (state) =>
    set((s) => ({
      syncState: { ...s.syncState, ...state },
    })),
  incrementPendingEvents: () =>
    set((s) => ({
      syncState: { ...s.syncState, pendingEvents: s.syncState.pendingEvents + 1 },
    })),
  decrementPendingEvents: () =>
    set((s) => ({
      syncState: {
        ...s.syncState,
        pendingEvents: Math.max(0, s.syncState.pendingEvents - 1),
        lastSyncAt: new Date().toISOString(),
      },
    })),
  incrementReconnectAttempts: () =>
    set((s) => ({
      syncState: { ...s.syncState, reconnectAttempts: s.syncState.reconnectAttempts + 1 },
    })),
  resetReconnectAttempts: () =>
    set((s) => ({
      syncState: { ...s.syncState, reconnectAttempts: 0 },
    })),
}))

interface RealtimeEventStore {
  events: RealtimeEvent[]
  addEvent: (event: RealtimeEvent) => void
  getRecentEvents: (count?: number) => RealtimeEvent[]
  getEventsByType: (type: RealtimeEventType) => RealtimeEvent[]
  getEventsByQueue: (queueType: string) => RealtimeEvent[]
  clearEvents: () => void
}

export const useRealtimeEventStore = create<RealtimeEventStore>((set, get) => ({
  events: [],
  addEvent: (event) =>
    set((s) => ({
      events: [event, ...s.events].slice(0, 100),
    })),
  getRecentEvents: (count = 20) => {
    const { events } = get()
    return events.slice(0, count)
  },
  getEventsByType: (type) => {
    const { events } = get()
    return events.filter((e) => e.type === type)
  },
  getEventsByQueue: (queueType) => {
    const { events } = get()
    return events.filter((e) => e.queueType === queueType)
  },
  clearEvents: () => set({ events: [] }),
}))
