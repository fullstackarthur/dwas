import { memo } from 'react'
import { usePresenceStore } from '../stores/realtimeStore'
import clsx from 'clsx'

export const TeamPresenceStack = memo(function TeamPresenceStack() {
  const { getOnlineUsers } = usePresenceStore()
  const users = getOnlineUsers()

  const statusColors: Record<string, string> = {
    online: 'bg-success-green',
    away: 'bg-warning-yellow',
    busy: 'bg-error-red',
    offline: 'bg-text-muted',
  }

  return (
    <div className="p-3">
      <div className="flex items-center -space-x-1 mb-2">
        {users.slice(0, 6).map((p) => (
          <div key={p.userId} className="relative">
            <div className="w-7 h-7 rounded-full bg-selected-surface border-2 border-bg-secondary flex items-center justify-center">
              <span className="text-[9px] font-medium text-text-secondary">
                {p.user.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className={clsx('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-bg-secondary', statusColors[p.status])} />
          </div>
        ))}
        {users.length > 6 && (
          <div className="w-7 h-7 rounded-full bg-bg-tertiary border-2 border-bg-secondary flex items-center justify-center">
            <span className="text-[9px] font-medium text-text-muted">+{users.length - 6}</span>
          </div>
        )}
      </div>
      <div className="text-[11px] text-text-muted">
        {users.length} team member{users.length !== 1 ? 's' : ''} online
      </div>
    </div>
  )
})
