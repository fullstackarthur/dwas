import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { mockRFQStages } from '../../../data/mock/rfq'
import { formatDistanceToNow } from '../../../core/utils'
import { FiUser, FiClock, FiMapPin } from 'react-icons/fi'

interface RFQWorkspaceHeaderProps {
  rfq: RFQ
}

export const RFQWorkspaceHeader = memo(function RFQWorkspaceHeader({
  rfq,
}: RFQWorkspaceHeaderProps) {
  const stageInfo = mockRFQStages.find((s) => s.id === rfq.stage)
  const qtyDisplay = rfq.totalQuantity >= 1000 ? `${(rfq.totalQuantity / 1000).toFixed(1)}K` : rfq.totalQuantity

  return (
    <div className="px-4 py-3 bg-bg-secondary border-b border-border-panel flex-shrink-0">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[18px] font-semibold text-text-primary">
              {rfq.rfqNumber}
            </h1>
            <span
              className="text-[11px] px-2 py-0.5 rounded border"
              style={{
                color: stageInfo?.color || '#6B778C',
                borderColor: `${stageInfo?.color || '#6B778C'}30`,
                backgroundColor: `${stageInfo?.color || '#6B778C'}10`,
              }}
            >
              {stageInfo?.label || rfq.stage}
            </span>
            <span
              className={clsx(
                'text-[11px] px-2 py-0.5 rounded',
                rfq.priority === 'critical' && 'bg-error-red/15 text-error-red',
                rfq.priority === 'high' && 'bg-warning-yellow/15 text-warning-yellow',
                rfq.priority === 'medium' && 'bg-active-blue/15 text-active-blue',
                rfq.priority === 'low' && 'bg-text-muted/15 text-text-muted'
              )}
            >
              {rfq.priority}
            </span>
          </div>

          <div className="text-[14px] text-text-secondary mt-1">
            {rfq.clientName}
          </div>

          <div className="flex items-center gap-4 mt-2 text-[12px] text-text-muted">
            <span className="flex items-center gap-1">
              <FiUser className="w-3 h-3" />
              {rfq.assignee?.name || 'Unassigned'}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              Updated {formatDistanceToNow(new Date(rfq.updatedAt))}
            </span>
            <span className="flex items-center gap-1">
              <FiMapPin className="w-3 h-3" />
              {rfq.deliveryLocation}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[12px] text-text-muted">Total Quantity</div>
          <div className="text-[16px] font-semibold text-text-primary">
            {qtyDisplay} <span className="text-[12px] font-normal text-text-muted">units</span>
          </div>
          <div className="text-[12px] text-text-muted mt-1">
            {rfq.items.length} item{rfq.items.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  )
})