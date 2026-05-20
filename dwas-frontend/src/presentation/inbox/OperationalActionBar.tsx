import { memo } from 'react'
import { FiCheckCircle, FiXCircle, FiArrowRight, FiUserPlus, FiMessageSquare } from 'react-icons/fi'

interface OperationalActionBarProps {
  status: string
  onApprove?: () => void
  onReject?: () => void
  onAssign?: () => void
  onComment?: () => void
  onView?: () => void
  onStatusChange?: (status: string) => void
}

export const OperationalActionBar = memo(function OperationalActionBar({
  status,
  onApprove,
  onReject,
  onAssign,
  onComment,
  onView,
  onStatusChange,
}: OperationalActionBarProps) {
  const isPending = status === 'pending' || status === 'open' || status === 'awaiting_approval'

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-t border-divider bg-bg-secondary/80">
      {isPending && onApprove && (
        <button
          onClick={onApprove}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-success-green hover:bg-success-green/10 rounded transition-colors duration-120"
        >
          <FiCheckCircle className="w-3 h-3" />
          Approve
        </button>
      )}
      {isPending && onReject && (
        <button
          onClick={onReject}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-error-red hover:bg-error-red/10 rounded transition-colors duration-120"
        >
          <FiXCircle className="w-3 h-3" />
          Reject
        </button>
      )}
      {onAssign && (
        <button
          onClick={onAssign}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120"
        >
          <FiUserPlus className="w-3 h-3" />
          Assign
        </button>
      )}
      {onComment && (
        <button
          onClick={onComment}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120"
        >
          <FiMessageSquare className="w-3 h-3" />
          Comment
        </button>
      )}
      {onView && (
        <button
          onClick={onView}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120"
        >
          <FiArrowRight className="w-3 h-3" />
          View
        </button>
      )}
      {onStatusChange && (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="ml-auto bg-bg-tertiary border border-border-panel text-[11px] text-text-secondary rounded px-2 py-1 outline-none focus:border-active-blue transition-colors duration-120"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="awaiting_review">Awaiting Review</option>
          <option value="awaiting_approval">Awaiting Approval</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      )}
    </div>
  )
})
