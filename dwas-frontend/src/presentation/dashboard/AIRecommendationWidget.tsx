import { memo } from 'react'
import { useAIStore } from '../stores'
import { FiAlertTriangle, FiTrendingUp, FiCheckCircle, FiFileText, FiCpu, FiX } from 'react-icons/fi'
import clsx from 'clsx'

export const AIRecommendationWidget = memo(function AIRecommendationWidget() {
  const { recommendations, dismissRecommendation } = useAIStore()

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

  if (recommendations.length === 0) {
    return (
      <div className="p-4 text-center">
        <FiCpu className="w-6 h-6 text-text-muted mx-auto mb-2" />
        <div className="text-[12px] text-text-muted">No active recommendations</div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-divider">
      {recommendations.slice(0, 4).map((rec) => {
        const Icon = iconMap[rec.type] || FiCpu
        const confidence = Math.round(rec.confidence * 100)
        const confidenceColor = confidence >= 85 ? 'text-success-green' : confidence >= 70 ? 'text-warning-yellow' : 'text-text-muted'

        return (
          <div key={rec.id} className="px-3 py-2.5 group hover:bg-hover-surface/50 transition-colors duration-120">
            <div className="flex items-start gap-2">
              <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', colorMap[rec.type] || 'text-text-muted')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-medium text-text-primary truncate">{rec.title}</span>
                  <button
                    onClick={() => dismissRecommendation(rec.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-text-primary transition-all duration-120 flex-shrink-0"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-snug line-clamp-2">{rec.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={clsx('text-[10px] font-medium', confidenceColor)}>
                    {confidence}% confidence
                  </span>
                  {rec.suggestedAction && (
                    <button className="text-[10px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
                      Apply suggestion
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
