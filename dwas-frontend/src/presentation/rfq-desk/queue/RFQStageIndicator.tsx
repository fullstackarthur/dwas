import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { mockRFQStages } from '../../../data/mock/rfq'

export const RFQStageIndicator = memo(function RFQStageIndicator({
  stage,
}: {
  stage: RFQ['stage']
}) {
  const stageInfo = mockRFQStages.find((s) => s.id === stage)
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