import { memo } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useRFQDeskStore } from '../../stores'

export const LiveQueueUpdateIndicator = memo(function LiveQueueUpdateIndicator() {
  const realtimeConnected = useRFQDeskStore((s) => s.realtimeConnected)

  return (
    <motion.div
      animate={{ opacity: realtimeConnected ? 1 : 0.5 }}
      className="flex items-center gap-1.5"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-2 h-2 rounded-full bg-success-green"
      />
      <span className="text-[11px] text-text-muted">
        {realtimeConnected ? 'Live' : 'Offline'}
      </span>
    </motion.div>
  )
})