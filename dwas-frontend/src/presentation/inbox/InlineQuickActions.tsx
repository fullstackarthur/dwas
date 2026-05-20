import { memo } from 'react'
import { FiCheckCircle, FiClock, FiUserPlus, FiMessageSquare, FiArrowRight, FiFlag } from 'react-icons/fi'

interface InlineQuickActionsProps {
  type: 'queue_item' | 'approval' | 'dispatch' | 'escalation'
  onApprove?: () => void
  onReject?: () => void
  onAssign?: () => void
  onComment?: () => void
  onView?: () => void
  onEscalate?: () => void
  onResolve?: () => void
}

export const InlineQuickActions = memo(function InlineQuickActions({
  type,
  onApprove,
  onReject,
  onAssign,
  onComment,
  onView,
  onEscalate,
  onResolve,
}: InlineQuickActionsProps) {
  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-120">
      {type === 'approval' && onApprove && (
        <button onClick={onApprove} className="p-1 text-success-green hover:bg-success-green/10 rounded transition-colors duration-120" title="Approve">
          <FiCheckCircle className="w-3 h-3" />
        </button>
      )}
      {type === 'approval' && onReject && (
        <button onClick={onReject} className="p-1 text-error-red hover:bg-error-red/10 rounded transition-colors duration-120" title="Reject">
          <FiClock className="w-3 h-3" />
        </button>
      )}
      {onAssign && (
        <button onClick={onAssign} className="p-1 text-text-muted hover:text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120" title="Assign">
          <FiUserPlus className="w-3 h-3" />
        </button>
      )}
      {onComment && (
        <button onClick={onComment} className="p-1 text-text-muted hover:text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120" title="Comment">
          <FiMessageSquare className="w-3 h-3" />
        </button>
      )}
      {type === 'escalation' && onEscalate && (
        <button onClick={onEscalate} className="p-1 text-warning-yellow hover:bg-warning-yellow/10 rounded transition-colors duration-120" title="Escalate">
          <FiFlag className="w-3 h-3" />
        </button>
      )}
      {type === 'queue_item' && onResolve && (
        <button onClick={onResolve} className="p-1 text-success-green hover:bg-success-green/10 rounded transition-colors duration-120" title="Resolve">
          <FiCheckCircle className="w-3 h-3" />
        </button>
      )}
      {onView && (
        <button onClick={onView} className="p-1 text-text-muted hover:text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120" title="View">
          <FiArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  )
})
