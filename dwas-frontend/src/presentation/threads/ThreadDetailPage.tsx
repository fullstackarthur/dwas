import { memo } from 'react'
import { useThreadStore } from '../stores'
import { STATUS_LABELS, PRIORITY_LABELS } from '../../core/constants'
import {
  FiArrowLeft,
  FiSend,
  FiPaperclip,
  FiCpu,
} from 'react-icons/fi'
import clsx from 'clsx'

function MessageBubble({ messageId }: { messageId: string }) {
  const { getActiveThread } = useThreadStore()
  const thread = getActiveThread()
  const message = thread?.messages.find((m) => m.id === messageId)
  if (!message) return null

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className={clsx('flex gap-2 px-4 py-3', message.isAiGenerated && 'bg-bg-tertiary/50')}>
      <div className="w-7 h-7 rounded-full bg-selected-surface flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[10px] font-medium text-text-secondary">
          {message.author.name.split(' ').map((n) => n[0]).join('')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-medium text-text-primary">{message.author.name}</span>
          {message.isAiGenerated && (
            <span className="flex items-center gap-1 text-[10px] text-active-blue bg-active-blue/10 px-1.5 py-0.5 rounded">
              <FiCpu className="w-3 h-3" />
              AI
            </span>
          )}
          <span className="text-[11px] text-text-muted">{timeAgo(message.createdAt)}</span>
        </div>
        <div className="text-[13px] text-text-secondary leading-relaxed">{message.content}</div>
      </div>
    </div>
  )
}

function ThreadHeader() {
  const { getActiveThread } = useThreadStore()
  const { setActiveThreadId } = useThreadStore()
  const thread = getActiveThread()
  if (!thread) return null

  return (
    <div className="px-4 py-3 border-b border-divider">
      <button
        onClick={() => setActiveThreadId(null)}
        className="flex items-center gap-1 text-[12px] text-text-muted hover:text-text-secondary mb-2 transition-colors duration-120"
      >
        <FiArrowLeft className="w-3.5 h-3.5" />
        Back to threads
      </button>
      <h1 className="text-[18px] font-semibold text-text-primary">{thread.subject}</h1>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-[12px] text-text-secondary">{STATUS_LABELS[thread.status]}</span>
        <span className="text-text-muted">·</span>
        <span className="text-[12px] text-text-secondary">{PRIORITY_LABELS[thread.priority]} priority</span>
        <span className="text-text-muted">·</span>
        <span className="text-[12px] text-text-muted">{thread.messages.length} messages</span>
        <span className="text-text-muted">·</span>
        <span className="text-[12px] text-text-muted">{thread.participants.length} participants</span>
      </div>
    </div>
  )
}

function MessageComposer() {
  return (
    <div className="px-4 py-3 border-t border-divider">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-bg-tertiary border border-border-panel rounded-md px-3 py-2">
          <input
            type="text"
            placeholder="Type a reply..."
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>
        <button className="p-2 text-text-muted hover:text-active-blue transition-colors duration-120">
          <FiPaperclip className="w-4 h-4" />
        </button>
        <button className="p-2 bg-active-blue text-white rounded-md hover:bg-active-blue/90 transition-colors duration-120">
          <FiSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export const ThreadDetailPage = memo(function ThreadDetailPage() {
  const { getActiveThread } = useThreadStore()
  const thread = getActiveThread()

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-[14px] text-text-muted">Select a thread to view details</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ThreadHeader />
      <div className="flex-1 overflow-y-auto py-2">
        {thread.messages.map((msg) => (
          <MessageBubble key={msg.id} messageId={msg.id} />
        ))}
      </div>
      <MessageComposer />
    </div>
  )
})
