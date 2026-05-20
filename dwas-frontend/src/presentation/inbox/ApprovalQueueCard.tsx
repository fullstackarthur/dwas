import { memo } from 'react'
import { FiClock, FiDollarSign, FiCheckCircle, FiXCircle, FiArrowRight } from 'react-icons/fi'
import { PriorityBadge } from './Indicators'
import type { ApprovalRequest } from '../../core/types'

interface ApprovalQueueCardProps {
  approval: ApprovalRequest
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onView?: (id: string) => void
}

export const ApprovalQueueCard = memo(function ApprovalQueueCard({
  approval,
  onApprove,
  onReject,
  onView,
}: ApprovalQueueCardProps) {
  const typeLabels: Record<string, string> = {
    po: 'Purchase Order',
    dispatch: 'Dispatch',
    payment: 'Payment',
    contract: 'Contract',
    reroute: 'Re-route',
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const isOverdue = approval.dueDate && new Date(approval.dueDate) < new Date()

  return (
    <div className="px-4 py-3 border-b border-divider hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-start gap-3">
        <FiClock className="w-4 h-4 text-warning-yellow mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-text-primary">{approval.title}</span>
            <PriorityBadge priority={approval.priority} variant="compact" />
            {isOverdue && <span className="text-[10px] text-error-red font-medium">OVERDUE</span>}
          </div>
          {approval.description && (
            <div className="text-[12px] text-text-secondary mb-2 leading-snug">{approval.description}</div>
          )}
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span>Type: {typeLabels[approval.type]}</span>
            {approval.amount && (
              <span className="flex items-center gap-1">
                <FiDollarSign className="w-3 h-3" />
                ₹{(approval.amount / 100000).toFixed(1)}L
              </span>
            )}
            <span>Requested by {approval.requester.name}</span>
            <span>{timeAgo(approval.requestedAt)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onView?.(approval.id)}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-secondary bg-bg-tertiary border border-border-panel rounded hover:bg-hover-surface transition-colors duration-120"
            >
              <FiArrowRight className="w-3 h-3" />
              View details
            </button>
            {approval.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove?.(approval.id)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] text-success-green bg-success-green/10 border border-success-green/30 rounded hover:bg-success-green/20 transition-colors duration-120"
                >
                  <FiCheckCircle className="w-3 h-3" />
                  Approve
                </button>
                <button
                  onClick={() => onReject?.(approval.id)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] text-error-red bg-error-red/10 border border-error-red/30 rounded hover:bg-error-red/20 transition-colors duration-120"
                >
                  <FiXCircle className="w-3 h-3" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
