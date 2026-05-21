import { memo } from 'react'
import clsx from 'clsx'
import { RFQDeskLayout } from './RFQDeskLayout'
import { QueueFilterToolbar } from '../topbar/QueueFilterToolbar'
import { CollapsibleQueueRail } from '../queue/CollapsibleQueueRail'
import { RFQWorkspace } from '../workspace/RFQWorkspace'

interface RFQDeskSurfaceProps {
  className?: string
}

export const RFQDeskSurface = memo(function RFQDeskSurface({
  className,
}: RFQDeskSurfaceProps) {
  return (
    <div className={clsx('flex flex-col h-full bg-bg-primary overflow-hidden', className)}>
      <QueueFilterToolbar />
      <RFQDeskLayout
        queueRail={<CollapsibleQueueRail />}
        workspace={<RFQWorkspace />}
      />
    </div>
  )
})