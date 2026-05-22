import { memo } from 'react'
import { FiTruck, FiMapPin, FiClock, FiAlertTriangle, FiCheckCircle, FiLoader } from 'react-icons/fi'
import clsx from 'clsx'
import type { DispatchRecord } from '../../core/types'

const mockDispatchRecords: DispatchRecord[] = []

function DispatchRow({ record }: { record: DispatchRecord }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    loading: { color: 'text-active-blue', icon: FiLoader, label: 'Loading' },
    in_transit: { color: 'text-info-cyan', icon: FiTruck, label: 'In Transit' },
    delivered: { color: 'text-success-green', icon: FiCheckCircle, label: 'Delivered' },
    delayed: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Delayed' },
    returned: { color: 'text-text-muted', icon: FiClock, label: 'Returned' },
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
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-center gap-2">
        <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-text-primary">{record.poNumber}</span>
            <span className={clsx('text-[10px] font-medium', config.color)}>{config.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-[10px] text-text-muted">
              <FiMapPin className="w-3 h-3" />
              {record.destination}
            </span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{record.weight}</span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{record.driverName}</span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{record.vehicleNumber}</span>
          </div>
          {record.delayReason && (
            <div className="text-[10px] text-error-red mt-1 truncate">{record.delayReason}</div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] text-text-muted">{timeAgo(record.dispatchedAt)}</div>
          {record.eta && (
            <div className="text-[10px] text-text-secondary">ETA: {new Date(record.eta).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export const DispatchTrackingWidget = memo(function DispatchTrackingWidget() {
  const active = mockDispatchRecords.filter((d) => d.status !== 'delivered' && d.status !== 'returned')

  return (
    <div>
      {active.map((record) => (
        <DispatchRow key={record.id} record={record} />
      ))}
    </div>
  )
})
