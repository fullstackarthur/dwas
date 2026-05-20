import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiX, FiFilter } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchStore } from '../stores/commandStore'
import SearchResultPanel from './SearchResultPanel'
import SearchFilterToolbar from './SearchFilterToolbar'
import OperationalSearchSuggestions from './OperationalSearchSuggestions'

function GlobalOperationalSearch() {
  const { isOpen, close, query, setQuery, search, results, loading, filters, setFilters, clearResults } = useSearchStore()
  const [showFilters, setShowFilters] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        useSearchStore.getState().open()
      }
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      search(value)
    } else {
      clearResults()
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
            className="fixed inset-0 bg-black/60 z-50"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-16 -translate-x-1/2 w-full max-w-3xl z-50 rounded-lg border border-[#DFE1E6] bg-[#FFFFFF] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DFE1E6]">
              <FiSearch className="w-4 h-4 text-[#6B778C]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search threads, documents, vendors, drivers, dispatches..."
                className="flex-1 bg-transparent text-[#172B4D] text-sm outline-none placeholder:text-[#6B778C]"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded transition-colors ${showFilters ? 'bg-[#DEEBFF] text-[#0052CC]' : 'text-[#6B778C] hover:text-[#44546F]'}`}
              >
                <FiFilter className="w-4 h-4" />
              </button>
              <button onClick={close} className="text-[#6B778C] hover:text-[#172B4D] transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[#DFE1E6] bg-[#FAFBFC]">
                    <SearchFilterToolbar filters={filters} onChange={setFilters} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-h-[28rem] overflow-y-auto">
              {!query && !results.length ? (
                <OperationalSearchSuggestions onSelect={(q) => handleSearch(q)} />
              ) : loading ? (
                <div className="px-4 py-8 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#6B778C] mt-2">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <SearchResultPanel results={results} onClose={close} />
              ) : query ? (
                <div className="px-4 py-8 text-center text-sm text-[#6B778C]">No results found for "{query}"</div>
              ) : null}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-[#DFE1E6] bg-[#FAFBFC]">
              <div className="flex items-center gap-4 text-xs text-[#6B778C]">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
              <div className="text-xs text-[#6B778C]">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default GlobalOperationalSearch
