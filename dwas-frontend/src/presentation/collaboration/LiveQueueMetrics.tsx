import { memo } from 'react'
import { useQueueStore } from '../stores'
import { FiList, FiAlertTriangle, FiClock, FiCheckCircle } from 'react-icons/fi'
import clsx from 'clsx'

export const LiveQueueMetrics = memo(function LiveQueueMetrics() {
  const { items } = useQueueStore()

  const metrics = [
    { label: 'Total Items', value: items.length, icon: FiList, color: 'text-text-secondary' },
    { label: 'Critical', value: items.filter((i) => i.priority === 'critical').length, icon: FiAlertTriangle, color: 'text-error-red' },
    { label: 'In Progress', value: items.filter((i) => i.status === 'in_progress').length, icon: FiClock, color: 'text-active-blue' },
    { label: 'Resolved', value: items.filter((i) => i.status === 'resolved' || i.status === 'closed').length, icon: FiCheckCircle, color: 'text-success-green' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {metrics.map((m) => {
        const Icon = m.icon
        return (
          <div key={m.label} className="flex items-center gap-2">
            <Icon className={clsx('w-4 h-4', m.color)} />
            <div>
              <div className="text-[16px] font-semibold text-text-primary leading-none">{m.value}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{m.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
