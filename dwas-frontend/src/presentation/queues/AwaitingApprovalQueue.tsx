import { memo } from 'react'
import { mockApprovalRequests } from '../../data/mock/operational'
import type { ApprovalRequest } from '../../core/types'
import { FiClock, FiDollarSign, FiFileText, FiTruck, FiNavigation, FiCheckCircle } from 'react-icons/fi'
import clsx from 'clsx'

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
  const isOverdue = approval.dueDate && new Date(approval.dueDate) < new Date()

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120 group">
      <Icon className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-primary">{approval.title}</span>
          <span className={clsx('text-[10px] font-medium', priorityColors[approval.priority])}>{approval.priority}</span>
          {isOverdue && <span className="text-[10px] text-error-red font-medium">OVERDUE</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-text-muted">Requested by {approval.requester.name}</span>
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[11px] text-text-muted">{timeAgo(approval.requestedAt)}</span>
          {approval.dueDate && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className={clsx('text-[11px]', isOverdue ? 'text-error-red' : 'text-text-muted')}>
                Due {new Date(approval.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          )}
        </div>
      </div>
      {approval.amount && (
        <span className="text-[13px] font-medium text-text-secondary flex-shrink-0">
          ₹{(approval.amount / 100000).toFixed(1)}L
        </span>
      )}
    </div>
  )
}

export const AwaitingApprovalQueue = memo(function AwaitingApprovalQueue() {
  const pending = mockApprovalRequests.filter((a) => a.status === 'pending')
  const overdue = pending.filter((a) => a.dueDate && new Date(a.dueDate) < new Date())

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Awaiting Approval</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {pending.length} item{pending.length !== 1 ? 's' : ''} pending your approval
        </p>
      </div>

      {overdue.length > 0 && (
        <div className="px-3 py-1.5 border-b border-divider bg-error-red/5">
          <span className="text-[11px] text-error-red font-medium">
            {overdue.length} overdue approval{overdue.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {pending.length === 0 ? (
          <div className="p-8 text-center">
            <FiCheckCircle className="w-8 h-8 text-success-green mx-auto mb-2" />
            <div className="text-[14px] text-text-muted">All approvals are up to date</div>
          </div>
        ) : (
          pending.map((approval) => <ApprovalRow key={approval.id} approval={approval} />)
        )}
      </div>
    </div>
  )
})
