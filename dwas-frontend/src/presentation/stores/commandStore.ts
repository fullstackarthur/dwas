import { create } from 'zustand'
import type { CommandDefinition, SearchResult, WorkspaceState, WorkspacePanel, OfflineQueueItem, PWAState, SearchFilter } from '../../core/types/command'
import { mockQueueItems, mockThreads } from '../../data/mock'
import { mockDispatchRecords, mockTransportRecords, mockVendorResponses } from '../../data/mock/operational'
import { useUIStore } from '../stores'

const commands: CommandDefinition[] = [
  { id: 'cmd-1', label: 'Go to Dashboard', section: 'Navigation', shortcut: 'G D', action: () => {}, keywords: ['home', 'overview'] },
  { id: 'cmd-2', label: 'Go to Inbox', section: 'Navigation', shortcut: 'G I', action: () => {}, keywords: ['notifications', 'alerts'] },
  { id: 'cmd-3', label: 'Go to Dispatch Queue', section: 'Navigation', shortcut: 'G Q', action: () => {}, keywords: ['dispatch', 'shipments'] },
  { id: 'cmd-4', label: 'Go to Procurement Queue', section: 'Navigation', action: () => {}, keywords: ['procurement', 'purchasing'] },
  { id: 'cmd-5', label: 'Go to Logistics Queue', section: 'Navigation', action: () => {}, keywords: ['logistics', 'transport'] },
  { id: 'cmd-6', label: 'Go to Escalations', section: 'Navigation', action: () => {}, keywords: ['escalation', 'urgent'] },
  { id: 'cmd-7', label: 'Go to Collaboration Center', section: 'Navigation', action: () => {}, keywords: ['team', 'presence', 'collaboration'] },
  { id: 'cmd-8', label: 'Create new thread', section: 'Actions', shortcut: 'N', action: () => {}, keywords: ['new', 'create', 'thread'] },
  { id: 'cmd-9', label: 'Refresh all queues', section: 'Actions', shortcut: 'R', action: () => {}, keywords: ['sync', 'reload', 'refresh'] },
  { id: 'cmd-10', label: 'Mark all notifications read', section: 'Actions', shortcut: 'M A', action: () => {}, keywords: ['notifications', 'read', 'clear'] },
  { id: 'cmd-11', label: 'Assign operator to selected', section: 'Workflow', action: () => {}, requiresSelection: true, keywords: ['assign', 'operator', 'reassign'] },
  { id: 'cmd-12', label: 'Approve RFQ', section: 'Workflow', action: () => {}, requiresSelection: true, keywords: ['approve', 'rfq', 'quotation'] },
  { id: 'cmd-13', label: 'Escalate workflow', section: 'Workflow', action: () => {}, requiresSelection: true, keywords: ['escalate', 'urgent', 'priority'] },
  { id: 'cmd-14', label: 'Update dispatch status', section: 'Workflow', action: () => {}, requiresSelection: true, keywords: ['dispatch', 'update', 'status'] },
  { id: 'cmd-15', label: 'Request driver update', section: 'Workflow', action: () => {}, keywords: ['driver', 'update', 'tracking'] },
  { id: 'cmd-16', label: 'Generate operational summary', section: 'AI', action: () => {}, keywords: ['summary', 'report', 'ai', 'generate'] },
  { id: 'cmd-17', label: 'Sync Tally records', section: 'Operations', action: () => {}, keywords: ['tally', 'sync', 'weight'] },
  { id: 'cmd-18', label: 'Create followup', section: 'Actions', action: () => {}, keywords: ['followup', 'reminder', 'follow'] },
  { id: 'cmd-19', label: 'Toggle sidebar', section: 'View', shortcut: 'Ctrl+B', action: () => useUIStore.getState().toggleSidebar(), keywords: ['sidebar', 'nav', 'toggle'] },
  { id: 'cmd-20', label: 'Toggle right panel', section: 'View', shortcut: 'Ctrl+\\', action: () => useUIStore.getState().toggleRightSidebar(), keywords: ['panel', 'right', 'toggle'] },
  { id: 'cmd-21', label: 'Open AI Assistant', section: 'AI', shortcut: 'Ctrl+J', action: () => {}, keywords: ['ai', 'assistant', 'intelligence'] },
  { id: 'cmd-22', label: 'Run AI review on selected', section: 'AI', action: () => {}, requiresSelection: true, keywords: ['ai', 'review', 'analyze'] },
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

    set({ loading: true })
    const lower = query.toLowerCase()
    const results: SearchResult[] = []

    mockQueueItems
      .filter((item) => item.title.toLowerCase().includes(lower) || item.tags.some((t) => t.includes(lower)))
      .forEach((item) =>
        results.push({
          id: item.id,
          type: 'queue_item',
          title: item.title,
          subtitle: item.type,
          metadata: { priority: item.priority, status: item.status },
          priority: item.priority,
          status: item.status,
          score: 1,
        })
      )

    mockThreads
      .filter((t) => t.subject.toLowerCase().includes(lower))
      .forEach((t) =>
        results.push({
          id: t.id,
          type: 'thread',
          title: t.subject,
          subtitle: t.queueType,
          metadata: { messages: t.messages.length, participants: t.participants.length },
          status: t.status,
          score: 0.9,
        })
      )

    mockDispatchRecords
      .filter((d) => d.poNumber.toLowerCase().includes(lower) || d.destination.toLowerCase().includes(lower))
      .forEach((d) =>
        results.push({
          id: d.id,
          type: 'dispatch',
          title: `${d.poNumber} - ${d.destination}`,
          subtitle: d.status,
          metadata: { weight: d.weight, material: d.material },
          status: d.status,
          score: 0.8,
        })
      )

    mockVendorResponses
      .filter((v) => v.vendorName.toLowerCase().includes(lower) || v.rfqTitle.toLowerCase().includes(lower))
      .forEach((v) =>
        results.push({
          id: v.id,
          type: 'vendor',
          title: v.vendorName,
          subtitle: v.rfqTitle,
          metadata: { status: v.status },
          status: v.status,
          score: 0.7,
        })
      )

    mockTransportRecords
      .filter((t) => t.driverName.toLowerCase().includes(lower) || t.vehicleNumber.toLowerCase().includes(lower))
      .forEach((t) =>
        results.push({
          id: t.id,
          type: 'driver',
          title: t.driverName,
          subtitle: t.vehicleNumber,
          metadata: { status: t.status, route: t.route },
          status: t.status,
          score: 0.6,
        })
      )

    set({ results: results.slice(0, 20), loading: false })
  },
  clearResults: () => set({ results: [], query: '' }),
}))

interface WorkspaceStore {
  state: WorkspaceState
  setPanelVisibility: (panelId: string, visible: boolean) => void
  togglePanelCollapse: (panelId: string) => void
  setPanelSize: (panelId: string, size: number) => void
  setDensity: (density: WorkspaceState['density']) => void
  setLayout: (layout: WorkspaceState['layout']) => void
  saveLayout: (name: string) => void
  loadLayout: (name: string) => void
  resetLayout: () => void
}

const defaultPanels: WorkspacePanel[] = [
  { id: 'queue', type: 'queue', title: 'Queue', visible: true, collapsed: false, size: 40, position: 'left', docked: true },
  { id: 'thread', type: 'thread', title: 'Thread', visible: true, collapsed: false, size: 40, position: 'left', docked: true },
  { id: 'metadata', type: 'metadata', title: 'Metadata', visible: true, collapsed: false, size: 20, position: 'right', docked: true },
  { id: 'ai', type: 'ai', title: 'AI', visible: false, collapsed: false, size: 20, position: 'right', docked: false },
  { id: 'activity', type: 'activity', title: 'Activity', visible: false, collapsed: false, size: 20, position: 'bottom', docked: false },
]

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  state: {
    panels: defaultPanels,
    sidebarWidth: 240,
    rightSidebarWidth: 320,
    density: 'comfortable',
    layout: 'single',
    savedLayouts: [],
  },
  setPanelVisibility: (panelId, visible) =>
    set((s) => ({
      state: {
        ...s.state,
        panels: s.state.panels.map((p) => (p.id === panelId ? { ...p, visible } : p)),
      },
    })),
  togglePanelCollapse: (panelId) =>
    set((s) => ({
      state: {
        ...s.state,
        panels: s.state.panels.map((p) => (p.id === panelId ? { ...p, collapsed: !p.collapsed } : p)),
      },
    })),
  setPanelSize: (panelId, size) =>
    set((s) => ({
      state: {
        ...s.state,
        panels: s.state.panels.map((p) => (p.id === panelId ? { ...p, size } : p)),
      },
    })),
  setDensity: (density) =>
    set((s) => ({
      state: { ...s.state, density },
    })),
  setLayout: (layout) =>
    set((s) => ({
      state: { ...s.state, layout },
    })),
  saveLayout: (name) =>
    set((s) => ({
      state: {
        ...s.state,
        savedLayouts: [...s.state.savedLayouts, { name, panels: s.state.panels }],
      },
    })),
  loadLayout: (name) =>
    set((s) => {
      const layout = s.state.savedLayouts.find((l) => l.name === name)
      return layout ? { state: { ...s.state, panels: layout.panels } } : {}
    }),
  resetLayout: () =>
    set((s) => ({
      state: { ...s.state, panels: defaultPanels },
    })),
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
