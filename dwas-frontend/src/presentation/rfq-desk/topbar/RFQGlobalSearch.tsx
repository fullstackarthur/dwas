import { memo, useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { FiSearch, FiX } from 'react-icons/fi'
import { useRFQDeskStore } from '../../stores'
import { motion, AnimatePresence } from 'framer-motion'

export const RFQGlobalSearch = memo(function RFQGlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { rfqs, selectRfq } = useRFQDeskStore()

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const results = query.length > 0
    ? rfqs
        .filter(
          (r) =>
            r.rfqNumber.toLowerCase().includes(query.toLowerCase()) ||
            r.clientName.toLowerCase().includes(query.toLowerCase()) ||
            r.items.some((i) => i.materialDescription.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 6)
    : []

  const handleSelect = (rfqId: string) => {
    selectRfq(rfqId)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative">
      <div
        className={clsx(
          'flex items-center gap-2 h-8 rounded-md border transition-colors duration-120 bg-bg-tertiary',
          open ? 'w-80 border-active-blue' : 'w-56 border-border-panel'
        )}
      >
        <FiSearch className="w-4 h-4 text-text-muted ml-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search RFQs..."
          className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 text-text-muted hover:text-text-primary"
          >
            <FiX className="w-3 h-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 mt-1 w-96 bg-bg-secondary border border-border-panel rounded-md shadow-lg z-20 overflow-hidden"
            >
              <div className="p-2">
                {results.map((rfq) => (
                  <button
                    key={rfq.id}
                    onClick={() => handleSelect(rfq.id)}
                    className="w-full flex items-start gap-3 p-2 rounded hover:bg-hover-surface text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-text-primary">
                          {rfq.rfqNumber}
                        </span>
                        <span
                          className={clsx(
                            'text-[10px] px-1.5 py-0.5 rounded',
                            rfq.priority === 'critical' && 'bg-error-red/15 text-error-red',
                            rfq.priority === 'high' && 'bg-warning-yellow/15 text-warning-yellow',
                            rfq.priority === 'medium' && 'bg-active-blue/15 text-active-blue',
                            rfq.priority === 'low' && 'bg-text-muted/15 text-text-muted'
                          )}
                        >
                          {rfq.priority}
                        </span>
                      </div>
                      <div className="text-[12px] text-text-secondary truncate">
                        {rfq.clientName}
                      </div>
                      <div className="text-[11px] text-text-muted truncate">
                        {rfq.items.map((i) => i.materialDescription).join(', ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})