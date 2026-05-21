import { memo } from 'react'

export const PurchaseOrdersPage = memo(function PurchaseOrdersPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider flex-shrink-0">
        <h1 className="text-[24px] font-semibold text-text-primary">Purchase Orders</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">Manage purchase orders</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Content will be added */}
      </div>
    </div>
  )
})
