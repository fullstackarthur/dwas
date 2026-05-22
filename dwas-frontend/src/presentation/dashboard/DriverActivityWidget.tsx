import { memo } from 'react'
import type { DriverUpdate } from '../../core/types'
import { FiMapPin, FiAlertTriangle, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx'

const mockDriverUpdates: DriverUpdate[] = []

function DriverUpdateRow({ update }: { update: DriverUpdate }) {
  const typeConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    location: { color: 'text-info-cyan', icon: FiMapPin, label: 'Location' },
    delay: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Delay' },
    arrival: { color: 'text-success-green', icon: FiCheckCircle, label: 'Arrival' },
    departure: { color: 'text-active-blue', icon: FiArrowRight, label: 'Departure' },
    issue: { color: 'text-warning-yellow', icon: FiAlertTriangle, label: 'Issue' },
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
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-start gap-2">
        <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-text-primary">{update.driverName}</span>
            <span className="text-[10px] font-mono text-text-muted">{update.vehicleNumber}</span>
            <span className={clsx('text-[10px] font-medium', config.color)}>{config.label}</span>
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5">{update.message}</div>
          <div className="flex items-center gap-2 mt-1">
            {update.location && (
              <span className="text-[10px] text-text-muted">{update.location}</span>
            )}
            <span className="text-[10px] text-text-muted">{timeAgo(update.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const DriverActivityWidget = memo(function DriverActivityWidget() {
  return (
    <div>
      {mockDriverUpdates.slice(0, 5).map((update) => (
        <DriverUpdateRow key={update.id} update={update} />
      ))}
    </div>
  )
})
