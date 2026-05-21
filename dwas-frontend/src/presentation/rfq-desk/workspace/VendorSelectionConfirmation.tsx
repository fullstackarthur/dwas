import { memo } from 'react'
import clsx from 'clsx'
import { FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { RFQ } from '../../../core/types/rfq'

interface VendorSelectionConfirmationProps {
  rfq: RFQ
}

export const VendorSelectionConfirmation = memo(function VendorSelectionConfirmation({ rfq }: VendorSelectionConfirmationProps) {
  const hasQuotation = rfq.quotations.length > 0

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      disabled={!hasQuotation}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-2 rounded border transition-colors duration-120',
        hasQuotation
          ? 'border-success-green/30 bg-success-green/5 text-success-green hover:bg-success-green/10'
          : 'border-border-panel bg-bg-tertiary text-text-muted cursor-not-allowed'
      )}
    >
      <FiCheckCircle className="w-4 h-4" />
      <span className="text-[12px] font-medium">
        Confirm Vendor Selection{hasQuotation ? '' : ' (Awaiting quotation)'}
      </span>
    </motion.button>
  )
})