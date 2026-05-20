import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiAlertTriangle } from 'react-icons/fi'

export const AIAnomalyAlert = memo(function AIAnomalyAlert() {
  const { aiRecommendations } = useThreadDataStore()
  const anomalies = aiRecommendations.filter((r) => r.type === 'anomaly_alert' && !r.dismissed)

  if (anomalies.length === 0) return null

  return (
    <div className="px-4 py-2 border-b border-divider bg-warning-yellow/5">
      {anomalies.map((rec) => (
        <div key={rec.id} className="flex items-start gap-2">
          <FiAlertTriangle className="w-3.5 h-3.5 text-warning-yellow mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[12px] font-medium text-warning-yellow">{rec.title}</div>
            <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{rec.description}</p>
            {rec.suggestedAction && (
              <button className="mt-1 text-[10px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
                {rec.suggestedAction}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
})
