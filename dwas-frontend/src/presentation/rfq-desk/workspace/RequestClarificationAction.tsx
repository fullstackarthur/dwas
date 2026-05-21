import { memo } from 'react'
import { FiMessageSquare } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { RFQ } from '../../../core/types/rfq'

interface RequestClarificationActionProps {
  rfq: RFQ
}

export const RequestClarificationAction = memo(function RequestClarificationAction({}: RequestClarificationActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full flex items-center gap-2 px-3 py-2 rounded border border-border-panel bg-bg-tertiary text-text-secondary hover:bg-hover-surface transition-colors duration-120"
    >
      <FiMessageSquare className="w-4 h-4" />
      <span className="text-[12px] font-medium">Request Clarification</span>
    </motion.button>
  )
})