import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { formatDistanceToNow } from '../../../core/utils'

interface SLAStatusPanelProps {
  rfq: RFQ
}

export const SLAStatusPanel = memo(function SLAStatusPanel({ rfq }: SLAStatusPanelProps) {
  if (rfq.slaStatus === 'no_sla' || !rfq.slaDeadline) {
    return null
  }

  const deadline = new Date(rfq.slaDeadline)
  const now = new Date()
  const hoursRemaining = Math.max(0, (deadline.getTime() - now.getTime()) / 3600000)
  const isBreached = rfq.slaStatus === 'breached'

  return (
    <div
      className={clsx(
        'p-3 rounded border',
        rfq.slaStatus === 'on_track' && 'bg-success-green/5 border-success-green/20',
        rfq.slaStatus === 'at_risk' && 'bg-warning-yellow/5 border-warning-yellow/20',
        rfq.slaStatus === 'breached' && 'bg-error-red/5 border-error-red/20'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {rfq.slaStatus === 'on_track' && (
            <FiCheckCircle className="w-4 h-4 text-success-green" />
          )}
          {rfq.slaStatus === 'at_risk' && (
            <FiAlertTriangle className="w-4 h-4 text-warning-yellow" />
          )}
          {rfq.slaStatus === 'breached' && (
            <FiAlertTriangle className="w-4 h-4 text-error-red" />
          )}
          <span
            className={clsx(
              'text-[12px] font-semibold',
              rfq.slaStatus === 'on_track' && 'text-success-green',
              rfq.slaStatus === 'at_risk' && 'text-warning-yellow',
              rfq.slaStatus === 'breached' && 'text-error-red'
            )}
          >
            SLA {rfq.slaStatus === 'on_track' ? 'On Track' : rfq.slaStatus === 'at_risk' ? 'At Risk' : 'Breached'}
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
      {rfq.slaStatus !== 'breached' && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
            <span>Deadline</span>
            <span>{formatDistanceToNow(deadline)}</span>
          </div>
          <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full',
                rfq.slaStatus === 'on_track' && 'bg-success-green',
                rfq.slaStatus === 'at_risk' && 'bg-warning-yellow'
              )}
              style={{
                width: `${Math.min(100, (hoursRemaining / 48) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
})