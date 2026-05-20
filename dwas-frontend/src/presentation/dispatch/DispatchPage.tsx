import { memo } from 'react'
import { useQueueStore } from '../stores'
import { STATUS_LABELS } from '../../core/constants'
import {
  FiTruck,
  FiMapPin,
  FiClock,
  FiPackage,
} from 'react-icons/fi'

function DispatchCard({ itemId }: { itemId: string }) {
  const { items } = useQueueStore()
  const item = items.find((i) => i.id === itemId)
  if (!item) return null

  return (
    <div className="p-3 bg-bg-secondary border border-border-panel rounded-md">
      <div className="flex items-start justify-between mb-2">
        <div className="text-[13px] font-medium text-text-primary">{item.title}</div>
        <span className="text-[11px] text-text-muted">{STATUS_LABELS[item.status]}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiPackage className="w-3.5 h-3.5 text-text-muted" />
          <span>{item.metadata.weight || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiMapPin className="w-3.5 h-3.5 text-text-muted" />
          <span>{item.metadata.grade || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiTruck className="w-3.5 h-3.5 text-text-muted" />
          <span>{item.assignee?.name || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiClock className="w-3.5 h-3.5 text-text-muted" />
          <span>{item.dueDate ? new Date(item.dueDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'No deadline'}</span>
        </div>
      </div>
    </div>
  )
}

export const DispatchPage = memo(function DispatchPage() {
  const { items } = useQueueStore()
  const dispatchItems = items.filter((i) => i.type === 'dispatch')

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-[24px] font-semibold text-text-primary">Dispatch Board</h1>
        <p className="text-[13px] text-text-secondary mt-1">Active dispatch operations and truck allocation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {dispatchItems.map((item) => (
          <DispatchCard key={item.id} itemId={item.id} />
        ))}
      </div>

      {dispatchItems.length === 0 && (
        <div className="p-8 text-center">
          <FiTruck className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <div className="text-[14px] text-text-muted">No active dispatches</div>
        </div>
      )}
    </div>
  )
})
