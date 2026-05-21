import { memo } from 'react'
import clsx from 'clsx'
import type { User } from '../../../core/types'

export const RFQAssignmentIndicator = memo(function RFQAssignmentIndicator({
  assignee,
}: {
  assignee?: User
}) {
  if (!assignee) return null

  const initials = assignee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div
      className="flex items-center gap-1 px-1 py-0.5 rounded bg-bg-tertiary"
      title={`Assigned to ${assignee.name}`}
    >
      <span className="w-4 h-4 flex items-center justify-center text-[8px] font-bold bg-active-blue/20 text-active-blue rounded-full">
        {initials}
      </span>
      <span className="text-[10px] text-text-muted">
        {assignee.name.split(' ')[0]}
      </span>
    </div>
  )
})