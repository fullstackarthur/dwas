import { memo } from 'react'
import { useQueueStore } from '../stores'
import { QUEUE_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '../../core/constants'
import {
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiChevronRight,
  FiFilter,
} from 'react-icons/fi'
import clsx from 'clsx'

function PriorityBadge({ priority }: { priority: string }) {
  const colorMap: Record<string, string> = {
    critical: 'bg-error-red/15 text-error-red border-error-red/30',
    high: 'bg-warning-yellow/15 text-warning-yellow border-warning-yellow/30',
    medium: 'bg-info-cyan/15 text-info-cyan border-info-cyan/30',
    low: 'bg-text-muted/15 text-text-muted border-text-muted/30',
    none: 'bg-text-muted/10 text-text-muted border-border-panel',
  }

  return (
    <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded border', colorMap[priority] || colorMap.none)}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    open: 'text-warning-yellow',
    in_progress: 'text-active-blue',
    awaiting_review: 'text-info-cyan',
    awaiting_approval: 'text-warning-yellow',
    resolved: 'text-success-green',
    closed: 'text-text-muted',
    cancelled: 'text-text-muted',
  }

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    open: FiAlertTriangle,
    in_progress: FiClock,
    awaiting_review: FiClock,
    awaiting_approval: FiClock,
    resolved: FiCheckCircle,
    closed: FiCheckCircle,
    cancelled: FiCheckCircle,
  }

  const Icon = iconMap[status] || FiChevronRight

  return (
    <span className={clsx('flex items-center gap-1 text-[11px]', colorMap[status] || 'text-text-muted')}>
      <Icon className="w-3 h-3" />
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function QueueRow({ itemId }: { itemId: string }) {
  const { items, selectedId, setSelectedId } = useQueueStore()
  const item = items.find((i) => i.id === itemId)
  if (!item) return null

  const isSelected = selectedId === item.id

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <button
      onClick={() => setSelectedId(item.id)}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2 text-left border-b border-divider last:border-0 transition-colors duration-120',
        isSelected ? 'bg-selected-surface' : 'hover:bg-hover-surface'
      )}
    >
      <PriorityBadge priority={item.priority} />

      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-text-primary truncate">{item.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-text-muted">{QUEUE_LABELS[item.type] || item.type}</span>
          {item.assignee && (
            <>
              <span className="text-text-muted">·</span>
              <span className="text-[11px] text-text-muted">{item.assignee.name}</span>
            </>
          )}
          <span className="text-text-muted">·</span>
          <span className="text-[11px] text-text-muted">{timeAgo(item.updatedAt)}</span>
        </div>
      </div>

      <StatusBadge status={item.status} />

      {item.dueDate && new Date(item.dueDate) < new Date() && item.status !== 'resolved' && item.status !== 'closed' && (
        <span className="text-[10px] text-error-red font-medium flex-shrink-0">OVERDUE</span>
      )}
    </button>
  )
}

function QueueFilterBar() {
  const { filter, setFilter } = useQueueStore()

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-divider">
      <FiFilter className="w-3.5 h-3.5 text-text-muted" />
      <select
        value={filter.queueType || ''}
        onChange={(e) => setFilter({ queueType: e.target.value || undefined })}
        className="bg-bg-tertiary border border-border-panel text-[12px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue"
      >
        <option value="">All Queues</option>
        {Object.entries(QUEUE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select
        value={filter.priority || ''}
        onChange={(e) => setFilter({ priority: e.target.value || undefined })}
        className="bg-bg-tertiary border border-border-panel text-[12px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue"
      >
        <option value="">All Priorities</option>
        {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select
        value={filter.status || ''}
        onChange={(e) => setFilter({ status: e.target.value || undefined })}
        className="bg-bg-tertiary border border-border-panel text-[12px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue"
      >
        <option value="">All Statuses</option>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  )
}

export const QueuesPage = memo(function QueuesPage() {
  const { getFilteredItems } = useQueueStore()
  const filtered = getFilteredItems()

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Queues</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {filtered.length} active item{filtered.length !== 1 ? 's' : ''} across all queues
        </p>
      </div>

      <QueueFilterBar />

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-[14px] text-text-muted">No items match the current filters</div>
          </div>
        ) : (
          filtered.map((item) => <QueueRow key={item.id} itemId={item.id} />)
        )}
      </div>
    </div>
  )
})
