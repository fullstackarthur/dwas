import { memo } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'

interface QueueFilterToolbarProps {
  queueType?: string
  priority?: string
  status?: string
  sortBy?: string
  onFilterChange: (filter: { queueType?: string; priority?: string; status?: string; sortBy?: string }) => void
  onClear: () => void
  resultCount: number
}

export const QueueFilterToolbar = memo(function QueueFilterToolbar({
  queueType,
  priority,
  status,
  sortBy,
  onFilterChange,
  onClear,
  resultCount,
}: QueueFilterToolbarProps) {
  const hasActiveFilters = queueType || priority || status || sortBy

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-divider bg-bg-secondary/50">
      <FiFilter className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />

      <select
        value={queueType || ''}
        onChange={(e) => onFilterChange({ queueType: e.target.value || undefined })}
        className="bg-bg-tertiary border border-border-panel text-[12px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue transition-colors duration-120"
      >
        <option value="">All Queues</option>
        <option value="dispatch">Dispatch</option>
        <option value="procurement">Procurement</option>
        <option value="logistics">Logistics</option>
        <option value="vendor_communication">Vendor Comm.</option>
        <option value="ai_review">AI Review</option>
        <option value="escalations">Escalations</option>
      </select>

      <select
        value={priority || ''}
        onChange={(e) => onFilterChange({ priority: e.target.value || undefined })}
        className="bg-bg-tertiary border border-border-panel text-[12px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue transition-colors duration-120"
      >
        <option value="">All Priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={status || ''}
        onChange={(e) => onFilterChange({ status: e.target.value || undefined })}
        className="bg-bg-tertiary border border-border-panel text-[12px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue transition-colors duration-120"
      >
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="awaiting_review">Awaiting Review</option>
        <option value="awaiting_approval">Awaiting Approval</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={sortBy || ''}
        onChange={(e) => onFilterChange({ sortBy: e.target.value || undefined })}
        className="bg-bg-tertiary border border-border-panel text-[12px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue transition-colors duration-120"
      >
        <option value="">Sort By</option>
        <option value="priority">Priority</option>
        <option value="createdAt">Created</option>
        <option value="updatedAt">Updated</option>
        <option value="dueDate">Due Date</option>
      </select>

      <div className="flex-1" />

      <span className="text-[11px] text-text-muted">{resultCount} item{resultCount !== 1 ? 's' : ''}</span>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-muted hover:text-text-primary transition-colors duration-120"
        >
          <FiX className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  )
})
