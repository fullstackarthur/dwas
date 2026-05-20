import { memo } from 'react'
import { FiDollarSign, FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi'
import clsx from 'clsx'
import type { VendorResponse } from '../../core/types'

interface VendorResponseCardProps {
  response: VendorResponse
  onClick?: () => void
}

export const VendorResponseCard = memo(function VendorResponseCard({ response, onClick }: VendorResponseCardProps) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    submitted: { color: 'text-success-green', icon: FiCheckCircle, label: 'Submitted' },
    pending: { color: 'text-warning-yellow', icon: FiClock, label: 'Pending' },
    overdue: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Overdue' },
    declined: { color: 'text-text-muted', icon: FiXCircle, label: 'Declined' },
  }

  const config = statusConfig[response.status] || statusConfig.pending
  const Icon = config.icon

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 border-b border-divider hover:bg-hover-surface/50 transition-colors duration-120"
    >
      <div className="flex items-start gap-3">
        <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-text-primary">{response.vendorName}</span>
            <span className={clsx('text-[10px] font-medium', config.color)}>{config.label}</span>
          </div>
          <div className="text-[12px] text-text-secondary mb-1">{response.rfqTitle}</div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            {response.pricing && (
              <span className="flex items-center gap-1">
                <FiDollarSign className="w-3 h-3" />
                ₹{response.pricing.toLocaleString('en-IN')}/{response.currency}
              </span>
            )}
            {response.leadTime && <span>Lead: {response.leadTime}</span>}
            <span>{timeAgo(response.submittedAt)}</span>
          </div>
          {response.message && (
            <div className="text-[11px] text-text-secondary mt-1 leading-snug">{response.message}</div>
          )}
        </div>
      </div>
    </button>
  )
})
