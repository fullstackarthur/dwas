import { memo } from 'react'
import clsx from 'clsx'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useRFQDeskStore } from '../../stores'
import { QueueRailCollapseToggle } from './QueueRailCollapseToggle'
import { RFQQueueList } from './RFQQueueList'
import { QueueRailResizeHandle } from './QueueRailResizeHandle'
import { motion } from 'framer-motion'

export const CollapsibleQueueRail = memo(function CollapsibleQueueRail() {
  const queueRailCollapsed = useRFQDeskStore((s) => s.queueRailCollapsed)

  return (
    <div
      className={clsx(
        'h-full flex flex-col bg-bg-secondary border-r border-border-panel',
        queueRailCollapsed ? 'w-[72px]' : 'w-[320px]'
      )}
    >
      {!queueRailCollapsed && (
        <div className="h-10 flex items-center justify-between px-3 border-b border-divider flex-shrink-0">
          <span className="text-[12px] font-semibold text-text-primary">
            RFQ Queue
          </span>
          <QueueRailCollapseToggle />
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <RFQQueueList collapsed={queueRailCollapsed} />
      </div>

      {queueRailCollapsed && (
        <div className="h-10 flex items-center justify-center border-t border-divider flex-shrink-0">
          <QueueRailCollapseToggle />
        </div>
      )}
    </div>
  )
})