import { memo } from 'react'
import { usePresenceStore } from '../stores/realtimeStore'
import clsx from 'clsx'

export const ActiveUserRail = memo(function ActiveUserRail() {
  const { getOnlineUsers } = usePresenceStore()
  const onlineUsers = getOnlineUsers()

  const statusColors: Record<string, string> = {
    online: 'bg-success-green',
    away: 'bg-warning-yellow',
    busy: 'bg-error-red',
    offline: 'bg-text-muted',
  }

  return (
    <div className="flex items-center gap-1 px-2">
      {onlineUsers.slice(0, 5).map((p) => (
        <div key={p.userId} className="relative group">
          <div className="w-6 h-6 rounded-full bg-selected-surface flex items-center justify-center border border-border-panel">
            <span className="text-[9px] font-medium text-text-secondary">
              {p.user.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className={clsx('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-bg-secondary', statusColors[p.status])} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-bg-tertiary border border-border-panel rounded text-[10px] text-text-secondary whitespace-nowrap hidden group-hover:block z-overlay">
            {p.user.name}
            {p.currentView && <span className="text-text-muted ml-1">· {p.currentView}</span>}
          </div>
        </div>
      ))}
      {onlineUsers.length > 5 && (
        <span className="text-[10px] text-text-muted ml-1">+{onlineUsers.length - 5}</span>
      )}
    </div>
  )
})
