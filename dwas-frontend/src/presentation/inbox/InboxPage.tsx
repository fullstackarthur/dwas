import { memo } from 'react'
import { useNotificationStore } from '../stores'
import {
  FiBell,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiX,
  FiSettings,
} from 'react-icons/fi'
import clsx from 'clsx'

function NotificationIcon({ type }: { type: string }) {
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

  const Icon = iconMap[type] || FiBell

  return <Icon className={clsx('w-4 h-4 flex-shrink-0', colorMap[type] || 'text-text-muted')} />
}

function NotificationRow({ notificationId }: { notificationId: string }) {
  const { notifications, markAsRead, dismiss } = useNotificationStore()
  const notification = notifications.find((n) => n.id === notificationId)
  if (!notification) return null

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div
      className={clsx(
        'flex items-start gap-3 px-4 py-3 border-b border-divider last:border-0 group transition-colors duration-120',
        !notification.read ? 'bg-bg-tertiary/30' : 'hover:bg-hover-surface/50'
      )}
    >
      <div className="mt-0.5">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={clsx('text-[13px] font-medium', notification.read ? 'text-text-secondary' : 'text-text-primary')}>
            {notification.title}
          </span>
          {!notification.read && <span className="w-1.5 h-1.5 rounded-full bg-active-blue flex-shrink-0" />}
        </div>
        <div className="text-[12px] text-text-secondary mt-0.5 leading-snug">{notification.message}</div>
        <div className="text-[11px] text-text-muted mt-1">{timeAgo(notification.createdAt)}</div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-120">
        {!notification.read && (
          <button
            onClick={() => markAsRead(notification.id)}
            className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120"
          >
            <FiCheckCircle className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => dismiss(notification.id)}
          className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export const InboxPage = memo(function InboxPage() {
  const { notifications, markAllAsRead } = useNotificationStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-text-primary">Inbox</h1>
          <p className="text-[13px] text-text-secondary mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[12px] text-active-blue hover:text-active-blue/80 transition-colors duration-120"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <FiBell className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <div className="text-[14px] text-text-muted">No notifications</div>
          </div>
        ) : (
          notifications.map((n) => <NotificationRow key={n.id} notificationId={n.id} />)
        )}
      </div>
    </div>
  )
})
