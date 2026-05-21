import { memo, useState } from 'react'
import clsx from 'clsx'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { mockRFQStages } from '../../../data/mock/rfq'
import type { RFQ, RFQStage } from '../../../core/types/rfq'
import { useRFQDeskStore } from '../../stores'

interface RFQStageTransitionPanelProps {
  rfq: RFQ
}

export const RFQStageTransitionPanel = memo(function RFQStageTransitionPanel({ rfq }: RFQStageTransitionPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const { updateRfqStage } = useRFQDeskStore()

  const currentStageIndex = mockRFQStages.findIndex((s) => s.id === rfq.stage)
  const availableStages = mockRFQStages.slice(currentStageIndex + 1)

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