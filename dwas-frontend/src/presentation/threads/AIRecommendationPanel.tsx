import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCpu, FiAlertTriangle, FiTrendingUp, FiCheckCircle, FiFileText, FiX, FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx'

export const AIRecommendationPanel = memo(function AIRecommendationPanel() {
  const { aiRecommendations, dismissAIRecommendation } = useThreadDataStore()

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    vendor_suggestion: FiTrendingUp,
    transport_suggestion: FiTrendingUp,
    margin_estimation: FiFileText,
    risk_alert: FiAlertTriangle,
    workflow_suggestion: FiArrowRight,
    followup_suggestion: FiCheckCircle,
    anomaly_alert: FiAlertTriangle,
    executive_summary: FiFileText,
  }

  const colorMap: Record<string, string> = {
    vendor_suggestion: 'text-info-cyan',
    transport_suggestion: 'text-info-cyan',
    margin_estimation: 'text-text-secondary',
    risk_alert: 'text-error-red',
    workflow_suggestion: 'text-active-blue',
    followup_suggestion: 'text-success-green',
    anomaly_alert: 'text-warning-yellow',
    executive_summary: 'text-text-secondary',
  }

  const bgMap: Record<string, string> = {
    risk_alert: 'bg-error-red/5 border-error-red/20',
    anomaly_alert: 'bg-warning-yellow/5 border-warning-yellow/20',
    vendor_suggestion: 'bg-info-cyan/5 border-info-cyan/20',
    transport_suggestion: 'bg-info-cyan/5 border-info-cyan/20',
    followup_suggestion: 'bg-success-green/5 border-success-green/20',
    margin_estimation: 'bg-bg-tertiary/50 border-border-panel',
    workflow_suggestion: 'bg-active-blue/5 border-active-blue/20',
    executive_summary: 'bg-bg-tertiary/50 border-border-panel',
  }

  const activeRecs = aiRecommendations.filter((r) => !r.dismissed)

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[14px] font-semibold text-text-primary flex items-center gap-2">
          <FiCpu className="w-4 h-4 text-active-blue" />
          AI Recommendations
        </h2>
        <span className="text-[11px] text-text-muted">{activeRecs.length} active</span>
      </div>

      <div className="space-y-2">
        {activeRecs.map((rec) => {
          const Icon = iconMap[rec.type] || FiCpu
          const confidence = Math.round(rec.confidence * 100)
          const confidenceColor = confidence >= 85 ? 'text-success-green' : confidence >= 70 ? 'text-warning-yellow' : 'text-text-muted'

          return (
            <div key={rec.id} className={clsx('border rounded-md p-3 group', bgMap[rec.type] || 'bg-bg-tertiary/50 border-border-panel')}>
              <div className="flex items-start gap-2">
                <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', colorMap[rec.type] || 'text-text-muted')} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-text-primary">{rec.title}</span>
                    <button
                      onClick={() => dismissAIRecommendation(rec.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-text-primary transition-all duration-120 flex-shrink-0"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={clsx('text-[10px] font-medium', confidenceColor)}>{confidence}% confidence</span>
                    <span className="text-text-muted text-[10px]">·</span>
                    <span className="text-[10px] text-text-muted capitalize">{rec.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1.5 leading-snug">{rec.description}</p>
                  {rec.suggestedAction && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-divider">
                      <span className="text-[10px] text-text-muted">Suggested:</span>
                      <button className="text-[10px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
                        {rec.suggestedAction}
                      </button>
                    </div>
                  )}
                  {rec.alternatives && rec.alternatives.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] text-text-muted">Alternatives:</span>
                      <div className="flex items-center gap-1 mt-1">
                        {rec.alternatives.map((alt, i) => (
                          <span key={i} className="text-[10px] bg-bg-tertiary text-text-muted px-1.5 py-0.5 rounded border border-border-panel">
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})
