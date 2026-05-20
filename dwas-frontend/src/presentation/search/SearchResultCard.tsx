import type { SearchResult } from '../../core/types/command'
import { FiFileText, FiMessageSquare, FiTruck, FiUser, FiPackage, FiCalendar, FiMapPin } from 'react-icons/fi'

interface SearchResultCardProps {
  result: SearchResult
  onClick: () => void
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  queue_item: FiMessageSquare,
  thread: FiFileText,
  document: FiPackage,
  vendor: FiUser,
  driver: FiTruck,
  dispatch: FiCalendar,
  user: FiUser,
  event: FiCalendar,
}

const priorityColors: Record<string, string> = {
  low: 'text-[#6B778C]',
  normal: 'text-[#44546F]',
  high: 'text-[#FFAB00]',
  critical: 'text-[#DE350B]',
}

const statusColors: Record<string, string> = {
  open: 'text-[#0052CC]',
  in_progress: 'text-[#00B8D9]',
  resolved: 'text-[#36B37E]',
  closed: 'text-[#6B778C]',
  escalated: 'text-[#DE350B]',
}

function SearchResultCard({ result, onClick }: SearchResultCardProps) {
  const Icon = typeIcons[result.type] || FiFileText

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[#EBECF0] transition-colors group"
    >
      <div className="mt-0.5">
        <Icon className="w-4 h-4 text-[#44546F] group-hover:text-[#0052CC] transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#172B4D] truncate">{result.title}</span>
          {result.priority && (
            <span className={`text-[10px] font-medium ${priorityColors[result.priority] || 'text-[#6B778C]'}`}>
              {result.priority}
            </span>
          )}
          {result.status && (
            <span className={`text-[10px] font-medium ${statusColors[result.status] || 'text-[#6B778C]'}`}>
              {result.status}
            </span>
          )}
        </div>

        {result.subtitle && <div className="text-[10px] text-[#6B778C] mt-0.5">{result.subtitle}</div>}

        {result.metadata && Object.keys(result.metadata).length > 0 && (
          <div className="flex items-center gap-3 mt-1.5">
            {result.metadata.material && (
              <span className="text-[10px] text-[#44546F]">
                <FiPackage className="w-2.5 h-2.5 inline mr-0.5" />
                {result.metadata.material}
              </span>
            )}
            {result.metadata.destination && (
              <span className="text-[10px] text-[#44546F]">
                <FiMapPin className="w-2.5 h-2.5 inline mr-0.5" />
                {result.metadata.destination}
              </span>
            )}
            {result.metadata.weight && (
              <span className="text-[10px] text-[#44546F]">{result.metadata.weight} MT</span>
            )}
            {result.metadata.messages !== undefined && (
              <span className="text-[10px] text-[#44546F]">{result.metadata.messages} messages</span>
            )}
            {result.metadata.participants !== undefined && (
              <span className="text-[10px] text-[#44546F]">{result.metadata.participants} participants</span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

export default SearchResultCard
