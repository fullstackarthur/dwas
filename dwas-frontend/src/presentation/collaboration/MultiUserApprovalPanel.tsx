import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCheckCircle, FiClock, FiXCircle, FiUser } from 'react-icons/fi'
import clsx from 'clsx'

export const MultiUserApprovalPanel = memo(function MultiUserApprovalPanel() {
  const { approvalSteps } = useThreadDataStore()

  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    pending: { color: 'text-warning-yellow', icon: FiClock, label: 'Pending' },
    approved: { color: 'text-success-green', icon: FiCheckCircle, label: 'Approved' },
    rejected: { color: 'text-error-red', icon: FiXCircle, label: 'Rejected' },
    skipped: { color: 'text-text-muted', icon: FiClock, label: 'Skipped' },
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">Multi-User Approvals</span>
      </div>
      {approvalSteps.map((step) => {
        const conf = statusConfig[step.status] || statusConfig.pending
        const Icon = conf.icon

        return (
          <div key={step.id} className="px-3 py-2.5 hover:bg-hover-surface/50 transition-colors duration-120">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={clsx('w-3.5 h-3.5', conf.color)} />
              <span className="text-[12px] text-text-primary">{step.title}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <FiUser className="w-3 h-3" />
                {step.approver.name}
              </span>
              <span className={clsx('font-medium', conf.color)}>{conf.label}</span>
              <span>·</span>
              <span>{timeAgo(step.requestedAt)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
})
