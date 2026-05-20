import { useWorkspaceStore } from '../stores/commandStore'
import WorkspaceLayoutEngine from './WorkspaceLayoutEngine'
import ResizableWorkspacePanels from './ResizableWorkspacePanels'

interface MultiPaneWorkspaceProps {
  leftContent?: React.ReactNode
  centerContent: React.ReactNode
  rightContent?: React.ReactNode
  bottomContent?: React.ReactNode
}

function MultiPaneWorkspace({ leftContent, centerContent, rightContent, bottomContent }: MultiPaneWorkspaceProps) {
  const { state } = useWorkspaceStore()
  const { layout } = state

  if (layout === 'single') {
    return <div className="h-full overflow-auto">{centerContent}</div>
  }

  return (
    <WorkspaceLayoutEngine>
      <ResizableWorkspacePanels>
        {leftContent && <div className="h-full overflow-auto bg-[#FFFFFF]">{leftContent}</div>}
        <div className="h-full overflow-auto bg-[#F4F5F7]">{centerContent}</div>
        {rightContent && <div className="h-full overflow-auto bg-[#FFFFFF]">{rightContent}</div>}
      </ResizableWorkspacePanels>
      {bottomContent && <div className="border-t border-[#DFE1E6] bg-[#FFFFFF]">{bottomContent}</div>}
    </WorkspaceLayoutEngine>
  )
}

export default MultiPaneWorkspace
