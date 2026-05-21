import { memo } from 'react'

export const RFQUnreadIndicator = memo(function RFQUnreadIndicator({
  count,
}: {
  count: number
}) {
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-active-blue text-white rounded-full">
      {count > 9 ? '9+' : count}
    </span>
  )
})