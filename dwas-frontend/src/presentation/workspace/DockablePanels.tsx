import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkspaceStore } from '../stores/commandStore'
import type { WorkspacePanel } from '../../core/types/command'

interface DockablePanelsProps {
  panels: WorkspacePanel[]
  renderPanel: (panel: WorkspacePanel) => React.ReactNode
}

function DockablePanels({ panels, renderPanel }: DockablePanelsProps) {
  const { setPanelVisibility, togglePanelCollapse } = useWorkspaceStore()

  const leftPanels = panels.filter((p) => p.position === 'left' && p.visible)
  const rightPanels = panels.filter((p) => p.position === 'right' && p.visible)
  const bottomPanels = panels.filter((p) => p.position === 'bottom' && p.visible)

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 gap-px bg-[#DFE1E6] overflow-hidden">
        {leftPanels.length > 0 && (
          <div className="flex gap-px bg-[#DFE1E6] overflow-hidden">
            {leftPanels.map((panel) => (
              <DockablePanel key={panel.id} panel={panel} renderPanel={renderPanel} onToggle={togglePanelCollapse} onClose={() => setPanelVisibility(panel.id, false)} />
            ))}
          </div>
        )}

        <div className="flex-1 bg-[#F4F5F7] overflow-auto">
          {panels.find((p) => p.id === 'thread' && p.visible && !p.collapsed) && renderPanel(panels.find((p) => p.id === 'thread')!)}
        </div>

        {rightPanels.length > 0 && (
          <div className="flex gap-px bg-[#DFE1E6] overflow-hidden">
            {rightPanels.map((panel) => (
              <DockablePanel key={panel.id} panel={panel} renderPanel={renderPanel} onToggle={togglePanelCollapse} onClose={() => setPanelVisibility(panel.id, false)} />
            ))}
          </div>
        )}
      </div>

      {bottomPanels.length > 0 && (
        <div className="border-t border-[#DFE1E6] bg-[#FFFFFF]">
          {bottomPanels.map((panel) => (
            <DockablePanel key={panel.id} panel={panel} renderPanel={renderPanel} onToggle={togglePanelCollapse} onClose={() => setPanelVisibility(panel.id, false)} />
          ))}
        </div>
      )}
    </div>
  )
}

interface DockablePanelProps {
  panel: WorkspacePanel
  renderPanel: (panel: WorkspacePanel) => React.ReactNode
  onToggle: (id: string) => void
  onClose: () => void
}

function DockablePanel({ panel, renderPanel, onToggle, onClose }: DockablePanelProps) {
  return (
    <motion.div
      animate={{ width: panel.collapsed ? 40 : panel.size * 4, minWidth: panel.collapsed ? 40 : 200 }}
      transition={{ duration: 0.2 }}
      className="bg-[#FFFFFF] flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#DFE1E6] bg-[#FAFBFC]">
        {!panel.collapsed && <span className="text-xs font-medium text-[#172B4D]">{panel.title}</span>}
        <div className="flex items-center gap-1">
          <button onClick={() => onToggle(panel.id)} className="p-1 hover:bg-[#EBECF0] rounded text-[#6B778C] hover:text-[#44546F] transition-colors">
            {panel.collapsed ? <FiChevronDown className="w-3.5 h-3.5" /> : <FiChevronUp className="w-3.5 h-3.5" />}
          </button>
          {!panel.docked && (
            <button onClick={onClose} className="p-1 hover:bg-[#EBECF0] rounded text-[#6B778C] hover:text-[#44546F] transition-colors">
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {!panel.collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-auto"
          >
            {renderPanel(panel)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DockablePanels
