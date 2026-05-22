import { memo, useRef, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { FiSearch, FiX } from 'react-icons/fi'
import { useRFQDeskStore } from '../../stores'

export const RFQGlobalSearch = memo(function RFQGlobalSearch() {
  const inputRef = useRef<HTMLInputElement>(null)
  const filters = useRFQDeskStore((s) => s.filters)
  const setFilters = useRFQDeskStore((s) => s.setFilters)
  const clearFilters = useRFQDeskStore((s) => s.clearFilters)
  const rfqs = useRFQDeskStore((s) => s.rfqs)

  const query = filters.searchQuery ?? ''
  const isActive = query.length > 0

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ searchQuery: e.target.value })
    },
    [setFilters]
  )

  const handleClear = useCallback(() => {
    setFilters({ searchQuery: '' })
    inputRef.current?.focus()
  }, [setFilters])

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClear()
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClear])

  // Count matching results for feedback
  const matchCount = isActive
    ? rfqs.filter((r) => {
        const q = query.toLowerCase()
        return (
          r.rfqNumber.toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.deliveryLocation.toLowerCase().includes(q) ||
          r.items.some((i) => i.materialDescription.toLowerCase().includes(q))
        )
      }).length
    : rfqs.length

  return (
    <div className="relative flex items-center gap-2">
      <div
        className={clsx(
          'flex items-center gap-2 h-8 rounded-md border transition-all duration-150 bg-bg-tertiary',
          isActive
            ? 'w-72 border-active-blue shadow-[0_0_0_2px_rgba(0,82,204,0.12)]'
            : 'w-56 border-border-panel hover:border-text-muted'
        )}
      >
        <FiSearch className={clsx('w-3.5 h-3.5 ml-2.5 flex-shrink-0 transition-colors', isActive ? 'text-active-blue' : 'text-text-muted')} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search RFQs…"
          className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted outline-none min-w-0"
        />
        {isActive ? (
          <div className="flex items-center gap-1.5 pr-1.5">
            <span className="text-[10px] text-text-muted tabular-nums whitespace-nowrap">
              {matchCount} result{matchCount !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleClear}
              className="p-0.5 rounded text-text-muted hover:text-text-primary hover:bg-hover-surface transition-colors"
              title="Clear search (Esc)"
            >
              <FiX className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-[10px] text-text-muted mr-2 border border-border-panel rounded px-1 hidden sm:inline-block">
            /
          </span>
        )}
      </div>
    </div>
  )
})