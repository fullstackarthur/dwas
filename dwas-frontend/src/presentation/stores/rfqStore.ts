import { create } from 'zustand'
import type { RFQDeskState } from '../../core/types/rfq'
import { mockRFQs } from '../../data/mock/rfq'
import { rfqRepository } from '../../data/repositories/SupabaseRFQRepository'

interface RFQDeskStore extends RFQDeskState {
  error: string | null
  detailLoading: boolean
  fetchRfqs: () => Promise<void>
  fetchRfqDetail: (id: string) => Promise<void>
  subscribeToRealtime: () => void
  unsubscribeFromRealtime: () => void
}

let realtimeUnsubscribe: (() => void) | null = null

export const useRFQDeskStore = create<RFQDeskStore>((set, get) => ({
  rfqs: [],
  selectedRfqId: null,
  filters: {},
  queueRailCollapsed: false,
  loading: false,
  detailLoading: false,
  realtimeConnected: false,
  error: null,

  setRfqs: (rfqs) => set({ rfqs, error: null }),

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
      get().fetchRfqDetail(id)
    }
  },

  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),

  clearFilters: () => set({ filters: {} }),

  toggleQueueRail: () =>
    set((s) => ({ queueRailCollapsed: !s.queueRailCollapsed })),

  setLoading: (loading) => set({ loading }),

  markAsRead: async (rfqId) => {
    set((s) => ({
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId ? { ...r, unreadUpdates: 0 } : r
      ),
    }))
    try {
      await rfqRepository.markAsRead(rfqId)
    } catch (e) {
      console.error('[rfqStore] markAsRead failed:', e)
    }
  },

  updateRfqStage: async (rfqId, stage) => {
    set((s) => ({
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId ? { ...r, stage, updatedAt: new Date().toISOString() } : r
      ),
    }))
    try {
      await rfqRepository.updateRfqStage(rfqId, stage)
    } catch (e) {
      console.error('[rfqStore] updateRfqStage failed:', e)
    }
  },

  selectVendor: async (rfqId, vendorRecommendationId) => {
    set((s) => ({
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              selectedVendorId: vendorRecommendationId,
              vendorRecommendations: r.vendorRecommendations.map((v) =>
                v.id === vendorRecommendationId ? { ...v, isSelected: true } : { ...v, isSelected: false }
              ),
              stage: 'quotation_review' as const,
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }))
    try {
      await rfqRepository.selectVendor(rfqId, vendorRecommendationId)
    } catch (e) {
      console.error('[rfqStore] selectVendor failed:', e)
      get().fetchRfqDetail(rfqId)
    }
  },

  acceptQuote: async (rfqId, quoteId) => {
    set((s) => ({
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              acceptedQuoteId: quoteId,
              quotations: r.quotations.map((q) =>
                q.id === quoteId ? { ...q, status: 'accepted' as const } : { ...q, status: 'rejected' as const }
              ),
              status: 'won' as const,
              stage: 'order_confirmation' as const,
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }))
    try {
      await rfqRepository.acceptQuote(rfqId, quoteId)
    } catch (e) {
      console.error('[rfqStore] acceptQuote failed:', e)
      get().fetchRfqDetail(rfqId)
    }
  },

  rejectQuote: async (rfqId, quoteId) => {
    set((s) => ({
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              quotations: r.quotations.map((q) =>
                q.id === quoteId ? { ...q, status: 'rejected' as const } : q
              ),
              updatedAt: new Date().toISOString(),
            }
          : r
      ),
    }))
    try {
      await rfqRepository.rejectQuote(rfqId, quoteId)
    } catch (e) {
      console.error('[rfqStore] rejectQuote failed:', e)
      get().fetchRfqDetail(rfqId)
    }
  },

  sendToVendor: async (rfqId, vendorId) => {
    try {
      await rfqRepository.sendToVendor(rfqId, vendorId)
      get().fetchRfqDetail(rfqId)
    } catch (e) {
      console.error('[rfqStore] sendToVendor failed:', e)
    }
  },

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

  fetchRfqs: async () => {
    set({ loading: true, error: null })
    try {
      const rfqs = await rfqRepository.fetchAllRfqs()
      set({ rfqs, loading: false, error: null })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to fetch RFQs'
      console.error('[rfqStore] fetchRfqs failed, falling back to mock:', e)
      set({
        rfqs: mockRFQs,
        loading: false,
        error: message,
      })
    }
  },

  fetchRfqDetail: async (id) => {
    set({ detailLoading: true })
    try {
      const detail = await rfqRepository.fetchRfqById(id)
      if (detail) {
        set((s) => ({
          rfqs: s.rfqs.map((r) => (r.id === id ? detail : r)),
          detailLoading: false,
        }))
      } else {
        set({ detailLoading: false })
      }
    } catch (e) {
      console.error('[rfqStore] fetchRfqDetail failed:', e)
      set({ detailLoading: false })
    }
  },

  subscribeToRealtime: () => {
    if (realtimeUnsubscribe) return

    realtimeUnsubscribe = rfqRepository.subscribeToRfqChanges((rfqs) => {
      set({ rfqs, realtimeConnected: true, error: null })
    })

    set({ realtimeConnected: true })
  },

  unsubscribeFromRealtime: () => {
    if (realtimeUnsubscribe) {
      realtimeUnsubscribe()
      realtimeUnsubscribe = null
    }
    set({ realtimeConnected: false })
  },
}))
