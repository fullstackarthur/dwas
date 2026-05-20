import { memo } from 'react'
import { useThreadWorkspaceStore } from '../stores/threadStore'
import { OperationalThreadHeader } from './OperationalThreadHeader'
import { ThreadStatusRail } from './ThreadStatusRail'
import { ThreadLifecycleStepper } from './ThreadLifecycleStepper'
import { OperationalTimeline } from './OperationalTimeline'
import { ThreadParticipantsPanel } from './ThreadParticipantsPanel'
import { ApprovalWorkflowPanel } from './ApprovalWorkflowPanel'
import { DispatchTrackingPanel } from './DispatchTrackingPanel'
import { VendorCommunicationPanel } from './VendorCommunicationPanel'
import { RequirementDetailsPanel } from './RequirementDetailsPanel'
import { SLAStatusPanel } from './SLAStatusPanel'
import { OperationalNotesPanel } from './OperationalNotesPanel'
import { DocumentCenter } from './DocumentCenter'
import { AIRecommendationPanel } from './AIRecommendationPanel'
import { AIContextPanel } from './AIContextPanel'
import { AIExecutiveSummary } from './AIExecutiveSummary'
import clsx from 'clsx'

type ThreadWorkspaceTab = 'timeline' | 'documents' | 'approvals' | 'dispatch' | 'vendor' | 'ai' | 'notes'

const tabs: { id: ThreadWorkspaceTab; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'documents', label: 'Documents' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'dispatch', label: 'Dispatch' },
  { id: 'vendor', label: 'Vendor' },
  { id: 'ai', label: 'AI Insights' },
  { id: 'notes', label: 'Notes' },
]

export const ThreadWorkspaceLayout = memo(function ThreadWorkspaceLayout() {
  const { activeTab, setActiveTab, rightSidebarTab, setRightSidebarTab } = useThreadWorkspaceStore()

  const sidebarTabs = [
    { id: 'metadata' as const, label: 'Details' },
    { id: 'participants' as const, label: 'People' },
    { id: 'sla' as const, label: 'SLA' },
    { id: 'ai' as const, label: 'AI' },
    { id: 'workflow' as const, label: 'Workflow' },
  ]

  return (
    <div className="flex flex-col h-full">
      <OperationalThreadHeader />
      <ThreadStatusRail />
      <ThreadLifecycleStepper />

      <div className="flex-1 min-h-0 flex">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-0 px-4 border-b border-divider flex-shrink-0 bg-bg-secondary">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'px-3 py-2 text-[12px] border-b-2 transition-colors duration-120',
                  activeTab === tab.id
                    ? 'border-active-blue text-text-primary font-medium'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto bg-bg-primary">
            {activeTab === 'timeline' && <OperationalTimeline />}
            {activeTab === 'documents' && <DocumentCenter />}
            {activeTab === 'approvals' && <ApprovalWorkflowPanel />}
            {activeTab === 'dispatch' && <DispatchTrackingPanel />}
            {activeTab === 'vendor' && <VendorCommunicationPanel />}
            {activeTab === 'ai' && <AIRecommendationPanel />}
            {activeTab === 'notes' && <OperationalNotesPanel />}
          </div>
        </div>

        <div className="w-72 bg-bg-secondary border-l border-border-panel flex flex-col flex-shrink-0">
          <div className="flex items-center gap-0 px-2 border-b border-divider flex-shrink-0">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRightSidebarTab(tab.id)}
                className={clsx(
                  'px-2 py-1.5 text-[11px] border-b-2 transition-colors duration-120',
                  rightSidebarTab === tab.id
                    ? 'border-active-blue text-text-primary'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {rightSidebarTab === 'metadata' && <RequirementDetailsPanel />}
            {rightSidebarTab === 'participants' && <ThreadParticipantsPanel />}
            {rightSidebarTab === 'sla' && <SLAStatusPanel />}
            {rightSidebarTab === 'ai' && <AIContextPanel />}
            {rightSidebarTab === 'workflow' && (
              <div className="p-3">
                <AIExecutiveSummary />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
