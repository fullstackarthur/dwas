import { memo } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

interface MissingInformationAlertProps {
  count: number
}

export const MissingInformationAlert = memo(function MissingInformationAlert({
  count,
}: MissingInformationAlertProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-error-red/10 border border-error-red/20 rounded">
      <FiAlertTriangle className="w-4 h-4 text-error-red flex-shrink-0" />
      <span className="text-[12px] text-error-red">
        {count} requirement{count !== 1 ? 's are' : ' is'} missing or incomplete
      </span>
    </div>
  )
})