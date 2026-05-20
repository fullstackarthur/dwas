import { memo } from 'react'
import { usePresenceStore } from '../stores/realtimeStore'

export const TeamActivityPanel = memo(function TeamActivityPanel() {
  const { getOnlineUsers } = usePresenceStore()
  const users = getOnlineUsers()

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
        <span className="text-[11px] font-medium text-text-muted">Team Activity</span>
      </div>
      {users.map((p) => (
        <div key={p.userId} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-selected-surface flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-medium text-text-secondary">
                {p.user.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-primary truncate">{p.user.name}</div>
              <div className="text-[10px] text-text-muted">
                {p.currentView ? `Viewing ${p.currentView}` : 'Active'}
                {p.currentItemId && <span className="ml-1">· Item {p.currentItemId}</span>}
              </div>
            </div>
            <span className="text-[10px] text-text-muted flex-shrink-0">{timeAgo(p.lastActive)}</span>
          </div>
        </div>
      ))}
    </div>
  )
})
