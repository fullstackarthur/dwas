import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCpu } from 'react-icons/fi'
import clsx from 'clsx'

export const AIExtractionConfidenceIndicator = memo(function AIExtractionConfidenceIndicator() {
  const { requirements } = useThreadDataStore()
  const extracted = requirements.filter((r) => r.confidence !== undefined)

  if (extracted.length === 0) return null

  const avgConfidence = extracted.reduce((sum, r) => sum + (r.confidence || 0), 0) / extracted.length
  const overallColor = avgConfidence >= 0.9 ? 'text-success-green' : avgConfidence >= 0.8 ? 'text-warning-yellow' : 'text-error-red'

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
        <FiCpu className="w-4 h-4 text-active-blue" />
        AI Extraction Confidence
      </h2>
      <div className="mb-3 p-2 bg-bg-tertiary rounded">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-text-muted">Overall confidence</span>
          <span className={clsx('text-[13px] font-semibold', overallColor)}>
            {Math.round(avgConfidence * 100)}%
          </span>
        </div>
        <div className="mt-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-180', avgConfidence >= 0.9 ? 'bg-success-green' : avgConfidence >= 0.8 ? 'bg-warning-yellow' : 'bg-error-red')}
            style={{ width: `${avgConfidence * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        {extracted.map((req) => {
          const conf = req.confidence || 0
          const color = conf >= 0.9 ? 'text-success-green' : conf >= 0.8 ? 'text-warning-yellow' : 'text-error-red'
          const barColor = conf >= 0.9 ? 'bg-success-green' : conf >= 0.8 ? 'bg-warning-yellow' : 'bg-error-red'

          return (
            <div key={req.id} className="flex items-center gap-2">
              <span className="text-[11px] text-text-muted w-20 truncate">{req.label}</span>
              <div className="flex-1 h-1 bg-bg-primary rounded-full overflow-hidden">
                <div className={clsx('h-full rounded-full', barColor)} style={{ width: `${conf * 100}%` }} />
              </div>
              <span className={clsx('text-[10px] font-medium w-8 text-right', color)}>
                {Math.round(conf * 100)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
