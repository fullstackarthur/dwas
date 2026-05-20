import { memo } from 'react'
import { useAIStore } from '../stores'
import { FiCpu, FiAlertTriangle, FiTrendingUp, FiCheckCircle, FiFileText, FiX } from 'react-icons/fi'
import clsx from 'clsx'

function AIReviewRow({ recId }: { recId: string }) {
  const { recommendations, dismissRecommendation } = useAIStore()
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
  const confidence = Math.round(rec.confidence * 100)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120 group">
      <div className="p-1.5 rounded bg-bg-tertiary flex-shrink-0">
        <Icon className={clsx('w-4 h-4', colorMap[rec.type] || 'text-text-muted')} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-medium text-text-primary">{rec.title}</span>
          <span className={clsx('text-[10px] font-medium', confidence >= 85 ? 'text-success-green' : confidence >= 70 ? 'text-warning-yellow' : 'text-text-muted')}>
            {confidence}% confidence
          </span>
        </div>
        <div className="text-[12px] text-text-secondary leading-snug">{rec.description}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-text-muted">{timeAgo(rec.createdAt)}</span>
          {rec.relatedItemId && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className="text-[10px] text-active-blue">{rec.relatedItemId}</span>
            </>
          )}
          {rec.suggestedAction && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <button className="text-[10px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
                Apply suggestion
              </button>
            </>
          )}
        </div>
      </div>
      <button
        onClick={() => dismissRecommendation(rec.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-text-primary transition-all duration-120 flex-shrink-0"
      >
        <FiX className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export const AIReviewQueue = memo(function AIReviewQueue() {
  const { recommendations } = useAIStore()
  const riskAlerts = recommendations.filter((r) => r.type === 'risk_alert')
  const suggestions = recommendations.filter((r) => r.type !== 'risk_alert' && r.type !== 'summary')
  const summaries = recommendations.filter((r) => r.type === 'summary')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">AI Review Queue</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}, {riskAlerts.length} risk alert{riskAlerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {riskAlerts.length > 0 && (
        <div className="px-3 py-1.5 border-b border-divider bg-error-red/5">
          <span className="text-[11px] text-error-red font-medium">
            {riskAlerts.length} risk alert{riskAlerts.length !== 1 ? 's' : ''} require review
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center">
            <FiCpu className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <div className="text-[14px] text-text-muted">No AI reviews pending</div>
          </div>
        ) : (
          <>
            {riskAlerts.length > 0 && (
              <>
                <div className="px-3 py-1.5 border-b border-divider bg-bg-tertiary/50">
                  <span className="text-[11px] font-medium text-error-red uppercase tracking-wide">Risk Alerts</span>
                </div>
                {riskAlerts.map((r) => <AIReviewRow key={r.id} recId={r.id} />)}
              </>
            )}
            {suggestions.length > 0 && (
              <>
                <div className="px-3 py-1.5 border-b border-divider bg-bg-tertiary/50">
                  <span className="text-[11px] font-medium text-info-cyan uppercase tracking-wide">Suggestions</span>
                </div>
                {suggestions.map((r) => <AIReviewRow key={r.id} recId={r.id} />)}
              </>
            )}
            {summaries.length > 0 && (
              <>
                <div className="px-3 py-1.5 border-b border-divider bg-bg-tertiary/50">
                  <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">Summaries</span>
                </div>
                {summaries.map((r) => <AIReviewRow key={r.id} recId={r.id} />)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
})
