import { useState } from 'react'
import { FiBell, FiClock, FiX, FiPlus } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface Reminder {
  id: string
  message: string
  triggerAt: string
  type: 'time' | 'event' | 'sla'
  status: 'pending' | 'triggered' | 'dismissed'
}

interface SmartReminderCreatorProps {
  isOpen: boolean
  onClose: () => void
  onCreateReminder: (reminder: { message: string; triggerAt: string; type: string }) => void
  existingReminders?: Reminder[]
}

function SmartReminderCreator({ isOpen, onClose, onCreateReminder, existingReminders = [] }: SmartReminderCreatorProps) {
  const [message, setMessage] = useState('')
  const [triggerType, setTriggerType] = useState<'time' | 'event' | 'sla'>('time')
  const [triggerValue, setTriggerValue] = useState('')

  const quickOptions = [
    { label: '15 min', value: '15m' },
    { label: '30 min', value: '30m' },
    { label: '1 hour', value: '1h' },
    { label: '2 hours', value: '2h' },
    { label: 'End of day', value: 'eod' },
    { label: 'Tomorrow', value: 'tomorrow' },
  ]

  const handleSubmit = () => {
    if (message.trim() && triggerValue) {
      onCreateReminder({ message, triggerAt: triggerValue, type: triggerType })
      setMessage('')
      setTriggerValue('')
    }
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#DFE1E6]">
              <h3 className="text-sm font-semibold text-[#172B4D]">Smart Reminder</h3>
              <button onClick={onClose} className="text-[#6B778C] hover:text-[#172B4D] transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-[#44546F] mb-1.5">Reminder Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What should I remind you about?"
                  className="w-full bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-2 text-xs text-[#172B4D] outline-none focus:border-[#0052CC] placeholder:text-[#6B778C]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#44546F] mb-1.5">Trigger Type</label>
                <div className="flex gap-1">
                  {(['time', 'event', 'sla'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTriggerType(type)}
                      className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded border transition-colors capitalize ${
                        triggerType === type
                          ? 'bg-[#DEEBFF] border-[#0052CC] text-[#172B4D]'
                          : 'bg-[#FAFBFC] border-[#DFE1E6] text-[#6B778C] hover:text-[#44546F]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {triggerType === 'time' && (
                <div>
                  <label className="block text-xs text-[#44546F] mb-1.5">
                    <FiClock className="w-3 h-3 inline mr-1" />
                    Quick Options
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {quickOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTriggerValue(opt.value)}
                        className={`px-2 py-1.5 text-[10px] rounded border transition-colors ${
                          triggerValue === opt.value
                            ? 'bg-[#DEEBFF] border-[#0052CC] text-[#172B4D]'
                            : 'bg-[#FAFBFC] border-[#DFE1E6] text-[#6B778C] hover:text-[#44546F]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {existingReminders.length > 0 && (
                <div>
                  <label className="block text-xs text-[#44546F] mb-1.5">Active Reminders</label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {existingReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-center gap-2 px-3 py-2 bg-[#FAFBFC] rounded text-xs"
                      >
                        <FiBell className="w-3 h-3 text-[#0052CC]" />
                        <span className="text-[#172B4D] flex-1 truncate">{reminder.message}</span>
                        <span className="text-[#6B778C]">{reminder.triggerAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={onClose} className="px-3 py-1.5 text-xs text-[#44546F] hover:text-[#172B4D] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || !triggerValue}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0052CC] text-white rounded hover:bg-[#0747A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus className="w-3 h-3" />
                  Create Reminder
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SmartReminderCreator
