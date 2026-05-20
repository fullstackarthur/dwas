import { useState } from 'react'
import { FiDatabase, FiRefreshCw, FiTrash } from 'react-icons/fi'
import { usePWAStore } from '../stores/commandStore'

interface CachedThread {
  id: string
  subject: string
  queueType: string
  cachedAt: string
  size: string
}

const mockCachedThreads: CachedThread[] = [
  { id: 't-1', subject: 'RFQ-2024-0892 Tally mismatch', queueType: 'vendor', cachedAt: '2h ago', size: '24 KB' },
  { id: 't-2', subject: 'Dispatch delay - PO-4521', queueType: 'dispatch', cachedAt: '4h ago', size: '18 KB' },
  { id: 't-3', subject: 'Vendor approval pending', queueType: 'approval', cachedAt: '6h ago', size: '12 KB' },
  { id: 't-4', subject: 'Escalation - Payment terms', queueType: 'escalation', cachedAt: '1d ago', size: '32 KB' },
]

function OfflineThreadCache() {
  const { state } = usePWAStore()
  const [cachedThreads, setCachedThreads] = useState<CachedThread[]>(mockCachedThreads)
  const [clearing, setClearing] = useState(false)

  const handleClear = () => {
    setClearing(true)
    setTimeout(() => {
      setCachedThreads([])
      setClearing(false)
    }, 500)
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#172B4D] flex items-center gap-2">
          <FiDatabase className="w-4 h-4 text-[#0052CC]" />
          Offline Cache
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B778C]">{cachedThreads.length} threads</span>
          {cachedThreads.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearing}
              className="flex items-center gap-1 text-xs text-[#6B778C] hover:text-[#DE350B] transition-colors disabled:opacity-50"
            >
              {clearing ? <FiRefreshCw className="w-3 h-3 animate-spin" /> : <FiTrash className="w-3 h-3" />}
              Clear
            </button>
          )}
        </div>
      </div>

      {!state.isOnline && (
        <div className="mb-3 px-3 py-2 bg-[#FFAB00]/10 border border-[#FFAB00]/30 rounded text-xs text-[#FFAB00]">
          Showing cached threads. Some data may be outdated.
        </div>
      )}

      {cachedThreads.length === 0 ? (
        <div className="text-center py-6">
          <FiDatabase className="w-6 h-6 text-[#6B778C] mx-auto mb-2" />
          <p className="text-xs text-[#6B778C]">No cached threads</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {cachedThreads.map((thread) => (
            <div
              key={thread.id}
              className="flex items-center gap-3 px-3 py-2 bg-[#FAFBFC] rounded text-xs hover:bg-[#EBECF0] transition-colors cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0052CC]" />
              <div className="flex-1 min-w-0">
                <div className="text-[#172B4D] truncate">{thread.subject}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#6B778C]">{thread.queueType}</span>
                  <span className="text-[#6B778C]">•</span>
                  <span className="text-[#6B778C]">{thread.cachedAt}</span>
                  <span className="text-[#6B778C]">•</span>
                  <span className="text-[#6B778C]">{thread.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[#DFE1E6]">
        <div className="flex items-center justify-between text-[10px] text-[#6B778C]">
          <span>Cache version</span>
          <span className="font-mono">{state.cacheVersion}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#6B778C] mt-1">
          <span>Last sync</span>
          <span>{state.lastSyncAt ? new Date(state.lastSyncAt).toLocaleString() : 'Never'}</span>
        </div>
      </div>
    </div>
  )
}

export default OfflineThreadCache
