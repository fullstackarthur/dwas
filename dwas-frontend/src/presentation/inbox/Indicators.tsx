import { memo } from 'react'
import clsx from 'clsx'

interface PriorityBadgeProps {
  priority: 'critical' | 'high' | 'medium' | 'low' | 'none'
  variant?: 'default' | 'compact'
}

export const PriorityBadge = memo(function PriorityBadge({ priority, variant = 'default' }: PriorityBadgeProps) {
  const config: Record<string, { color: string; bg: string; border: string; label: string }> = {
    critical: { color: 'text-error-red', bg: 'bg-error-red/15', border: 'border-error-red/30', label: 'Critical' },
    high: { color: 'text-warning-yellow', bg: 'bg-warning-yellow/15', border: 'border-warning-yellow/30', label: 'High' },
    medium: { color: 'text-info-cyan', bg: 'bg-info-cyan/15', border: 'border-info-cyan/30', label: 'Medium' },
    low: { color: 'text-text-muted', bg: 'bg-text-muted/10', border: 'border-border-panel', label: 'Low' },
    none: { color: 'text-text-muted', bg: 'bg-text-muted/10', border: 'border-border-panel', label: 'None' },
  }

  const c = config[priority] || config.none
  const sizeClasses = variant === 'compact' ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'

  return (
    <span className={clsx('inline-flex items-center font-medium rounded border', c.color, c.bg, c.border, sizeClasses)}>
      {variant === 'compact' && <span className={clsx('w-1 h-1 rounded-full mr-1', c.color.replace('text-', 'bg-'))} />}
      {c.label}
    </span>
  )
})

interface StatusIndicatorProps {
  status: string
  variant?: 'default' | 'dot'
}

export const QueueStatusIndicator = memo(function QueueStatusIndicator({ status, variant = 'default' }: StatusIndicatorProps) {
  const config: Record<string, { color: string; label: string }> = {
    open: { color: 'text-warning-yellow', label: 'Open' },
    in_progress: { color: 'text-active-blue', label: 'In Progress' },
    awaiting_review: { color: 'text-info-cyan', label: 'Awaiting Review' },
    awaiting_approval: { color: 'text-warning-yellow', label: 'Awaiting Approval' },
    resolved: { color: 'text-success-green', label: 'Resolved' },
    closed: { color: 'text-text-muted', label: 'Closed' },
    cancelled: { color: 'text-text-muted', label: 'Cancelled' },
  }

  const c = config[status] || { color: 'text-text-muted', label: status }

  if (variant === 'dot') {
    return (
      <span className="flex items-center gap-1.5">
        <span className={clsx('w-2 h-2 rounded-full', c.color.replace('text-', 'bg-'))} />
        <span className="text-[11px] text-text-secondary">{c.label}</span>
      </span>
    )
  }

  return <span className={clsx('text-[11px] font-medium', c.color)}>{c.label}</span>
})

interface MultiAssigneeIndicatorProps {
  assignees: { name: string; initials: string }[]
  maxDisplay?: number
}

export const MultiAssigneeIndicator = memo(function MultiAssigneeIndicator({ assignees, maxDisplay = 3 }: MultiAssigneeIndicatorProps) {
  const visible = assignees.slice(0, maxDisplay)
  const remaining = assignees.length - maxDisplay

  return (
    <div className="flex items-center">
      {visible.map((a, i) => (
        <div
          key={a.name}
          className="w-5 h-5 rounded-full bg-selected-surface border border-bg-secondary flex items-center justify-center -ml-1 first:ml-0"
          style={{ zIndex: visible.length - i }}
        >
          <span className="text-[8px] font-medium text-text-secondary">{a.initials}</span>
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-5 h-5 rounded-full bg-bg-tertiary border border-bg-secondary flex items-center justify-center -ml-1">
          <span className="text-[8px] font-medium text-text-muted">+{remaining}</span>
        </div>
      )}
    </div>
  )
})
