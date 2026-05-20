import { memo } from 'react'
import { FiCheckCircle } from 'react-icons/fi'

export const DeliveryProofPanel = memo(function DeliveryProofPanel() {
  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Delivery Proof</h2>
      <div className="border border-border-panel rounded-md p-4 text-center">
        <FiCheckCircle className="w-8 h-8 text-text-muted mx-auto mb-2" />
        <div className="text-[13px] text-text-muted">Awaiting delivery confirmation</div>
        <div className="text-[11px] text-text-muted mt-1">Proof of delivery will appear here once the shipment is delivered.</div>
      </div>
    </div>
  )
})
