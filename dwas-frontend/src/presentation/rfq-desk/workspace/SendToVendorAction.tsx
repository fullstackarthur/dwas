import { memo } from 'react'
import clsx from 'clsx'
import { FiSend } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { RFQ } from '../../../core/types/rfq'
import { useRFQDeskStore } from '../../stores'

interface SendToVendorActionProps {
  rfq: RFQ
}

export const SendToVendorAction = memo(function SendToVendorAction({ rfq }: SendToVendorActionProps) {
  const sendToVendor = useRFQDeskStore((s) => s.sendToVendor)

  const selectedVendor = rfq.vendorRecommendations.find(
    (v) => v.isSelected || v.id === rfq.selectedVendorId
  )
  const alreadySent = rfq.quotations.some(
    (q) => q.vendorId === selectedVendor?.vendorId
  )
  const canSend = !!selectedVendor && !alreadySent && rfq.status !== 'won'

  if (alreadySent) {
    return (
      <div className="w-full flex items-center gap-2 px-3 py-2 rounded border border-text-muted/20 bg-bg-tertiary">
        <FiSend className="w-4 h-4 text-text-muted" />
        <span className="text-[12px] font-medium text-text-muted">
          Already sent to {selectedVendor?.vendorName}
        </span>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={canSend ? { scale: 1.01 } : undefined}
      whileTap={canSend ? { scale: 0.99 } : undefined}
      disabled={!canSend}
      onClick={() => selectedVendor && sendToVendor(rfq.id, selectedVendor.vendorId)}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-2 rounded border transition-colors duration-120',
        canSend
          ? 'border-active-blue/30 bg-active-blue/5 text-active-blue hover:bg-active-blue/10'
          : 'border-border-panel bg-bg-tertiary text-text-muted cursor-not-allowed'
      )}
    >
      <FiSend className="w-4 h-4" />
      <span className="text-[12px] font-medium">
        {!selectedVendor
          ? 'Select a vendor first'
          : `Send to ${selectedVendor.vendorName}`}
      </span>
    </motion.button>
  )
})
