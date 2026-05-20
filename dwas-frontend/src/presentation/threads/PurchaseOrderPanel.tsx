import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiFileText } from 'react-icons/fi'

export const PurchaseOrderPanel = memo(function PurchaseOrderPanel() {
  const { requirements, financialEntries } = useThreadDataStore()

  const poValue = financialEntries.find((e) => e.type === 'po_value')
  const freight = financialEntries.find((e) => e.type === 'freight')

  const material = requirements.find((r) => r.label === 'Material')
  const quantity = requirements.find((r) => r.label === 'Quantity')
  const destination = requirements.find((r) => r.label === 'Destination')

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Purchase Order Details</h2>
      <div className="border border-border-panel rounded-md">
        <div className="px-3 py-2 border-b border-divider flex items-center gap-2">
          <FiFileText className="w-4 h-4 text-text-muted" />
          <span className="text-[13px] font-medium text-text-primary">PO#48291</span>
        </div>
        <div className="p-3 space-y-2">
          {material && (
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-muted">Material</span>
              <span className="text-text-primary">{material.value}</span>
            </div>
          )}
          {quantity && (
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-muted">Quantity</span>
              <span className="text-text-primary">{quantity.value} {quantity.unit}</span>
            </div>
          )}
          {destination && (
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-muted">Destination</span>
              <span className="text-text-primary">{destination.value}</span>
            </div>
          )}
          {poValue && (
            <div className="flex items-center justify-between text-[12px] pt-2 border-t border-divider">
              <span className="text-text-muted">PO Value</span>
              <span className="text-text-primary font-medium">₹{poValue.amount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {freight && (
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-muted">Freight</span>
              <span className="text-text-primary">₹{freight.amount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {poValue && freight && (
            <div className="flex items-center justify-between text-[12px] pt-2 border-t border-divider">
              <span className="text-text-muted font-medium">Total</span>
              <span className="text-text-primary font-semibold">₹{(poValue.amount + freight.amount).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
