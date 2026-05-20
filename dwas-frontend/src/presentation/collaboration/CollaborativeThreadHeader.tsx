import { memo } from 'react'
import { usePresenceStore } from '../stores/realtimeStore'
import { FiUser } from 'react-icons/fi'

export const CollaborativeThreadHeader = memo(function CollaborativeThreadHeader({ threadId }: { threadId: string }) {
  const { getOnlineUsers } = usePresenceStore()
  const onlineUsers = getOnlineUsers()
  const viewingUsers = onlineUsers.filter((p) => p.currentItemId === threadId || p.currentView?.includes(threadId))

  if (viewingUsers.length === 0) return null

  return (
    <div className="px-4 py-1.5 border-b border-divider bg-active-blue/5 flex items-center gap-2">
      <FiUser className="w-3 h-3 text-active-blue" />
      <span className="text-[11px] text-active-blue">
        {viewingUsers.length} {viewingUsers.length === 1 ? 'person' : 'people'} viewing
      </span>
      <div className="flex items-center -space-x-1">
        {viewingUsers.map((p) => (
          <div key={p.userId} className="w-5 h-5 rounded-full bg-selected-surface border border-bg-secondary flex items-center justify-center">
            <span className="text-[8px] font-medium text-text-secondary">
              {p.user.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
