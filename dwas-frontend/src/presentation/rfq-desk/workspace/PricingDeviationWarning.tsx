import { memo } from 'react'
import clsx from 'clsx'
import { FiTrendingUp, FiAlertTriangle } from 'react-icons/fi'
import type { RFQ } from '../../../core/types/rfq'

interface PricingDeviationWarningProps {
  rfq: RFQ
}

export const PricingDeviationWarning = memo(function PricingDeviationWarning({
  rfq,
}: PricingDeviationWarningProps) {
  const hasQuotations = rfq.quotations.length > 0

  if (!hasQuotations) {
    return (
      <div className="p-2 border border-border-panel rounded">
        <div className="flex items-center gap-1 text-[11px] font-medium text-text-muted">
          <FiTrendingUp className="w-3 h-3" />
          Pricing Analysis
        </div>
        <div className="mt-1 text-[11px] text-text-muted">
          Awaiting quotation to analyze pricing
        </div>
      </div>
    )
  }

  const avgQuoted = rfq.quotations.reduce((sum, q) => sum + q.totalPrice, 0) / rfq.quotations.length
  const marketAvg = 850000
  const deviation = ((avgQuoted - marketAvg) / marketAvg) * 100
  const isDeviationHigh = Math.abs(deviation) > 15

  return (
    <div className={clsx('p-2 border rounded', isDeviationHigh ? 'border-warning-yellow/30 bg-warning-yellow/5' : 'border-border-panel')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-medium text-text-primary">
          <FiTrendingUp className={clsx('w-3 h-3', isDeviationHigh ? 'text-warning-yellow' : 'text-text-muted')} />
          Pricing Analysis
        </div>
        {isDeviationHigh && <FiAlertTriangle className="w-3 h-3 text-warning-yellow" />}
      </div>
      <div className="mt-1 text-[11px] text-text-secondary">
        Quoted: <span className="font-medium">₹{(avgQuoted / 100000).toFixed(1)}L</span>
        <span className="mx-1">vs</span>
        Market: <span className="font-medium">₹{(marketAvg / 100000).toFixed(1)}L</span>
      </div>
      <div className={clsx('text-[10px]', deviation > 0 ? 'text-error-red' : 'text-success-green')}>
        {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}% from market
      </div>
    </div>
  )
})