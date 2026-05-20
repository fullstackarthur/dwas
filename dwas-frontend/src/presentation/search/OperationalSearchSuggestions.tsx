import { FiTrendingUp, FiClock, FiHash } from 'react-icons/fi'

interface OperationalSearchSuggestionsProps {
  onSelect: (query: string) => void
}

const recentSearches = ['RFQ-2024-0892', 'Tally mismatch', 'Vendor approval pending', 'Dispatch delay']
const popularSearches = ['Open escalations', 'Pending approvals', 'Delayed dispatches', 'Tally sync issues']
const quickQueries = ['queue:vendor status:open', 'priority:critical', 'type:dispatch status:delayed', 'assignee:rajesh']

function OperationalSearchSuggestions({ onSelect }: OperationalSearchSuggestionsProps) {
  return (
    <div className="px-4 py-4">
      <div className="mb-4">
        <h4 className="flex items-center gap-1.5 text-xs font-medium text-[#44546F] mb-2">
          <FiClock className="w-3 h-3" />
          Recent Searches
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {recentSearches.map((search) => (
            <button
              key={search}
              onClick={() => onSelect(search)}
              className="px-2 py-1 text-xs bg-[#FAFBFC] border border-[#DFE1E6] rounded text-[#44546F] hover:text-[#172B4D] hover:border-[#0052CC] transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="flex items-center gap-1.5 text-xs font-medium text-[#44546F] mb-2">
          <FiTrendingUp className="w-3 h-3" />
          Popular Searches
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {popularSearches.map((search) => (
            <button
              key={search}
              onClick={() => onSelect(search)}
              className="px-2 py-1 text-xs bg-[#FAFBFC] border border-[#DFE1E6] rounded text-[#44546F] hover:text-[#172B4D] hover:border-[#0052CC] transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="flex items-center gap-1.5 text-xs font-medium text-[#44546F] mb-2">
          <FiHash className="w-3 h-3" />
          Quick Queries
        </h4>
        <div className="space-y-1">
          {quickQueries.map((query) => (
            <button
              key={query}
              onClick={() => onSelect(query)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#EBECF0] rounded transition-colors"
            >
              <span className="font-mono text-[10px] text-[#0052CC]">{query}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OperationalSearchSuggestions
