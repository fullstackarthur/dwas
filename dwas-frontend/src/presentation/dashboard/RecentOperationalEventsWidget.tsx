import { memo } from 'react'
import { mockOperationalEvents } from '../../data/mock/operational'
import type { OperationalEvent } from '../../core/types'
import { FiTruck, FiPackage, FiAlertTriangle, FiClock, FiCpu, FiSettings } from 'react-icons/fi'
import clsx from 'clsx'

function EventRow({ event }: { event: OperationalEvent }) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    dispatch: FiTruck,
    procurement: FiPackage,
    escalation: FiAlertTriangle,
    approval: FiClock,
    ai_review: FiCpu,
    system: FiSettings,
  }

  const colorMap: Record<string, string> = {
    info: 'text-text-muted',
    warning: 'text-warning-yellow',
    critical: 'text-error-red',
  }

  const Icon = iconMap[event.type] || FiSettings

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-start gap-2">
        <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', colorMap[event.severity])} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-text-primary">{event.title}</div>
          <div className="text-[11px] text-text-secondary mt-0.5 leading-snug">{event.description}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-text-muted">{timeAgo(event.timestamp)}</span>
            {event.source && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-text-muted">{event.source}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const RecentOperationalEventsWidget = memo(function RecentOperationalEventsWidget() {
  return (
    <div>
      {mockOperationalEvents.slice(0, 6).map((event) => (
        <EventRow key={event.id} event={event} />
      ))}
    </div>
  )
})
