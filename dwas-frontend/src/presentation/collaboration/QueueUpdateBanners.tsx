import { memo } from 'react'
import { useRealtimeEventStore } from '../stores/realtimeStore'
import { FiArrowRight, FiAlertTriangle } from 'react-icons/fi'
import clsx from 'clsx'

export const QueueUpdateBanner = memo(function QueueUpdateBanner() {
  const { getRecentEvents } = useRealtimeEventStore()
  const queueEvents = getRecentEvents(3).filter((e) => e.type.startsWith('queue_item_'))

  if (queueEvents.length === 0) return null

  return (
    <div className="px-4 py-2 border-b border-divider bg-active-blue/5 flex items-center gap-2">
      <FiArrowRight className="w-3.5 h-3.5 text-active-blue" />
      <span className="text-[11px] text-active-blue">
        {queueEvents.length} queue update{queueEvents.length !== 1 ? 's' : ''} in last minute
      </span>
    </div>
  )
})

export const SLAWarningBanner = memo(function SLAWarningBanner() {
  const { getRecentEvents } = useRealtimeEventStore()
  const slaEvents = getRecentEvents(5).filter((e) => e.type.startsWith('sla_'))

  if (slaEvents.length === 0) return null

  return (
    <div className="px-4 py-2 border-b border-divider bg-warning-yellow/5 flex items-center gap-2">
      <FiAlertTriangle className="w-3.5 h-3.5 text-warning-yellow" />
      <span className="text-[11px] text-warning-yellow">
        {slaEvents.length} SLA warning{slaEvents.length !== 1 ? 's' : ''} active
      </span>
    </div>
  )
})

export const OperationalStatusTicker = memo(function OperationalStatusTicker() {
  const { syncState } = useSyncStore()

  const statusColors: Record<string, string> = {
    connected: 'text-success-green',
    connecting: 'text-warning-yellow',
    disconnected: 'text-error-red',
    error: 'text-error-red',
  }

  return (
    <div className="flex items-center gap-1.5 px-2">
      <div className={clsx('w-1.5 h-1.5 rounded-full', syncState.status === 'connected' ? 'bg-success-green' : syncState.status === 'connecting' ? 'bg-warning-yellow animate-pulse' : 'bg-error-red')} />
      <span className={clsx('text-[10px]', statusColors[syncState.status])}>
        {syncState.status === 'connected' ? 'Live' : syncState.status === 'connecting' ? 'Connecting...' : 'Offline'}
      </span>
    </div>
  )
})

import { useSyncStore } from '../stores/realtimeStore'

export const RealtimeSyncIndicator = OperationalStatusTicker
