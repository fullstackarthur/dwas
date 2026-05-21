import { memo } from 'react'
import clsx from 'clsx'
import type { AIVendorRecommendation } from '../../../core/types/rfq'
import { VendorScoreIndicator } from './VendorScoreIndicator'
import { FiMapPin } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface VendorRecommendationCardProps {
  vendor: AIVendorRecommendation
}

export const VendorRecommendationCard = memo(function VendorRecommendationCard({
  vendor,
}: VendorRecommendationCardProps) {

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-3 border border-border-panel rounded hover:border-active-blue/30 transition-colors duration-120 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary">
              {vendor.vendorName}
            </span>
            <VendorScoreIndicator score={vendor.score} />
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-text-muted">
            <FiMapPin className="w-3 h-3" />
            {vendor.vendorLocation}
          </div>
        </div>
        <span
          className={clsx(
            'text-[10px] px-1.5 py-0.5 rounded border',
            vendor.confidence === 'high' && 'bg-success-green/15 text-success-green border-success-green/30',
            vendor.confidence === 'medium' && 'bg-warning-yellow/15 text-warning-yellow border-warning-yellow/30',
            vendor.confidence === 'low' && 'bg-text-muted/15 text-text-muted border-text-muted/30'
          )}
        >
          {vendor.confidence}
        </span>
      </div>

      <div className="mt-2">
        <div className="text-[10px] font-medium text-text-muted uppercase mb-1">
          Match Reasons
        </div>
        <div className="flex flex-wrap gap-1">
          {vendor.matchReasons.map((reason, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-secondary rounded"
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      {vendor.historicalPerformance && (
        <div className="mt-2 pt-2 border-t border-divider grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-[11px] font-semibold text-success-green">
              {vendor.historicalPerformance.onTimeDeliveryRate.toFixed(0)}%
            </div>
            <div className="text-[9px] text-text-muted">On-Time</div>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-semibold text-active-blue">
              {vendor.historicalPerformance.qualityScore.toFixed(0)}%
            </div>
            <div className="text-[9px] text-text-muted">Quality</div>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-semibold text-text-primary">
              {vendor.historicalPerformance.averageLeadTime}d
            </div>
            <div className="text-[9px] text-text-muted">Lead Time</div>
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button className="flex-1 text-[11px] font-medium text-active-blue hover:bg-active-blue/10 py-1.5 rounded border border-active-blue/30 transition-colors duration-120">
          Select Vendor
        </button>
        <button className="flex-1 text-[11px] font-medium text-text-secondary hover:bg-hover-surface py-1.5 rounded border border-border-panel transition-colors duration-120">
          View Profile
        </button>
      </div>
    </motion.div>
  )
})