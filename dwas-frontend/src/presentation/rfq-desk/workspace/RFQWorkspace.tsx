import { memo } from 'react'
import { useRFQDeskStore } from '../../stores'
import { RFQWorkspaceHeader } from './RFQWorkspaceHeader'
import { OperationalTimeline } from './OperationalTimeline'
import { ExtractedRequirementsPanel } from './ExtractedRequirementsPanel'
import { VendorSuggestionsPanel } from './VendorSuggestionsPanel'
import { RFQDocumentCenter } from './RFQDocumentCenter'
import { AIInsightsPanel } from './AIInsightsPanel'
import { FollowupActionPanel } from './FollowupActionPanel'
import { SLAStatusPanel } from './SLAStatusPanel'
import { motion } from 'framer-motion'
import { operationalFade } from '../layout/animations'
import {
  Shimmer,
  ShimmerTimeline,
  ShimmerCard,
  ShimmerDocument,
} from './Shimmer'

export const RFQWorkspace = memo(function RFQWorkspace() {
  const selectedRfq = useRFQDeskStore((s) => s.getSelectedRfq())
  const detailLoading = useRFQDeskStore((s) => s.detailLoading)

  if (!selectedRfq) {
    return (
      <div className="flex items-center justify-center h-full bg-bg-primary">
        <div className="text-center">
          <div className="text-[14px] text-text-muted">Select an RFQ to view details</div>
        </div>
      </div>
    )
  }

  const hasDetailData = (selectedRfq.timeline?.length ?? 0) > 0 || (selectedRfq.items?.length ?? 0) > 0
  const showLoading = detailLoading && !hasDetailData

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

            {showLoading ? (
              <div className="panel">
                <div className="panel-header">
                  <h3 className="panel-title">Activity Flow</h3>
                  <Shimmer width="40px" height="11px" />
                </div>
                <div className="h-48 flex items-center justify-center">
                  <ShimmerTimeline />
                </div>
              </div>
            ) : (
              <OperationalTimeline rfq={selectedRfq} />
            )}

            {showLoading ? (
              <div className="panel">
                <div className="panel-header flex items-center">
                  <h3 className="panel-title">Extracted Requirements</h3>
                  <Shimmer width="60px" height="11px" />
                </div>
                <div className="p-3 space-y-2">
                  <ShimmerCard />
                  <ShimmerCard />
                </div>
              </div>
            ) : (
              <ExtractedRequirementsPanel rfq={selectedRfq} />
            )}

            {showLoading ? (
              <div className="panel">
                <div className="panel-header flex items-center">
                  <h3 className="panel-title">Vendor Suggestions</h3>
                  <Shimmer width="50px" height="11px" />
                </div>
                <div className="p-3 space-y-2">
                  <ShimmerCard />
                  <ShimmerCard />
                </div>
              </div>
            ) : (
              <VendorSuggestionsPanel rfq={selectedRfq} />
            )}

            {showLoading ? (
              <div className="panel">
                <div className="panel-header flex items-center">
                  <h3 className="panel-title">Documents</h3>
                  <Shimmer width="40px" height="11px" />
                </div>
                <div className="p-3 space-y-2">
                  <ShimmerDocument />
                  <ShimmerDocument />
                </div>
              </div>
            ) : (
              <RFQDocumentCenter rfq={selectedRfq} />
            )}

            {showLoading ? (
              <div className="panel">
                <div className="panel-header flex items-center">
                  <h3 className="panel-title">AI Insights</h3>
                  <Shimmer width="50px" height="11px" />
                </div>
                <div className="p-3 space-y-3">
                  <Shimmer width="100%" height="40px" />
                  <ShimmerCard />
                </div>
              </div>
            ) : (
              <AIInsightsPanel rfq={selectedRfq} />
            )}

            <FollowupActionPanel rfq={selectedRfq} />
          </div>
        </div>
      </div>
    </motion.div>
  )
})