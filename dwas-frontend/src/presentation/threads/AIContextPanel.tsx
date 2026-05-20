import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCpu, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi'
import clsx from 'clsx'

export const AIContextPanel = memo(function AIContextPanel() {
  const { aiRecommendations, slaInfo, dispatchInfo } = useThreadDataStore()

  const activeRecs = aiRecommendations.filter((r) => !r.dismissed)
  const riskAlerts = activeRecs.filter((r) => r.type === 'risk_alert' || r.type === 'anomaly_alert')
  const suggestions = activeRecs.filter((r) => r.type !== 'risk_alert' && r.type !== 'anomaly_alert' && r.type !== 'executive_summary')
  const atRiskSLA = slaInfo.filter((s) => s.status === 'at_risk' || s.status === 'breached')

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">AI Context</span>
      </div>

      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-2">
          <FiCpu className="w-3.5 h-3.5 text-active-blue" />
          <span className="text-[12px] font-medium text-text-primary">AI Analysis</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">Active recommendations</span>
            <span className="text-text-primary font-medium">{activeRecs.length}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">Risk alerts</span>
            <span className={clsx('font-medium', riskAlerts.length > 0 ? 'text-error-red' : 'text-success-green')}>
              {riskAlerts.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">Suggestions</span>
            <span className="text-text-primary font-medium">{suggestions.length}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">SLA at risk</span>
            <span className={clsx('font-medium', atRiskSLA.length > 0 ? 'text-warning-yellow' : 'text-success-green')}>
              {atRiskSLA.length}
            </span>
          </div>
        </div>
      </div>

      {riskAlerts.length > 0 && (
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertTriangle className="w-3.5 h-3.5 text-error-red" />
            <span className="text-[12px] font-medium text-error-red">Active Risks</span>
          </div>
          {riskAlerts.map((r) => (
            <div key={r.id} className="text-[11px] text-text-secondary leading-snug mb-1.5 last:mb-0">
              {r.title}
            </div>
          ))}
        </div>
      )}

      {dispatchInfo.length > 0 && (
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-3.5 h-3.5 text-info-cyan" />
            <span className="text-[12px] font-medium text-text-primary">Dispatch Status</span>
          </div>
          <div className="text-[11px] text-text-secondary">
            {dispatchInfo[0].material} - {dispatchInfo[0].weight} to {dispatchInfo[0].destination}
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">
            Status: {dispatchInfo[0].status.replace('_', ' ')}
            {dispatchInfo[0].eta && ` · ETA ${new Date(dispatchInfo[0].eta).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
          </div>
        </div>
      )}
    </div>
  )
})
