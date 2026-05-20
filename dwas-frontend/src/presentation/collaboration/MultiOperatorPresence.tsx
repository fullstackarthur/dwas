import { memo } from 'react'
import { usePresenceStore } from '../stores/realtimeStore'
import clsx from 'clsx'

export const MultiOperatorPresence = memo(function MultiOperatorPresence() {
  const { getOnlineUsers } = usePresenceStore()
  const onlineUsers = getOnlineUsers()

  const statusColors: Record<string, string> = {
    online: 'text-success-green',
    away: 'text-warning-yellow',
    busy: 'text-error-red',
    offline: 'text-text-muted',
  }

  const statusLabels: Record<string, string> = {
    online: 'Online',
    away: 'Away',
    busy: 'Busy',
    offline: 'Offline',
  }

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
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">{onlineUsers.length} operator{onlineUsers.length !== 1 ? 's' : ''} online</span>
      </div>
      {onlineUsers.map((p) => (
        <div key={p.userId} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-selected-surface flex items-center justify-center">
                <span className="text-[9px] font-medium text-text-secondary">
                  {p.user.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className={clsx('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-bg-secondary', statusColors[p.status].replace('text-', 'bg-'))} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] text-text-primary truncate">{p.user.name}</span>
                <span className={clsx('text-[9px] font-medium', statusColors[p.status])}>
                  {statusLabels[p.status]}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {p.currentView && (
                  <span className="text-[10px] text-text-muted truncate">{p.currentView}</span>
                )}
                <span className="text-[10px] text-text-muted">Active {timeAgo(p.lastActive)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})
