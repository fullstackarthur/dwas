import { memo } from 'react'
import { mockVendorResponses, mockRFQRecords } from '../../data/mock/operational'
import type { VendorResponse, RFQRecord } from '../../core/types'
import { FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi'
import clsx from 'clsx'

function VendorRow({ response }: { response: VendorResponse }) {
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
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120 group">
      <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', config.color)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-primary">{response.vendorName}</span>
          <span className={clsx('text-[10px] font-medium', config.color)}>{config.label}</span>
        </div>
        <div className="text-[11px] text-text-secondary truncate">{response.rfqTitle}</div>
      </div>
      {response.pricing && (
        <div className="text-right flex-shrink-0">
          <div className="text-[12px] font-medium text-text-primary">₹{response.pricing.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-text-muted">{response.currency}</div>
        </div>
      )}
      <div className="text-[11px] text-text-muted flex-shrink-0 w-16 text-right">{timeAgo(response.submittedAt)}</div>
    </div>
  )
}

function RFQSummaryRow({ rfq }: { rfq: RFQRecord }) {
  const statusColors: Record<string, string> = {
    open: 'text-active-blue',
    closing_soon: 'text-warning-yellow',
    closed: 'text-text-muted',
    awarded: 'text-success-green',
  }

  const responseRate = rfq.vendorCount > 0 ? Math.round((rfq.responseCount / rfq.vendorCount) * 100) : 0
  const daysLeft = Math.ceil((new Date(rfq.deadline).getTime() - Date.now()) / 86400000)

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-text-primary truncate">{rfq.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={clsx('text-[10px] font-medium', statusColors[rfq.status])}>{rfq.status.replace('_', ' ')}</span>
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[10px] text-text-muted">{rfq.responseCount}/{rfq.vendorCount} responses ({responseRate}%)</span>
          {rfq.status !== 'closed' && rfq.status !== 'awarded' && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className={clsx('text-[10px]', daysLeft <= 1 ? 'text-error-red' : 'text-text-muted')}>
                {daysLeft <= 0 ? 'Due today' : `${daysLeft}d left`}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const AwaitingVendorQueue = memo(function AwaitingVendorQueue() {
  const pendingResponses = mockVendorResponses.filter((r) => r.status === 'pending' || r.status === 'overdue')
  const openRFQs = mockRFQRecords.filter((r) => r.status === 'open' || r.status === 'closing_soon')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Awaiting Vendor Response</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {pendingResponses.length} pending response{pendingResponses.length !== 1 ? 's' : ''}, {openRFQs.length} open RFQ{openRFQs.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-3 py-1.5 border-b border-divider bg-warning-yellow/5">
        <span className="text-[11px] text-warning-yellow font-medium">
          {pendingResponses.filter((r) => r.status === 'overdue').length} overdue response{pendingResponses.filter((r) => r.status === 'overdue').length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 border-b border-divider bg-bg-tertiary/50">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">Pending Responses</span>
        </div>
        {pendingResponses.map((r) => (
          <VendorRow key={r.id} response={r} />
        ))}

        <div className="px-3 py-1.5 border-b border-divider bg-bg-tertiary/50 mt-2">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">Open RFQs</span>
        </div>
        {openRFQs.map((rfq) => (
          <RFQSummaryRow key={rfq.id} rfq={rfq} />
        ))}
      </div>
    </div>
  )
})
