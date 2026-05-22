import { memo } from 'react'
import type { RFQ } from '../../../core/types/rfq'

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

export const RFQStageIndicator = memo(function RFQStageIndicator({
  stage,
}: {
  stage: RFQ['stage']
}) {
  const stageInfo = RFQStages.find((s) => s.id === stage)
  const color = stageInfo?.color || '#6B778C'

  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded border"
      style={{
        color,
        borderColor: `${color}30`,
        backgroundColor: `${color}10`,
      }}
    >
      {stageInfo?.label || stage}
    </span>
  )
})