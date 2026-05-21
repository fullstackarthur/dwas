import { memo } from 'react'
import { FiCpu } from 'react-icons/fi'

export const OCRProcessingIndicator = memo(function OCRProcessingIndicator() {
  return (
    <span className="flex items-center gap-1 text-info-cyan">
      <FiCpu className="w-3 h-3" />
      Processing OCR
    </span>
  )
})