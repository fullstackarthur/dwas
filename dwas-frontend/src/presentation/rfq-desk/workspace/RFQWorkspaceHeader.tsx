import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { formatDistanceToNow } from '../../../core/utils'
import { FiUser, FiClock, FiMapPin, FiEdit2, FiUserPlus } from 'react-icons/fi'

const RFQStages = [
  { id: 'new', label: 'New', color: '#6B778C' },
  { id: 'requirements_extraction', label: 'Requirements Extraction', color: '#8B5CF6' },
  { id: 'vendor_sourcing', label: 'Vendor Sourcing', color: '#3B82F6' },
  { id: 'vendor_coordination', label: 'Vendor Coordination', color: '#F59E0B' },
  { id: 'quotation_received', label: 'Quotation Received', color: '#EF4444' },
  { id: 'quotation_review', label: 'Quotation Review', color: '#10B981' },
  { id: 'client_presentation', label: 'Client Presentation', color: '#6366F1' },
  { id: 'negotiation', label: 'Negotiation', color: '#EC4899' },
  { id: 'order_confirmation', label: 'Order Confirmation', color: '#14B8A6' },
  { id: 'po_generated', label: 'PO Generated', color: '#8B5CF6' },
  { id: 'closed', label: 'Closed', color: '#94A3B8' },
  { id: 'cancelled', label: 'Cancelled', color: '#6B7280' },
] as const

interface RFQWorkspaceHeaderProps {
  rfq: RFQ
  onEditClient: () => void
}

export const RFQWorkspaceHeader = memo(function RFQWorkspaceHeader({
  rfq,
  onEditClient,
}: RFQWorkspaceHeaderProps) {
  const stageInfo = RFQStages.find((s) => s.id === rfq.stage)
  const qtyDisplay = rfq.totalQuantity >= 1000 ? `${(rfq.totalQuantity / 1000).toFixed(1)}K` : rfq.totalQuantity
  const hasClient = Boolean(rfq.clientName)

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

          {/* Client row */}
          <div className="flex items-center gap-1.5 mt-1 group">
            {hasClient ? (
              <>
                <span className="text-[14px] text-text-secondary">{rfq.clientName}</span>
                <button
                  onClick={onEditClient}
                  title="Edit client details"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-text-muted hover:text-active-blue hover:bg-active-blue/10 transition-all duration-120"
                >
                  <FiEdit2 className="w-3 h-3" />
                </button>
              </>
            ) : (
              <button
                onClick={onEditClient}
                className="flex items-center gap-1.5 text-[12px] text-warning-yellow border border-warning-yellow/30 bg-warning-yellow/8 px-2 py-0.5 rounded hover:bg-warning-yellow/15 transition-colors"
              >
                <FiUserPlus className="w-3 h-3" />
                Add client details
              </button>
            )}
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