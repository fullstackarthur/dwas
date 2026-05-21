import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { FiCpu, FiAlertTriangle, FiTrendingUp, FiLink } from 'react-icons/fi'
import { SimilarHistoricalRFQs } from './SimilarHistoricalRFQs'
import { PricingDeviationWarning } from './PricingDeviationWarning'
import { AIWorkflowRecommendations } from './AIWorkflowRecommendations'

interface AIInsightsPanelProps {
  rfq: RFQ
}

export const AIInsightsPanel = memo(function AIInsightsPanel({ rfq }: AIInsightsPanelProps) {
  const hasInsights = rfq.aiConfidence > 0

  return (
    <div className="panel">
      <div className="panel-header flex items-center">
        <h3 className="panel-title">AI Insights</h3>
        <div className="ml-auto flex items-center gap-1 text-[11px] text-info-cyan">
          <FiCpu className="w-3 h-3" />
          DWAS AI
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div className="p-2 bg-info-cyan/5 border border-info-cyan/20 rounded">
          <div className="text-[11px] font-medium text-text-primary">
            AI Extraction Confidence
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-info-cyan rounded-full"
                style={{ width: `${rfq.aiConfidence * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-info-cyan">
              {(rfq.aiConfidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <SimilarHistoricalRFQs rfq={rfq} />
        <PricingDeviationWarning rfq={rfq} />
        <AIWorkflowRecommendations rfq={rfq} />
      </div>
    </div>
  )
})