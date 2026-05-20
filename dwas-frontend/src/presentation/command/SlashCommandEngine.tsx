import { useState, useRef, useEffect } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface SlashCommandOption {
  id: string
  label: string
  description: string
  action: (args?: string) => void
}

const slashCommands: SlashCommandOption[] = [
  { id: 'assign', label: '/assign', description: 'Assign to operator', action: () => {} },
  { id: 'approve', label: '/approve', description: 'Approve current item', action: () => {} },
  { id: 'reject', label: '/reject', description: 'Reject with reason', action: () => {} },
  { id: 'escalate', label: '/escalate', description: 'Escalate to supervisor', action: () => {} },
  { id: 'note', label: '/note', description: 'Add operational note', action: () => {} },
  { id: 'followup', label: '/followup', description: 'Create followup task', action: () => {} },
  { id: 'dispatch', label: '/dispatch', description: 'Update dispatch status', action: () => {} },
  { id: 'sync', label: '/sync', description: 'Sync external records', action: () => {} },
]

interface SlashCommandEngineProps {
  value: string
  onChange: (value: string) => void
  onExecute?: (command: string, args?: string) => void
  placeholder?: string
  className?: string
}

function SlashCommandEngine({ value, onChange, onExecute, placeholder, className }: SlashCommandEngineProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const isSlash = value.startsWith('/')
  const query = isSlash ? value.slice(1).split(' ')[0].toLowerCase() : ''
  const args = isSlash ? value.slice(1).split(' ').slice(1).join(' ') : ''

  const filtered = isSlash
    ? slashCommands.filter((c) => c.label.slice(1).includes(query))
    : []

  useEffect(() => {
    setShowSuggestions(isSlash && filtered.length > 0)
    setActiveIndex(0)
  }, [isSlash, filtered.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault()
      filtered[activeIndex].action(args)
      onExecute?.(filtered[activeIndex].label, args)
      onChange('')
      setShowSuggestions(false)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full bg-[#FAFBFC] border border-[#DFE1E6] rounded px-3 py-2 text-sm text-[#172B4D] outline-none focus:border-[#0052CC] ${className || ''}`}
      />

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-0 right-0 mb-1 bg-[#FFFFFF] border border-[#DFE1E6] rounded-lg shadow-xl overflow-hidden"
          >
            {filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action(args)
                  onExecute?.(cmd.label, args)
                  onChange('')
                  setShowSuggestions(false)
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                  idx === activeIndex ? 'bg-[#DEEBFF]' : 'hover:bg-[#EBECF0]'
                }`}
              >
                <div>
                  <div className="text-sm font-mono text-[#0052CC]">{cmd.label}</div>
                  <div className="text-xs text-[#6B778C]">{cmd.description}</div>
                </div>
                <FiArrowRight className="w-3.5 h-3.5 text-[#6B778C]" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SlashCommandEngine
