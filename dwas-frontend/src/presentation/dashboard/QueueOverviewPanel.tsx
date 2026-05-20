import { memo } from 'react'
import {
  FiList,
  FiAlertTriangle,
  FiClock,
  FiTruck,
  FiMessageSquare,
  FiCpu,
} from 'react-icons/fi'
import clsx from 'clsx'

interface QueueStat {
  id: string
  label: string
  count: number
  active: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend?: { value: number; direction: 'up' | 'down' }
}

const queueStats: QueueStat[] = [
  { id: 'qs-1', label: 'Dispatch', count: 8, active: 3, icon: FiTruck, color: 'text-active-blue', trend: { value: 2, direction: 'up' } },
  { id: 'qs-2', label: 'Procurement', count: 5, active: 2, icon: FiList, color: 'text-success-green', trend: { value: 1, direction: 'up' } },
  { id: 'qs-3', label: 'Logistics', count: 6, active: 2, icon: FiClock, color: 'text-info-cyan' },
  { id: 'qs-4', label: 'Vendor Comm.', count: 3, active: 1, icon: FiMessageSquare, color: 'text-warning-yellow' },
  { id: 'qs-5', label: 'AI Review', count: 2, active: 1, icon: FiCpu, color: 'text-text-muted' },
  { id: 'qs-6', label: 'Escalations', count: 3, active: 2, icon: FiAlertTriangle, color: 'text-error-red', trend: { value: 1, direction: 'up' } },
]

export const QueueOverviewPanel = memo(function QueueOverviewPanel() {
  return (
    <div className="divide-y divide-divider">
      {queueStats.map((qs) => {
        const Icon = qs.icon
        return (
          <div key={qs.id} className="px-3 py-2 flex items-center gap-3 hover:bg-hover-surface/50 transition-colors duration-120">
            <Icon className={clsx('w-4 h-4 flex-shrink-0', qs.color)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-secondary">{qs.label}</span>
                <span className="text-[12px] font-medium text-text-primary">{qs.count}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[11px] text-text-muted">{qs.active} active</span>
                {qs.trend && (
                  <span className={clsx('text-[10px]', qs.trend.direction === 'up' ? 'text-error-red' : 'text-success-green')}>
                    {qs.trend.direction === 'up' ? '+' : ''}{qs.trend.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
