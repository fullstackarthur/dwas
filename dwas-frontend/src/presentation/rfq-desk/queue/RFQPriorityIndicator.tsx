import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'

export const RFQPriorityIndicator = memo(function RFQPriorityIndicator({
  priority,
}: {
  priority: RFQ['priority']
}) {
  return (
    <span
      className={clsx(
        'w-2 h-6 rounded-sm',
        priority === 'critical' && 'bg-error-red',
        priority === 'high' && 'bg-warning-yellow',
        priority === 'medium' && 'bg-active-blue',
        priority === 'low' && 'bg-text-muted'
      )}
      title={`Priority: ${priority}`}
    />
  )
})