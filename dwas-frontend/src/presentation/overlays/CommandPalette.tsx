import { memo, useEffect, useRef, useState } from 'react'
import { useUIStore } from '../stores'
import { FiSearch, FiArrowRight, FiClock, FiHash } from 'react-icons/fi'
import clsx from 'clsx'

interface CommandItem {
  id: string
  label: string
  section: string
  action: () => void
  icon?: React.ComponentType<{ className?: string }>
  shortcut?: string
}

const commands: CommandItem[] = [
  { id: 'c1', label: 'Go to Dashboard', section: 'Navigation', action: () => {}, icon: FiHash, shortcut: 'G D' },
  { id: 'c2', label: 'Go to Inbox', section: 'Navigation', action: () => {}, icon: FiHash, shortcut: 'G I' },
  { id: 'c3', label: 'Go to Dispatch Queue', section: 'Navigation', action: () => {}, icon: FiHash, shortcut: 'G Q' },
  { id: 'c4', label: 'Go to Procurement Queue', section: 'Navigation', action: () => {}, icon: FiHash },
  { id: 'c5', label: 'Go to Logistics Queue', section: 'Navigation', action: () => {}, icon: FiHash },
  { id: 'c6', label: 'Create new thread', section: 'Actions', action: () => {}, shortcut: 'N' },
  { id: 'c7', label: 'Refresh all queues', section: 'Actions', action: () => {}, shortcut: 'R' },
  { id: 'c8', label: 'Mark all notifications read', section: 'Actions', action: () => {}, shortcut: 'M A' },
  { id: 'c9', label: 'Toggle sidebar', section: 'View', action: () => {}, shortcut: 'Ctrl+B' },
  { id: 'c10', label: 'Toggle right panel', section: 'View', action: () => {}, shortcut: 'Ctrl+\\' },
  { id: 'c11', label: 'Open AI Assistant', section: 'AI', action: () => {}, icon: FiClock, shortcut: 'Ctrl+J' },
  { id: 'c12', label: 'Run AI review on selected', section: 'AI', action: () => {}, icon: FiClock },
]

function CommandRow({
  command,
  active,
  onClick,
}: {
  command: CommandItem
  active: boolean
  onClick: () => void
}) {
  const Icon = command.icon

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors duration-120',
        active ? 'bg-selected-surface text-text-primary' : 'text-text-secondary hover:bg-hover-surface'
      )}
    >
      {Icon && <Icon className="w-4 h-4 text-text-muted flex-shrink-0" />}
      {!Icon && <FiArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />}
      <span className="flex-1 text-left">{command.label}</span>
      {command.shortcut && (
        <kbd className="text-[10px] bg-bg-primary px-1.5 py-0.5 rounded border border-border-panel text-text-muted">
          {command.shortcut}
        </kbd>
      )}
    </button>
  )
}

export const CommandPalette = memo(function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useUIStore()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.section]) acc[cmd.section] = []
    acc[cmd.section].push(cmd)
    return acc
  }, {})

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    if (!commandPaletteOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCommandPalette()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault()
        filtered[activeIndex].action()
        closeCommandPalette()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [commandPaletteOpen, filtered, activeIndex, closeCommandPalette])

  if (!commandPaletteOpen) return null

  let flatIndex = 0

  return (
    <div
      className="fixed inset-0 z-commandPalette flex items-start justify-center pt-[20vh]"
      onClick={closeCommandPalette}
    >
      <div className="fixed inset-0 bg-bg-primary/70" />
      <div
        className="relative w-[560px] max-h-[400px] bg-bg-secondary border border-border-panel rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 border-b border-divider">
          <FiSearch className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            placeholder="Type a command or search..."
            className="flex-1 py-3 bg-transparent text-[14px] text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {Object.entries(grouped).map(([section, cmds]) => (
            <div key={section}>
              <div className="px-3 py-1.5 text-[11px] font-medium text-text-muted uppercase tracking-wide">
                {section}
              </div>
              {cmds.map((cmd) => {
                const current = flatIndex
                flatIndex++
                return (
                  <CommandRow
                    key={cmd.id}
                    command={cmd}
                    active={current === activeIndex}
                    onClick={() => {
                      cmd.action()
                      closeCommandPalette()
                    }}
                  />
                )
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center">
              <div className="text-[13px] text-text-muted">No commands found</div>
            </div>
          )}
        </div>

        <div className="px-3 py-2 border-t border-divider flex items-center gap-3 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <kbd className="bg-bg-tertiary px-1 rounded border border-border-panel">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-bg-tertiary px-1 rounded border border-border-panel">↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-bg-tertiary px-1 rounded border border-border-panel">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
})
