import { useState } from 'react'
import { FiCheck, FiX, FiAlertTriangle, FiMessageSquare } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface OperationalDecisionDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  onApprove: (reason?: string) => void
  onReject: (reason: string) => void
  onEscalate?: (reason: string) => void
  showEscalate?: boolean
}

function OperationalDecisionDrawer({
  isOpen,
  onClose,
  title,
  description,
  onApprove,
  onReject,
  onEscalate,
  showEscalate = true,
}: OperationalDecisionDrawerProps) {
  const [action, setAction] = useState<'approve' | 'reject' | 'escalate' | null>(null)
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (action === 'approve') {
      onApprove(reason)
    } else if (action === 'reject') {
      onReject(reason)
    } else if (action === 'escalate' && onEscalate) {
      onEscalate(reason)
    }
    setAction(null)
    setReason('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-[#FFFFFF] border-l border-[#DFE1E6] shadow-2xl overflow-y-auto"
          >
            <div className="px-5 py-4 border-b border-[#DFE1E6]">
              <h3 className="text-sm font-semibold text-[#172B4D]">{title}</h3>
              {description && <p className="text-xs text-[#6B778C] mt-1">{description}</p>}
            </div>

            <div className="p-5">
              {!action ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setAction('approve')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#36B37E]/10 border border-[#36B37E]/30 rounded hover:bg-[#36B37E]/20 transition-colors text-left"
                  >
                    <FiCheck className="w-4 h-4 text-[#36B37E]" />
                    <div>
                      <div className="text-xs font-medium text-[#36B37E]">Approve</div>
                      <div className="text-[10px] text-[#6B778C]">Proceed with this action</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAction('reject')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#DE350B]/10 border border-[#DE350B]/30 rounded hover:bg-[#DE350B]/20 transition-colors text-left"
                  >
                    <FiX className="w-4 h-4 text-[#DE350B]" />
                    <div>
                      <div className="text-xs font-medium text-[#DE350B]">Reject</div>
                      <div className="text-[10px] text-[#6B778C]">Decline with reason</div>
                    </div>
                  </button>

                  {showEscalate && onEscalate && (
                    <button
                      onClick={() => setAction('escalate')}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-[#FFAB00]/10 border border-[#FFAB00]/30 rounded hover:bg-[#FFAB00]/20 transition-colors text-left"
                    >
                      <FiAlertTriangle className="w-4 h-4 text-[#FFAB00]" />
                      <div>
                        <div className="text-xs font-medium text-[#FFAB00]">Escalate</div>
                        <div className="text-[10px] text-[#6B778C]">Route to supervisor</div>
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {action === 'approve' && <FiCheck className="w-4 h-4 text-[#36B37E]" />}
                    {action === 'reject' && <FiX className="w-4 h-4 text-[#DE350B]" />}
                    {action === 'escalate' && <FiAlertTriangle className="w-4 h-4 text-[#FFAB00]" />}
                    <span className="text-xs font-medium text-[#172B4D] capitalize">{action}</span>
                  </div>

                  <div className="flex items-start gap-2 mb-3">
                    <FiMessageSquare className="w-3.5 h-3.5 text-[#6B778C] mt-0.5" />
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={
                        action === 'approve'
                          ? 'Approval note (optional)...'
                          : action === 'reject'
                            ? 'Rejection reason (required)...'
                            : 'Escalation reason...'
                      }
                      className="flex-1 bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-2 text-xs text-[#172B4D] outline-none focus:border-[#0052CC] resize-none placeholder:text-[#6B778C]"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setAction(null)}
                      className="px-3 py-1.5 text-xs text-[#44546F] hover:text-[#172B4D] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={action !== 'approve' && !reason.trim()}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        action === 'approve'
                          ? 'bg-[#36B37E] text-white hover:bg-[#2D9F6F]'
                          : action === 'reject'
                            ? 'bg-[#DE350B] text-white hover:bg-[#BF2600]'
                            : 'bg-[#FFAB00] text-[#F4F5F7] hover:bg-[#E69900]'
                      }`}
                    >
                      Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default OperationalDecisionDrawer
