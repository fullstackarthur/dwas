import { create } from 'zustand'
import type { CommandDefinition, SearchFilter, SearchResult, PWAState, OfflineQueueItem } from '../../core/types/command'
import { useUIStore } from '../stores'

const commands: CommandDefinition[] = [
  { id: 'cmd-1', label: 'Go to Dashboard', section: 'Navigation', shortcut: 'G D', action: () => {}, keywords: ['home', 'overview'] },
  { id: 'cmd-2', label: 'Go to RFQ Desk', section: 'Navigation', shortcut: 'G R', action: () => {}, keywords: ['rfq', 'desk', 'requests'] },
  { id: 'cmd-3', label: 'Go to Vendor Coordination', section: 'Navigation', action: () => {}, keywords: ['vendor', 'coordination'] },
  { id: 'cmd-4', label: 'Go to Client Quotations', section: 'Navigation', action: () => {}, keywords: ['client', 'quotations'] },
  { id: 'cmd-5', label: 'Go to Purchase Orders', section: 'Navigation', action: () => {}, keywords: ['purchase', 'orders', 'po'] },
  { id: 'cmd-6', label: 'Go to Logistics', section: 'Navigation', action: () => {}, keywords: ['logistics', 'transport'] },
  { id: 'cmd-7', label: 'Go to Dispatch Tracking', section: 'Navigation', action: () => {}, keywords: ['dispatch', 'tracking'] },
  { id: 'cmd-8', label: 'Go to Deliveries', section: 'Navigation', action: () => {}, keywords: ['deliveries', 'delivery'] },
  { id: 'cmd-9', label: 'Go to Payments & Tally', section: 'Navigation', action: () => {}, keywords: ['payments', 'tally', 'finance'] },
  { id: 'cmd-10', label: 'Toggle sidebar', section: 'View', shortcut: 'Ctrl+B', action: () => useUIStore.getState().toggleSidebar(), keywords: ['sidebar', 'nav', 'toggle'] },
  { id: 'cmd-11', label: 'Toggle right panel', section: 'View', action: () => useUIStore.getState().toggleRightSidebar(), keywords: ['panel', 'right', 'toggle'] },
  { id: 'cmd-12', label: 'Mark all notifications read', section: 'Actions', shortcut: 'M A', action: () => {}, keywords: ['notifications', 'read', 'clear'] },
  { id: 'cmd-13', label: 'Refresh data', section: 'Actions', shortcut: 'R', action: () => {}, keywords: ['sync', 'reload', 'refresh'] },
]

interface CommandStore {
  isOpen: boolean
  query: string
  activeIndex: number
  open: () => void
  close: () => void
  toggle: () => void
  setQuery: (query: string) => void
  setActiveIndex: (index: number) => void
  getFilteredCommands: () => CommandDefinition[]
  getCommands: () => CommandDefinition[]
}

export const useCommandStore = create<CommandStore>((set, get) => ({
  isOpen: false,
  query: '',
  activeIndex: 0,
  open: () => set({ isOpen: true, query: '', activeIndex: 0 }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen, query: '', activeIndex: 0 })),
  setQuery: (query) => set({ query, activeIndex: 0 }),
  setActiveIndex: (activeIndex) => set({ activeIndex }),
  getFilteredCommands: () => {
    const { query } = get()
    if (!query) return commands
    const lower = query.toLowerCase()
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(lower) ||
        c.section.toLowerCase().includes(lower) ||
        c.keywords?.some((k) => k.includes(lower))
    )
  },
  getCommands: () => commands,
}))

interface SearchStore {
  isOpen: boolean
  query: string
  filters: SearchFilter
  results: SearchResult[]
  loading: boolean
  open: () => void
  close: () => void
  setQuery: (query: string) => void
  setFilters: (filters: Partial<SearchFilter>) => void
  search: (query: string) => void
  clearResults: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: '',
  filters: {},
  results: [],
  loading: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: '', results: [] }),
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  search: (query) => {
    if (!query.trim()) {
      set({ results: [], loading: false })
      return
    }
    set({ loading: true, results: [] })
  },
  clearResults: () => set({ results: [], query: '' }),
}))

interface PWAStore {
  state: PWAState
  offlineQueue: OfflineQueueItem[]
  setOnline: (online: boolean) => void
  setInstalled: (installed: boolean) => void
  addToOfflineQueue: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'status' | 'retryCount'>) => void
  syncOfflineQueue: () => void
  clearOfflineQueue: () => void
}

export const usePWAStore = create<PWAStore>((set) => ({
  state: {
    isOnline: navigator.onLine,
    isInstalled: false,
    lastSyncAt: new Date().toISOString(),
    pendingSyncCount: 0,
    cacheVersion: '1.0.0',
  },
  offlineQueue: [],
  setOnline: (isOnline) =>
    set((s) => ({
      state: { ...s.state, isOnline, lastSyncAt: isOnline ? new Date().toISOString() : s.state.lastSyncAt },
    })),
  setInstalled: (isInstalled) =>
    set((s) => ({
      state: { ...s.state, isInstalled },
    })),
  addToOfflineQueue: (item) =>
    set((s) => ({
      offlineQueue: [
        ...s.offlineQueue,
        {
          ...item,
          id: `oq-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'pending',
          retryCount: 0,
        },
      ],
      state: { ...s.state, pendingSyncCount: s.state.pendingSyncCount + 1 },
    })),
  syncOfflineQueue: () =>
    set((s) => ({
      offlineQueue: s.offlineQueue.map((item) => ({ ...item, status: 'synced' as const })),
      state: { ...s.state, pendingSyncCount: 0, lastSyncAt: new Date().toISOString() },
    })),
  clearOfflineQueue: () =>
    set((s) => ({
      offlineQueue: [],
      state: { ...s.state, pendingSyncCount: 0 },
    })),
}))
