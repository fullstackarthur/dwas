import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiFileText } from 'react-icons/fi'
import clsx from 'clsx'

export const MarginEstimationPanel = memo(function MarginEstimationPanel() {
  const { aiRecommendations, financialEntries } = useThreadDataStore()
  const marginRec = aiRecommendations.find((r) => r.type === 'margin_estimation' && !r.dismissed)
  const poValue = financialEntries.find((e) => e.type === 'po_value')
  const freight = financialEntries.find((e) => e.type === 'freight')

  if (!marginRec) return null

  const totalCost = (poValue?.amount || 0) + (freight?.amount || 0)

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3 flex items-center gap-2">
        <FiFileText className="w-4 h-4 text-text-secondary" />
        Margin Estimation
      </h2>
      <div className="border border-border-panel rounded-md p-3">
        <p className="text-[12px] text-text-secondary leading-snug mb-3">{marginRec.description}</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[16px] font-semibold text-text-primary">₹{(totalCost / 100000).toFixed(1)}L</div>
            <div className="text-[10px] text-text-muted mt-0.5">Total Cost</div>
          </div>
          <div>
            <div className="text-[16px] font-semibold text-success-green">8.2%</div>
            <div className="text-[10px] text-text-muted mt-0.5">Net Margin</div>
          </div>
          <div>
            <div className={clsx('text-[16px] font-semibold', marginRec.confidence >= 0.8 ? 'text-success-green' : 'text-warning-yellow')}>
              {Math.round(marginRec.confidence * 100)}%
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">Confidence</div>
          </div>
        </div>
      </div>
    </div>
  )
})
