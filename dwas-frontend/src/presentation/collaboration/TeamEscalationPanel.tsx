import { memo } from 'react'
import { useCollaborationStore } from '../stores/notificationStore'
import { FiAlertTriangle } from 'react-icons/fi'

export const TeamEscalationPanel = memo(function TeamEscalationPanel() {
  const { auditEntries } = useCollaborationStore()
  const escalations = auditEntries.filter((e) => e.action.toLowerCase().includes('escalat') || e.targetType === 'system')

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
        <span className="text-[11px] font-medium text-text-muted">Team Escalations</span>
      </div>
      {escalations.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <FiAlertTriangle className="w-5 h-5 text-text-muted mx-auto mb-1" />
          <div className="text-[12px] text-text-muted">No active escalations</div>
        </div>
      ) : (
        escalations.map((entry) => (
          <div key={entry.id} className="px-3 py-2.5">
            <div className="flex items-center gap-2 mb-1">
              <FiAlertTriangle className="w-3.5 h-3.5 text-error-red" />
              <span className="text-[12px] font-medium text-text-primary">{entry.target}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span>{entry.actor.name}</span>
              <span>·</span>
              <span>{timeAgo(entry.timestamp)}</span>
            </div>
            {entry.details && (
              <div className="text-[11px] text-text-secondary mt-1">{entry.details}</div>
            )}
          </div>
        ))
      )}
    </div>
  )
})
