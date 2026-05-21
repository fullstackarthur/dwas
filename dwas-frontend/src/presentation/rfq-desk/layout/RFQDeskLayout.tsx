import { memo, type ReactNode } from 'react'
import { useRFQDeskStore } from '../../stores'
import { queueRailTransition } from './animations'
import { motion } from 'framer-motion'

interface RFQDeskLayoutProps {
  queueRail: ReactNode
  workspace: ReactNode
}

export const RFQDeskLayout = memo(function RFQDeskLayout({
  queueRail,
  workspace,
}: RFQDeskLayoutProps) {
  const queueRailCollapsed = useRFQDeskStore((s) => s.queueRailCollapsed)

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <motion.div
        animate={{ width: queueRailCollapsed ? 72 : 320 }}
        transition={queueRailTransition}
        className="flex-shrink-0 overflow-hidden"
      >
        {queueRail}
      </motion.div>
      <div className="flex-1 min-w-0 overflow-hidden border-l border-border-panel">
        {workspace}
      </div>
    </div>
  )
})