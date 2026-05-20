import { FiPlus, FiRefreshCw, FiCheck, FiAlertTriangle, FiTruck, FiFileText, FiUsers } from 'react-icons/fi'
import { useCommandStore } from '../stores/commandStore'

const quickActions = [
  { id: 'new-thread', label: 'New Thread', icon: FiPlus, action: () => {} },
  { id: 'refresh', label: 'Refresh Queues', icon: FiRefreshCw, action: () => {} },
  { id: 'approve', label: 'Approve Selected', icon: FiCheck, action: () => {} },
  { id: 'escalate', label: 'Escalate', icon: FiAlertTriangle, action: () => {} },
  { id: 'dispatch', label: 'Update Dispatch', icon: FiTruck, action: () => {} },
  { id: 'summary', label: 'AI Summary', icon: FiFileText, action: () => {} },
  { id: 'assign', label: 'Assign Operator', icon: FiUsers, action: () => {} },
]

function OperationalQuickActions() {
  const { open } = useCommandStore()

  return (
    <div className="flex items-center gap-1">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => action.action()}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-[#44546F] hover:text-[#172B4D] hover:bg-[#EBECF0] rounded transition-colors"
          title={action.label}
        >
          <action.icon className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{action.label}</span>
        </button>
      ))}
      <button
        onClick={open}
        className="ml-1 px-2 py-1.5 text-xs text-[#6B778C] hover:text-[#172B4D] hover:bg-[#EBECF0] rounded transition-colors border border-[#DFE1E6]"
      >
        <span className="hidden md:inline">Actions</span>
        <span className="md:hidden">⌘K</span>
      </button>
    </div>
  )
}

export default OperationalQuickActions
