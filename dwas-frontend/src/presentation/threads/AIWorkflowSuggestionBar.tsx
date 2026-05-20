import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi'

export const AIWorkflowSuggestionBar = memo(function AIWorkflowSuggestionBar() {
  const { aiRecommendations } = useThreadDataStore()
  const workflowRecs = aiRecommendations.filter((r) => r.type === 'workflow_suggestion' && !r.dismissed)
  const followupRecs = aiRecommendations.filter((r) => r.type === 'followup_suggestion' && !r.dismissed)

  if (workflowRecs.length === 0 && followupRecs.length === 0) return null

  return (
    <div className="px-4 py-2 border-b border-divider bg-active-blue/5">
      <div className="flex items-center gap-2 mb-1">
        <FiArrowRight className="w-3.5 h-3.5 text-active-blue" />
        <span className="text-[11px] font-medium text-active-blue">AI Workflow Suggestions</span>
      </div>
      <div className="space-y-1">
        {workflowRecs.map((rec) => (
          <div key={rec.id} className="flex items-center gap-2 text-[11px]">
            <span className="text-text-secondary">{rec.title}</span>
            {rec.suggestedAction && (
              <button className="text-[10px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
                {rec.suggestedAction}
              </button>
            )}
          </div>
        ))}
        {followupRecs.map((rec) => (
          <div key={rec.id} className="flex items-center gap-2 text-[11px]">
            <FiCheckCircle className="w-3 h-3 text-success-green" />
            <span className="text-text-secondary">{rec.title}</span>
            {rec.suggestedAction && (
              <button className="text-[10px] text-active-blue hover:text-active-blue/80 transition-colors duration-120">
                {rec.suggestedAction}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})
