import { create } from 'zustand'
import {
  mockTimelineEvents,
  mockApprovalSteps,
  mockDispatchInfo,
  mockVendorQuotations,
  mockAttachments,
  mockSLAInfo,
  mockRequirements,
  mockFinancialEntries,
  mockOperationalNotes,
  mockAIRecommendations,
  mockParticipants,
  mockWorkflowState,
} from '../../data/mock/thread'
import type {
  TimelineEvent,
  ApprovalStep,
  DispatchInfo,
  VendorQuotation,
  Attachment,
  SLAInfo,
  RequirementDetail,
  FinancialEntry,
  OperationalNote,
  AIRecommendation,
  ParticipantEntry,
  WorkflowState,
} from '../../core/types/thread'

type ThreadWorkspaceTab = 'timeline' | 'documents' | 'approvals' | 'dispatch' | 'vendor' | 'ai' | 'notes'
type RightSidebarTab = 'metadata' | 'participants' | 'sla' | 'ai' | 'workflow'

interface ThreadWorkspaceState {
  activeTab: ThreadWorkspaceTab
  rightSidebarTab: RightSidebarTab
  selectedEventId: string | null
  timelineFilter: string | null
  loading: boolean
  setActiveTab: (tab: ThreadWorkspaceTab) => void
  setRightSidebarTab: (tab: RightSidebarTab) => void
  setSelectedEventId: (id: string | null) => void
  setTimelineFilter: (filter: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useThreadWorkspaceStore = create<ThreadWorkspaceState>((set) => ({
  activeTab: 'timeline',
  rightSidebarTab: 'metadata',
  selectedEventId: null,
  timelineFilter: null,
  loading: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRightSidebarTab: (tab) => set({ rightSidebarTab: tab }),
  setSelectedEventId: (id) => set({ selectedEventId: id }),
  setTimelineFilter: (filter) => set({ timelineFilter: filter }),
  setLoading: (loading) => set({ loading }),
}))

interface ThreadDataState {
  timelineEvents: TimelineEvent[]
  approvalSteps: ApprovalStep[]
  dispatchInfo: DispatchInfo[]
  vendorQuotations: VendorQuotation[]
  attachments: Attachment[]
  slaInfo: SLAInfo[]
  requirements: RequirementDetail[]
  financialEntries: FinancialEntry[]
  operationalNotes: OperationalNote[]
  aiRecommendations: AIRecommendation[]
  participants: ParticipantEntry[]
  workflowState: WorkflowState
  setTimelineEvents: (events: TimelineEvent[]) => void
  addTimelineEvent: (event: TimelineEvent) => void
  setApprovalSteps: (steps: ApprovalStep[]) => void
  updateApprovalStep: (id: string, updates: Partial<ApprovalStep>) => void
  setDispatchInfo: (info: DispatchInfo[]) => void
  setVendorQuotations: (quotations: VendorQuotation[]) => void
  setAttachments: (attachments: Attachment[]) => void
  setSLAInfo: (info: SLAInfo[]) => void
  setRequirements: (requirements: RequirementDetail[]) => void
  setFinancialEntries: (entries: FinancialEntry[]) => void
  setOperationalNotes: (notes: OperationalNote[]) => void
  addOperationalNote: (note: OperationalNote) => void
  setAIRecommendations: (recs: AIRecommendation[]) => void
  dismissAIRecommendation: (id: string) => void
  setParticipants: (participants: ParticipantEntry[]) => void
  setWorkflowState: (state: WorkflowState) => void
  transitionWorkflow: (target: string) => void
}

export const useThreadDataStore = create<ThreadDataState>((set) => ({
  timelineEvents: mockTimelineEvents,
  approvalSteps: mockApprovalSteps,
  dispatchInfo: mockDispatchInfo,
  vendorQuotations: mockVendorQuotations,
  attachments: mockAttachments,
  slaInfo: mockSLAInfo,
  requirements: mockRequirements,
  financialEntries: mockFinancialEntries,
  operationalNotes: mockOperationalNotes,
  aiRecommendations: mockAIRecommendations,
  participants: mockParticipants,
  workflowState: mockWorkflowState,
  setTimelineEvents: (events) => set({ timelineEvents: events }),
  addTimelineEvent: (event) => set((s) => ({ timelineEvents: [event, ...s.timelineEvents] })),
  setApprovalSteps: (steps) => set({ approvalSteps: steps }),
  updateApprovalStep: (id, updates) =>
    set((s) => ({
      approvalSteps: s.approvalSteps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    })),
  setDispatchInfo: (info) => set({ dispatchInfo: info }),
  setVendorQuotations: (quotations) => set({ vendorQuotations: quotations }),
  setAttachments: (attachments) => set({ attachments }),
  setSLAInfo: (info) => set({ slaInfo: info }),
  setRequirements: (requirements) => set({ requirements }),
  setFinancialEntries: (entries) => set({ financialEntries: entries }),
  setOperationalNotes: (notes) => set({ operationalNotes: notes }),
  addOperationalNote: (note) => set((s) => ({ operationalNotes: [note, ...s.operationalNotes] })),
  setAIRecommendations: (recs) => set({ aiRecommendations: recs }),
  dismissAIRecommendation: (id) =>
    set((s) => ({
      aiRecommendations: s.aiRecommendations.map((r) =>
        r.id === id ? { ...r, dismissed: true } : r
      ),
    })),
  setParticipants: (participants) => set({ participants }),
  setWorkflowState: (state) => set({ workflowState: state }),
  transitionWorkflow: (target) =>
    set((s) => ({
      workflowState: {
        ...s.workflowState,
        currentState: target,
        history: [
          ...s.workflowState.history,
          { state: target, timestamp: new Date().toISOString() },
        ],
      },
    })),
}))
