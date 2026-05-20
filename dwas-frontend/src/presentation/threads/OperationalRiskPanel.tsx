import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiAlertTriangle, FiClock } from 'react-icons/fi'
import clsx from 'clsx'

export const OperationalRiskPanel = memo(function OperationalRiskPanel() {
  const { aiRecommendations, slaInfo } = useThreadDataStore()
  const risks = aiRecommendations.filter((r) => (r.type === 'risk_alert' || r.type === 'anomaly_alert') && !r.dismissed)
  const atRiskSLA = slaInfo.filter((s) => s.status === 'at_risk' || s.status === 'breached')

  if (risks.length === 0 && atRiskSLA.length === 0) return null

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
        <FiAlertTriangle className="w-4 h-4 text-error-red" />
        Operational Risks
      </h2>
      <div className="space-y-2">
        {risks.map((rec) => {
          const confidence = Math.round(rec.confidence * 100)
          const severityColor = confidence >= 90 ? 'text-error-red' : confidence >= 75 ? 'text-warning-yellow' : 'text-info-cyan'
          const severityBg = confidence >= 90 ? 'bg-error-red/10' : confidence >= 75 ? 'bg-warning-yellow/10' : 'bg-info-cyan/10'

          return (
            <div key={rec.id} className={clsx('border rounded-md p-3', severityBg, confidence >= 90 ? 'border-error-red/20' : confidence >= 75 ? 'border-warning-yellow/20' : 'border-info-cyan/20')}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-text-primary">{rec.title}</span>
                <span className={clsx('text-[10px] font-medium', severityColor)}>{confidence}% risk</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">{rec.description}</p>
              {rec.suggestedAction && (
                <div className="mt-2 text-[10px] text-text-muted">
                  Mitigation: <span className="text-active-blue">{rec.suggestedAction}</span>
                </div>
              )}
            </div>
          )
        })}
        {atRiskSLA.map((sla) => (
          <div key={sla.id} className="border border-warning-yellow/20 bg-warning-yellow/5 rounded-md p-3">
            <div className="flex items-center gap-2 mb-1">
              <FiClock className="w-3.5 h-3.5 text-warning-yellow" />
              <span className="text-[12px] font-medium text-text-primary">SLA: {sla.label}</span>
            </div>
            <div className="text-[11px] text-text-secondary">
              Target: {sla.target}
              {sla.remainingHours !== undefined && (
                <span className={clsx('ml-2', sla.remainingHours <= 4 ? 'text-error-red' : 'text-warning-yellow')}>
                  {sla.remainingHours}h remaining
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
