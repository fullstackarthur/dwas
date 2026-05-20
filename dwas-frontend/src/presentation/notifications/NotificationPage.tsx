import { memo } from 'react'
import { useNotificationStore } from '../stores/notificationStore'
import { AssignmentNotificationCard } from '../notifications/NotificationCards'
import { FiBell, FiCheckCircle } from 'react-icons/fi'

export const NotificationPage = memo(function NotificationPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotificationStore()

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-[24px] font-semibold text-text-primary">Notifications</h1>
          <p className="text-[13px] text-text-secondary mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[12px] text-active-blue hover:text-active-blue/80 transition-colors duration-120"
          >
            <FiCheckCircle className="w-3.5 h-3.5" />
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
          notifications.map((n) => (
            <AssignmentNotificationCard
              key={n.id}
              notification={n}
              onMarkRead={markAsRead}
              onDismiss={dismiss}
            />
          ))
        )}
      </div>
    </div>
  )
})
