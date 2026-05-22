import { memo } from 'react'
import type { WorkloadEntry } from '../../core/types'
import clsx from 'clsx'

const mockWorkloadEntries: WorkloadEntry[] = []

function TeamMemberRow({ entry }: { entry: WorkloadEntry }) {
  const statusColors: Record<string, string> = {
    online: 'bg-success-green',
    away: 'bg-warning-yellow',
    offline: 'bg-text-muted',
    busy: 'bg-error-red',
  }

  return (
    <div className="px-3 py-2 border-b border-divider last:border-0 hover:bg-hover-surface/50 transition-colors duration-120">
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-selected-surface flex items-center justify-center">
            <span className="text-[9px] font-medium text-text-secondary">
              {entry.userName.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className={clsx('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-bg-secondary', statusColors[entry.status])} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-text-primary">{entry.userName}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-text-muted">{entry.activeItems} active</span>
            <span className="text-text-muted text-[10px]">·</span>
            <span className="text-[10px] text-text-muted">{entry.completedToday} done today</span>
            {entry.overdueItems > 0 && (
              <>
                <span className="text-text-muted text-[10px]">·</span>
                <span className="text-[10px] text-error-red">{entry.overdueItems} overdue</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const TeamActivityWidget = memo(function TeamActivityWidget() {
  return (
    <div>
      {mockWorkloadEntries.map((entry) => (
        <TeamMemberRow key={entry.userId} entry={entry} />
      ))}
    </div>
  )
})
