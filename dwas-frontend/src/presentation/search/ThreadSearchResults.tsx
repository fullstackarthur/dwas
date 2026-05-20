import type { SearchResult } from '../../core/types/command'

interface ThreadSearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

function ThreadSearchResults({ results, onClose }: ThreadSearchResultsProps) {
  return (
    <div className="space-y-0">
      {results.map((result) => (
        <div key={result.id} className="px-3 py-2 hover:bg-[#EBECF0] transition-colors">
          <button onClick={onClose} className="w-full text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#172B4D]">{result.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#FAFBFC] rounded text-[#6B778C]">{result.subtitle}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              {result.metadata?.messages && (
                <span className="text-[10px] text-[#6B778C]">{result.metadata.messages} messages</span>
              )}
              {result.metadata?.participants && (
                <span className="text-[10px] text-[#6B778C]">{result.metadata.participants} participants</span>
              )}
              {result.status && (
                <span
                  className={`text-[10px] font-medium ${
                    result.status === 'open'
                      ? 'text-[#0052CC]'
                      : result.status === 'resolved'
                        ? 'text-[#36B37E]'
                        : 'text-[#6B778C]'
                  }`}
                >
                  {result.status}
                </span>
              )}
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}

export default ThreadSearchResults
