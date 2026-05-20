import { useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface Operator {
  id: string
  name: string
  role: string
  availability: 'available' | 'busy' | 'offline'
  currentLoad: number
}

const mockOperators: Operator[] = [
  { id: 'op-1', name: 'Rajesh Kumar', role: 'Procurement Lead', availability: 'available', currentLoad: 3 },
  { id: 'op-2', name: 'Priya Sharma', role: 'Dispatch Coordinator', availability: 'busy', currentLoad: 7 },
  { id: 'op-3', name: 'Amit Patel', role: 'Logistics Manager', availability: 'available', currentLoad: 2 },
  { id: 'op-4', name: 'Sneha Reddy', role: 'Vendor Relations', availability: 'offline', currentLoad: 0 },
  { id: 'op-5', name: 'Vikram Singh', role: 'Quality Controller', availability: 'available', currentLoad: 4 },
]

interface AssignmentActionPanelProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (operatorId: string) => void
  currentAssignee?: string
}

function AssignmentActionPanel({ isOpen, onClose, onAssign, currentAssignee }: AssignmentActionPanelProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const availabilityColors = {
    available: 'bg-[#36B37E]',
    busy: 'bg-[#FFAB00]',
    offline: 'bg-[#6B778C]',
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
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 rounded-lg border border-[#DFE1E6] bg-[#FFFFFF] shadow-2xl"
          >
            <div className="px-4 py-3 border-b border-[#DFE1E6]">
              <h3 className="text-sm font-semibold text-[#172B4D]">Assign Operator</h3>
              <p className="text-xs text-[#6B778C] mt-0.5">Select an operator to handle this thread</p>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="space-y-1">
                {mockOperators.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => setSelected(op.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors text-left ${
                      selected === op.id ? 'bg-[#DEEBFF]' : 'hover:bg-[#EBECF0]'
                    } ${currentAssignee === op.id ? 'border border-[#0052CC]/40' : ''}`}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#DEEBFF] flex items-center justify-center text-xs font-medium text-[#44546F]">
                        {op.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#FFFFFF] ${availabilityColors[op.availability]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#172B4D]">{op.name}</div>
                      <div className="text-[10px] text-[#6B778C]">{op.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#6B778C]">{op.currentLoad} active</div>
                      {currentAssignee === op.id && <FiCheck className="w-3.5 h-3.5 text-[#0052CC] ml-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Assignment note (optional)..."
                className="w-full bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-2 text-xs text-[#172B4D] outline-none focus:border-[#0052CC] resize-none placeholder:text-[#6B778C]"
                rows={2}
              />
              <div className="flex items-center justify-end gap-2 mt-3">
                <button onClick={onClose} className="px-3 py-1.5 text-xs text-[#44546F] hover:text-[#172B4D] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selected) {
                      onAssign(selected)
                      onClose()
                    }
                  }}
                  disabled={!selected}
                  className="px-3 py-1.5 text-xs font-medium bg-[#0052CC] text-white rounded hover:bg-[#0747A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AssignmentActionPanel
