import { FiCheck, FiX, FiAlertTriangle, FiSend, FiMessageSquare, FiPaperclip } from 'react-icons/fi'

interface TouchAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'primary' | 'secondary' | 'danger' | 'warning'
  onClick: () => void
}

interface TouchOptimizedToolbarProps {
  actions?: TouchAction[]
  className?: string
}

const defaultActions: TouchAction[] = [
  { id: 'approve', label: 'Approve', icon: FiCheck, variant: 'primary', onClick: () => {} },
  { id: 'reject', label: 'Reject', icon: FiX, variant: 'danger', onClick: () => {} },
  { id: 'escalate', label: 'Escalate', icon: FiAlertTriangle, variant: 'warning', onClick: () => {} },
  { id: 'reply', label: 'Reply', icon: FiMessageSquare, onClick: () => {} },
  { id: 'attach', label: 'Attach', icon: FiPaperclip, onClick: () => {} },
  { id: 'submit', label: 'Submit', icon: FiSend, variant: 'primary', onClick: () => {} },
]

function TouchOptimizedToolbar({ actions, className }: TouchOptimizedToolbarProps) {
  const buttons = actions || defaultActions

  const variantClasses = {
    primary: 'bg-[#0052CC] text-white active:bg-[#0747A6]',
    secondary: 'bg-[#FAFBFC] text-[#44546F] active:bg-[#EBECF0] border border-[#DFE1E6]',
    danger: 'bg-[#DE350B]/20 text-[#DE350B] active:bg-[#DE350B]/30 border border-[#DE350B]/40',
    warning: 'bg-[#FFAB00]/20 text-[#FFAB00] active:bg-[#FFAB00]/30 border border-[#FFAB00]/40',
  }

  return (
    <div className={`flex items-center gap-2 p-3 bg-[#FFFFFF] border-t border-[#DFE1E6] ${className || ''}`}>
      {buttons.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs transition-colors active:scale-95 ${
              variantClasses[action.variant || 'secondary']
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default TouchOptimizedToolbar
