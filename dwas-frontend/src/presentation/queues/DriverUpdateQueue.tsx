import { memo } from 'react'
import { mockDriverUpdates } from '../../data/mock/operational'
import type { DriverUpdate } from '../../core/types'
import { FiMapPin, FiAlertTriangle, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx'

function DriverUpdateRow({ update }: { update: DriverUpdate }) {
  const typeConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string; bg: string }> = {
    location: { color: 'text-info-cyan', icon: FiMapPin, label: 'Location', bg: 'bg-info-cyan/10' },
    delay: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Delay', bg: 'bg-error-red/10' },
    arrival: { color: 'text-success-green', icon: FiCheckCircle, label: 'Arrival', bg: 'bg-success-green/10' },
    departure: { color: 'text-active-blue', icon: FiArrowRight, label: 'Departure', bg: 'bg-active-blue/10' },
    issue: { color: 'text-warning-yellow', icon: FiAlertTriangle, label: 'Issue', bg: 'bg-warning-yellow/10' },
  }

  const config = typeConfig[update.updateType] || typeConfig.location
  const Icon = config.icon

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    return `${hours}h ago`
  }

  return (
    <div className="flex items-start gap-3 px-4 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className={clsx('p-1.5 rounded flex-shrink-0', config.bg)}>
        <Icon className={clsx('w-4 h-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-medium text-text-primary">{update.driverName}</span>
          <span className="text-[11px] font-mono text-text-muted">{update.vehicleNumber}</span>
          <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', config.bg, config.color)}>
            {config.label}
          </span>
        </div>
        <div className="text-[12px] text-text-secondary leading-snug">{update.message}</div>
        <div className="flex items-center gap-2 mt-1">
          {update.location && (
            <span className="text-[11px] text-text-muted">{update.location}</span>
          )}
          <span className="text-[11px] text-text-muted">{timeAgo(update.timestamp)}</span>
          {update.relatedDispatchId && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className="text-[11px] text-active-blue">{update.relatedDispatchId}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const DriverUpdateQueue = memo(function DriverUpdateQueue() {
  const delays = mockDriverUpdates.filter((u) => u.updateType === 'delay' || u.updateType === 'issue')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Driver Updates</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {mockDriverUpdates.length} update{mockDriverUpdates.length !== 1 ? 's' : ''}, {delays.length} issue{delays.length !== 1 ? 's' : ''}
        </p>
      </div>

      {delays.length > 0 && (
        <div className="px-3 py-1.5 border-b border-divider bg-error-red/5">
          <span className="text-[11px] text-error-red font-medium">
            {delays.length} driver issue{delays.length !== 1 ? 's' : ''} reported
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {mockDriverUpdates.map((update) => (
          <DriverUpdateRow key={update.id} update={update} />
        ))}
      </div>
    </div>
  )
})
