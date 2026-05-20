import { memo } from 'react'
import type { TimelineEvent } from '../../core/types/thread'
import { HumanActivityCard } from './HumanActivityCard'
import { AIActivityCard } from './AIActivityCard'
import { SystemEventCard } from './SystemEventCard'
import { WorkflowTransitionCard } from './WorkflowTransitionCard'

interface TimelineEventCardProps {
  event: TimelineEvent
}

export const TimelineEventCard = memo(function TimelineEventCard({ event }: TimelineEventCardProps) {
  switch (event.type) {
    case 'human_activity':
      return <HumanActivityCard event={event} />
    case 'ai_activity':
      return <AIActivityCard event={event} />
    case 'system_event':
      return <SystemEventCard event={event} />
    case 'workflow_transition':
      return <WorkflowTransitionCard event={event} />
    case 'approval_event':
      return <HumanActivityCard event={event} />
    case 'dispatch_event':
      return <HumanActivityCard event={event} />
    case 'document_event':
      return <HumanActivityCard event={event} />
    default:
      return <HumanActivityCard event={event} />
  }
})
