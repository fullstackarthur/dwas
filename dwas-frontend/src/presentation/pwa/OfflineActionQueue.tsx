import { FiPlus, FiEdit, FiCheck, FiSend } from 'react-icons/fi'
import { usePWAStore } from '../stores/commandStore'

interface OfflineActionQueueProps {
  className?: string
}

function OfflineActionQueue({ className }: OfflineActionQueueProps) {
  const { offlineQueue, addToOfflineQueue, state } = usePWAStore()

  const quickActions = [
    { id: 'note', label: 'Add Note', icon: FiPlus, type: 'note' },
    { id: 'status', label: 'Update Status', icon: FiEdit, type: 'status_update' },
    { id: 'approve', label: 'Approve', icon: FiCheck, type: 'approval' },
    { id: 'submit', label: 'Submit', icon: FiSend, type: 'submission' },
  ]

  return (
    <div className={`bg-[#FFFFFF] border border-[#DFE1E6] rounded-lg p-4 ${className || ''}`}>
      <h3 className="text-sm font-semibold text-[#172B4D] mb-3">Offline Actions</h3>

      {!state.isOnline && (
        <div className="mb-3 px-3 py-2 bg-[#DE350B]/10 border border-[#DE350B]/30 rounded text-xs text-[#DE350B]">
          Actions will be queued and synced when online
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() =>
              addToOfflineQueue({
                type: action.type,
                payload: { action: action.id, timestamp: Date.now() },
              })
            }
            className="flex items-center gap-2 px-3 py-2 bg-[#FAFBFC] hover:bg-[#EBECF0] rounded text-xs text-[#44546F] hover:text-[#172B4D] transition-colors"
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        ))}
      </div>

      {offlineQueue.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] text-[#6B778C] uppercase tracking-wider mb-1">Queued Actions</div>
          {offlineQueue.slice(-3).map((item) => (
            <div key={item.id} className="flex items-center gap-2 px-2 py-1.5 bg-[#FAFBFC] rounded text-[10px] text-[#44546F]">
              <div className={`w-1.5 h-1.5 rounded-full ${
                item.status === 'pending' ? 'bg-[#FFAB00]' :
                item.status === 'syncing' ? 'bg-[#0052CC]' :
                item.status === 'synced' ? 'bg-[#36B37E]' : 'bg-[#DE350B]'
              }`} />
              <span className="truncate">{item.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OfflineActionQueue
