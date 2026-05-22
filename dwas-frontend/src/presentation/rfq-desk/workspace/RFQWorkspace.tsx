import { memo, useState, useCallback } from 'react'
import { useRFQDeskStore } from '../../stores'
import { RFQWorkspaceHeader } from './RFQWorkspaceHeader'
import { ClientDetailsBanner } from './ClientDetailsBanner'
import { ClientDetailsEditorPanel } from './ClientDetailsEditorPanel'
import { OperationalTimeline } from './OperationalTimeline'
import { ExtractedRequirementsPanel } from './ExtractedRequirementsPanel'
import { VendorSuggestionsPanel } from './VendorSuggestionsPanel'
import { RFQDocumentCenter } from './RFQDocumentCenter'
import { AIInsightsPanel } from './AIInsightsPanel'
import { FollowupActionPanel } from './FollowupActionPanel'
import { SLAStatusPanel } from './SLAStatusPanel'
import { motion } from 'framer-motion'
import { operationalFade } from '../layout/animations'
import { LoadingIndicator } from './LoadingIndicator'

export const RFQWorkspace = memo(function RFQWorkspace() {
  const selectedRfq = useRFQDeskStore((s) => s.getSelectedRfq())
  const detailLoading = useRFQDeskStore((s) => s.detailLoading)
  const [editorOpen, setEditorOpen] = useState(false)

  const openEditor = useCallback(() => setEditorOpen(true), [])
  const closeEditor = useCallback(() => setEditorOpen(false), [])

  if (!selectedRfq) {
    return (
      <div className="flex items-center justify-center h-full bg-bg-primary">
        <div className="text-center">
          <div className="text-[14px] text-text-muted">Select an RFQ to view details</div>
        </div>
      </div>
    )
  }

  if (detailLoading) {
    return <LoadingIndicator />
  }

  const missingClient = !selectedRfq.clientName

  return (
    <>
      <motion.div
        key={selectedRfq.id}
        {...operationalFade}
        className="flex flex-col h-full bg-bg-primary overflow-hidden"
      >
        <RFQWorkspaceHeader rfq={selectedRfq} onEditClient={openEditor} />

        {missingClient && (
          <ClientDetailsBanner onAddClient={openEditor} />
        )}

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

      <ClientDetailsEditorPanel
        rfq={selectedRfq}
        isOpen={editorOpen}
        onClose={closeEditor}
      />
    </>
  )
})
