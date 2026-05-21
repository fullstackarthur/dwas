import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { formatDistanceToNow } from '../../../core/utils'

export const SLAStatusBadge = memo(function SLAStatusBadge({
  status,
  deadline,
}: {
  status: RFQ['slaStatus']
  deadline?: string
}) {
  const timeRemaining = deadline ? formatDistanceToNow(new Date(deadline)) : null

  return (
    <div className="flex items-center gap-1">
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full',
          status === 'on_track' && 'bg-success-green',
          status === 'at_risk' && 'bg-warning-yellow',
          status === 'breached' && 'bg-error-red',
          status === 'no_sla' && 'bg-text-muted/50'
        )}
      />
      <span
        className={clsx(
          'text-[10px]',
          status === 'on_track' && 'text-success-green',
          status === 'at_risk' && 'text-warning-yellow',
          status === 'breached' && 'text-error-red',
          status === 'no_sla' && 'text-text-muted'
        )}
      >
        {status === 'no_sla' ? 'No SLA' : timeRemaining}
      </span>
    </div>
  )
})