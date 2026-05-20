import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiTag, FiHash, FiCalendar, FiMapPin } from 'react-icons/fi'
import clsx from 'clsx'

export const RequirementDetailsPanel = memo(function RequirementDetailsPanel() {
  const { requirements } = useThreadDataStore()

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Material: FiTag,
    Quantity: FiHash,
    Grade: FiTag,
    Thickness: FiHash,
    Width: FiHash,
    Destination: FiMapPin,
    'Delivery Deadline': FiCalendar,
  }

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">Requirements</span>
      </div>
      {requirements.map((req) => {
        const Icon = iconMap[req.label] || FiTag

        return (
          <div key={req.id} className="px-3 py-2 hover:bg-hover-surface/50 transition-colors duration-120">
            <div className="flex items-center gap-2">
              <Icon className="w-3 h-3 text-text-muted flex-shrink-0" />
              <span className="text-[11px] text-text-muted w-28 flex-shrink-0">{req.label}</span>
              <span className="text-[12px] text-text-primary">
                {req.value}
                {req.unit && <span className="text-text-muted ml-0.5">{req.unit}</span>}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 ml-5">
              {req.source && (
                <span className="text-[10px] text-text-muted">Source: {req.source}</span>
              )}
              {req.confidence !== undefined && (
                <span className={clsx('text-[10px]', req.confidence >= 0.9 ? 'text-success-green' : req.confidence >= 0.8 ? 'text-warning-yellow' : 'text-text-muted')}>
                  {Math.round(req.confidence * 100)}% confidence
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})
