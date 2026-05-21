import { memo } from 'react'
import clsx from 'clsx'
import { FiPlus, FiRefreshCw } from 'react-icons/fi'
import { motion } from 'framer-motion'

export const RFQQuickActions = memo(function RFQQuickActions() {
  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-active-blue text-white rounded-md hover:bg-active-blue/90 transition-colors duration-120"
      >
        <FiPlus className="w-3.5 h-3.5" />
        <span>New RFQ</span>
      </motion.button>
    </div>
  )
})