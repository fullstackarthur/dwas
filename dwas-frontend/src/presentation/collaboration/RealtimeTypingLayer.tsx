import { memo } from 'react'
import { useCollaborationStore } from '../stores/notificationStore'
import { usePresenceStore } from '../stores/realtimeStore'
import { FiEdit3 } from 'react-icons/fi'

export const RealtimeTypingLayer = memo(function RealtimeTypingLayer({ threadId }: { threadId: string }) {
  const { getTypingInThread } = useCollaborationStore()
  const { getUserPresence } = usePresenceStore()
  const typingUserIds = getTypingInThread(threadId)

  if (typingUserIds.length === 0) return null

  const typingNames = typingUserIds
    .map((uid) => getUserPresence(uid)?.user.name)
    .filter(Boolean)

  return (
    <div className="px-4 py-1.5 border-b border-divider bg-bg-tertiary/50 flex items-center gap-1.5">
      <FiEdit3 className="w-3 h-3 text-text-muted animate-pulse" />
      <span className="text-[11px] text-text-muted">
        {typingNames.length === 1
          ? `${typingNames[0]} is typing...`
          : `${typingNames.length} people are typing...`}
      </span>
    </div>
  )
})
