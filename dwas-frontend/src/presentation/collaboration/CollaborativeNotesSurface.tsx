import { memo, useState } from 'react'
import { useThreadDataStore } from '../stores/threadStore'
import { useAppStore } from '../stores'
import { FiLock, FiTag, FiPlus } from 'react-icons/fi'
import clsx from 'clsx'

export const CollaborativeNotesSurface = memo(function CollaborativeNotesSurface() {
  const { operationalNotes, addOperationalNote } = useThreadDataStore()
  const { currentUser } = useAppStore()
  const [newNote, setNewNote] = useState('')
  const [isInternal, setIsInternal] = useState(false)

  const handleSubmit = () => {
    if (!newNote.trim()) return
    addOperationalNote({
      id: `on-${Date.now()}`,
      content: newNote.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      isInternal,
    })
    setNewNote('')
    setIsInternal(false)
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="p-4">
      <h2 className="text-[14px] font-semibold text-text-primary mb-3">Collaborative Notes</h2>

      <div className="mb-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note visible to all team members..."
          className="w-full bg-bg-tertiary border border-border-panel rounded-md px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted outline-none focus:border-active-blue transition-colors duration-120 resize-none h-16"
        />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-1.5 text-[11px] text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded border-border-panel bg-bg-tertiary"
            />
            <FiLock className="w-3 h-3" />
            Internal
          </label>
          <button
            onClick={handleSubmit}
            disabled={!newNote.trim()}
            className="flex items-center gap-1 px-2 py-1 text-[11px] bg-active-blue text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-active-blue/90 transition-colors duration-120"
          >
            <FiPlus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {operationalNotes.map((note) => (
          <div key={note.id} className={clsx('border border-border-panel rounded-md p-3', note.isInternal && 'bg-warning-yellow/5 border-warning-yellow/20')}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] font-medium text-text-primary">{note.author.name}</span>
              {note.isInternal && (
                <span className="flex items-center gap-1 text-[10px] text-warning-yellow">
                  <FiLock className="w-3 h-3" />
                  Internal
                </span>
              )}
              <span className="text-[10px] text-text-muted">{timeAgo(note.createdAt)}</span>
            </div>
            <div className="text-[12px] text-text-secondary leading-snug">{note.content}</div>
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {note.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-bg-tertiary text-text-muted px-1.5 py-0.5 rounded border border-border-panel flex items-center gap-1">
                    <FiTag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})
