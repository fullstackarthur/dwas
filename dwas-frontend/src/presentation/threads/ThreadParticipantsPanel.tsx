import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import clsx from 'clsx'

export const ThreadParticipantsPanel = memo(function ThreadParticipantsPanel() {
  const { participants } = useThreadDataStore()

  const roleLabels: Record<string, string> = {
    requester: 'Requester',
    assignee: 'Assignee',
    approver: 'Approver',
    vendor: 'Vendor',
    driver: 'Driver',
    observer: 'Observer',
    ai: 'AI Assistant',
  }

  const roleColors: Record<string, string> = {
    requester: 'text-active-blue',
    assignee: 'text-success-green',
    approver: 'text-warning-yellow',
    vendor: 'text-info-cyan',
    driver: 'text-text-secondary',
    observer: 'text-text-muted',
    ai: 'text-active-blue',
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
      </div>
      {participants.map((p) => (
        <div key={p.user.id} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-selected-surface flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-medium text-text-secondary">
                {p.user.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] text-text-primary truncate">{p.user.name}</span>
                <span className={clsx('text-[9px] font-medium', roleColors[p.role] || 'text-text-muted')}>
                  {roleLabels[p.role]}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-text-muted">{p.contributionCount} contribution{p.contributionCount !== 1 ? 's' : ''}</span>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-text-muted">Active {timeAgo(p.lastActive)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})
