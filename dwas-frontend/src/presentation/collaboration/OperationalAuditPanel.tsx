import { memo } from 'react'
import { useCollaborationStore } from '../stores/notificationStore'
import { FiFileText, FiClock, FiArrowRight } from 'react-icons/fi'

export const OperationalAuditPanel = memo(function OperationalAuditPanel() {
  const { auditEntries } = useCollaborationStore()

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    queue_item: FiFileText,
    thread: FiFileText,
    approval: FiClock,
    dispatch: FiFileText,
    vendor: FiFileText,
    system: FiFileText,
  }

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Operational Audit Log</h2>
      <div className="space-y-0">
        {auditEntries.map((entry) => {
          const Icon = typeIcons[entry.targetType] || FiFileText

          return (
            <div key={entry.id} className="flex items-start gap-3 py-2.5 border-b border-divider last:border-0">
              <Icon className="w-3.5 h-3.5 text-text-muted mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-text-primary">{entry.action}</span>
                  <span className="text-[12px] text-text-secondary truncate">{entry.target}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-text-muted">{entry.actor.name}</span>
                  <span className="text-text-muted text-[10px]">·</span>
                  <span className="text-[10px] text-text-muted">{timeAgo(entry.timestamp)}</span>
                  <span className="text-text-muted text-[10px]">·</span>
                  <span className="text-[10px] text-text-muted capitalize">{entry.targetType.replace('_', ' ')}</span>
                </div>
                {entry.details && (
                  <div className="text-[10px] text-text-secondary mt-1">{entry.details}</div>
                )}
                {entry.oldValue && entry.newValue && (
                  <div className="flex items-center gap-1 mt-1 text-[10px]">
                    <span className="text-text-muted line-through">{entry.oldValue}</span>
                    <FiArrowRight className="w-3 h-3 text-text-muted" />
                    <span className="text-active-blue">{entry.newValue}</span>
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
