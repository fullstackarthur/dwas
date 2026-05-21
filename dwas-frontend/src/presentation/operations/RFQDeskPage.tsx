import { memo, useEffect } from 'react'
import { RFQDeskSurface } from '../rfq-desk/layout'
import { AnimatePresence, motion } from 'framer-motion'
import { useRFQDeskStore } from '../stores/rfqStore'

export const RFQDeskPage = memo(function RFQDeskPage() {
  const fetchRfqs = useRFQDeskStore((s) => s.fetchRfqs)
  const subscribeToRealtime = useRFQDeskStore((s) => s.subscribeToRealtime)
  const unsubscribeFromRealtime = useRFQDeskStore((s) => s.unsubscribeFromRealtime)

  useEffect(() => {
    fetchRfqs()
    subscribeToRealtime()
    return () => {
      unsubscribeFromRealtime()
    }
  }, [fetchRfqs, subscribeToRealtime, unsubscribeFromRealtime])

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
