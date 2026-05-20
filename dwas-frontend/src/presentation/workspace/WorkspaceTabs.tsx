import { FiX, FiPlus } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface WorkspaceTab {
  id: string
  label: string
  type: string
  closable?: boolean
}

interface WorkspaceTabsProps {
  tabs: WorkspaceTab[]
  activeTab: string
  onChange: (tabId: string) => void
  onClose?: (tabId: string) => void
  onAdd?: () => void
}

function WorkspaceTabs({ tabs, activeTab, onChange, onClose, onAdd }: WorkspaceTabsProps) {
  return (
    <div className="flex items-center gap-px bg-[#F4F5F7] border-b border-[#DFE1E6]">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          layout
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors relative ${
            activeTab === tab.id
              ? 'bg-[#FFFFFF] text-[#172B4D]'
              : 'text-[#6B778C] hover:text-[#44546F] hover:bg-[#FAFBFC]'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div layoutId="activeTab" className="absolute top-0 left-0 right-0 h-0.5 bg-[#0052CC]" />
          )}
          <span className="truncate max-w-32">{tab.label}</span>
          {tab.closable && onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose(tab.id)
              }}
              className="p-0.5 hover:bg-[#EBECF0] rounded text-[#6B778C] hover:text-[#44546F] transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </motion.button>
      ))}

      {onAdd && (
        <button
          onClick={onAdd}
          className="p-2 text-[#6B778C] hover:text-[#44546F] hover:bg-[#FAFBFC] transition-colors"
        >
          <FiPlus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export default WorkspaceTabs
