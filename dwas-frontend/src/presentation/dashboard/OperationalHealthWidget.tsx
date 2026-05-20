import { memo } from 'react'
import { mockOperationalHealth } from '../../data/mock/operational'
import type { OperationalHealthMetric } from '../../core/types'
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi'
import clsx from 'clsx'

function HealthRow({ metric }: { metric: OperationalHealthMetric }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; bg: string }> = {
    healthy: { color: 'text-success-green', icon: FiCheckCircle, bg: 'bg-success-green/10' },
    degraded: { color: 'text-warning-yellow', icon: FiAlertTriangle, bg: 'bg-warning-yellow/10' },
    critical: { color: 'text-error-red', icon: FiXCircle, bg: 'bg-error-red/10' },
  }

  const config = statusConfig[metric.status] || statusConfig.healthy
  const Icon = config.icon

  return (
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-center gap-2">
        <div className={clsx('p-1 rounded', config.bg)}>
          <Icon className={clsx('w-3 h-3', config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-text-primary">{metric.label}</div>
          <div className="text-[11px] text-text-muted mt-0.5">{metric.detail}</div>
        </div>
        {metric.value && (
          <span className="text-[12px] font-medium text-text-secondary flex-shrink-0">{metric.value}</span>
        )}
      </div>
    </div>
  )
}

export const OperationalHealthWidget = memo(function OperationalHealthWidget() {
  const criticalCount = mockOperationalHealth.filter((m) => m.status === 'critical').length
  const degradedCount = mockOperationalHealth.filter((m) => m.status === 'degraded').length

  return (
    <div>
      {(criticalCount > 0 || degradedCount > 0) && (
        <div className={clsx('px-3 py-1.5 border-b border-divider', criticalCount > 0 ? 'bg-error-red/5' : 'bg-warning-yellow/5')}>
          <span className={clsx('text-[11px] font-medium', criticalCount > 0 ? 'text-error-red' : 'text-warning-yellow')}>
            {criticalCount > 0 ? `${criticalCount} critical` : ''}
            {criticalCount > 0 && degradedCount > 0 ? ', ' : ''}
            {degradedCount > 0 ? `${degradedCount} degraded` : ''}
          </span>
        </div>
      )}
      <div>
        {mockOperationalHealth.map((metric) => (
          <HealthRow key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  )
})
