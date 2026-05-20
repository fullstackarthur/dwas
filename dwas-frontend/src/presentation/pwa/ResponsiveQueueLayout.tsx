import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiFilter, FiArrowDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface QueueItem {
  id: string
  title: string
  type: string
  priority: string
  status: string
  assignee?: string
  updatedAt: string
}

interface ResponsiveQueueLayoutProps {
  items: QueueItem[]
  onItemClick: (id: string) => void
}

function ResponsiveQueueLayout({ items, onItemClick }: ResponsiveQueueLayoutProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const priorityColors: Record<string, string> = {
    low: 'bg-[#6B778C]/20 text-[#6B778C]',
    normal: 'bg-[#44546F]/20 text-[#44546F]',
    high: 'bg-[#FFAB00]/20 text-[#FFAB00]',
    critical: 'bg-[#DE350B]/20 text-[#DE350B]',
  }

  const statusColors: Record<string, string> = {
    open: 'text-[#0052CC]',
    in_progress: 'text-[#00B8D9]',
    resolved: 'text-[#36B37E]',
    closed: 'text-[#6B778C]',
  }

  return (
    <div className="divide-y divide-[#DFE1E6]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#FAFBFC]">
        <span className="text-xs font-medium text-[#44546F]">{items.length} items</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-[#6B778C] hover:text-[#44546F] transition-colors"
          >
            <FiFilter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#6B778C] hover:text-[#44546F] transition-colors">
            <FiArrowDown className="w-3.5 h-3.5" />
            Sort
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#FFFFFF] border-b border-[#DFE1E6]"
          >
            <div className="px-4 py-3 flex items-center gap-2">
              <select className="flex-1 bg-[#FAFBFC] border border-[#DFE1E6] rounded px-2 py-1.5 text-xs text-[#172B4D] outline-none">
                <option>All priorities</option>
                <option>Critical</option>
                <option>High</option>
                <option>Normal</option>
                <option>Low</option>
              </select>
              <select className="flex-1 bg-[#FAFBFC] border border-[#DFE1E6] rounded px-2 py-1.5 text-xs text-[#172B4D] outline-none">
                <option>All statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            className="w-full px-4 py-3 text-left hover:bg-[#EBECF0] transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#172B4D] truncate">{item.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[item.priority] || priorityColors.normal}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] ${statusColors[item.status] || 'text-[#6B778C]'}`}>{item.status}</span>
                  <span className="text-[10px] text-[#6B778C]">•</span>
                  <span className="text-[10px] text-[#6B778C]">{item.type}</span>
                  {item.assignee && (
                    <>
                      <span className="text-[10px] text-[#6B778C]">•</span>
                      <span className="text-[10px] text-[#6B778C]">{item.assignee}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#6B778C]">{item.updatedAt}</span>
                {expandedId === item.id ? (
                  <FiChevronUp className="w-4 h-4 text-[#6B778C]" />
                ) : (
                  <FiChevronDown className="w-4 h-4 text-[#6B778C]" />
                )}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {expandedId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[#FAFBFC]"
              >
                <div className="px-4 py-3 space-y-2">
                  <button
                    onClick={() => onItemClick(item.id)}
                    className="w-full px-3 py-2 text-xs font-medium bg-[#0052CC] text-white rounded hover:bg-[#0747A6] transition-colors"
                  >
                    Open Thread
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DFE1E6] rounded text-[#44546F] hover:text-[#172B4D] transition-colors">
                      Assign
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DFE1E6] rounded text-[#44546F] hover:text-[#172B4D] transition-colors">
                      Escalate
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default ResponsiveQueueLayout
