import type { SearchResult } from '../../core/types/command'
import { FiTruck, FiMapPin } from 'react-icons/fi'

interface DriverSearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

function DriverSearchResults({ results, onClose }: DriverSearchResultsProps) {
  return (
    <div className="space-y-0">
      {results.map((result) => (
        <button
          key={result.id}
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#EBECF0] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#DEEBFF] flex items-center justify-center text-[10px] font-medium text-[#44546F]">
            {result.title
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#172B4D] truncate">{result.title}</div>
            <div className="flex items-center gap-3 mt-0.5">
              {result.subtitle && (
                <span className="text-[10px] text-[#6B778C] flex items-center gap-0.5">
                  <FiTruck className="w-2.5 h-2.5" />
                  {result.subtitle}
                </span>
              )}
              {result.metadata?.route && (
                <span className="text-[10px] text-[#6B778C] flex items-center gap-0.5">
                  <FiMapPin className="w-2.5 h-2.5" />
                  {result.metadata.route}
                </span>
              )}
            </div>
          </div>
          {result.status && (
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                result.status === 'active'
                  ? 'bg-[#36B37E]/20 text-[#36B37E]'
                  : result.status === 'on_route'
                    ? 'bg-[#0052CC]/20 text-[#0052CC]'
                    : result.status === 'idle'
                      ? 'bg-[#FFAB00]/20 text-[#FFAB00]'
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

export default DriverSearchResults
