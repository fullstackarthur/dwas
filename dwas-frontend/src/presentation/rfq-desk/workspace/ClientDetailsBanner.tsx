import { memo } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface ClientDetailsBannerProps {
  onAddClient: () => void
}

export const ClientDetailsBanner = memo(function ClientDetailsBanner({
  onAddClient,
}: ClientDetailsBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="mx-4 mt-3 flex items-center justify-between gap-3 px-4 py-2.5 bg-warning-yellow/8 border border-warning-yellow/25 rounded"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-warning-yellow/15 flex-shrink-0">
          <FiUserPlus className="w-3 h-3 text-warning-yellow" />
        </div>
        <div>
          <span className="text-[12px] font-medium text-warning-yellow">Client details missing</span>
          <span className="text-[12px] text-text-muted ml-1.5">
            — Add client info so this RFQ shows up correctly in all views.
          </span>
        </div>
      </div>
      <button
        onClick={onAddClient}
        className="flex-shrink-0 text-[12px] font-medium text-warning-yellow border border-warning-yellow/40 px-3 py-1 rounded hover:bg-warning-yellow/10 transition-colors whitespace-nowrap"
      >
        Add Client
      </button>
    </motion.div>
  )
})
