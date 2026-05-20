import { memo } from 'react'
import { FiMessageSquare, FiClock, FiUser } from 'react-icons/fi'
import { PriorityBadge, QueueStatusIndicator } from './Indicators'

interface ThreadPreviewCardProps {
  id: string
  subject: string
  queueType: string
  status: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  participantCount: number
  messageCount: number
  lastActivity: string
  lastMessagePreview?: string
  onClick?: () => void
}

export const ThreadPreviewCard = memo(function ThreadPreviewCard({
  subject,
  queueType,
  status,
  priority,
  participantCount,
  messageCount,
  lastActivity,
  lastMessagePreview,
  onClick,
}: ThreadPreviewCardProps) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 border-b border-divider hover:bg-hover-surface/50 transition-colors duration-120"
    >
      <div className="flex items-start gap-3">
        <FiMessageSquare className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-text-primary truncate">{subject}</span>
            <PriorityBadge priority={priority} variant="compact" />
          </div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span>{queueType}</span>
            <QueueStatusIndicator status={status} variant="dot" />
            <span className="flex items-center gap-1">
              <FiUser className="w-3 h-3" />
              {participantCount}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageSquare className="w-3 h-3" />
              {messageCount}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {timeAgo(lastActivity)}
            </span>
          </div>
          {lastMessagePreview && (
            <div className="text-[11px] text-text-secondary mt-1 truncate">{lastMessagePreview}</div>
          )}
        </div>
      </div>
    </button>
  )
})
