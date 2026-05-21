import { memo } from 'react'

export const VendorCoordinationPage = memo(function VendorCoordinationPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider flex-shrink-0">
        <h1 className="text-[24px] font-semibold text-text-primary">Vendor Coordination</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">Coordinate with vendors</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Content will be added */}
      </div>
    </div>
  )
})
