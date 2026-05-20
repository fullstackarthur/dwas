import { memo } from 'react'
import { useNotificationStore } from '../stores'
import { FiBell, FiAlertTriangle, FiCheckCircle, FiInfo, FiSettings } from 'react-icons/fi'
import clsx from 'clsx'

export const NotificationSummaryPanel = memo(function NotificationSummaryPanel() {
  const { notifications } = useNotificationStore()
  const unread = notifications.filter((n) => !n.read)
  const recent = notifications.slice(0, 5)

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    info: FiInfo,
    warning: FiAlertTriangle,
    error: FiAlertTriangle,
    success: FiCheckCircle,
    system: FiSettings,
  }

  const colorMap: Record<string, string> = {
    info: 'text-info-cyan',
    warning: 'text-warning-yellow',
    error: 'text-error-red',
    success: 'text-success-green',
    system: 'text-text-muted',
  }

  return (
    <div>
      {unread.length > 0 && (
        <div className="px-3 py-1.5 border-b border-divider bg-warning-yellow/5">
          <span className="text-[11px] text-warning-yellow font-medium">{unread.length} unread notification{unread.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      <div className="divide-y divide-divider">
        {recent.map((n) => {
          const Icon = iconMap[n.type] || FiBell
          const timeAgo = (date: string) => {
            const diff = Date.now() - new Date(date).getTime()
            const mins = Math.floor(diff / 60000)
            if (mins < 60) return `${mins}m ago`
            const hours = Math.floor(mins / 60)
            return `${hours}h ago`
          }

          return (
            <div key={n.id} className={clsx('px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120', !n.read && 'bg-bg-tertiary/30')}>
              <div className="flex items-start gap-2">
                <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', colorMap[n.type])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-active-blue flex-shrink-0" />}
                    <span className={clsx('text-[12px]', n.read ? 'text-text-secondary' : 'text-text-primary font-medium')}>
                      {n.title}
                    </span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
