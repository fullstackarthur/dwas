import { memo } from 'react'
import { useThreadDataStore, useThreadWorkspaceStore } from '../stores/threadStore'
import { TimelineEventCard } from './TimelineEventCard'
import { FiX } from 'react-icons/fi'
import clsx from 'clsx'

const filterOptions = [
  { id: null, label: 'All' },
  { id: 'human_activity', label: 'Human' },
  { id: 'ai_activity', label: 'AI' },
  { id: 'system_event', label: 'System' },
  { id: 'workflow_transition', label: 'Workflow' },
  { id: 'approval_event', label: 'Approval' },
  { id: 'dispatch_event', label: 'Dispatch' },
  { id: 'document_event', label: 'Document' },
]

export const OperationalTimeline = memo(function OperationalTimeline() {
  const { timelineEvents } = useThreadDataStore()
  const { timelineFilter, setTimelineFilter } = useThreadWorkspaceStore()

  const filtered = timelineFilter
    ? timelineEvents.filter((e) => e.type === timelineFilter)
    : timelineEvents

  const groupedByDate = filtered.reduce<Record<string, typeof timelineEvents>>((acc, event) => {
    const date = new Date(event.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(event)
    return acc
  }, {})

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[14px] font-semibold text-text-primary">Operational Timeline</h2>
        <div className="flex items-center gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.id || 'all'}
              onClick={() => setTimelineFilter(opt.id)}
              className={clsx(
                'px-2 py-1 text-[10px] rounded border transition-colors duration-120',
                timelineFilter === opt.id
                  ? 'bg-selected-surface text-text-primary border-border-panel'
                  : 'text-text-muted border-transparent hover:bg-hover-surface'
              )}
            >
              {opt.label}
            </button>
          ))}
          {timelineFilter && (
            <button
              onClick={() => setTimelineFilter(null)}
              className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedByDate).map(([date, events]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-border-panel" />
              <span className="text-[11px] font-medium text-text-muted">{date}</span>
              <div className="flex-1 h-px bg-divider" />
              <span className="text-[10px] text-text-muted">{events.length} event{events.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="ml-1 space-y-0">
              {events.map((event) => (
                <TimelineEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
