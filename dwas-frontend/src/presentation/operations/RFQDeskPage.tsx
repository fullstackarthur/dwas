import { memo } from 'react'
import { RFQDeskSurface } from '../rfq-desk/layout'
import { AnimatePresence, motion } from 'framer-motion'

export const RFQDeskPage = memo(function RFQDeskPage() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="rfq-desk"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col h-full"
      >
        <RFQDeskSurface />
      </motion.div>
    </AnimatePresence>
  )
})