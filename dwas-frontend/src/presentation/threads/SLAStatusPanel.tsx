import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import clsx from 'clsx'

export const SLAStatusPanel = memo(function SLAStatusPanel() {
  const { slaInfo } = useThreadDataStore()

  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string; bg: string }> = {
    on_track: { color: 'text-success-green', icon: FiCheckCircle, label: 'On Track', bg: 'bg-success-green/10' },
    at_risk: { color: 'text-warning-yellow', icon: FiClock, label: 'At Risk', bg: 'bg-warning-yellow/10' },
    breached: { color: 'text-error-red', icon: FiXCircle, label: 'Breached', bg: 'bg-error-red/10' },
    met: { color: 'text-text-muted', icon: FiCheckCircle, label: 'Met', bg: 'bg-text-muted/10' },
  }

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">SLA Tracking</span>
      </div>
      {slaInfo.map((sla) => {
        const conf = statusConfig[sla.status] || statusConfig.on_track
        const Icon = conf.icon

        return (
          <div key={sla.id} className="px-3 py-2.5 hover:bg-hover-surface/50 transition-colors duration-120">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-text-primary">{sla.label}</span>
              <div className={clsx('flex items-center gap-1 text-[10px] font-medium', conf.color)}>
                <Icon className="w-3 h-3" />
                {conf.label}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span>Target: {sla.target}</span>
              {sla.remainingHours !== undefined && (
                <>
                  <span className="text-text-muted">·</span>
                  <span className={clsx(sla.remainingHours <= 4 ? 'text-error-red' : sla.remainingHours <= 12 ? 'text-warning-yellow' : 'text-text-muted')}>
                    {sla.remainingHours}h remaining
                  </span>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})
