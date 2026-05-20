import { useEffect } from 'react'

interface ShortcutDefinition {
  key: string
  modifiers?: ('ctrl' | 'meta' | 'shift' | 'alt')[]
  handler: () => void
  preventDefault?: boolean
  enabled?: boolean
}

const shortcuts: ShortcutDefinition[] = [
  { key: 'k', modifiers: ['ctrl'], handler: () => {}, preventDefault: true },
  { key: 'b', modifiers: ['ctrl'], handler: () => {}, preventDefault: true },
  { key: '\\', modifiers: ['ctrl'], handler: () => {}, preventDefault: true },
  { key: 'j', modifiers: ['ctrl'], handler: () => {}, preventDefault: true },
  { key: 'n', handler: () => {} },
  { key: 'r', handler: () => {} },
  { key: 'Escape', handler: () => {} },
  { key: 'ArrowUp', handler: () => {}, preventDefault: true },
  { key: 'ArrowDown', handler: () => {}, preventDefault: true },
  { key: 'Enter', handler: () => {}, preventDefault: true },
]

function KeyboardShortcutRegistry() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key

      const shortcut = shortcuts.find((s) => {
        const sModifiers = s.modifiers || []
        const sKey = s.key
        const matchModifiers =
          sModifiers.length === 0
            ? !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
            : sModifiers.every((m) => {
                if (m === 'ctrl') return e.ctrlKey
                if (m === 'meta') return e.metaKey
                if (m === 'shift') return e.shiftKey
                if (m === 'alt') return e.altKey
                return false
              })
        return sKey === key && matchModifiers
      })

      if (shortcut) {
        if (shortcut.preventDefault) e.preventDefault()
        shortcut.handler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null
}

export function registerShortcut(definition: ShortcutDefinition) {
  shortcuts.push(definition)
}

export function unregisterShortcut(key: string, modifiers?: string[]) {
  const idx = shortcuts.findIndex((s) => s.key === key && JSON.stringify(s.modifiers) === JSON.stringify(modifiers))
  if (idx !== -1) shortcuts.splice(idx, 1)
}

export default KeyboardShortcutRegistry
