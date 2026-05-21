import { memo } from 'react'
import clsx from 'clsx'

interface VendorScoreIndicatorProps {
  score: number
}

export const VendorScoreIndicator = memo(function VendorScoreIndicator({
  score,
}: VendorScoreIndicatorProps) {
  const color = score >= 85 ? 'text-success-green' : score >= 70 ? 'text-warning-yellow' : 'text-error-red'
  const bgColor = score >= 85 ? 'bg-success-green/15' : score >= 70 ? 'bg-warning-yellow/15' : 'bg-error-red/15'

  return (
    <span className={clsx('text-[11px] font-semibold px-1.5 py-0.5 rounded', bgColor, color)}>
      {score}
    </span>
  )
})