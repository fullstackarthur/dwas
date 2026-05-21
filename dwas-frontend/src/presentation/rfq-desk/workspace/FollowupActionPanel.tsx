import { memo } from 'react'
import clsx from 'clsx'
import type { RFQ } from '../../../core/types/rfq'
import { mockRFQStages } from '../../../data/mock/rfq'
import { RFQStageTransitionPanel } from './RFQStageTransitionPanel'
import { VendorSelectionConfirmation } from './VendorSelectionConfirmation'
import { RequestClarificationAction } from './RequestClarificationAction'
import { SendToVendorAction } from './SendToVendorAction'
import { InternalNotesPanel } from './InternalNotesPanel'
import { motion } from 'framer-motion'

interface FollowupActionPanelProps {
  rfq: RFQ
}

export const FollowupActionPanel = memo(function FollowupActionPanel({ rfq }: FollowupActionPanelProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Actions</h3>
      </div>
      <div className="p-3 space-y-3">
        <SendToVendorAction rfq={rfq} />
        <RequestClarificationAction rfq={rfq} />
        <VendorSelectionConfirmation rfq={rfq} />
        <RFQStageTransitionPanel rfq={rfq} />
        <InternalNotesPanel rfq={rfq} />
      </div>
    </div>
  )
})