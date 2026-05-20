import { memo } from 'react'
import { mockQueueItems } from '../../data/mock'
import type { QueueItem } from '../../core/types'
import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi'
import clsx from 'clsx'

function PORow({ item }: { item: QueueItem }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    open: { color: 'text-warning-yellow', icon: FiClock, label: 'Open' },
    in_progress: { color: 'text-active-blue', icon: FiFileText, label: 'In Progress' },
    awaiting_review: { color: 'text-info-cyan', icon: FiClock, label: 'Awaiting Review' },
    awaiting_approval: { color: 'text-warning-yellow', icon: FiClock, label: 'Awaiting Approval' },
    resolved: { color: 'text-success-green', icon: FiCheckCircle, label: 'Resolved' },
  }

  const config = statusConfig[item.status] || statusConfig.open
  const Icon = config.icon

  const priorityColors: Record<string, string> = {
    critical: 'text-error-red',
    high: 'text-warning-yellow',
    medium: 'text-info-cyan',
    low: 'text-text-muted',
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'resolved' && item.status !== 'closed'

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120 group">
      <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', config.color)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-primary">{item.title}</span>
          <span className={clsx('text-[10px] font-medium', priorityColors[item.priority])}>{item.priority}</span>
          {isOverdue && <span className="text-[10px] text-error-red font-medium">OVERDUE</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {item.assignee && (
            <span className="text-[11px] text-text-muted">{item.assignee.name}</span>
          )}
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[11px] text-text-muted">{timeAgo(item.updatedAt)}</span>
          {item.dueDate && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className={clsx('text-[11px]', isOverdue ? 'text-error-red' : 'text-text-muted')}>
                Due {new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const PendingPOQueue = memo(function PendingPOQueue() {
  const procurementItems = mockQueueItems.filter((i) => i.type === 'procurement' && i.status !== 'resolved' && i.status !== 'closed')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Pending POs</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {procurementItems.length} procurement item{procurementItems.length !== 1 ? 's' : ''} in progress
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {procurementItems.length === 0 ? (
          <div className="p-8 text-center">
            <FiCheckCircle className="w-8 h-8 text-success-green mx-auto mb-2" />
            <div className="text-[14px] text-text-muted">No pending procurement items</div>
          </div>
        ) : (
          procurementItems.map((item) => <PORow key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
})
