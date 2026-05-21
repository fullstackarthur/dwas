import { memo } from 'react'
import { motion } from 'framer-motion'

export const LoadingIndicator = memo(function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-full bg-bg-primary">
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-active-blue"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-active-blue"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-active-blue"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span className="ml-3 text-[12px] text-text-muted">Loading RFQ data...</span>
    </div>
  )
})
