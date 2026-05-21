import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi'
import { formatDistanceToNow } from '../../../core/utils'

interface SLAStatusPanelProps {
  rfq: RFQ
}

export const SLAStatusPanel = memo(function SLAStatusPanel({ rfq }: SLAStatusPanelProps) {
  if (rfq.slaStatus === 'no_sla' || !rfq.slaDeadline) {
    return null
  }

  const deadline = new Date(rfq.slaDeadline)
  const created = new Date(rfq.createdAt)
  const now = new Date()
  const totalWindowMs = deadline.getTime() - created.getTime()
  const elapsedMs = now.getTime() - created.getTime()
  const hoursRemaining = Math.max(0, (deadline.getTime() - now.getTime()) / 3600000)
  const totalHours = totalWindowMs / 3600000
  const elapsedPercent = totalHours > 0 ? Math.min(100, Math.max(0, (elapsedMs / totalWindowMs) * 100)) : 0
  const isBreached = rfq.slaStatus === 'breached' || hoursRemaining <= 0
  const showRelativeTime = hoursRemaining < 24

  return (
    <div
      className={clsx(
        'p-3 rounded border',
        isBreached && 'bg-error-red/5 border-error-red/20',
        !isBreached && rfq.slaStatus === 'at_risk' && 'bg-warning-yellow/5 border-warning-yellow/20',
        !isBreached && rfq.slaStatus === 'on_track' && 'bg-success-green/5 border-success-green/20'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isBreached && rfq.slaStatus === 'on_track' && (
            <FiCheckCircle className="w-4 h-4 text-success-green" />
          )}
          {!isBreached && rfq.slaStatus === 'at_risk' && (
            <FiAlertTriangle className="w-4 h-4 text-warning-yellow" />
          )}
          {isBreached && (
            <FiAlertTriangle className="w-4 h-4 text-error-red" />
          )}
          <span
            className={clsx(
              'text-[12px] font-semibold',
              isBreached && 'text-error-red',
              !isBreached && rfq.slaStatus === 'on_track' && 'text-success-green',
              !isBreached && rfq.slaStatus === 'at_risk' && 'text-warning-yellow'
            )}
          >
            SLA {isBreached ? 'Breached' : rfq.slaStatus === 'on_track' ? 'On Track' : 'At Risk'}
          </span>
        </div>
        <div className="text-right">
          {isBreached ? (
            <span className="text-[11px] text-error-red">
              Breached {formatDistanceToNow(deadline)} ago
            </span>
          ) : (
            <span className="text-[11px] text-text-secondary">
              {hoursRemaining.toFixed(1)}h remaining
            </span>
          )}
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
          <div className="flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            <span>Deadline</span>
          </div>
          <span>
            {showRelativeTime
              ? formatDistanceToNow(deadline)
              : deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              isBreached && 'bg-error-red',
              !isBreached && rfq.slaStatus === 'on_track' && 'bg-success-green',
              !isBreached && rfq.slaStatus === 'at_risk' && 'bg-warning-yellow'
            )}
            style={{ width: `${elapsedPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
})