import { memo } from 'react'
import { FiLink } from 'react-icons/fi'

interface SimilarHistoricalRFQsProps {
  rfq: { id: string; clientName: string }
}

export const SimilarHistoricalRFQs = memo(function SimilarHistoricalRFQs({
  rfq,
}: SimilarHistoricalRFQsProps) {
  const similarRFQs = [
    { id: 'rfq-89', number: 'RFQ-89', similarity: 87, outcome: 'Completed' },
    { id: 'rfq-76', number: 'RFQ-76', similarity: 72, outcome: 'Completed' },
  ]

  return (
    <div className="p-2 border border-border-panel rounded">
      <div className="flex items-center gap-1 text-[11px] font-medium text-text-primary">
        <FiLink className="w-3 h-3 text-text-muted" />
        Similar Historical RFQs
      </div>
      <div className="mt-2 space-y-1">
        {similarRFQs.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between text-[11px] hover:bg-hover-surface rounded px-1 py-0.5 cursor-pointer"
          >
            <span className="text-active-blue">{s.number}</span>
            <span className="text-[10px] text-text-muted">{s.similarity}% match</span>
          </div>
        ))}
      </div>
    </div>
  )
})