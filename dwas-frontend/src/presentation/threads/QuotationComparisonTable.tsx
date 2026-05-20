import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'
import clsx from 'clsx'

export const QuotationComparisonTable = memo(function QuotationComparisonTable() {
  const { vendorQuotations } = useThreadDataStore()
  const sorted = [...vendorQuotations].sort((a, b) => a.pricing - b.pricing)

  const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    submitted: FiClock,
    under_review: FiClock,
    accepted: FiCheckCircle,
    rejected: FiXCircle,
    counter_offered: FiClock,
  }

  const statusColors: Record<string, string> = {
    submitted: 'text-text-muted',
    under_review: 'text-warning-yellow',
    accepted: 'text-success-green',
    rejected: 'text-text-muted',
    counter_offered: 'text-info-cyan',
  }

  const lowestPrice = sorted[0]?.pricing || 0

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Quotation Comparison</h2>
      <div className="border border-border-panel rounded-md overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-bg-tertiary border-b border-divider">
              <th className="text-left px-3 py-2 text-text-muted font-medium">Vendor</th>
              <th className="text-right px-3 py-2 text-text-muted font-medium">Price/MT</th>
              <th className="text-center px-3 py-2 text-text-muted font-medium">Lead Time</th>
              <th className="text-center px-3 py-2 text-text-muted font-medium">Validity</th>
              <th className="text-center px-3 py-2 text-text-muted font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((q, i) => {
              const Icon = statusIcons[q.status] || FiClock
              const isLowest = q.pricing === lowestPrice && q.status !== 'rejected'

              return (
                <tr key={q.id} className={clsx('border-b border-divider last:border-0', isLowest && 'bg-success-green/5')}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {i === 0 && <span className="text-[10px] text-success-green font-medium">Best</span>}
                      <span className="text-text-primary">{q.vendorName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className={clsx('font-medium', isLowest ? 'text-success-green' : 'text-text-primary')}>
                      ₹{q.pricing.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-text-secondary">{q.leadTime}</td>
                  <td className="px-3 py-2 text-center text-text-secondary">{q.validityDays}d</td>
                  <td className="px-3 py-2 text-center">
                    <span className={clsx('flex items-center justify-center gap-1', statusColors[q.status])}>
                      <Icon className="w-3 h-3" />
                      <span className="capitalize text-[10px]">{q.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
})
