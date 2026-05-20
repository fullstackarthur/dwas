import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import clsx from 'clsx'

export const FinancialSyncPanel = memo(function FinancialSyncPanel() {
  const { financialEntries } = useThreadDataStore()

  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    pending: { color: 'text-warning-yellow', icon: FiClock, label: 'Pending' },
    processed: { color: 'text-active-blue', icon: FiCheckCircle, label: 'Processed' },
    overdue: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Overdue' },
    completed: { color: 'text-success-green', icon: FiCheckCircle, label: 'Completed' },
  }

  const typeLabels: Record<string, string> = {
    po_value: 'PO Value',
    payment: 'Payment',
    invoice: 'Invoice',
    credit_note: 'Credit Note',
    freight: 'Freight',
  }

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Financial Overview</h2>
      <div className="space-y-0">
        {financialEntries.map((entry) => {
          const conf = statusConfig[entry.status] || statusConfig.pending
          const Icon = conf.icon

          return (
            <div key={entry.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
              <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', conf.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-text-primary">{typeLabels[entry.type]}</span>
                  <span className={clsx('text-[10px] font-medium', conf.color)}>{conf.label}</span>
                </div>
                {entry.reference && (
                  <div className="text-[10px] text-text-muted mt-0.5">{entry.reference}</div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[13px] font-medium text-text-primary">₹{entry.amount.toLocaleString('en-IN')}</div>
                {entry.dueDate && (
                  <div className="text-[10px] text-text-muted">
                    Due {new Date(entry.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
