import { memo } from 'react'
import type { RFQ } from '../../../core/types/rfq'
import { VendorRecommendationCard } from './VendorRecommendationCard'
import { useRFQDeskStore } from '../../stores'
import { FiCheckCircle } from 'react-icons/fi'

interface VendorSuggestionsPanelProps {
  rfq: RFQ
}

export const VendorSuggestionsPanel = memo(function VendorSuggestionsPanel({
  rfq,
}: VendorSuggestionsPanelProps) {
  const selectVendor = useRFQDeskStore((s) => s.selectVendor)

  const selectedVendor = rfq.vendorRecommendations.find(
    (v) => v.isSelected || v.id === rfq.selectedVendorId
  )
  const isConfirmed = rfq.status === 'won' || !!rfq.acceptedQuoteId

  if (isConfirmed && selectedVendor) {
    return (
      <div className="panel">
        <div className="panel-header flex items-center">
          <h3 className="panel-title">Vendor Suggestions</h3>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-success-green">
            <FiCheckCircle className="w-3.5 h-3.5" />
            Confirmed
          </span>
        </div>
        <div className="p-3">
          <div className="p-3 border border-success-green/30 bg-success-green/5 rounded">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-text-primary">
                {selectedVendor.vendorName}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-success-green/15 text-success-green border border-success-green/30">
                Selected
              </span>
            </div>
            <div className="text-[11px] text-text-muted mt-1">
              {selectedVendor.vendorLocation}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="panel-header flex items-center">
        <h3 className="panel-title">Vendor Suggestions</h3>
        <span className="text-[11px] text-text-muted ml-2">
          {rfq.vendorRecommendations.length} matched
        </span>
        {rfq.aiVendorMatchCount > 0 && (
          <span className="ml-auto text-[11px] text-info-cyan">
            AI sourced {rfq.aiVendorMatchCount} total
          </span>
        )}
      </div>
      <div className="p-3 space-y-2">
        {rfq.vendorRecommendations.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-[12px] text-text-muted">
              No vendor matches yet. AI is sourcing vendors.
            </div>
          </div>
        ) : (
          rfq.vendorRecommendations.map((vendor) => {
            const isSelected = vendor.isSelected || vendor.id === rfq.selectedVendorId
            return (
              <VendorRecommendationCard
                key={vendor.id}
                vendor={{ ...vendor, isSelected }}
                onSelect={(vendorId) => selectVendor(rfq.id, vendorId)}
              />
            )
          })
        )}
      </div>
    </div>
  )
})
