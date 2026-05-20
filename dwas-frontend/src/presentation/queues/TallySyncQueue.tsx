import { memo } from 'react'
import { mockTallyRecords } from '../../data/mock/operational'
import type { TallyRecord } from '../../core/types'
import { FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi'
import clsx from 'clsx'

function TallyRow({ record }: { record: TallyRecord }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string; bg: string }> = {
    matched: { color: 'text-success-green', icon: FiCheckCircle, label: 'Matched', bg: 'bg-success-green/10' },
    discrepancy: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Discrepancy', bg: 'bg-error-red/10' },
    pending: { color: 'text-warning-yellow', icon: FiClock, label: 'Pending', bg: 'bg-warning-yellow/10' },
  }

  const config = statusConfig[record.status] || statusConfig.pending
  const Icon = config.icon

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className={clsx(
      'flex items-center gap-3 px-4 py-2.5 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120',
      record.status === 'discrepancy' && 'bg-error-red/5'
    )}>
      <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', config.color)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-text-primary">{record.poNumber}</span>
          <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', config.bg, config.color)}>
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[11px] text-text-secondary">{record.material}</span>
          <span className="text-text-muted text-[10px]">·</span>
          <span className="text-[11px] text-text-muted">Expected: {record.expectedWeight}</span>
          {record.actualWeight && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className={clsx('text-[11px]', record.status === 'discrepancy' ? 'text-error-red' : 'text-text-secondary')}>
                Actual: {record.actualWeight}
              </span>
            </>
          )}
          {record.discrepancy && record.discrepancy !== '0 MT' && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className="text-[11px] text-error-red font-medium">Disc: {record.discrepancy}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-[11px] text-text-muted">{timeAgo(record.recordedAt)}</div>
        {record.recordedBy && <div className="text-[10px] text-text-muted">{record.recordedBy}</div>}
      </div>
    </div>
  )
}

export const TallySyncQueue = memo(function TallySyncQueue() {
  const discrepancies = mockTallyRecords.filter((r) => r.status === 'discrepancy')
  const pending = mockTallyRecords.filter((r) => r.status === 'pending')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Tally Sync</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {discrepancies.length} discrepanc{discrepancies.length !== 1 ? 'ies' : 'y'}, {pending.length} pending
        </p>
      </div>

      {discrepancies.length > 0 && (
        <div className="px-3 py-1.5 border-b border-divider bg-error-red/5">
          <span className="text-[11px] text-error-red font-medium">
            {discrepancies.length} weight discrepanc{discrepancies.length !== 1 ? 'ies' : 'y'} require review
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {mockTallyRecords.map((record) => (
          <TallyRow key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
})
