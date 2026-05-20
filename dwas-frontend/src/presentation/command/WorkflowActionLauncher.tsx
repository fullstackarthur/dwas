import { useState } from 'react'
import { FiTruck, FiFileText, FiUsers, FiCheck, FiAlertTriangle, FiRefreshCw, FiPlus } from 'react-icons/fi'

interface WorkflowAction {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  action: () => void
}

const workflowActions: WorkflowAction[] = [
  { id: 'approve-rfq', label: 'Approve RFQ', description: 'Approve selected quotation', icon: FiCheck, category: 'Procurement', action: () => {} },
  { id: 'update-dispatch', label: 'Update Dispatch', description: 'Modify dispatch status', icon: FiTruck, category: 'Logistics', action: () => {} },
  { id: 'assign-operator', label: 'Assign Operator', description: 'Reassign to operator', icon: FiUsers, category: 'Workflow', action: () => {} },
  { id: 'escalate', label: 'Escalate Thread', description: 'Escalate to supervisor', icon: FiAlertTriangle, category: 'Workflow', action: () => {} },
  { id: 'sync-tally', label: 'Sync Tally', description: 'Sync weight records', icon: FiRefreshCw, category: 'Operations', action: () => {} },
  { id: 'generate-summary', label: 'Generate Summary', description: 'AI operational summary', icon: FiFileText, category: 'AI', action: () => {} },
  { id: 'create-followup', label: 'Create Followup', description: 'Add followup task', icon: FiPlus, category: 'Workflow', action: () => {} },
]

function WorkflowActionLauncher() {
  const [filter, setFilter] = useState('')
  const categories = Array.from(new Set(workflowActions.map((a) => a.category)))
  const filtered = filter
    ? workflowActions.filter(
        (a) =>
          a.label.toLowerCase().includes(filter.toLowerCase()) ||
          a.category.toLowerCase().includes(filter.toLowerCase())
      )
    : workflowActions

  return (
    <div className="bg-[#FFFFFF] border border-[#DFE1E6] rounded-lg p-4">
      <h3 className="text-sm font-semibold text-[#172B4D] mb-3">Workflow Actions</h3>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter actions..."
        className="w-full bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-1.5 text-xs text-[#172B4D] outline-none focus:border-[#0052CC] mb-3 placeholder:text-[#6B778C]"
      />

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryActions = filtered.filter((a) => a.category === category)
          if (categoryActions.length === 0) return null

          return (
            <div key={category}>
              <div className="text-xs font-medium text-[#6B778C] uppercase tracking-wider mb-1.5">{category}</div>
              <div className="grid grid-cols-1 gap-1">
                {categoryActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="flex items-center gap-2 px-3 py-2 text-left hover:bg-[#EBECF0] rounded transition-colors group"
                  >
                    <action.icon className="w-4 h-4 text-[#44546F] group-hover:text-[#0052CC] transition-colors" />
                    <div>
                      <div className="text-xs text-[#172B4D]">{action.label}</div>
                      <div className="text-[10px] text-[#6B778C]">{action.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorkflowActionLauncher
