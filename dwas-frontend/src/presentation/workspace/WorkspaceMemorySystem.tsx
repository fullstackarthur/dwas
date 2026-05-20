import { useEffect, useRef } from 'react'

interface WorkspaceMemorySystemProps {
  key: string
  value: unknown
}

function WorkspaceMemorySystem({ key: storageKey, value }: WorkspaceMemorySystemProps) {
  const savedRef = useRef<string>('')

  useEffect(() => {
    const serialized = JSON.stringify(value)
    if (serialized !== savedRef.current) {
      savedRef.current = serialized
      try {
        localStorage.setItem(`dwas-workspace-${storageKey}`, serialized)
      } catch {
        // Storage full or unavailable
      }
    }
  }, [storageKey, value])

  return null
}

export function loadWorkspaceState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`dwas-workspace-${key}`)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

export function clearWorkspaceState(key: string) {
  localStorage.removeItem(`dwas-workspace-${key}`)
}

export function clearAllWorkspaceState() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith('dwas-workspace-'))
  keys.forEach((k) => localStorage.removeItem(k))
}

export default WorkspaceMemorySystem
