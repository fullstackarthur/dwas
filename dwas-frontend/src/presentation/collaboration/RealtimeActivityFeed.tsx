import { memo } from 'react'
import { useRealtimeEventStore } from '../stores/realtimeStore'
import { FiUser, FiCpu, FiSettings, FiAlertTriangle, FiTruck, FiClock, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx'

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  queue_item_created: FiClock,
  queue_item_updated: FiArrowRight,
  queue_item_assigned: FiUser,
  thread_message: FiClock,
  approval_requested: FiClock,
  approval_responded: FiCheckCircle,
  dispatch_started: FiTruck,
  dispatch_delayed: FiAlertTriangle,
  dispatch_delivered: FiCheckCircle,
  escalation_raised: FiAlertTriangle,
  sla_warning: FiAlertTriangle,
  sla_breached: FiAlertTriangle,
  ai_recommendation: FiCpu,
  ai_review_completed: FiCpu,
  user_status_changed: FiUser,
  system_sync: FiSettings,
}

const typeColors: Record<string, string> = {
  queue_item_created: 'text-active-blue',
  queue_item_updated: 'text-text-muted',
  queue_item_assigned: 'text-info-cyan',
  thread_message: 'text-text-secondary',
  approval_requested: 'text-warning-yellow',
  approval_responded: 'text-success-green',
  dispatch_started: 'text-active-blue',
  dispatch_delayed: 'text-error-red',
  dispatch_delivered: 'text-success-green',
  escalation_raised: 'text-error-red',
  sla_warning: 'text-warning-yellow',
  sla_breached: 'text-error-red',
  ai_recommendation: 'text-active-blue',
  ai_review_completed: 'text-active-blue',
  user_status_changed: 'text-text-muted',
  system_sync: 'text-text-muted',
}

export const RealtimeActivityFeed = memo(function RealtimeActivityFeed() {
  const { getRecentEvents } = useRealtimeEventStore()
  const events = getRecentEvents(15)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    return `${hours}h ago`
  }

  return (
    <div className="divide-y divide-divider">
      {events.length === 0 ? (
        <div className="p-4 text-center">
          <FiClock className="w-6 h-6 text-text-muted mx-auto mb-2" />
          <div className="text-[12px] text-text-muted">No recent activity</div>
        </div>
      ) : (
        events.map((event) => {
          const Icon = typeIcons[event.type] || FiSettings
          const color = typeColors[event.type] || 'text-text-muted'

          return (
            <div key={event.id} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
              <div className="flex items-start gap-2">
                <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', color)} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-text-primary capitalize">
                    {event.type.replace(/_/g, ' ')}
                  </div>
                  {event.user && (
                    <div className="text-[11px] text-text-muted mt-0.5">
                      {event.user.name}
                    </div>
                  )}
                  <div className="text-[10px] text-text-muted mt-0.5">{timeAgo(event.timestamp)}</div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
})
