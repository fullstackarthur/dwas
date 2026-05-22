import { memo } from 'react'
import { FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi'
import clsx from 'clsx'
import type { VendorResponse } from '../../core/types'

const mockVendorResponses: VendorResponse[] = []

function VendorResponseRow({ response }: { response: VendorResponse }) {
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
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-center gap-2">
        <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-text-primary">{response.vendorName}</span>
            <span className={clsx('text-[10px] font-medium', config.color)}>{config.label}</span>
          </div>
          <div className="text-[11px] text-text-secondary truncate mt-0.5">{response.rfqTitle}</div>
          <div className="flex items-center gap-2 mt-0.5">
            {response.pricing && (
              <span className="text-[10px] text-text-secondary">₹{response.pricing.toLocaleString('en-IN')}/{response.currency}</span>
            )}
            {response.leadTime && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-text-muted">Lead: {response.leadTime}</span>
              </>
            )}
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{timeAgo(response.submittedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const VendorResponseWidget = memo(function VendorResponseWidget() {
  return (
    <div>
      {mockVendorResponses.slice(0, 5).map((response) => (
        <VendorResponseRow key={response.id} response={response} />
      ))}
    </div>
  )
})
