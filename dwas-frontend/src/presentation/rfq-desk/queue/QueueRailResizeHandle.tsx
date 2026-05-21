import { memo } from 'react'

export const QueueRailResizeHandle = memo(function QueueRailResizeHandle() {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-active-blue/30 transition-colors duration-120" />
  )
})