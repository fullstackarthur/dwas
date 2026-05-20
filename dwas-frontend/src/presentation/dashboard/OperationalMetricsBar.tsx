import { memo } from 'react'
import { useAppStore } from '../stores'
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiAlertTriangle,
  FiClock,
  FiTruck,
  FiPackage,
  FiCpu,
} from 'react-icons/fi'
import clsx from 'clsx'

interface MetricItem {
  id: string
  label: string
  value: string | number
  delta?: number
  trend?: 'up' | 'down' | 'stable'
  unit?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const metrics: MetricItem[] = [
  { id: 'm-1', label: 'Active Queue Items', value: 27, delta: 3, trend: 'up', icon: FiList, color: 'text-active-blue' },
  { id: 'm-2', label: 'Pending Approvals', value: 5, delta: 1, trend: 'up', icon: FiClock, color: 'text-warning-yellow' },
  { id: 'm-3', label: 'Active Dispatches', value: 5, delta: 0, trend: 'stable', icon: FiTruck, color: 'text-info-cyan' },
  { id: 'm-4', label: 'Open RFQs', value: 3, delta: -1, trend: 'down', icon: FiPackage, color: 'text-success-green' },
  { id: 'm-5', label: 'Escalations', value: 3, delta: 1, trend: 'up', icon: FiAlertTriangle, color: 'text-error-red' },
  { id: 'm-6', label: 'AI Reviews Pending', value: 2, delta: 0, trend: 'stable', icon: FiCpu, color: 'text-text-muted' },
]

export const OperationalMetricsBar = memo(function OperationalMetricsBar() {
  const { syncStatus } = useAppStore()

  return (
    <div className="px-4 py-2 bg-bg-secondary border-b border-border-panel flex items-center gap-4 overflow-x-auto flex-shrink-0">
      {metrics.map((m) => {
        const Icon = m.icon
        const TrendIcon = m.trend === 'up' ? FiTrendingUp : m.trend === 'down' ? FiTrendingDown : FiMinus
        const trendColor = m.trend === 'up' ? 'text-error-red' : m.trend === 'down' ? 'text-success-green' : 'text-text-muted'

        return (
          <div key={m.id} className="flex items-center gap-2 pr-4 border-r border-divider last:border-0 flex-shrink-0">
            <Icon className={clsx('w-3.5 h-3.5', m.color)} />
            <div>
              <div className="text-[11px] text-text-muted">{m.label}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-semibold text-text-primary leading-none">{m.value}</span>
                {m.delta !== undefined && (
                  <span className={clsx('flex items-center gap-0.5 text-[10px]', trendColor)}>
                    <TrendIcon className="w-2.5 h-2.5" />
                    {m.delta > 0 ? '+' : ''}{m.delta}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
        <div className={clsx('w-1.5 h-1.5 rounded-full', syncStatus === 'synced' ? 'bg-success-green' : syncStatus === 'syncing' ? 'bg-warning-yellow animate-pulse' : 'bg-error-red')} />
        <span className="text-[11px] text-text-muted">{syncStatus === 'synced' ? 'Live' : syncStatus === 'syncing' ? 'Syncing' : 'Offline'}</span>
      </div>
    </div>
  )
})

import { FiList } from 'react-icons/fi'
