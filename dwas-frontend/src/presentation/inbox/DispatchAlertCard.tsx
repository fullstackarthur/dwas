import { memo } from 'react'
import { FiTruck, FiMapPin, FiClock, FiAlertTriangle, FiCheckCircle, FiLoader } from 'react-icons/fi'
import clsx from 'clsx'
import type { DispatchRecord } from '../../core/types'

interface DispatchAlertCardProps {
  record: DispatchRecord
  onClick?: () => void
}

export const DispatchAlertCard = memo(function DispatchAlertCard({ record, onClick }: DispatchAlertCardProps) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string; bg: string }> = {
    loading: { color: 'text-active-blue', icon: FiLoader, label: 'Loading', bg: 'bg-active-blue/10' },
    in_transit: { color: 'text-info-cyan', icon: FiTruck, label: 'In Transit', bg: 'bg-info-cyan/10' },
    delivered: { color: 'text-success-green', icon: FiCheckCircle, label: 'Delivered', bg: 'bg-success-green/10' },
    delayed: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Delayed', bg: 'bg-error-red/10' },
    returned: { color: 'text-text-muted', icon: FiClock, label: 'Returned', bg: 'bg-text-muted/10' },
  }

  const config = statusConfig[record.status] || statusConfig.in_transit
  const Icon = config.icon

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-3 border-b border-divider hover:bg-hover-surface/50 transition-colors duration-120',
        record.status === 'delayed' && 'bg-error-red/5'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('p-1.5 rounded', config.bg)}>
          <Icon className={clsx('w-4 h-4', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-text-primary">{record.poNumber}</span>
            <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', config.bg, config.color)}>
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <FiMapPin className="w-3 h-3" />
              {record.destination}
            </span>
            <span>{record.weight}</span>
            <span>{record.driverName}</span>
            <span>{record.vehicleNumber}</span>
          </div>
          {record.delayReason && (
            <div className="text-[11px] text-error-red mt-1">{record.delayReason}</div>
          )}
          <div className="text-[10px] text-text-muted mt-1">
            Dispatched {timeAgo(record.dispatchedAt)}
            {record.eta && ` · ETA ${new Date(record.eta).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
          </div>
        </div>
      </div>
    </button>
  )
})
