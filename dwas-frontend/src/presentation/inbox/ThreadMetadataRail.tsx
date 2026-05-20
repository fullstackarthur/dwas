import { memo } from 'react'
import { FiHash, FiCalendar, FiUser, FiTag, FiLink, FiClock } from 'react-icons/fi'

interface MetadataEntry {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface ThreadMetadataRailProps {
  metadata: Record<string, string | number | boolean>
  tags?: string[]
  createdAt?: string
  updatedAt?: string
  assignee?: string
  reporter?: string
  relatedId?: string
}

export const ThreadMetadataRail = memo(function ThreadMetadataRail({
  metadata,
  tags,
  createdAt,
  updatedAt,
  assignee,
  reporter,
  relatedId,
}: ThreadMetadataRailProps) {
  const entries: MetadataEntry[] = []

  if (assignee) entries.push({ label: 'Assignee', value: assignee, icon: FiUser })
  if (reporter) entries.push({ label: 'Reporter', value: reporter, icon: FiUser })
  if (createdAt) entries.push({ label: 'Created', value: new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: FiCalendar })
  if (updatedAt) entries.push({ label: 'Updated', value: new Date(updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: FiClock })
  if (relatedId) entries.push({ label: 'Related', value: relatedId, icon: FiLink })

  Object.entries(metadata).forEach(([key, value]) => {
    entries.push({ label: key, value: String(value), icon: FiTag })
  })

  if (entries.length === 0 && (!tags || tags.length === 0)) return null

  return (
    <div className="border-t border-divider">
      <div className="px-3 py-2 border-b border-divider">
        <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">Metadata</span>
      </div>
      <div className="divide-y divide-divider">
        {entries.map((entry, i) => {
          const Icon = entry.icon || FiHash
          return (
            <div key={i} className="px-3 py-1.5 flex items-center gap-2">
              <Icon className="w-3 h-3 text-text-muted flex-shrink-0" />
              <span className="text-[11px] text-text-muted w-16 flex-shrink-0">{entry.label}</span>
              <span className="text-[11px] text-text-secondary truncate">{entry.value}</span>
            </div>
          )
        })}
        {tags && tags.length > 0 && (
          <div className="px-3 py-1.5 flex items-center gap-2">
            <FiTag className="w-3 h-3 text-text-muted flex-shrink-0" />
            <span className="text-[11px] text-text-muted w-16 flex-shrink-0">Tags</span>
            <div className="flex items-center gap-1 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="text-[10px] bg-bg-tertiary text-text-muted px-1.5 py-0.5 rounded border border-border-panel">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
