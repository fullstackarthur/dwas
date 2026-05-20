import { memo } from 'react'
import type { TimelineEvent } from '../../core/types/thread'
import { FiArrowRight } from 'react-icons/fi'

export const WorkflowTransitionCard = memo(function WorkflowTransitionCard({ event }: { event: TimelineEvent }) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const fromState = event.metadata?.from as string | undefined
  const toState = event.metadata?.to as string | undefined

  const stateLabels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    in_transit: 'In Transit',
    awaiting_review: 'Awaiting Review',
    awaiting_approval: 'Awaiting Approval',
    resolved: 'Resolved',
    closed: 'Closed',
    delivered: 'Delivered',
    delayed: 'Delayed',
  }

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-divider last:border-0 bg-warning-yellow/5 hover:bg-warning-yellow/10 transition-colors duration-120">
      <div className="p-1.5 rounded bg-bg-tertiary flex-shrink-0 mt-0.5">
        <FiArrowRight className="w-3.5 h-3.5 text-warning-yellow" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-warning-yellow">Workflow Transition</span>
          {fromState && toState && (
            <span className="text-[11px] text-text-secondary">
              {stateLabels[fromState] || fromState}
              {' → '}
              {stateLabels[toState] || toState}
            </span>
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
