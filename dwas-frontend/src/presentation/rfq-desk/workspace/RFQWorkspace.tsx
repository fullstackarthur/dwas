import { memo } from 'react'
import clsx from 'clsx'
import { useRFQDeskStore } from '../../stores'
import { RFQWorkspaceHeader } from './RFQWorkspaceHeader'
import { OperationalTimeline } from './OperationalTimeline'
import { ExtractedRequirementsPanel } from './ExtractedRequirementsPanel'
import { VendorSuggestionsPanel } from './VendorSuggestionsPanel'
import { RFQDocumentCenter } from './RFQDocumentCenter'
import { AIInsightsPanel } from './AIInsightsPanel'
import { FollowupActionPanel } from './FollowupActionPanel'
import { SLAStatusPanel } from './SLAStatusPanel'
import { AnimatePresence, motion } from 'framer-motion'
import { operationalFade, operationalSlide } from '../layout/animations'

export const RFQWorkspace = memo(function RFQWorkspace() {
  const selectedRfq = useRFQDeskStore((s) => s.getSelectedRfq())

  if (!selectedRfq) {
    return (
      <div className="flex items-center justify-center h-full bg-bg-primary">
        <div className="text-center">
          <div className="text-[14px] text-text-muted">Select an RFQ to view details</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      key={selectedRfq.id}
      {...operationalFade}
      className="flex flex-col h-full bg-bg-primary overflow-hidden"
    >
      <RFQWorkspaceHeader rfq={selectedRfq} />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            <SLAStatusPanel rfq={selectedRfq} />
            <OperationalTimeline rfq={selectedRfq} />
            <ExtractedRequirementsPanel rfq={selectedRfq} />
            <VendorSuggestionsPanel rfq={selectedRfq} />
            <RFQDocumentCenter rfq={selectedRfq} />
            <AIInsightsPanel rfq={selectedRfq} />
            <FollowupActionPanel rfq={selectedRfq} />
          </div>
        </div>
      </div>
    </motion.div>
  )
})