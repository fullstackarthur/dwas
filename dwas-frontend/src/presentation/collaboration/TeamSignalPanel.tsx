import { memo } from 'react'
import { usePresenceStore, useSyncStore } from '../stores/realtimeStore'
import { FiActivity, FiUsers, FiClock } from 'react-icons/fi'

export const TeamSignalPanel = memo(function TeamSignalPanel() {
  const { getOnlineUsers } = usePresenceStore()
  const { syncState } = useSyncStore()
  const onlineUsers = getOnlineUsers()

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">Team Signals</span>
      </div>
      <div className="px-3 py-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-text-muted">
              <FiUsers className="w-3 h-3" />
              Online
            </span>
            <span className="text-text-primary font-medium">{onlineUsers.length}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-text-muted">
              <FiActivity className="w-3 h-3" />
              Latency
            </span>
            <span className="text-text-primary">{syncState.latency}ms</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-text-muted">
              <FiClock className="w-3 h-3" />
              Last sync
            </span>
            <span className="text-text-primary">
              {new Date(syncState.lastSyncAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})
