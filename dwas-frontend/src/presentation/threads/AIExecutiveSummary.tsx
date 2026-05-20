import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiFileText, FiCpu } from 'react-icons/fi'

export const AIExecutiveSummary = memo(function AIExecutiveSummary() {
  const { aiRecommendations } = useThreadDataStore()
  const summary = aiRecommendations.find((r) => r.type === 'executive_summary' && !r.dismissed)

  if (!summary) return null

  return (
    <div className="border border-border-panel rounded-md">
      <div className="px-3 py-2 border-b border-divider flex items-center gap-2">
        <FiFileText className="w-3.5 h-3.5 text-active-blue" />
        <span className="text-[12px] font-medium text-text-primary">Executive Summary</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-active-blue">
          <FiCpu className="w-3 h-3" />
          AI Generated
        </span>
      </div>
      <div className="p-3">
        <p className="text-[12px] text-text-secondary leading-relaxed">{summary.description}</p>
        <div className="mt-2 text-[10px] text-text-muted">
          Confidence: {Math.round(summary.confidence * 100)}% · Generated {new Date(summary.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
})
