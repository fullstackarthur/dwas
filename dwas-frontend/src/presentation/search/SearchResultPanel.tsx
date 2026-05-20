import type { SearchResult } from '../../core/types/command'
import SearchResultCard from './SearchResultCard'
import ThreadSearchResults from './ThreadSearchResults'
import DocumentSearchResults from './DocumentSearchResults'
import VendorSearchResults from './VendorSearchResults'
import DispatchSearchResults from './DispatchSearchResults'
import DriverSearchResults from './DriverSearchResults'

interface SearchResultPanelProps {
  results: SearchResult[]
  onClose: () => void
}

function SearchResultPanel({ results, onClose }: SearchResultPanelProps) {
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, result) => {
    if (!acc[result.type]) acc[result.type] = []
    acc[result.type].push(result)
    return acc
  }, {})

  const sectionLabels: Record<string, string> = {
    queue_item: 'Queue Items',
    thread: 'Threads',
    document: 'Documents',
    vendor: 'Vendors',
    driver: 'Drivers',
    dispatch: 'Dispatches',
    user: 'Users',
    event: 'Events',
  }

  return (
    <div className="py-2">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="mb-2">
          <div className="px-4 py-1.5 text-xs font-medium text-[#6B778C] uppercase tracking-wider">
            {sectionLabels[type] || type}
            <span className="ml-2 text-[10px] text-[#0052CC]">{items.length}</span>
          </div>

          {type === 'thread' && <ThreadSearchResults results={items} onClose={onClose} />}
          {type === 'document' && <DocumentSearchResults results={items} onClose={onClose} />}
          {type === 'vendor' && <VendorSearchResults results={items} onClose={onClose} />}
          {type === 'dispatch' && <DispatchSearchResults results={items} onClose={onClose} />}
          {type === 'driver' && <DriverSearchResults results={items} onClose={onClose} />}
          {type === 'queue_item' &&
            items.map((result) => (
              <SearchResultCard key={result.id} result={result} onClick={onClose} />
            ))}
          {type === 'user' &&
            items.map((result) => (
              <SearchResultCard key={result.id} result={result} onClick={onClose} />
            ))}
          {type === 'event' &&
            items.map((result) => (
              <SearchResultCard key={result.id} result={result} onClick={onClose} />
            ))}
        </div>
      ))}
    </div>
  )
}

export default SearchResultPanel
