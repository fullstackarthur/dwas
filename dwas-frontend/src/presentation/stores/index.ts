import { create } from 'zustand'
import type { User, QueueItem, Thread, Notification, AIRecommendation, BreadcrumbItem } from '../../core/types'
import { mockUsers, mockQueueItems, mockThreads, mockNotifications, mockAIRecommendations, mockDashboardMetrics } from '../../data/mock'

interface UIState {
  sidebarCollapsed: boolean
  rightSidebarVisible: boolean
  rightSidebarTab: 'ai' | 'activity' | 'metadata'
  commandPaletteOpen: boolean
  searchOpen: boolean
  activeNavId: string
  breadcrumbs: BreadcrumbItem[]
  toggleSidebar: () => void
  toggleRightSidebar: () => void
  setRightSidebarTab: (tab: 'ai' | 'activity' | 'metadata') => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  openSearch: () => void
  closeSearch: () => void
  setActiveNav: (id: string) => void
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  rightSidebarVisible: true,
  rightSidebarTab: 'ai',
  commandPaletteOpen: false,
  searchOpen: false,
  activeNavId: 'dashboard',
  breadcrumbs: [{ label: 'Dashboard', href: '/dashboard', active: true }],
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleRightSidebar: () => set((s) => ({ rightSidebarVisible: !s.rightSidebarVisible })),
  setRightSidebarTab: (tab) => set({ rightSidebarTab: tab }),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  setActiveNav: (id) => set({ activeNavId: id }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}))

interface QueueState {
  items: QueueItem[]
  selectedId: string | null
  filter: { queueType?: string; priority?: string; status?: string }
  loading: boolean
  setItems: (items: QueueItem[]) => void
  setSelectedId: (id: string | null) => void
  setFilter: (filter: Partial<QueueState['filter']>) => void
  setLoading: (loading: boolean) => void
  getFilteredItems: () => QueueItem[]
}

export const useQueueStore = create<QueueState>((set, get) => ({
  items: mockQueueItems,
  selectedId: null,
  filter: {},
  loading: false,
  setItems: (items) => set({ items }),
  setSelectedId: (id) => set({ selectedId: id }),
  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),
  setLoading: (loading) => set({ loading }),
  getFilteredItems: () => {
    const { items, filter } = get()
    return items.filter((item) => {
      if (filter.queueType && item.type !== filter.queueType) return false
      if (filter.priority && item.priority !== filter.priority) return false
      if (filter.status && item.status !== filter.status) return false
      return true
    })
  },
}))

interface ThreadState {
  threads: Thread[]
  activeThreadId: string | null
  loading: boolean
  setThreads: (threads: Thread[]) => void
  setActiveThreadId: (id: string | null) => void
  setLoading: (loading: boolean) => void
  getActiveThread: () => Thread | undefined
}

export const useThreadStore = create<ThreadState>((set, get) => ({
  threads: mockThreads,
  activeThreadId: null,
  loading: false,
  setThreads: (threads) => set({ threads }),
  setActiveThreadId: (id) => set({ activeThreadId: id }),
  setLoading: (loading) => set({ loading }),
  getActiveThread: () => {
    const { threads, activeThreadId } = get()
    return threads.find((t) => t.id === activeThreadId)
  },
}))

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  dismiss: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: s.notifications.filter((n) => !n.read && n.id !== id).length,
    })),
  markAllAsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  dismiss: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
      unreadCount: s.notifications.filter((n) => !n.read && n.id !== id).length,
    })),
}))

interface AIState {
  recommendations: AIRecommendation[]
  loading: boolean
  setRecommendations: (recommendations: AIRecommendation[]) => void
  setLoading: (loading: boolean) => void
  dismissRecommendation: (id: string) => void
}

export const useAIStore = create<AIState>((set) => ({
  recommendations: mockAIRecommendations,
  loading: false,
  setRecommendations: (recommendations) => set({ recommendations }),
  setLoading: (loading) => set({ loading }),
  dismissRecommendation: (id) =>
    set((s) => ({
      recommendations: s.recommendations.filter((r) => r.id !== id),
    })),
}))

interface AppState {
  currentUser: User
  metrics: typeof mockDashboardMetrics
  syncStatus: 'synced' | 'syncing' | 'error'
  lastSyncAt: string
  setCurrentUser: (user: User) => void
  setMetrics: (metrics: typeof mockDashboardMetrics) => void
  setSyncStatus: (status: 'synced' | 'syncing' | 'error') => void
  triggerSync: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: mockUsers[0],
  metrics: mockDashboardMetrics,
  syncStatus: 'synced',
  lastSyncAt: new Date().toISOString(),
  setCurrentUser: (user) => set({ currentUser: user }),
  setMetrics: (metrics) => set({ metrics }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  triggerSync: () => {
    set({ syncStatus: 'syncing' })
    setTimeout(() => {
      set({ syncStatus: 'synced', lastSyncAt: new Date().toISOString() })
    }, 1500)
  },
}))
