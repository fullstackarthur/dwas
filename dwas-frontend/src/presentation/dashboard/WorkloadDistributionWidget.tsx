import { memo } from 'react'
import { mockWorkloadEntries } from '../../data/mock/operational'
import clsx from 'clsx'

export const WorkloadDistributionWidget = memo(function WorkloadDistributionWidget() {
  const totalActive = mockWorkloadEntries.reduce((sum, e) => sum + e.activeItems, 0)
  const totalCompleted = mockWorkloadEntries.reduce((sum, e) => sum + e.completedToday, 0)
  const totalOverdue = mockWorkloadEntries.reduce((sum, e) => sum + e.overdueItems, 0)

  const sorted = [...mockWorkloadEntries].sort((a, b) => b.activeItems - a.activeItems)
  const maxItems = sorted[0]?.activeItems || 1

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b border-divider">
        <div>
          <div className="text-[16px] font-semibold text-text-primary leading-none">{totalActive}</div>
          <div className="text-[10px] text-text-muted mt-0.5">Total Active</div>
        </div>
        <div>
          <div className="text-[16px] font-semibold text-success-green leading-none">{totalCompleted}</div>
          <div className="text-[10px] text-text-muted mt-0.5">Completed Today</div>
        </div>
        <div>
          <div className="text-[16px] font-semibold text-error-red leading-none">{totalOverdue}</div>
          <div className="text-[10px] text-text-muted mt-0.5">Overdue</div>
        </div>
      </div>
      <div className="space-y-2">
        {sorted.map((entry) => (
          <div key={entry.userId} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-selected-surface flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-medium text-text-secondary">
                {entry.userName.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <span className="text-[11px] text-text-secondary w-24 truncate">{entry.userName.split(' ')[0]}</span>
            <div className="flex-1 h-2 bg-bg-tertiary rounded-sm overflow-hidden">
              <div
                className={clsx('h-full rounded-sm', entry.overdueItems > 0 ? 'bg-error-red' : 'bg-active-blue')}
                style={{ width: `${(entry.activeItems / maxItems) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-text-muted w-6 text-right">{entry.activeItems}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
