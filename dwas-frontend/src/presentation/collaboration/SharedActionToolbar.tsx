import { memo } from 'react'
import { FiPlus, FiUserPlus, FiMessageSquare, FiFlag, FiCheckCircle } from 'react-icons/fi'

export const SharedActionToolbar = memo(function SharedActionToolbar() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-t border-divider bg-bg-secondary/80">
      <button className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120">
        <FiPlus className="w-3 h-3" />
        Add item
      </button>
      <button className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120">
        <FiUserPlus className="w-3 h-3" />
        Assign
      </button>
      <button className="flex items-center gap-1 px-2 py-1 text-[11px] text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120">
        <FiMessageSquare className="w-3 h-3" />
        Comment
      </button>
      <button className="flex items-center gap-1 px-2 py-1 text-[11px] text-warning-yellow hover:bg-warning-yellow/10 rounded transition-colors duration-120">
        <FiFlag className="w-3 h-3" />
        Escalate
      </button>
      <div className="flex-1" />
      <button className="flex items-center gap-1 px-2 py-1 text-[11px] text-success-green hover:bg-success-green/10 rounded transition-colors duration-120">
        <FiCheckCircle className="w-3 h-3" />
        Resolve
      </button>
    </div>
  )
})
