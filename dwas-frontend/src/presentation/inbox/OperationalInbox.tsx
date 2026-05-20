import { memo, useState } from 'react'
import { useNotificationStore } from '../stores'
import { mockInboxItems } from '../../data/mock/operational'
import type { InboxItem } from '../../core/types'
import {
  FiInbox,
  FiClock,
  FiAlertTriangle,
  FiTruck,
  FiPackage,
  FiCpu,
  FiDollarSign,
  FiMessageSquare,
} from 'react-icons/fi'
import clsx from 'clsx'

type InboxTab = 'all' | 'unread' | 'approvals' | 'dispatch' | 'procurement' | 'escalations' | 'ai'

const tabConfig: { id: InboxTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All', icon: FiInbox },
  { id: 'unread', label: 'Unread', icon: FiAlertTriangle },
  { id: 'approvals', label: 'Approvals', icon: FiClock },
  { id: 'dispatch', label: 'Dispatch', icon: FiTruck },
  { id: 'procurement', label: 'Procurement', icon: FiPackage },
  { id: 'escalations', label: 'Escalations', icon: FiAlertTriangle },
  { id: 'ai', label: 'AI', icon: FiCpu },
]

function InboxItemCard({ item }: { item: InboxItem }) {
  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    queue_item: FiPackage,
    thread: FiMessageSquare,
    approval: FiClock,
    dispatch_alert: FiTruck,
    vendor_response: FiDollarSign,
    ai_insight: FiCpu,
    escalation: FiAlertTriangle,
  }

  const priorityColors: Record<string, string> = {
    critical: 'text-error-red',
    high: 'text-warning-yellow',
    medium: 'text-info-cyan',
    low: 'text-text-muted',
  }

  const Icon = typeIcons[item.type] || FiInbox

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className={clsx(
      'flex items-start gap-3 px-4 py-3 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120 cursor-pointer',
      !item.read && 'bg-bg-tertiary/30'
    )}>
      <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0 text-text-muted')} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-active-blue flex-shrink-0" />}
          <span className={clsx('text-[13px]', item.read ? 'text-text-secondary' : 'text-text-primary font-medium')}>
            {item.title}
          </span>
          <span className={clsx('text-[10px] font-medium', priorityColors[item.priority])}>
            {item.priority}
          </span>
        </div>
        {item.description && (
          <div className="text-[12px] text-text-muted mt-0.5 leading-snug truncate">{item.description}</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          {item.queueType && (
            <span className="text-[10px] text-text-muted">{item.queueType}</span>
          )}
          {item.assignee && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className="text-[10px] text-text-secondary">{item.assignee.name}</span>
            </>
          )}
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[10px] text-text-muted">{timeAgo(item.updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}

export const OperationalInbox = memo(function OperationalInbox() {
  const [activeTab, setActiveTab] = useState<InboxTab>('all')
  const { unreadCount } = useNotificationStore()

  const filteredItems = mockInboxItems.filter((item) => {
    if (activeTab === 'unread') return !item.read
    if (activeTab === 'approvals') return item.type === 'approval'
    if (activeTab === 'dispatch') return item.type === 'dispatch_alert'
    if (activeTab === 'procurement') return item.queueType === 'procurement'
    if (activeTab === 'escalations') return item.type === 'escalation'
    if (activeTab === 'ai') return item.type === 'ai_insight'
    return true
  })

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider flex-shrink-0">
        <h1 className="text-[24px] font-semibold text-text-primary">Inbox</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {unreadCount > 0 ? `${unreadCount} unread item${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
        </p>
      </div>

      <div className="flex items-center gap-0 px-3 border-b border-divider flex-shrink-0">
        {tabConfig.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const count = tab.id === 'unread' ? unreadCount : undefined

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 text-[12px] border-b-2 transition-colors duration-120',
                isActive
                  ? 'border-active-blue text-text-primary'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {count !== undefined && count > 0 && (
                <span className="text-[10px] bg-active-blue/20 text-active-blue px-1.5 py-0.5 rounded-sm font-medium">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <FiInbox className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <div className="text-[14px] text-text-muted">No items in this view</div>
          </div>
        ) : (
          filteredItems.map((item) => <InboxItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
})
