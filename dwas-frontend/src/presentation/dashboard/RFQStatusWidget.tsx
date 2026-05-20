import { memo } from 'react'
import { FiClock, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi'
import clsx from 'clsx'
import { mockRFQRecords } from '../../data/mock/operational'
import type { RFQRecord } from '../../core/types'

function RFQRow({ rfq }: { rfq: RFQRecord }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    open: { color: 'text-active-blue', icon: FiClock, label: 'Open' },
    closing_soon: { color: 'text-warning-yellow', icon: FiAlertTriangle, label: 'Closing Soon' },
    closed: { color: 'text-text-muted', icon: FiXCircle, label: 'Closed' },
    awarded: { color: 'text-success-green', icon: FiCheckCircle, label: 'Awarded' },
  }

  const config = statusConfig[rfq.status] || statusConfig.open
  const Icon = config.icon

  const daysLeft = Math.ceil((new Date(rfq.deadline).getTime() - Date.now()) / 86400000)
  const responseRate = rfq.vendorCount > 0 ? Math.round((rfq.responseCount / rfq.vendorCount) * 100) : 0

  return (
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-text-primary truncate">{rfq.title}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={clsx('flex items-center gap-1 text-[10px]', config.color)}>
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{rfq.responseCount}/{rfq.vendorCount} responses</span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{responseRate}% rate</span>
            {rfq.status !== 'closed' && rfq.status !== 'awarded' && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className={clsx('text-[10px]', daysLeft <= 1 ? 'text-error-red' : 'text-text-muted')}>
                  {daysLeft <= 0 ? 'Due today' : `${daysLeft}d left`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const RFQStatusWidget = memo(function RFQStatusWidget() {
  return (
    <div>
      {mockRFQRecords.slice(0, 4).map((rfq) => (
        <RFQRow key={rfq.id} rfq={rfq} />
      ))}
    </div>
  )
})
