import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { RFQPriorityIndicator } from './RFQPriorityIndicator'
import { RFQUnreadIndicator } from './RFQUnreadIndicator'
import { SLAStatusBadge } from './SLAStatusBadge'
import { AIFlagIndicator } from './AIFlagIndicator'
import { RFQStageIndicator } from './RFQStageIndicator'
import { RFQAssignmentIndicator } from './RFQAssignmentIndicator'
import { formatDistanceToNow } from '../../../core/utils'

interface RFQOperationalRowProps {
  rfq: RFQ
  isSelected: boolean
  onClick: () => void
}

export const RFQOperationalRow = memo(function RFQOperationalRow({
  rfq,
  isSelected,
  onClick,
}: RFQOperationalRowProps) {
  const lastActivityDisplay = rfq.lastActivityAt
    ? formatDistanceToNow(new Date(rfq.lastActivityAt))
    : ''

  // Use loaded items if available, otherwise fall back to totalItems count from the view
  const itemCount = rfq.items.length > 0 ? rfq.items.length : rfq.totalItems

  const itemSummary =
    rfq.items.length === 1
      ? rfq.items[0].materialDescription.substring(0, 25)
      : rfq.items.length === 2
        ? rfq.items.map((i) => i.materialDescription.substring(0, 15)).join(' & ')
        : `${itemCount} Item${itemCount !== 1 ? 's' : ''}`

  const totalQty = rfq.totalQuantity
  const qtyDisplay = totalQty >= 1000 ? `${(totalQty / 1000).toFixed(1)}K` : totalQty

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-3 border-b border-divider transition-colors duration-120 relative',
        isSelected
          ? 'bg-selected-surface'
          : 'hover:bg-hover-surface'
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-active-blue" />
      )}

      <div className="flex items-start gap-2">
        <RFQPriorityIndicator priority={rfq.priority} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary">
              {rfq.rfqNumber}
            </span>
            {rfq.unreadUpdates > 0 && (
              <RFQUnreadIndicator count={rfq.unreadUpdates} />
            )}
          </div>

          <div className="text-[12px] text-text-secondary mt-0.5 truncate">
            {rfq.clientName}
          </div>

          <div className="text-[11px] text-text-muted mt-0.5 truncate">
            {itemSummary}
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-text-muted">
              {qtyDisplay} units
            </span>
            <span className="text-[10px] text-text-muted">
              {rfq.deliveryLocation.substring(0, 15)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <RFQStageIndicator stage={rfq.stage} />
            <AIFlagIndicator matchCount={rfq.aiVendorMatchCount} />
            {rfq.assignee && (
              <RFQAssignmentIndicator assignee={rfq.assignee} />
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <SLAStatusBadge status={rfq.slaStatus} deadline={rfq.slaDeadline} />
            <span className="text-[10px] text-text-muted">
              {lastActivityDisplay}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
})