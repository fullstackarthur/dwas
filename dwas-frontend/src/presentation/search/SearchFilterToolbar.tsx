import type { SearchFilter } from '../../core/types/command'

interface SearchFilterToolbarProps {
  filters: SearchFilter
  onChange: (filters: Partial<SearchFilter>) => void
}

const queueTypes = ['vendor', 'approval', 'procurement', 'dispatch', 'logistics', 'escalation']
const statuses = ['open', 'in_progress', 'resolved', 'closed', 'escalated']
const priorities = ['low', 'normal', 'high', 'critical']

function SearchFilterToolbar({ filters, onChange }: SearchFilterToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-[#6B778C] uppercase tracking-wider mb-1">Queue Type</label>
          <select
            value={filters.queueType || ''}
            onChange={(e) => onChange({ queueType: e.target.value || undefined })}
            className="w-full bg-[#FFFFFF] border border-[#DFE1E6] rounded px-2 py-1.5 text-xs text-[#172B4D] outline-none focus:border-[#0052CC]"
          >
            <option value="">All queues</option>
            {queueTypes.map((q) => (
              <option key={q} value={q}>
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-[#6B778C] uppercase tracking-wider mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onChange({ status: e.target.value || undefined })}
            className="w-full bg-[#FFFFFF] border border-[#DFE1E6] rounded px-2 py-1.5 text-xs text-[#172B4D] outline-none focus:border-[#0052CC]"
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-medium text-[#6B778C] uppercase tracking-wider mb-1">Priority</label>
          <select
            value={filters.priority || ''}
            onChange={(e) => onChange({ priority: e.target.value || undefined })}
            className="w-full bg-[#FFFFFF] border border-[#DFE1E6] rounded px-2 py-1.5 text-xs text-[#172B4D] outline-none focus:border-[#0052CC]"
          >
            <option value="">All priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-[#6B778C] uppercase tracking-wider mb-1">Assignee</label>
          <input
            type="text"
            value={filters.assignee || ''}
            onChange={(e) => onChange({ assignee: e.target.value || undefined })}
            placeholder="Operator name..."
            className="w-full bg-[#FFFFFF] border border-[#DFE1E6] rounded px-2 py-1.5 text-xs text-[#172B4D] outline-none focus:border-[#0052CC] placeholder:text-[#6B778C]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onChange({ queueType: undefined, status: undefined, priority: undefined, assignee: undefined })}
          className="px-2 py-1 text-xs text-[#6B778C] hover:text-[#44546F] transition-colors"
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}

export default SearchFilterToolbar
