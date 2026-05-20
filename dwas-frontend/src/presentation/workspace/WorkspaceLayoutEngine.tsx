import { useWorkspaceStore } from '../stores/commandStore'

interface WorkspaceLayoutEngineProps {
  children: React.ReactNode
  className?: string
}

function WorkspaceLayoutEngine({ children, className }: WorkspaceLayoutEngineProps) {
  const { state } = useWorkspaceStore()
  const { layout, density } = state

  const densityClasses = {
    compact: 'text-xs',
    comfortable: 'text-sm',
    spacious: 'text-base',
  }

  const layoutClasses = {
    single: 'grid grid-cols-1',
    split: 'grid grid-cols-2',
    triple: 'grid grid-cols-3',
  }

  return (
    <div className={`flex flex-col h-full ${densityClasses[density]} ${className || ''}`}>
      <div className={`flex-1 ${layoutClasses[layout]} gap-px bg-[#DFE1E6]`}>{children}</div>
    </div>
  )
}

export default WorkspaceLayoutEngine
