import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi'

export const TransportSuggestionPanel = memo(function TransportSuggestionPanel() {
  const { aiRecommendations } = useThreadDataStore()
  const transportRecs = aiRecommendations.filter((r) => r.type === 'transport_suggestion' && !r.dismissed)

  if (transportRecs.length === 0) return null

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
        <FiTrendingUp className="w-4 h-4 text-info-cyan" />
        Transport Suggestions
      </h2>
      <div className="space-y-2">
        {transportRecs.map((rec) => (
          <div key={rec.id} className="border border-info-cyan/20 bg-info-cyan/5 rounded-md p-3">
            <div className="text-[12px] font-medium text-text-primary mb-1">{rec.title}</div>
            <p className="text-[11px] text-text-secondary leading-snug">{rec.description}</p>
            {rec.alternatives && rec.alternatives.length > 0 && (
              <div className="mt-2 flex items-center gap-1 flex-wrap">
                {rec.alternatives.map((alt, i) => (
                  <span key={i} className="text-[10px] bg-bg-tertiary text-text-muted px-1.5 py-0.5 rounded border border-border-panel">
                    {alt}
                  </span>
                ))}
              </div>
            )}
            {rec.suggestedAction && (
              <button className="mt-2 flex items-center gap-1 text-[11px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
                <FiArrowRight className="w-3 h-3" />
                {rec.suggestedAction}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})
