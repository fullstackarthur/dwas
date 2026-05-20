import { memo, useState } from 'react'
import { useAIStore } from '../stores'
import {
  FiCpu,
  FiSend,
  FiAlertTriangle,
  FiTrendingUp,
  FiCheckCircle,
  FiFileText,
} from 'react-icons/fi'
import clsx from 'clsx'

function AIRecommendationCard({ recId }: { recId: string }) {
  const { recommendations } = useAIStore()
  const rec = recommendations.find((r) => r.id === recId)
  if (!rec) return null

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    risk_alert: FiAlertTriangle,
    routing_suggestion: FiTrendingUp,
    priority_adjustment: FiAlertTriangle,
    summary: FiFileText,
    action_item: FiCheckCircle,
  }

  const colorMap: Record<string, string> = {
    risk_alert: 'text-error-red',
    routing_suggestion: 'text-info-cyan',
    priority_adjustment: 'text-warning-yellow',
    summary: 'text-text-secondary',
    action_item: 'text-success-green',
  }

  const Icon = iconMap[rec.type] || FiCpu

  return (
    <div className="p-4 bg-bg-secondary border border-border-panel rounded-md">
      <div className="flex items-start gap-2 mb-2">
        <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', colorMap[rec.type] || 'text-text-muted')} />
        <div className="flex-1">
          <div className="text-[14px] font-medium text-text-primary">{rec.title}</div>
          <div className="text-[12px] text-text-muted mt-0.5">
            Confidence: {Math.round(rec.confidence * 100)}%
          </div>
        </div>
      </div>
      <p className="text-[13px] text-text-secondary leading-relaxed mb-3">{rec.description}</p>
      {rec.suggestedAction && (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-text-muted">Suggested action:</span>
          <button className="text-[12px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

export const AIAssistantPage = memo(function AIAssistantPage() {
  const { recommendations } = useAIStore()
  const [query, setQuery] = useState('')

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-[24px] font-semibold text-text-primary">AI Assistant</h1>
        <p className="text-[13px] text-text-secondary mt-1">AI-powered insights, recommendations, and operational analysis</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-bg-tertiary border border-border-panel rounded-md px-3 py-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about operations, queues, or specific items..."
              className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
          <button className="p-2 bg-active-blue text-white rounded-md hover:bg-active-blue/90 transition-colors duration-120">
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <h2 className="text-[16px] font-semibold text-text-primary mb-2">Active Recommendations</h2>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <AIRecommendationCard key={rec.id} recId={rec.id} />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="p-8 text-center">
          <FiCpu className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <div className="text-[14px] text-text-muted">No active recommendations</div>
        </div>
      )}
    </div>
  )
})
