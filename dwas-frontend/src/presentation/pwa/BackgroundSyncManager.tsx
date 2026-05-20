import { useState, useEffect } from 'react'
import { FiRefreshCw, FiCheck, FiClock } from 'react-icons/fi'
import { usePWAStore } from '../stores/commandStore'

function BackgroundSyncManager() {
  const { state, offlineQueue, syncOfflineQueue } = usePWAStore()
  const [syncing, setSyncing] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    if (!state.isOnline || offlineQueue.length === 0) return

    const interval = setInterval(() => {
      handleSync()
    }, 30000)

    return () => clearInterval(interval)
  }, [state.isOnline, offlineQueue.length])

  const handleSync = async () => {
    if (syncing || !state.isOnline || offlineQueue.length === 0) return

    setSyncing(true)
    try {
      syncOfflineQueue()
      setLastSyncResult('success')
    } catch {
      setLastSyncResult('error')
    } finally {
      setSyncing(false)
      setTimeout(() => setLastSyncResult(null), 3000)
    }
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#172B4D]">Background Sync</h3>
        <div className="flex items-center gap-2">
          {lastSyncResult === 'success' && (
            <span className="flex items-center gap-1 text-xs text-[#36B37E]">
              <FiCheck className="w-3 h-3" />
              Synced
            </span>
          )}
          {lastSyncResult === 'error' && (
            <span className="text-xs text-[#DE350B]">Sync failed</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#44546F]">Status</span>
          <span className={state.isOnline ? 'text-[#36B37E]' : 'text-[#DE350B]'}>
            {state.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[#44546F]">Pending Items</span>
          <span className="text-[#172B4D]">{offlineQueue.filter((q) => q.status === 'pending').length}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[#44546F]">Last Sync</span>
          <span className="text-[#172B4D]">
            {state.lastSyncAt ? new Date(state.lastSyncAt).toLocaleTimeString() : 'Never'}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[#44546F]">Cache Version</span>
          <span className="text-[#172B4D] font-mono">{state.cacheVersion}</span>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing || !state.isOnline || offlineQueue.length === 0}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-[#0052CC] text-white rounded hover:bg-[#0747A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {syncing ? (
            <>
              <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <FiClock className="w-3.5 h-3.5" />
              Sync Now
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default BackgroundSyncManager
