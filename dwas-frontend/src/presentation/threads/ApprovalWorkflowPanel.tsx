import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCheckCircle, FiXCircle, FiClock, FiMinus, FiUser } from 'react-icons/fi'
import clsx from 'clsx'

export const ApprovalWorkflowPanel = memo(function ApprovalWorkflowPanel() {
  const { approvalSteps } = useThreadDataStore()

  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string; bg: string }> = {
    pending: { color: 'text-warning-yellow', icon: FiClock, label: 'Pending', bg: 'bg-warning-yellow/10' },
    approved: { color: 'text-success-green', icon: FiCheckCircle, label: 'Approved', bg: 'bg-success-green/10' },
    rejected: { color: 'text-error-red', icon: FiXCircle, label: 'Rejected', bg: 'bg-error-red/10' },
    skipped: { color: 'text-text-muted', icon: FiMinus, label: 'Skipped', bg: 'bg-text-muted/10' },
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
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Approval Workflow</h2>
      <div className="space-y-0">
        {approvalSteps.map((step, i) => {
          const conf = statusConfig[step.status] || statusConfig.pending
          const Icon = conf.icon

          return (
            <div key={step.id} className={clsx('border border-border-panel rounded-md', i > 0 && 'mt-2')}>
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={clsx('p-1 rounded', conf.bg)}>
                      <Icon className={clsx('w-3.5 h-3.5', conf.color)} />
                    </div>
                    <span className="text-[13px] font-medium text-text-primary">{step.title}</span>
                  </div>
                  <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', conf.bg, conf.color)}>
                    {conf.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <FiUser className="w-3 h-3" />
                    {step.approver.name}
                  </span>
                  <span>Requested {timeAgo(step.requestedAt)}</span>
                  {step.respondedAt && (
                    <>
                      <span className="text-text-muted text-[10px]">·</span>
                      <span>Responded {timeAgo(step.respondedAt)}</span>
                    </>
                  )}
                </div>
                {step.comment && (
                  <div className="mt-2 p-2 bg-bg-tertiary rounded text-[11px] text-text-secondary leading-snug">
                    {step.comment}
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
