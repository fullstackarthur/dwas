import { memo, useState } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import type { RFQ, RFQStage } from '../../../core/types/rfq'
import { useRFQDeskStore } from '../../stores'

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

interface RFQStageTransitionPanelProps {
  rfq: RFQ
}

export const RFQStageTransitionPanel = memo(function RFQStageTransitionPanel({ rfq }: RFQStageTransitionPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const { updateRfqStage } = useRFQDeskStore()

  const currentStageIndex = RFQStages.findIndex((s) => s.id === rfq.stage)
  const availableStages = RFQStages.slice(currentStageIndex + 1)

  const handleTransition = (newStage: RFQStage) => {
    updateRfqStage(rfq.id, newStage)
  }

  return (
    <div className="border border-border-panel rounded">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-medium text-text-primary hover:bg-hover-surface transition-colors duration-120"
      >
        <span>Stage Transition</span>
        {expanded ? (
          <FiChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <FiChevronRight className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-1">
          {availableStages.length === 0 ? (
            <div className="text-[11px] text-text-muted py-2">No further stages</div>
          ) : (
            availableStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => handleTransition(stage.id as RFQStage)}
                className="w-full text-left px-2 py-1.5 text-[11px] text-text-secondary hover:bg-hover-surface rounded transition-colors duration-120"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: stage.color }}
                />
                {stage.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
})