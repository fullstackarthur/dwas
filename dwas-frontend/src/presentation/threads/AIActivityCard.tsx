import { memo } from 'react'
import type { TimelineEvent } from '../../core/types/thread'
import { FiCpu } from 'react-icons/fi'
import clsx from 'clsx'

export const AIActivityCard = memo(function AIActivityCard({ event }: { event: TimelineEvent }) {
  const Icon = FiCpu
  const confidence = event.confidence ? Math.round(event.confidence * 100) : null
  const confidenceColor = confidence && confidence >= 85 ? 'text-success-green' : confidence && confidence >= 70 ? 'text-warning-yellow' : 'text-text-muted'

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-divider last:border-0 bg-active-blue/5 hover:bg-active-blue/10 transition-colors duration-120">
      <div className="p-1.5 rounded bg-bg-tertiary flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-active-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[12px] font-medium text-active-blue">
            <FiCpu className="w-3 h-3" />
            DWAS AI
          </span>
          <span className="text-[12px] text-text-secondary">{event.title}</span>
          {confidence !== null && (
            <span className={clsx('text-[10px] font-medium', confidenceColor)}>{confidence}%</span>
          )}
        </div>
        {event.description && (
          <div className="text-[11px] text-text-muted mt-0.5 leading-snug">{event.description}</div>
        )}
        <div className="text-[10px] text-text-muted mt-1">{timeAgo(event.timestamp)}</div>
      </div>
    </div>
  )
})
