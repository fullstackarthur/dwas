import { memo } from 'react'
import clsx from 'clsx'
import type { RFQTimelineEvent } from '../../../core/types/rfq'
import { FiUser, FiCpu, FiSettings, FiArrowRight } from 'react-icons/fi'
import { formatDistanceToNow } from '../../../core/utils'

interface TimelineEventCardProps {
  event: RFQTimelineEvent
}

export const TimelineEventCard = memo(function TimelineEventCard({
  event,
}: TimelineEventCardProps) {
  const Icon =
    event.type === 'human' ? FiUser : event.type === 'ai' ? FiCpu : event.type === 'system' ? FiSettings : FiArrowRight

  return (
    <div className="flex items-start gap-3 pl-2">
      <div
        className={clsx(
          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 relative z-10',
          event.type === 'human' && 'bg-active-blue/20',
          event.type === 'ai' && 'bg-info-cyan/20',
          event.type === 'system' && 'bg-text-muted/20',
          event.type === 'workflow_transition' && 'bg-success-green/20'
        )}
      >
        <Icon
          className={clsx(
            'w-3 h-3',
            event.type === 'human' && 'text-active-blue',
            event.type === 'ai' && 'text-info-cyan',
            event.type === 'system' && 'text-text-muted',
            event.type === 'workflow_transition' && 'text-success-green'
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-text-primary">{event.title}</span>
          <span className="text-[10px] text-text-muted">
            {formatDistanceToNow(new Date(event.timestamp))}
          </span>
        </div>
        {event.description && (
          <p className="text-[11px] text-text-muted mt-0.5">{event.description}</p>
        )}
        {event.type === 'workflow_transition' && event.previousStage && event.newStage && (
          <div className="flex items-center gap-1 mt-1 text-[10px]">
            <span className="text-text-muted">{formatStage(event.previousStage)}</span>
            <FiArrowRight className="w-3 h-3 text-text-muted" />
            <span className="text-active-blue">{formatStage(event.newStage)}</span>
          </div>
        )}
        {event.actor && (
          <div className="text-[10px] text-text-muted mt-1">
            by {event.actor.name}
          </div>
        )}
      </div>
    </div>
  )
})

function formatStage(stage: string): string {
  return stage
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}