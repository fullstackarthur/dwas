import { memo } from 'react'
import type { TimelineEvent } from '../../core/types/thread'
import { FiUser, FiCheckCircle, FiFileText, FiTruck, FiMessageSquare } from 'react-icons/fi'
import clsx from 'clsx'

export const HumanActivityCard = memo(function HumanActivityCard({ event }: { event: TimelineEvent }) {
  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    human_activity: FiUser,
    approval_event: FiCheckCircle,
    dispatch_event: FiTruck,
    document_event: FiFileText,
  }

  const typeColors: Record<string, string> = {
    human_activity: 'text-text-muted',
    approval_event: 'text-success-green',
    dispatch_event: 'text-active-blue',
    document_event: 'text-info-cyan',
  }

  const Icon = typeIcons[event.type] || FiMessageSquare
  const color = typeColors[event.type] || 'text-text-muted'

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/30 transition-colors duration-120">
      <div className={clsx('p-1.5 rounded bg-bg-tertiary flex-shrink-0 mt-0.5')}>
        <Icon className={clsx('w-3.5 h-3.5', color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {event.author && (
            <span className="text-[12px] font-medium text-text-primary">{event.author.name}</span>
          )}
          <span className="text-[12px] text-text-secondary">{event.title}</span>
        </div>
        {event.description && (
          <div className="text-[11px] text-text-muted mt-0.5 leading-snug">{event.description}</div>
        )}
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {Object.entries(event.metadata).slice(0, 3).map(([key, value]) => (
              <span key={key} className="text-[10px] bg-bg-tertiary text-text-muted px-1.5 py-0.5 rounded border border-border-panel">
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
        <div className="text-[10px] text-text-muted mt-1">{timeAgo(event.timestamp)}</div>
      </div>
    </div>
  )
})
