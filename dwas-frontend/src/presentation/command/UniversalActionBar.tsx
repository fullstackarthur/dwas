import { FiCheck, FiX, FiAlertTriangle, FiSend, FiSave, FiRefreshCw } from 'react-icons/fi'

interface ActionButton {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'primary' | 'secondary' | 'danger' | 'warning'
  disabled?: boolean
  onClick: () => void
}

interface UniversalActionBarProps {
  actions?: ActionButton[]
  showDefault?: boolean
  className?: string
}

const defaultActions: ActionButton[] = [
  { id: 'approve', label: 'Approve', icon: FiCheck, variant: 'primary', onClick: () => {} },
  { id: 'reject', label: 'Reject', icon: FiX, variant: 'danger', onClick: () => {} },
  { id: 'escalate', label: 'Escalate', icon: FiAlertTriangle, variant: 'warning', onClick: () => {} },
  { id: 'submit', label: 'Submit', icon: FiSend, onClick: () => {} },
  { id: 'save', label: 'Save', icon: FiSave, variant: 'secondary', onClick: () => {} },
  { id: 'sync', label: 'Sync', icon: FiRefreshCw, variant: 'secondary', onClick: () => {} },
]

function UniversalActionBar({ actions, showDefault = true, className }: UniversalActionBarProps) {
  const buttons = actions || (showDefault ? defaultActions : [])

  const variantClasses = {
    primary: 'bg-[#0052CC] text-white hover:bg-[#0747A6]',
    secondary: 'bg-[#FAFBFC] text-[#44546F] hover:bg-[#EBECF0] border border-[#DFE1E6]',
    danger: 'bg-[#DE350B]/20 text-[#DE350B] hover:bg-[#DE350B]/30 border border-[#DE350B]/40',
    warning: 'bg-[#FFAB00]/20 text-[#FFAB00] hover:bg-[#FFAB00]/30 border border-[#FFAB00]/40',
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className || ''}`}>
      {buttons.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              variantClasses[action.variant || 'secondary']
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {action.label}
          </button>
        )
      })}
    </div>
  )
}

export default UniversalActionBar
