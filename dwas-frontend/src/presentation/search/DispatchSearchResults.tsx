import type { SearchResult } from '../../core/types/command'
import { FiTruck, FiMapPin } from 'react-icons/fi'

interface DispatchSearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

function DispatchSearchResults({ results, onClose }: DispatchSearchResultsProps) {
  return (
    <div className="space-y-0">
      {results.map((result) => (
        <button
          key={result.id}
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#EBECF0] transition-colors"
        >
          <FiTruck className="w-4 h-4 text-[#00B8D9] mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#172B4D] truncate">{result.title}</div>
            <div className="flex items-center gap-3 mt-0.5">
              {result.metadata?.material && (
                <span className="text-[10px] text-[#6B778C]">{result.metadata.material}</span>
              )}
              {result.metadata?.weight && (
                <span className="text-[10px] text-[#6B778C]">{result.metadata.weight} MT</span>
              )}
              {result.metadata?.destination && (
                <span className="text-[10px] text-[#6B778C] flex items-center gap-0.5">
                  <FiMapPin className="w-2.5 h-2.5" />
                  {result.metadata.destination}
                </span>
              )}
            </div>
          </div>
          {result.status && (
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                result.status === 'dispatched'
                  ? 'bg-[#36B37E]/20 text-[#36B37E]'
                  : result.status === 'delayed'
                    ? 'bg-[#DE350B]/20 text-[#DE350B]'
                    : result.status === 'in_transit'
                      ? 'bg-[#0052CC]/20 text-[#0052CC]'
                      : 'bg-[#6B778C]/20 text-[#6B778C]'
              }`}
            >
              {result.status.replace('_', ' ')}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default DispatchSearchResults
