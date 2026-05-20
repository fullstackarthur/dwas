import { memo } from 'react'
import { FiClock, FiDollarSign, FiTruck, FiFileText, FiNavigation } from 'react-icons/fi'
import clsx from 'clsx'
import { mockApprovalRequests } from '../../data/mock/operational'
import type { ApprovalRequest } from '../../core/types'

function ApprovalRow({ approval }: { approval: ApprovalRequest }) {
  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    po: FiFileText,
    dispatch: FiTruck,
    payment: FiDollarSign,
    contract: FiFileText,
    reroute: FiNavigation,
  }

  const priorityColors: Record<string, string> = {
    critical: 'text-error-red',
    high: 'text-warning-yellow',
    medium: 'text-info-cyan',
    low: 'text-text-muted',
  }

  const Icon = typeIcons[approval.type] || FiClock

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const isOverdue = approval.dueDate && new Date(approval.dueDate) < new Date()

  return (
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-text-primary truncate">{approval.title}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={clsx('text-[10px] font-medium', priorityColors[approval.priority])}>
              {approval.priority}
            </span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{approval.requester.name}</span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{timeAgo(approval.requestedAt)}</span>
            {isOverdue && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-error-red font-medium">OVERDUE</span>
              </>
            )}
          </div>
        </div>
        {approval.amount && (
          <span className="text-[12px] font-medium text-text-secondary flex-shrink-0">
            ₹{(approval.amount / 100000).toFixed(1)}L
          </span>
        )}
      </div>
    </div>
  )
}

export const PendingApprovalsWidget = memo(function PendingApprovalsWidget() {
  const pending = mockApprovalRequests.filter((a) => a.status === 'pending')

  return (
    <div>
      <div className="px-3 py-1.5 border-b border-divider flex items-center justify-between">
        <span className="text-[11px] text-text-muted">{pending.length} pending approval{pending.length !== 1 ? 's' : ''}</span>
        <button className="text-[11px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
          View all
        </button>
      </div>
      <div>
        {pending.slice(0, 5).map((approval) => (
          <ApprovalRow key={approval.id} approval={approval} />
        ))}
      </div>
    </div>
  )
})
