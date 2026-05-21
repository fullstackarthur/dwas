import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RFQDeskSurface } from './layout'
import { queueItemMotion } from './layout/animations'

export const RFQDeskPage = motion(
  memo(function RFQDeskPage() {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="rfq-desk"
          {...queueItemMotion}
          className="flex flex-col h-full"
        >
          <RFQDeskSurface />
        </motion.div>
      </AnimatePresence>
    )
  })
)