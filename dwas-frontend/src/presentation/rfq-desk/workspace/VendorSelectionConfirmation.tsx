import { memo } from 'react'
import clsx from 'clsx'
import { FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { RFQ } from '../../../core/types/rfq'
import { useRFQDeskStore } from '../../stores'

interface VendorSelectionConfirmationProps {
  rfq: RFQ
}

export const VendorSelectionConfirmation = memo(function VendorSelectionConfirmation({ rfq }: VendorSelectionConfirmationProps) {
  const acceptQuote = useRFQDeskStore((s) => s.acceptQuote)

  const selectedVendor = rfq.vendorRecommendations.find(
    (v) => v.isSelected || v.id === rfq.selectedVendorId
  )
  const vendorQuote = rfq.quotations.find(
    (q) => q.vendorId === selectedVendor?.vendorId && q.status !== 'rejected'
  )
  const canConfirm = !!selectedVendor && !!vendorQuote && rfq.status !== 'won'

  if (rfq.status === 'won') {
    return (
      <div className="w-full flex items-center gap-2 px-3 py-2 rounded border border-success-green/30 bg-success-green/5">
        <FiCheckCircle className="w-4 h-4 text-success-green" />
        <span className="text-[12px] font-medium text-success-green">
          Vendor confirmed - {selectedVendor?.vendorName}
        </span>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={canConfirm ? { scale: 1.01 } : undefined}
      whileTap={canConfirm ? { scale: 0.99 } : undefined}
      disabled={!canConfirm}
      onClick={() => vendorQuote && acceptQuote(rfq.id, vendorQuote.id)}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-2 rounded border transition-colors duration-120',
        canConfirm
          ? 'border-success-green/30 bg-success-green/5 text-success-green hover:bg-success-green/10'
          : 'border-border-panel bg-bg-tertiary text-text-muted cursor-not-allowed'
      )}
    >
      <FiCheckCircle className="w-4 h-4" />
      <span className="text-[12px] font-medium">
        {!selectedVendor
          ? 'Select a vendor first'
          : !vendorQuote
            ? 'Awaiting quotation'
            : `Confirm ${vendorQuote.vendorName}`}
      </span>
    </motion.button>
  )
})
