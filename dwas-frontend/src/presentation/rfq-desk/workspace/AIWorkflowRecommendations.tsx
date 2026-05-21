import { memo } from 'react'
import { FiCpu } from 'react-icons/fi'
import type { RFQ } from '../../../core/types/rfq'
import { mockRFQStages } from '../../../data/mock/rfq'

interface AIWorkflowRecommendationsProps {
  rfq: RFQ
}

export const AIWorkflowRecommendations = memo(function AIWorkflowRecommendations({
  rfq,
}: AIWorkflowRecommendationsProps) {
  const recommendations = getRecommendations(rfq)

  if (recommendations.length === 0) return null

  return (
    <div className="p-2 border border-border-panel rounded">
      <div className="flex items-center gap-1 text-[11px] font-medium text-text-primary">
        <FiCpu className="w-3 h-3 text-info-cyan" />
        AI Recommendations
      </div>
      <div className="mt-2 space-y-1">
        {recommendations.map((rec, i) => (
          <div key={i} className="text-[11px] text-text-secondary flex items-start gap-1">
            <span className="text-active-blue">•</span>
            {rec}
          </div>
        ))}
      </div>
    </div>
  )
})

function getRecommendations(rfq: RFQ): string[] {
  const recs: string[] = []
  const stageInfo = mockRFQStages.find((s) => s.id === rfq.stage)

  if (rfq.stage === 'new') {
    recs.push('Initiate AI extraction to parse requirements from attached documents')
  }

  if (rfq.slaStatus === 'at_risk') {
    recs.push('Prioritize vendor outreach to meet SLA deadline')
  }

  if (rfq.aiVendorMatchCount > 3 && rfq.vendorRecommendations.length === 0) {
    recs.push('Contact matched vendors before quotes expire')
  }

  if (rfq.requirements.some((r) => r.validationStatus === 'uncertain')) {
    recs.push('Request clarification from client on uncertain requirements')
  }

  return recs
}