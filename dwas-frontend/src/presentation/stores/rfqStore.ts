import { create } from 'zustand'
import type { RFQ, RFQFilter, RFQDeskState, RFQStage } from '../../core/types/rfq'
import { mockRFQs } from '../../data/mock/rfq'

export const useRFQDeskStore = create<RFQDeskState>((set, get) => ({
  rfqs: mockRFQs,
  selectedRfqId: 'rfq-104',
  filters: {},
  queueRailCollapsed: false,
  loading: false,
  realtimeConnected: true,

  setRfqs: (rfqs) => set({ rfqs }),

  selectRfq: (id) => {
    set({ selectedRfqId: id })
    if (id) {
      const rfq = get().rfqs.find((r) => r.id === id)
      if (rfq && rfq.unreadUpdates > 0) {
        set((s) => ({
          rfqs: s.rfqs.map((r) =>
            r.id === id ? { ...r, unreadUpdates: 0 } : r
          ),
        }))
      }
    }
  },

  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),

  clearFilters: () => set({ filters: {} }),

  toggleQueueRail: () =>
    set((s) => ({ queueRailCollapsed: !s.queueRailCollapsed })),

  setLoading: (loading) => set({ loading }),

  markAsRead: (rfqId) =>
    set((s) => ({
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId ? { ...r, unreadUpdates: 0 } : r
      ),
    })),

  updateRfqStage: (rfqId, stage) =>
    set((s) => ({
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId ? { ...r, stage, updatedAt: new Date().toISOString() } : r
      ),
    })),

  getSelectedRfq: () => {
    const { rfqs, selectedRfqId } = get()
    return rfqs.find((r) => r.id === selectedRfqId)
  },

  getFilteredRfqs: () => {
    const { rfqs, filters } = get()
    return rfqs.filter((rfq) => {
      if (filters.stage?.length && !filters.stage.includes(rfq.stage)) return false
      if (filters.priority?.length && !filters.priority.includes(rfq.priority)) return false
      if (filters.status?.length && !filters.status.includes(rfq.status)) return false
      if (filters.assigneeId && rfq.assignee?.id !== filters.assigneeId) return false
      if (filters.slaStatus?.length && !filters.slaStatus.includes(rfq.slaStatus)) return false
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (
          !rfq.rfqNumber.toLowerCase().includes(query) &&
          !rfq.clientName.toLowerCase().includes(query) &&
          !rfq.items.some((i) => i.materialDescription.toLowerCase().includes(query))
        ) {
          return false
        }
      }
      return true
    })
  },
}))