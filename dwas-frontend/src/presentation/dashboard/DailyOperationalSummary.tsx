import { memo } from 'react'
import { FiTruck, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi'
import clsx from 'clsx'

const mockDispatchRecords: { id: string; status: string }[] = []

export const DailyOperationalSummary = memo(function DailyOperationalSummary() {
  const today = new Date()
  const dispatches = mockDispatchRecords
  const totalDispatches = dispatches.length
  const delivered = dispatches.filter((d) => d.status === 'delivered').length
  const inTransit = dispatches.filter((d) => d.status === 'in_transit').length
  const delayed = dispatches.filter((d) => d.status === 'delayed').length

  const summary = [
    { label: 'Total Dispatches', value: totalDispatches, icon: FiTruck, color: 'text-text-secondary' },
    { label: 'Delivered', value: delivered, icon: FiCheckCircle, color: 'text-success-green' },
    { label: 'In Transit', value: inTransit, icon: FiClock, color: 'text-active-blue' },
    { label: 'Delayed', value: delayed, icon: FiAlertTriangle, color: 'text-error-red' },
  ]

  return (
    <div className="p-3">
      <div className="text-[11px] text-text-muted mb-2">
        {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {summary.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="flex items-center gap-2">
              <Icon className={clsx('w-4 h-4', s.color)} />
              <div>
                <div className="text-[16px] font-semibold text-text-primary leading-none">{s.value}</div>
                <div className="text-[10px] text-text-muted mt-0.5">{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
