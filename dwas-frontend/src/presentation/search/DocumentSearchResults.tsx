import type { SearchResult } from '../../core/types/command'

interface DocumentSearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

function DocumentSearchResults({ results, onClose }: DocumentSearchResultsProps) {
  return (
    <div className="space-y-0">
      {results.map((result) => (
        <button
          key={result.id}
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#EBECF0] transition-colors"
        >
          <div className="w-8 h-8 rounded bg-[#FAFBFC] flex items-center justify-center text-[10px] font-medium text-[#44546F]">
            DOC
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#172B4D] truncate">{result.title}</div>
            <div className="text-[10px] text-[#6B778C]">{result.subtitle}</div>
          </div>
          {result.metadata?.confidence && (
            <div className="text-[10px] text-[#36B37E]">{result.metadata.confidence}% match</div>
          )}
        </button>
      ))}
    </div>
  )
}

export default DocumentSearchResults
