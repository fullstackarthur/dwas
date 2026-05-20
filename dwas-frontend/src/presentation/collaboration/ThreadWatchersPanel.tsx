import { memo } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { FiEye } from 'react-icons/fi'

export const ThreadWatchersPanel = memo(function ThreadWatchersPanel() {
  const { participants } = useThreadDataStore()
  const watchers = participants.filter((p) => p.role === 'observer')

  return (
    <div className="divide-y divide-divider">
      <div className="px-3 py-1.5">
        <span className="text-[11px] font-medium text-text-muted">{watchers.length} watcher{watchers.length !== 1 ? 's' : ''}</span>
      </div>
      {watchers.length === 0 ? (
        <div className="px-3 py-3 text-center">
          <FiEye className="w-4 h-4 text-text-muted mx-auto mb-1" />
          <div className="text-[11px] text-text-muted">No watchers</div>
        </div>
      ) : (
        watchers.map((p) => (
          <div key={p.user.id} className="px-3 py-2 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-selected-surface flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-medium text-text-secondary">
                {p.user.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <span className="text-[12px] text-text-secondary">{p.user.name}</span>
          </div>
        ))
      )}
    </div>
  )
})
