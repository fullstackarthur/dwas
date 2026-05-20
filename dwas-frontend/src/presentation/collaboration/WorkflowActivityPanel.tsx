import { memo } from 'react'
import { useCollaborationStore } from '../stores/notificationStore'
import { FiArrowRight, FiUser } from 'react-icons/fi'

export const WorkflowActivityPanel = memo(function WorkflowActivityPanel() {
  const { auditEntries } = useCollaborationStore()

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
        <span className="text-[11px] font-medium text-text-muted">Workflow Activity</span>
      </div>
      {auditEntries.map((entry) => (
        <div key={entry.id} className="px-3 py-2.5 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-start gap-2">
            <FiArrowRight className="w-3.5 h-3.5 text-text-muted mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-text-primary">{entry.action}</span>
                <span className="text-[12px] text-text-secondary truncate">{entry.target}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[10px] text-text-muted">
                  <FiUser className="w-3 h-3" />
                  {entry.actor.name}
                </span>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-text-muted">{timeAgo(entry.timestamp)}</span>
              </div>
              {entry.details && (
                <div className="text-[10px] text-text-secondary mt-1">{entry.details}</div>
              )}
              {entry.oldValue && entry.newValue && (
                <div className="flex items-center gap-1 mt-1 text-[10px]">
                  <span className="text-text-muted">{entry.oldValue}</span>
                  <FiArrowRight className="w-3 h-3 text-text-muted" />
                  <span className="text-active-blue">{entry.newValue}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})
