import { memo } from 'react'
import { useQueueStore } from '../stores'

export const SharedOperationalQueue = memo(function SharedOperationalQueue() {
  const { getFilteredItems } = useQueueStore()
  const items = getFilteredItems().slice(0, 8)

  const priorityColors: Record<string, string> = {
    critical: 'text-error-red',
    high: 'text-warning-yellow',
    medium: 'text-info-cyan',
    low: 'text-text-muted',
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    return `${hours}h ago`
  }

  return (
    <div className="divide-y divide-divider">
      {items.map((item) => (
        <div key={item.id} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium ${priorityColors[item.priority]}`}>
              {item.priority}
            </span>
            <span className="text-[12px] text-text-primary truncate flex-1">{item.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {item.assignee && (
              <span className="text-[10px] text-text-muted">{item.assignee.name}</span>
            )}
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{timeAgo(item.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  )
})
