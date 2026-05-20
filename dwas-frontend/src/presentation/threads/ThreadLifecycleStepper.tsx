import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiCheckCircle, FiClock, FiAlertTriangle, FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx'

const stateConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  open: { color: 'text-warning-yellow', icon: FiClock, label: 'Open' },
  in_progress: { color: 'text-active-blue', icon: FiClock, label: 'In Progress' },
  in_transit: { color: 'text-info-cyan', icon: FiArrowRight, label: 'In Transit' },
  awaiting_review: { color: 'text-warning-yellow', icon: FiClock, label: 'Awaiting Review' },
  awaiting_approval: { color: 'text-warning-yellow', icon: FiClock, label: 'Awaiting Approval' },
  resolved: { color: 'text-success-green', icon: FiCheckCircle, label: 'Resolved' },
  closed: { color: 'text-text-muted', icon: FiCheckCircle, label: 'Closed' },
  delivered: { color: 'text-success-green', icon: FiCheckCircle, label: 'Delivered' },
  delayed: { color: 'text-error-red', icon: FiAlertTriangle, label: 'Delayed' },
}

const stateOrder = ['open', 'in_progress', 'in_transit', 'awaiting_review', 'delivered', 'closed']

export const ThreadLifecycleStepper = memo(function ThreadLifecycleStepper() {
  const { workflowState, transitionWorkflow } = useThreadDataStore()
  const { currentState, history, availableTransitions } = workflowState

  const visitedStates = history.map((h) => h.state)
  if (!visitedStates.includes(currentState)) visitedStates.push(currentState)

  const relevantStates = stateOrder.filter((s) => visitedStates.includes(s) || s === currentState)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="px-4 py-2 border-b border-divider bg-bg-secondary/50 flex items-center gap-2 flex-shrink-0 overflow-x-auto">
      {relevantStates.map((state, i) => {
        const conf = stateConfig[state] || stateConfig.open
        const Icon = conf.icon
        const isCurrent = state === currentState
        const historyEntry = history.find((h) => h.state === state)

        return (
          <div key={state} className="flex items-center gap-2 flex-shrink-0">
            {i > 0 && <div className="w-4 h-px bg-divider" />}
            <div className={clsx(
              'flex items-center gap-1.5 px-2 py-1 rounded text-[11px]',
              isCurrent ? 'bg-selected-surface text-text-primary' : 'text-text-muted'
            )}>
              <Icon className={clsx('w-3 h-3', isCurrent ? conf.color : 'text-text-muted')} />
              <span className={clsx('font-medium', isCurrent && 'text-text-primary')}>{conf.label}</span>
              {historyEntry && (
                <span className="text-[10px] text-text-muted">{timeAgo(historyEntry.timestamp)}</span>
              )}
            </div>
          </div>
        )
      })}

      {availableTransitions.length > 0 && (
        <>
          <div className="w-4 h-px bg-divider flex-shrink-0" />
          <div className="flex items-center gap-1 flex-shrink-0">
            {availableTransitions.map((transition) => (
              <button
                key={transition.target}
                onClick={() => transitionWorkflow(transition.target)}
                className={clsx(
                  'flex items-center gap-1 px-2 py-1 rounded text-[11px] border transition-colors duration-120',
                  transition.target === 'delayed'
                    ? 'text-error-red border-error-red/30 hover:bg-error-red/10'
                    : 'text-active-blue border-active-blue/30 hover:bg-active-blue/10'
                )}
              >
                <FiArrowRight className="w-3 h-3" />
                {transition.label}
                {transition.requiresApproval && (
                  <span className="text-[9px] text-text-muted">(approval)</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
})
