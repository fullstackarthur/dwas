import { FiRefreshCw, FiCheck, FiX, FiClock } from 'react-icons/fi'
import { usePWAStore } from '../stores/commandStore'
import type { OfflineQueueItem } from '../../core/types/command'

function SyncQueuePanel() {
  const { offlineQueue, syncOfflineQueue, clearOfflineQueue, state } = usePWAStore()

  const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    pending: FiClock,
    syncing: FiRefreshCw,
    synced: FiCheck,
    failed: FiX,
  }

  const statusColors: Record<string, string> = {
    pending: 'text-[#FFAB00]',
    syncing: 'text-[#0052CC]',
    synced: 'text-[#36B37E]',
    failed: 'text-[#DE350B]',
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#172B4D]">Sync Queue</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B778C]">
            {offlineQueue.filter((q) => q.status === 'pending').length} pending
          </span>
          {state.isOnline && offlineQueue.length > 0 && (
            <button
              onClick={syncOfflineQueue}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-[#0052CC] text-white rounded hover:bg-[#0747A6] transition-colors"
            >
              <FiRefreshCw className="w-3 h-3" />
              Sync All
            </button>
          )}
          {offlineQueue.length > 0 && (
            <button
              onClick={clearOfflineQueue}
              className="text-xs text-[#6B778C] hover:text-[#44546F] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {offlineQueue.length === 0 ? (
        <div className="text-center py-6">
          <FiCheck className="w-6 h-6 text-[#36B37E] mx-auto mb-2" />
          <p className="text-xs text-[#6B778C]">All synced</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {offlineQueue.map((item: OfflineQueueItem) => {
            const Icon = statusIcons[item.status] || FiClock
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 px-3 py-2 bg-[#FAFBFC] rounded text-xs"
              >
                <Icon className={`w-3.5 h-3.5 ${statusColors[item.status]}`} />
                <span className="flex-1 text-[#172B4D] truncate">{item.type}</span>
                <span className="text-[#6B778C]">{new Date(item.timestamp).toLocaleTimeString()}</span>
                {item.retryCount > 0 && (
                  <span className="text-[10px] text-[#DE350B]">×{item.retryCount}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SyncQueuePanel
