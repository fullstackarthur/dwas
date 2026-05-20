import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiHash, FiTag, FiCalendar, FiMapPin } from 'react-icons/fi'

export const CollaborativeMetadataRail = memo(function CollaborativeMetadataRail() {
  const { requirements, dispatchInfo } = useThreadDataStore()

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
        <span className="text-[11px] font-medium text-text-muted">Metadata</span>
      </div>
      {requirements.map((req) => {
        const Icon = iconMap[req.label] || FiHash

        return (
          <div key={req.id} className="px-3 py-1.5 flex items-center gap-2">
            <Icon className="w-3 h-3 text-text-muted flex-shrink-0" />
            <span className="text-[11px] text-text-muted w-28 flex-shrink-0">{req.label}</span>
            <span className="text-[11px] text-text-secondary truncate">
              {req.value}
              {req.unit && <span className="text-text-muted ml-0.5">{req.unit}</span>}
            </span>
          </div>
        )
      })}
      {dispatchInfo.length > 0 && dispatchInfo[0].vehicleNumber && (
        <div className="px-3 py-1.5 flex items-center gap-2">
          <FiHash className="w-3 h-3 text-text-muted flex-shrink-0" />
          <span className="text-[11px] text-text-muted w-28 flex-shrink-0">Vehicle</span>
          <span className="text-[11px] text-text-secondary font-mono">{dispatchInfo[0].vehicleNumber}</span>
        </div>
      )}
    </div>
  )
})
