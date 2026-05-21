import { memo } from 'react'
import clsx from 'clsx'
import { FiSend } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { RFQ } from '../../../core/types/rfq'

interface SendToVendorActionProps {
  rfq: RFQ
}

export const SendToVendorAction = memo(function SendToVendorAction({ rfq }: SendToVendorActionProps) {
  const hasSelectedVendor = false

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      disabled={!hasSelectedVendor}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-2 rounded border transition-colors duration-120',
        hasSelectedVendor
          ? 'border-active-blue/30 bg-active-blue/5 text-active-blue hover:bg-active-blue/10'
          : 'border-border-panel bg-bg-tertiary text-text-muted cursor-not-allowed'
      )}
    >
      <FiSend className="w-4 h-4" />
      <span className="text-[12px] font-medium">
        Send to Vendor{hasSelectedVendor ? '' : ' (Select vendor first)'}
      </span>
    </motion.button>
  )
})