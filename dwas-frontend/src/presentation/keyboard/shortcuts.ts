import { useEffect, useRef } from 'react'
import { useUIStore } from '../stores'

interface ShortcutHandler {
  key: string
  handler: (e: KeyboardEvent) => void
  preventDefault?: boolean
}

export function useKeyboardShortcuts(handlers: ShortcutHandler[]) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey

      for (const shortcut of handlersRef.current) {
        const shortcutKey = shortcut.key.toLowerCase()
        const shortcutCtrl = shortcutKey.startsWith('ctrl+')

        if (shortcutCtrl) {
          const actualKey = shortcutKey.replace('ctrl+', '')
          if (ctrl && key === actualKey) {
            if (shortcut.preventDefault !== false) e.preventDefault()
            shortcut.handler(e)
            return
          }
        } else if (!ctrl && key === shortcutKey) {
          const target = e.target as HTMLElement
          const isInput =
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.contentEditable === 'true'

          if (!isInput) {
            if (shortcut.preventDefault !== false) e.preventDefault()
            shortcut.handler(e)
            return
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}

export function KeyboardShortcutsProvider() {
  const { toggleSidebar, openCommandPalette, openSearch, closeCommandPalette, closeSearch } = useUIStore()

  useKeyboardShortcuts([
    { key: 'ctrl+b', handler: toggleSidebar },
    { key: 'ctrl+k', handler: openCommandPalette },
    { key: 'ctrl+/', handler: openSearch },
    { key: 'escape', handler: () => { closeCommandPalette(); closeSearch() } },
  ])

  return null
}
