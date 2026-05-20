import { useState, useRef, useCallback } from 'react'
import { useWorkspaceStore } from '../stores/commandStore'

interface ResizableWorkspacePanelsProps {
  children: React.ReactNode[]
  className?: string
}

function ResizableWorkspacePanels({ children, className }: ResizableWorkspacePanelsProps) {
  const { setPanelSize } = useWorkspaceStore()
  const [dragging, setDragging] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.preventDefault()
      setDragging(index)
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging === null || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const totalWidth = rect.width
      const panelWidth = (x / totalWidth) * 100

      if (panelWidth > 15 && panelWidth < 85) {
        setPanelSize(`panel-${dragging}`, panelWidth)
      }
    },
    [dragging, children.length, setPanelSize]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  useState(() => {
    if (dragging !== null) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  })

  return (
    <div ref={containerRef} className={`flex h-full ${className || ''}`}>
      {children.map((child, index) => (
        <div key={index} className="flex items-stretch flex-1">
          <div className="flex-1 overflow-hidden">{child}</div>
          {index < children.length - 1 && (
            <div
              onMouseDown={handleMouseDown(index)}
              className={`w-1 cursor-col-resize bg-[#DFE1E6] hover:bg-[#0052CC] transition-colors ${
                dragging === index ? 'bg-[#0052CC]' : ''
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ResizableWorkspacePanels
