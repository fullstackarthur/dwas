import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi'
import clsx from 'clsx'

const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  open: { color: 'text-warning-yellow', icon: FiAlertTriangle, label: 'Open' },
  in_progress: { color: 'text-active-blue', icon: FiClock, label: 'In Progress' },
  in_transit: { color: 'text-info-cyan', icon: FiClock, label: 'In Transit' },
  awaiting_review: { color: 'text-warning-yellow', icon: FiClock, label: 'Awaiting Review' },
  awaiting_approval: { color: 'text-warning-yellow', icon: FiClock, label: 'Awaiting Approval' },
  resolved: { color: 'text-success-green', icon: FiCheckCircle, label: 'Resolved' },
  closed: { color: 'text-text-muted', icon: FiCheckCircle, label: 'Closed' },
  delivered: { color: 'text-success-green', icon: FiCheckCircle, label: 'Delivered' },
  delayed: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Delayed' },
}

export const ThreadStatusRail = memo(function ThreadStatusRail() {
  const { dispatchInfo, approvalSteps } = useThreadDataStore()
  const status = dispatchInfo[0]?.status || 'in_progress'
  const statusConf = statusConfig[status] || statusConfig.open
  const StatusIcon = statusConf.icon

  const pendingApprovals = approvalSteps.filter((a) => a.status === 'pending').length
  const approvedApprovals = approvalSteps.filter((a) => a.status === 'approved').length

  return (
    <div className="px-4 py-2 border-b border-divider bg-bg-secondary/80 flex items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <StatusIcon className={clsx('w-4 h-4', statusConf.color)} />
        <span className={clsx('text-[13px] font-medium', statusConf.color)}>{statusConf.label}</span>
      </div>
      <div className="w-px h-4 bg-divider" />
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-text-muted">Approvals:</span>
        <span className="text-[11px] text-success-green">{approvedApprovals} approved</span>
        {pendingApprovals > 0 && (
          <span className="text-[11px] text-warning-yellow">{pendingApprovals} pending</span>
        )}
      </div>
      <div className="w-px h-4 bg-divider" />
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-text-muted">Queue:</span>
        <span className="text-[11px] text-text-secondary">Dispatch</span>
      </div>
      <div className="w-px h-4 bg-divider" />
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-text-muted">Priority:</span>
        <span className="text-[11px] text-error-red font-medium">Critical</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-text-muted">PO#48291</span>
      </div>
    </div>
  )
})
