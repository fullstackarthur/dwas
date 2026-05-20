import { memo } from 'react'
import type { OperationalNotification } from '../../core/types/realtime'
import { FiUser, FiBell, FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'
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
  critical: 'bg-error-red/5',
  warning: 'bg-warning-yellow/5',
  normal: 'bg-active-blue/5',
  low: 'bg-bg-tertiary/50',
}

const categoryLabels: Record<string, string> = {
  queue: 'Queue',
  dispatch: 'Dispatch',
  approval: 'Approval',
  escalation: 'Escalation',
  sla: 'SLA',
  ai: 'AI',
  system: 'System',
  assignment: 'Assignment',
}

interface NotificationCardProps {
  notification: OperationalNotification
  onMarkRead?: (id: string) => void
  onDismiss?: (id: string) => void
}

export const AssignmentNotificationCard = memo(function AssignmentNotificationCard({ notification, onMarkRead, onDismiss }: NotificationCardProps) {
  const Icon = iconMap[notification.type] || FiInfo
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className={clsx('px-4 py-3 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120 group', bgMap[notification.type])}>
      <div className="flex items-start gap-3">
        <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', colorMap[notification.type])} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {!notification.read && <span className="w-1.5 h-1.5 rounded-full bg-active-blue flex-shrink-0" />}
            <span className={clsx('text-[13px]', notification.read ? 'text-text-secondary' : 'text-text-primary font-medium')}>
              {notification.title}
            </span>
            <span className="text-[10px] text-text-muted">{categoryLabels[notification.category]}</span>
          </div>
          <div className="text-[12px] text-text-muted leading-snug">{notification.message}</div>
          <div className="flex items-center gap-2 mt-1">
            {notification.sourceUser && (
              <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                <FiUser className="w-3 h-3" />
                {notification.sourceUser.name}
              </span>
            )}
            <span className="text-[10px] text-text-muted">{timeAgo(notification.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-120">
          {!notification.read && onMarkRead && (
            <button onClick={() => onMarkRead(notification.id)} className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120">
              <FiCheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {onDismiss && (
            <button onClick={() => onDismiss(notification.id)} className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120">
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

export const DispatchAlertCard = AssignmentNotificationCard
export const ApprovalRequestCard = AssignmentNotificationCard
export const EscalationAlertSurface = AssignmentNotificationCard
