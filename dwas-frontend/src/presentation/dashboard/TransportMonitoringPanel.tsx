import { memo } from 'react'
import { mockTransportRecords } from '../../data/mock/operational'
import type { TransportRecord } from '../../core/types'
import { FiTruck, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi'
import clsx from 'clsx'

function TransportRow({ record }: { record: TransportRecord }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    available: { color: 'text-success-green', icon: FiCheckCircle, label: 'Available' },
    en_route: { color: 'text-active-blue', icon: FiTruck, label: 'En Route' },
    loading: { color: 'text-info-cyan', icon: FiClock, label: 'Loading' },
    maintenance: { color: 'text-warning-yellow', icon: FiClock, label: 'Maintenance' },
    offline: { color: 'text-text-muted', icon: FiTruck, label: 'Offline' },
  }

  const config = statusConfig[record.status] || statusConfig.offline
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
      <div className="flex items-center gap-2">
        <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono text-text-primary">{record.vehicleNumber}</span>
            <span className={clsx('text-[10px] font-medium', config.color)}>{config.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-text-secondary">{record.driverName}</span>
            {record.destination && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="flex items-center gap-1 text-[10px] text-text-muted">
                  <FiMapPin className="w-3 h-3" />
                  {record.destination}
                </span>
              </>
            )}
            {record.currentLoad && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-text-muted">{record.currentLoad}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-[10px] text-text-muted flex-shrink-0">{timeAgo(record.lastUpdate)}</div>
      </div>
    </div>
  )
}

export const TransportMonitoringPanel = memo(function TransportMonitoringPanel() {
  const active = mockTransportRecords.filter((r) => r.status !== 'offline')

  return (
    <div>
      {active.map((record) => (
        <TransportRow key={record.id} record={record} />
      ))}
    </div>
  )
})
