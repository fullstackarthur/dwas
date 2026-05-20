import { useRef, useEffect } from 'react'
import { FiSearch, FiArrowUp, FiArrowDown, FiCornerDownLeft, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommandStore } from '../stores/commandStore'

function GlobalCommandPalette() {
  const { isOpen, close, query, setQuery, activeIndex, setActiveIndex, getFilteredCommands } = useCommandStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredCommands = getFilteredCommands()
  const sections = Array.from(new Set(filteredCommands.map((c) => c.section)))

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        useCommandStore.getState().toggle()
      }
      if (e.key === 'Escape' && isOpen) {
        close()
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setActiveIndex(Math.min(activeIndex + 1, filteredCommands.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveIndex(Math.max(activeIndex - 1, 0))
        }
        if (e.key === 'Enter' && filteredCommands[activeIndex]) {
          e.preventDefault()
          filteredCommands[activeIndex].action()
          close()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, activeIndex, filteredCommands, close, setActiveIndex])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-24 -translate-x-1/2 w-full max-w-2xl z-50 rounded-lg border border-[#DFE1E6] bg-[#FFFFFF] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DFE1E6]">
              <FiSearch className="w-4 h-4 text-[#6B778C]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, queues, threads..."
                className="flex-1 bg-transparent text-[#172B4D] text-sm outline-none placeholder:text-[#6B778C]"
              />
              <button onClick={close} className="text-[#6B778C] hover:text-[#44546F] transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {sections.map((section) => {
                const sectionCommands = filteredCommands.filter((c) => c.section === section)
                return (
                  <div key={section} className="mb-2">
                    <div className="px-4 py-1.5 text-xs font-medium text-[#6B778C] uppercase tracking-wider">{section}</div>
                    {sectionCommands.map((cmd) => {
                      const idx = filteredCommands.indexOf(cmd)
                      const isActive = idx === activeIndex
                      return (
                        <button
                          key={cmd.id}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => {
                            cmd.action()
                            close()
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${
                            isActive ? 'bg-[#DEEBFF]' : 'hover:bg-[#EBECF0]'
                          }`}
                        >
                          <div>
                            <div className="text-sm text-[#172B4D]">{cmd.label}</div>
                            {cmd.description && <div className="text-xs text-[#6B778C] mt-0.5">{cmd.description}</div>}
                          </div>
                          {cmd.shortcut && (
                            <div className="flex items-center gap-1">
                              {cmd.shortcut.split('+').map((key, i) => (
                                <kbd
                                  key={i}
                                  className="px-1.5 py-0.5 text-xs font-mono bg-[#FAFBFC] border border-[#DFE1E6] rounded text-[#44546F]"
                                >
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}

              {filteredCommands.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-[#6B778C]">No commands found</div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-[#DFE1E6] bg-[#FAFBFC]">
              <div className="flex items-center gap-4 text-xs text-[#6B778C]">
                <span className="flex items-center gap-1">
                  <FiArrowUp className="w-3 h-3" />
                  <FiArrowDown className="w-3 h-3" />
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <FiCornerDownLeft className="w-3 h-3" />
                  Execute
                </span>
                <span>esc to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default GlobalCommandPalette
