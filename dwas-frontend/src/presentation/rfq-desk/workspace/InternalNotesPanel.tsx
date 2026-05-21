import { memo, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'

interface InternalNotesPanelProps {
  rfq: { id: string; notes?: string }
}

export const InternalNotesPanel = memo(function InternalNotesPanel({ rfq }: InternalNotesPanelProps) {
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(rfq.notes || '')

  return (
    <div className="border border-border-panel rounded">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[12px] font-medium text-text-primary">Internal Notes</span>
        <button
          onClick={() => setEditing(!editing)}
          className="p-1 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded transition-colors duration-120"
        >
          <FiEdit2 className="w-3 h-3" />
        </button>
      </div>
      <div className="px-3 pb-3">
        {editing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes..."
            className="w-full h-20 text-[12px] bg-bg-tertiary border border-border-panel rounded px-2 py-1.5 resize-none focus:border-active-blue outline-none transition-colors duration-120"
          />
        ) : (
          <div className="text-[12px] text-text-muted min-h-[40px]">
            {notes || 'No notes added'}
          </div>
        )}
      </div>
    </div>
  )
})