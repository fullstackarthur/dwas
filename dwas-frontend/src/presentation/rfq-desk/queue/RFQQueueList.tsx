import { memo, memo as memo2 } from 'react'
import clsx from 'clsx'
import { useRFQDeskStore } from '../../stores'
import { RFQOperationalRow } from './RFQOperationalRow'
import { motion } from 'framer-motion'
import type { RFQ } from '../../../core/types/rfq'

interface RFQQueueListProps {
  collapsed: boolean
}

export const RFQQueueList = memo(function RFQQueueList({
  collapsed,
}: RFQQueueListProps) {
  const { getFilteredRfqs, selectedRfqId, selectRfq } = useRFQDeskStore()
  const rfqs = getFilteredRfqs()

  if (collapsed) {
    return (
      <div className="h-full flex flex-col">
        {rfqs.map((rfq) => (
          <CollapsedRFQItem
            key={rfq.id}
            rfq={rfq}
            isSelected={rfq.id === selectedRfqId}
            onClick={() => selectRfq(rfq.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      {rfqs.map((rfq) => (
        <motion.div
          key={rfq.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.12 }}
        >
          <RFQOperationalRow
            rfq={rfq}
            isSelected={rfq.id === selectedRfqId}
            onClick={() => selectRfq(rfq.id)}
          />
        </motion.div>
      ))}
    </div>
  )
})

interface CollapsedRFQItemProps {
  rfq: RFQ
  isSelected: boolean
  onClick: () => void
}

const CollapsedRFQItem = memo(function CollapsedRFQItem({
  rfq,
  isSelected,
  onClick,
}: CollapsedRFQItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full h-14 flex flex-col items-center justify-center gap-1 border-b border-divider transition-colors duration-120',
        isSelected ? 'bg-selected-surface' : 'hover:bg-hover-surface'
      )}
    >
      <span className="text-[11px] font-medium text-text-primary">{rfq.rfqNumber}</span>
      <div className="flex items-center gap-1">
        <PriorityDot priority={rfq.priority} />
        {rfq.unreadUpdates > 0 && (
          <span className="w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-active-blue text-white rounded-full">
            {rfq.unreadUpdates}
          </span>
        )}
        <SLADot status={rfq.slaStatus} />
      </div>
    </button>
  )
})

const PriorityDot = memo2(function PriorityDot({
  priority,
}: {
  priority: RFQ['priority']
}) {
  return (
    <span
      className={clsx(
        'w-2 h-2 rounded-full',
        priority === 'critical' && 'bg-error-red',
        priority === 'high' && 'bg-warning-yellow',
        priority === 'medium' && 'bg-active-blue',
        priority === 'low' && 'bg-text-muted'
      )}
    />
  )
})

const SLADot = memo2(function SLADot({ status }: { status: RFQ['slaStatus'] }) {
  return (
    <span
      className={clsx(
        'w-2 h-2 rounded-full',
        status === 'on_track' && 'bg-success-green',
        status === 'at_risk' && 'bg-warning-yellow',
        status === 'breached' && 'bg-error-red',
        status === 'no_sla' && 'bg-text-muted/50'
      )}
    />
  )
})