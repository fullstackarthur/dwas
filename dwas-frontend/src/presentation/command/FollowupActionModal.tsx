import { useState } from 'react'
import { FiClock, FiCalendar, FiMessageSquare, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface FollowupActionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateFollowup: (followup: { title: string; dueDate: string; priority: string; note: string }) => void
}

function FollowupActionModal({ isOpen, onClose, onCreateFollowup }: FollowupActionModalProps) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('normal')
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (title.trim()) {
      onCreateFollowup({ title, dueDate, priority, note })
      setTitle('')
      setDueDate('')
      setPriority('normal')
      setNote('')
      onClose()
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-[#6B778C]' },
    { value: 'normal', label: 'Normal', color: 'text-[#44546F]' },
    { value: 'high', label: 'High', color: 'text-[#FFAB00]' },
    { value: 'critical', label: 'Critical', color: 'text-[#DE350B]' },
  ]

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
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#DFE1E6]">
              <h3 className="text-sm font-semibold text-[#172B4D]">Create Followup</h3>
              <button onClick={onClose} className="text-[#6B778C] hover:text-[#172B4D] transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-[#44546F] mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Followup title..."
                  className="w-full bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-2 text-xs text-[#172B4D] outline-none focus:border-[#0052CC] placeholder:text-[#6B778C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#44546F] mb-1.5">
                    <FiCalendar className="w-3 h-3 inline mr-1" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-2 text-xs text-[#172B4D] outline-none focus:border-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#44546F] mb-1.5">
                    <FiClock className="w-3 h-3 inline mr-1" />
                    Priority
                  </label>
                  <div className="flex gap-1">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPriority(opt.value)}
                        className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded border transition-colors ${
                          priority === opt.value
                            ? 'bg-[#DEEBFF] border-[#0052CC] text-[#172B4D]'
                            : 'bg-[#FAFBFC] border-[#DFE1E6] text-[#6B778C] hover:text-[#44546F]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#44546F] mb-1.5">
                  <FiMessageSquare className="w-3 h-3 inline mr-1" />
                  Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Additional context..."
                  className="w-full bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-2 text-xs text-[#172B4D] outline-none focus:border-[#0052CC] resize-none placeholder:text-[#6B778C]"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={onClose} className="px-3 py-1.5 text-xs text-[#44546F] hover:text-[#172B4D] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-[#0052CC] text-white rounded hover:bg-[#0747A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Followup
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FollowupActionModal
