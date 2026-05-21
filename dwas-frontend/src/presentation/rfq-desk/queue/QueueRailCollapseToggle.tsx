import { memo } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { useRFQDeskStore } from '../../stores'
import { motion } from 'framer-motion'

export const QueueRailCollapseToggle = memo(function QueueRailCollapseToggle() {
  const { queueRailCollapsed, toggleQueueRail } = useRFQDeskStore()

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleQueueRail}
      className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-hover-surface transition-colors duration-120"
      title={queueRailCollapsed ? 'Expand queue rail' : 'Collapse queue rail'}
    >
      {queueRailCollapsed ? (
        <FiChevronRight className="w-4 h-4" />
      ) : (
        <FiChevronRight className="w-4 h-4 transform rotate-180" />
      )}
    </motion.button>
  )
})