import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { AIExtractionConfidenceIndicator } from './AIExtractionConfidenceIndicator'
import { MissingInformationAlert } from './MissingInformationAlert'

interface ExtractedRequirementsPanelProps {
  rfq: RFQ
}

export const ExtractedRequirementsPanel = memo(function ExtractedRequirementsPanel({
  rfq,
}: ExtractedRequirementsPanelProps) {
  const missingRequirements = rfq.requirements.filter((r) => r.validationStatus === 'missing')
  const uncertainRequirements = rfq.requirements.filter((r) => r.validationStatus === 'uncertain')

  return (
    <div className="panel">
      <div className="panel-header flex items-center">
        <h3 className="panel-title">Extracted Requirements</h3>
        <AIExtractionConfidenceIndicator confidence={rfq.aiConfidence} />
      </div>
      <div className="p-3">
        {missingRequirements.length > 0 && (
          <MissingInformationAlert count={missingRequirements.length} />
        )}

        <div className="space-y-2 mt-3">
          {rfq.requirements.map((req) => (
            <div
              key={req.id}
              className={clsx(
                'flex items-start gap-2 p-2 rounded',
                req.validationStatus === 'missing' && 'bg-error-red/5 border border-error-red/20',
                req.validationStatus === 'uncertain' && 'bg-warning-yellow/5 border border-warning-yellow/20',
                req.validationStatus === 'valid' && 'bg-hover-surface'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-text-muted uppercase">
                    {req.category}
                  </span>
                  <ValidationBadge status={req.validationStatus} />
                </div>
                <div className="text-[12px] font-medium text-text-primary mt-0.5">
                  {req.label}
                </div>
                <div className="text-[12px] text-text-secondary">
                  {req.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {rfq.items.length > 0 && (
          <div className="mt-4">
            <h4 className="text-[11px] font-semibold text-text-muted uppercase mb-2">
              Material Items
            </h4>
            <div className="border border-border-panel rounded overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-bg-tertiary">
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-text-muted text-left">Material</th>
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-text-muted text-right">Qty</th>
                    <th className="px-2 py-1.5 text-[10px] font-semibold text-text-muted text-left">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {rfq.items.map((item) => (
                    <tr key={item.id} className="border-t border-divider">
                      <td className="px-2 py-1.5 text-[12px] text-text-primary">
                        {item.materialDescription}
                      </td>
                      <td className="px-2 py-1.5 text-[12px] text-text-secondary text-right">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-2 py-1.5 text-[11px] text-text-muted">
                        {item.deliveryLocation || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

const ValidationBadge = memo(function ValidationBadge({
  status,
}: {
  status: 'valid' | 'uncertain' | 'missing' | 'invalid'
}) {
  return (
    <span
      className={clsx(
        'text-[9px] px-1 py-0.5 rounded',
        status === 'valid' && 'bg-success-green/15 text-success-green',
        status === 'uncertain' && 'bg-warning-yellow/15 text-warning-yellow',
        status === 'missing' && 'bg-error-red/15 text-error-red',
        status === 'invalid' && 'bg-error-red/15 text-error-red'
      )}
    >
      {status}
    </span>
  )
})