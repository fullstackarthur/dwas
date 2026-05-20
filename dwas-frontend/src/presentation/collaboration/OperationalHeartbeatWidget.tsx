import { memo } from 'react'
import { useSyncStore } from '../stores/realtimeStore'
import { FiActivity } from 'react-icons/fi'
import clsx from 'clsx'

export const OperationalHeartbeatWidget = memo(function OperationalHeartbeatWidget() {
  const { syncState } = useSyncStore()

  const statusColors: Record<string, string> = {
    connected: 'text-success-green',
    connecting: 'text-warning-yellow',
    disconnected: 'text-error-red',
    error: 'text-error-red',
  }

  const statusLabels: Record<string, string> = {
    connected: 'Connected',
    connecting: 'Connecting...',
    disconnected: 'Disconnected',
    error: 'Connection Error',
  }

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-text-muted">System Heartbeat</span>
        <div className={clsx('flex items-center gap-1.5', statusColors[syncState.status])}>
          <FiActivity className={clsx('w-3 h-3', syncState.status === 'connected' && 'animate-pulse')} />
          <span className="text-[10px] font-medium">{statusLabels[syncState.status]}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-text-muted">Latency</span>
          <span className="text-text-primary">{syncState.latency}ms</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-text-muted">Pending events</span>
          <span className="text-text-primary">{syncState.pendingEvents}</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-text-muted">Last sync</span>
          <span className="text-text-primary">
            {new Date(syncState.lastSyncAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        {syncState.reconnectAttempts > 0 && (
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-text-muted">Reconnect attempts</span>
            <span className="text-warning-yellow">{syncState.reconnectAttempts}</span>
          </div>
        )}
      </div>
    </div>
  )
})
