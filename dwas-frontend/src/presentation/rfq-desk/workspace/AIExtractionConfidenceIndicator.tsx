import { memo } from 'react'
import clsx from 'clsx'

interface AIExtractionConfidenceIndicatorProps {
  confidence: number
}

export const AIExtractionConfidenceIndicator = memo(function AIExtractionConfidenceIndicator({
  confidence,
}: AIExtractionConfidenceIndicatorProps) {
  const percentage = Math.round(confidence * 100)
  const color =
    percentage >= 85 ? 'text-success-green' : percentage >= 70 ? 'text-warning-yellow' : 'text-error-red'

  return (
    <div className="flex items-center gap-1 ml-auto">
      <span className="text-[10px] text-text-muted">AI Confidence:</span>
      <span className={clsx('text-[11px] font-semibold', color)}>{percentage}%</span>
    </div>
  )
})