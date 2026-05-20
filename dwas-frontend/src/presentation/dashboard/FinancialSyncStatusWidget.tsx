import { memo } from 'react'
import { FiDollarSign, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi'
import clsx from 'clsx'

const financialItems = [
  { id: 'fs-1', label: 'Pending Payments', value: '₹51.2L', count: 3, status: 'warning', icon: FiClock },
  { id: 'fs-2', label: 'Overdue', value: '₹18.4L', count: 1, status: 'critical', icon: FiAlertTriangle },
  { id: 'fs-3', label: 'Processed Today', value: '₹12.8L', count: 2, status: 'success', icon: FiCheckCircle },
  { id: 'fs-4', label: 'Monthly Total', value: '₹2.4Cr', status: 'info', icon: FiDollarSign },
]

export const FinancialSyncStatusWidget = memo(function FinancialSyncStatusWidget() {
  const statusColors: Record<string, string> = {
    success: 'text-success-green',
    warning: 'text-warning-yellow',
    critical: 'text-error-red',
    info: 'text-text-secondary',
  }

  return (
    <div className="divide-y divide-divider">
      {financialItems.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.id} className="px-3 py-2 flex items-center gap-3">
            <Icon className={clsx('w-4 h-4 flex-shrink-0', statusColors[item.status])} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-secondary">{item.label}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-semibold text-text-primary">{item.value}</div>
              {item.count !== undefined && (
                <div className={clsx('text-[10px]', statusColors[item.status])}>{item.count} item{item.count !== 1 ? 's' : ''}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})
