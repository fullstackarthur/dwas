import { memo } from 'react'
import { mockEscalationRecords } from '../../data/mock/operational'
import type { EscalationRecord } from '../../core/types'
import { FiAlertTriangle, FiClock, FiCheckCircle, FiUser } from 'react-icons/fi'
import clsx from 'clsx'

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
    <div className="flex items-start gap-3 px-4 py-3 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className={clsx(
        'p-1.5 rounded flex-shrink-0',
        record.status === 'open' ? 'bg-error-red/10' : record.status === 'investigating' ? 'bg-warning-yellow/10' : 'bg-success-green/10'
      )}>
        <Icon className={clsx('w-4 h-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-medium text-text-primary">{record.title}</span>
          <span className={clsx('text-[10px] font-medium', priorityColors[record.priority])}>{record.priority}</span>
          <span className={clsx('text-[10px] font-medium', config.color)}>{config.label}</span>
        </div>
        <div className="text-[12px] text-text-secondary mb-2 leading-snug">{record.reason}</div>
        <div className="flex items-center gap-3 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <FiUser className="w-3 h-3" />
            Raised by {record.raisedBy.name}
          </span>
          <span>{timeAgo(record.raisedAt)}</span>
          {record.assignedTo && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className="text-text-secondary">Assigned to {record.assignedTo.name}</span>
            </>
          )}
          {slaRemaining !== null && slaRemaining > 0 && (
            <>
              <span className="text-text-muted text-[10px]">·</span>
              <span className={clsx(slaRemaining <= 2 ? 'text-error-red' : 'text-text-muted')}>
                SLA: {slaRemaining}h remaining
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const EscalationQueue = memo(function EscalationQueue() {
  const open = mockEscalationRecords.filter((r) => r.status === 'open' || r.status === 'investigating')
  const critical = open.filter((r) => r.priority === 'critical')

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-divider">
        <h1 className="text-[24px] font-semibold text-text-primary">Escalations</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          {open.length} active escalation{open.length !== 1 ? 's' : ''}
        </p>
      </div>

      {critical.length > 0 && (
        <div className="px-3 py-1.5 border-b border-divider bg-error-red/5">
          <span className="text-[11px] text-error-red font-medium">
            {critical.length} critical escalation{critical.length !== 1 ? 's' : ''} require immediate attention
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {mockEscalationRecords.map((record) => (
          <EscalationRow key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
})
