import { memo } from 'react'
import { FiCpu, FiAlertTriangle, FiTrendingUp, FiCheckCircle, FiFileText } from 'react-icons/fi'
import clsx from 'clsx'
import type { AIRecommendation } from '../../core/types'

interface AIInsightStripProps {
  recommendation: AIRecommendation
  compact?: boolean
  onDismiss?: () => void
  onApply?: () => void
}

export const AIInsightStrip = memo(function AIInsightStrip({
  recommendation,
  compact = false,
  onApply,
}: AIInsightStripProps) {
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

  const bgMap: Record<string, string> = {
    risk_alert: 'bg-error-red/5 border-error-red/20',
    routing_suggestion: 'bg-info-cyan/5 border-info-cyan/20',
    priority_adjustment: 'bg-warning-yellow/5 border-warning-yellow/20',
    summary: 'bg-bg-tertiary/50 border-border-panel',
    action_item: 'bg-success-green/5 border-success-green/20',
  }

  const Icon = iconMap[recommendation.type] || FiCpu
  const confidence = Math.round(recommendation.confidence * 100)

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-2 px-3 py-1.5 border-b border-divider', bgMap[recommendation.type])}>
        <Icon className={clsx('w-3 h-3 flex-shrink-0', colorMap[recommendation.type])} />
        <span className="text-[11px] text-text-secondary truncate flex-1">{recommendation.title}</span>
        <span className="text-[10px] text-text-muted flex-shrink-0">{confidence}%</span>
      </div>
    )
  }

  return (
    <div className={clsx('px-4 py-3 border-b border-divider', bgMap[recommendation.type])}>
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded bg-bg-tertiary">
          <Icon className={clsx('w-4 h-4', colorMap[recommendation.type])} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-medium text-text-primary">{recommendation.title}</span>
            <span className="text-[10px] text-text-muted">{confidence}% confidence</span>
          </div>
          <p className="text-[12px] text-text-secondary leading-snug">{recommendation.description}</p>
          {recommendation.suggestedAction && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-text-muted">Suggested:</span>
              <span className="text-[11px] text-text-secondary">{recommendation.suggestedAction}</span>
              <button
                onClick={onApply}
                className="ml-auto text-[11px] text-active-blue hover:text-active-blue/80 transition-colors duration-120"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
