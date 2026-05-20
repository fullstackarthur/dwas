import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import {
  FiArrowLeft,
  FiHash,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiMessageSquare,
  FiUser,
} from 'react-icons/fi'
import clsx from 'clsx'

const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  open: { color: 'text-warning-yellow', icon: FiAlertTriangle, label: 'Open' },
  in_progress: { color: 'text-active-blue', icon: FiClock, label: 'In Progress' },
  in_transit: { color: 'text-info-cyan', icon: FiClock, label: 'In Transit' },
  awaiting_review: { color: 'text-warning-yellow', icon: FiClock, label: 'Awaiting Review' },
  awaiting_approval: { color: 'text-warning-yellow', icon: FiClock, label: 'Awaiting Approval' },
  resolved: { color: 'text-success-green', icon: FiCheckCircle, label: 'Resolved' },
  closed: { color: 'text-text-muted', icon: FiCheckCircle, label: 'Closed' },
  delivered: { color: 'text-success-green', icon: FiCheckCircle, label: 'Delivered' },
  delayed: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Delayed' },
}

const priorityConfig: Record<string, { color: string; label: string }> = {
  critical: { color: 'text-error-red', label: 'Critical' },
  high: { color: 'text-warning-yellow', label: 'High' },
  medium: { color: 'text-info-cyan', label: 'Medium' },
  low: { color: 'text-text-muted', label: 'Low' },
}

export const OperationalThreadHeader = memo(function OperationalThreadHeader() {
  const { timelineEvents, dispatchInfo, approvalSteps } = useThreadDataStore()
  const status = dispatchInfo[0]?.status || 'in_progress'
  const statusConf = statusConfig[status] || statusConfig.open
  const StatusIcon = statusConf.icon
  const priorityConf = priorityConfig.critical

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const firstEvent = timelineEvents[timelineEvents.length - 1]
  const lastEvent = timelineEvents[0]

  return (
    <div className="px-4 py-3 border-b border-divider bg-bg-secondary flex-shrink-0">
      <div className="flex items-start gap-3">
        <button className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120 mt-0.5">
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <FiHash className="w-4 h-4 text-text-muted" />
            <span className="text-[11px] text-text-muted font-mono">TH-001</span>
            <span className={clsx('flex items-center gap-1 text-[11px] font-medium', statusConf.color)}>
              <StatusIcon className="w-3 h-3" />
              {statusConf.label}
            </span>
            <span className={clsx('text-[11px] font-medium', priorityConf.color)}>
              {priorityConf.label}
            </span>
          </div>
          <h1 className="text-[18px] font-semibold text-text-primary leading-tight">
            Steel coil dispatch - PO#48291 - Tata Steel to JSW Nagarjuna
          </h1>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              Created {firstEvent ? timeAgo(firstEvent.timestamp) : 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageSquare className="w-3 h-3" />
              {timelineEvents.length} events
            </span>
            <span className="flex items-center gap-1">
              <FiUser className="w-3 h-3" />
              {approvalSteps.filter((a) => a.status === 'approved').length}/{approvalSteps.length} approvals
            </span>
            {lastEvent && (
              <>
                <span className="text-text-muted">·</span>
                <span>Last activity {timeAgo(lastEvent.timestamp)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
