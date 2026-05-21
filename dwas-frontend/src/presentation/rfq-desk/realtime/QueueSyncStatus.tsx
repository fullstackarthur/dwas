import { memo, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import clsx from 'clsx'
import { useRFQDeskStore } from '../../stores'

export const QueueSyncStatus = memo(function QueueSyncStatus() {
  const [syncing, setSyncing] = useState(false)
  const fetchRfqs = useRFQDeskStore((s) => s.fetchRfqs)
  const selectedRfqId = useRFQDeskStore((s) => s.selectedRfqId)
  const fetchRfqDetail = useRFQDeskStore((s) => s.fetchRfqDetail)

  const handleSync = async () => {
    if (syncing) return
    setSyncing(true)
    try {
      await fetchRfqs()
      if (selectedRfqId) {
        await fetchRfqDetail(selectedRfqId)
      }
    } finally {
      setSyncing(false)
    }
  }

  return (
    <button
      onClick={handleSync}
      disabled={syncing}
      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-hover-surface transition-colors duration-120 disabled:opacity-50"
    >
      <FiRefreshCw className={clsx('w-3.5 h-3.5 text-text-muted', syncing && 'animate-spin')} />
      <span className="text-[11px] text-text-muted">{syncing ? 'Syncing...' : 'Sync'}</span>
    </button>
  )
})
