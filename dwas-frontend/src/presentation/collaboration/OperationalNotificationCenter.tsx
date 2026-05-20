import { memo } from 'react'
import { useNotificationStore } from '../stores/notificationStore'
import { FiBell, FiAlertTriangle, FiInfo } from 'react-icons/fi'
import clsx from 'clsx'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  low: FiInfo,
  normal: FiBell,
  warning: FiAlertTriangle,
  critical: FiAlertTriangle,
}

const colorMap: Record<string, string> = {
  low: 'text-text-muted',
  normal: 'text-active-blue',
  warning: 'text-warning-yellow',
  critical: 'text-error-red',
}

const bgMap: Record<string, string> = {
  critical: 'bg-error-red/5 border-error-red/20',
  warning: 'bg-warning-yellow/5 border-warning-yellow/20',
  normal: 'bg-active-blue/5 border-active-blue/20',
  low: 'bg-bg-tertiary/50 border-border-panel',
}

export const OperationalNotificationCenter = memo(function OperationalNotificationCenter() {
  const { notifications, unreadCount, criticalCount } = useNotificationStore()
  const recent = notifications.slice(0, 8)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-text-muted">
          {unreadCount} unread
          {criticalCount > 0 && (
            <span className="text-error-red ml-1">({criticalCount} critical)</span>
          )}
        </span>
      </div>
      {recent.map((n) => {
        const Icon = iconMap[n.type] || FiInfo

        return (
          <div key={n.id} className={clsx('px-3 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120', bgMap[n.type])}>
            <div className="flex items-start gap-2">
              <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', colorMap[n.type])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-active-blue flex-shrink-0" />}
                  <span className={clsx('text-[12px]', n.read ? 'text-text-secondary' : 'text-text-primary font-medium')}>
                    {n.title}
                  </span>
                </div>
                <div className="text-[11px] text-text-muted mt-0.5 leading-snug">{n.message}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-text-muted">{timeAgo(n.createdAt)}</span>
                  {n.sourceUser && (
                    <>
                      <span className="text-text-muted text-[10px]">·</span>
                      <span className="text-[10px] text-text-secondary">{n.sourceUser.name}</span>
                    </>
                  )}
                  {n.relatedQueueType && (
                    <>
                      <span className="text-text-muted text-[10px]">·</span>
                      <span className="text-[10px] text-text-muted">{n.relatedQueueType}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
