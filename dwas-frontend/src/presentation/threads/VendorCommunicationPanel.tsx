import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiClock } from 'react-icons/fi'
import clsx from 'clsx'

export const VendorCommunicationPanel = memo(function VendorCommunicationPanel() {
  const { vendorQuotations } = useThreadDataStore()

  const statusConfig: Record<string, { color: string; label: string; bg: string }> = {
    submitted: { color: 'text-text-secondary', label: 'Submitted', bg: 'bg-bg-tertiary' },
    under_review: { color: 'text-warning-yellow', label: 'Under Review', bg: 'bg-warning-yellow/10' },
    accepted: { color: 'text-success-green', label: 'Accepted', bg: 'bg-success-green/10' },
    rejected: { color: 'text-error-red', label: 'Rejected', bg: 'bg-error-red/10' },
    counter_offered: { color: 'text-info-cyan', label: 'Counter Offer', bg: 'bg-info-cyan/10' },
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Vendor Quotations</h2>
      <div className="space-y-2">
        {vendorQuotations.map((q) => {
          const conf = statusConfig[q.status] || statusConfig.submitted

          return (
            <div key={q.id} className="border border-border-panel rounded-md">
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-text-primary">{q.vendorName}</span>
                    <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', conf.bg, conf.color)}>
                      {conf.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-semibold text-text-primary">₹{q.pricing.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-text-muted">{q.currency}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    Lead: {q.leadTime}
                  </span>
                  <span>Valid: {q.validityDays} days</span>
                  <span>Submitted {timeAgo(q.submittedAt)}</span>
                </div>
                {q.terms && (
                  <div className="mt-2 text-[11px] text-text-secondary leading-snug">{q.terms}</div>
                )}
                {q.counterOffer && (
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="text-text-muted">Counter offer:</span>
                    <span className="text-info-cyan font-medium">₹{q.counterOffer.toLocaleString('en-IN')}/{q.currency}</span>
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
