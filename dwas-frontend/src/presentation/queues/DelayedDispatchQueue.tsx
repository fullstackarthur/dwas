import { memo } from 'react'
import { mockDispatchRecords } from '../../data/mock/operational'
import type { DispatchRecord } from '../../core/types'
import { FiAlertTriangle, FiTruck, FiMapPin } from 'react-icons/fi'

function DelayedRow({ record }: { record: DispatchRecord }) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const delayHours = record.eta ? Math.ceil((Date.now() - new Date(record.eta).getTime()) / 3600000) : null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120 bg-error-red/5">
      <FiAlertTriangle className="w-3.5 h-3.5 text-error-red flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-primary">{record.poNumber}</span>
          <span className="text-[10px] font-medium text-error-red">Delayed</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <FiMapPin className="w-3 h-3" />
            {record.destination}
          </span>
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[11px] text-text-muted">{record.weight}</span>
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[11px] text-text-muted">{record.driverName}</span>
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[11px] text-text-muted">{record.vehicleNumber}</span>
        </div>
        {record.delayReason && (
          <div className="text-[11px] text-error-red mt-1">{record.delayReason}</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-text-muted">Dispatched {timeAgo(record.dispatchedAt)}</span>
          {delayHours !== null && delayHours > 0 && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className="text-[10px] text-error-red font-medium">{delayHours}h overdue</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const DelayedDispatchQueue = memo(function DelayedDispatchQueue() {
  const delayed = mockDispatchRecords.filter((d) => d.status === 'delayed')
  const atRisk = mockDispatchRecords.filter((d) => d.status === 'in_transit' && d.eta && new Date(d.eta) < new Date())

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Delayed Dispatches</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {delayed.length} delayed, {atRisk.length} at risk
        </p>
      </div>

      {(delayed.length + atRisk.length) > 0 && (
        <div className="px-3 py-1.5 border-b border-divider bg-error-red/5">
          <span className="text-[11px] text-error-red font-medium">
            {delayed.length + atRisk.length} dispatch{delayed.length + atRisk.length !== 1 ? 'es' : ''} require attention
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {delayed.length === 0 && atRisk.length === 0 ? (
          <div className="p-8 text-center">
            <FiTruck className="w-8 h-8 text-success-green mx-auto mb-2" />
            <div className="text-[14px] text-text-muted">No delayed dispatches</div>
          </div>
        ) : (
          <>
            {delayed.map((record) => (
              <DelayedRow key={record.id} record={record} />
            ))}
            {atRisk.map((record) => (
              <DelayedRow key={record.id} record={record} />
            ))}
          </>
        )}
      </div>
    </div>
  )
})
