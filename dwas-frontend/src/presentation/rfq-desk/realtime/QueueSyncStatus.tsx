import { memo } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import clsx from 'clsx'

export const QueueSyncStatus = memo(function QueueSyncStatus() {
  const syncing = false

  return (
    <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-hover-surface transition-colors duration-120">
      <FiRefreshCw className={clsx('w-3.5 h-3.5 text-text-muted', syncing && 'animate-spin')} />
      <span className="text-[11px] text-text-muted">Sync</span>
    </button>
  )
})