import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { VendorRecommendationCard } from './VendorRecommendationCard'
import { VendorScoreIndicator } from './VendorScoreIndicator'

interface VendorSuggestionsPanelProps {
  rfq: RFQ
}

export const VendorSuggestionsPanel = memo(function VendorSuggestionsPanel({
  rfq,
}: VendorSuggestionsPanelProps) {
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
          rfq.vendorRecommendations.map((vendor) => (
            <VendorRecommendationCard key={vendor.id} vendor={vendor} rfqId={rfq.id} />
          ))
        )}
      </div>
    </div>
  )
})