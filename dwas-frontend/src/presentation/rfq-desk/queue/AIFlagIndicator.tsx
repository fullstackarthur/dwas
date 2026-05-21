import { memo } from 'react'
import { FiCpu } from 'react-icons/fi'

export const AIFlagIndicator = memo(function AIFlagIndicator({
  matchCount,
}: {
  matchCount: number
}) {
  if (matchCount === 0) return null

  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-info-cyan/10">
      <FiCpu className="w-3 h-3 text-info-cyan" />
      <span className="text-[10px] text-info-cyan font-medium">
        {matchCount} vendors
      </span>
    </div>
  )
})