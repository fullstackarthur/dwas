import { create } from 'zustand'
import type { User, Notification, AIRecommendation, BreadcrumbItem } from '../../core/types'
import { mockUsers, mockNotifications, mockAIRecommendations, mockDashboardMetrics } from '../../data/mock'
import { useRFQDeskStore } from './rfqStore'

export { useRFQDeskStore }

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
