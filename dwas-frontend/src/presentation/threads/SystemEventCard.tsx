import { memo } from 'react'
import type { TimelineEvent } from '../../core/types/thread'
import { FiSettings } from 'react-icons/fi'

export const SystemEventCard = memo(function SystemEventCard({ event }: { event: TimelineEvent }) {
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
      <div className="p-1.5 rounded bg-bg-tertiary flex-shrink-0 mt-0.5">
        <FiSettings className="w-3.5 h-3.5 text-text-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-text-secondary">{event.title}</div>
        {event.description && (
          <div className="text-[11px] text-text-muted mt-0.5 leading-snug">{event.description}</div>
        )}
        <div className="text-[10px] text-text-muted mt-1">{timeAgo(event.timestamp)}</div>
      </div>
    </div>
  )
})
