import { memo } from 'react'
import type { EscalationRecord } from '../../core/types'
import { FiAlertTriangle, FiClock, FiCheckCircle } from 'react-icons/fi'
import clsx from 'clsx'

const mockEscalationRecords: EscalationRecord[] = []

function EscalationRow({ record }: { record: EscalationRecord }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    open: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Open' },
    investigating: { color: 'text-warning-yellow', icon: FiClock, label: 'Investigating' },
    resolved: { color: 'text-success-green', icon: FiCheckCircle, label: 'Resolved' },
    closed: { color: 'text-text-muted', icon: FiCheckCircle, label: 'Closed' },
  }

  const config = statusConfig[record.status] || statusConfig.open
  const Icon = config.icon

  const priorityColors: Record<string, string> = {
    critical: 'text-error-red',
    high: 'text-warning-yellow',
    medium: 'text-info-cyan',
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const slaRemaining = record.slaDeadline ? Math.ceil((new Date(record.slaDeadline).getTime() - Date.now()) / 3600000) : null

  return (
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-start gap-2">
        <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-text-primary">{record.title}</span>
            <span className={clsx('text-[10px] font-medium', priorityColors[record.priority])}>{record.priority}</span>
          </div>
          <div className="text-[11px] text-text-secondary mt-0.5 leading-snug">{record.reason}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-text-muted">Raised by {record.raisedBy.name}</span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{timeAgo(record.raisedAt)}</span>
            {record.assignedTo && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-text-secondary">→ {record.assignedTo.name}</span>
              </>
            )}
            {slaRemaining !== null && slaRemaining > 0 && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className={clsx('text-[10px]', slaRemaining <= 2 ? 'text-error-red' : 'text-text-muted')}>
                  SLA: {slaRemaining}h remaining
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const EscalationQueueWidget = memo(function EscalationQueueWidget() {
  return (
    <div>
      {mockEscalationRecords.map((record) => (
        <EscalationRow key={record.id} record={record} />
      ))}
    </div>
  )
})
