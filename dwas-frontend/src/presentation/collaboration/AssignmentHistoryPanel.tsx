import { memo } from 'react'
import { useCollaborationStore } from '../stores/notificationStore'
import { FiUser, FiArrowRight } from 'react-icons/fi'

export const AssignmentHistoryPanel = memo(function AssignmentHistoryPanel() {
  const { assignmentEvents } = useCollaborationStore()

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
        <span className="text-[11px] font-medium text-text-muted">{assignmentEvents.length} assignment{assignmentEvents.length !== 1 ? 's' : ''}</span>
      </div>
      {assignmentEvents.map((event) => (
        <div key={event.id} className="px-3 py-2.5 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] text-text-primary truncate">{event.itemTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
            <FiUser className="w-3 h-3" />
            <span>{event.assignedBy.name}</span>
            <FiArrowRight className="w-3 h-3" />
            <span className="text-text-secondary">{event.assignedTo.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-text-muted">{event.queueType}</span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{timeAgo(event.timestamp)}</span>
          </div>
          {event.reason && (
            <div className="text-[10px] text-text-secondary mt-1">{event.reason}</div>
          )}
        </div>
      ))}
    </div>
  )
})
