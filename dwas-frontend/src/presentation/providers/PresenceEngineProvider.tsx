import { memo } from 'react'

export const PresenceEngineProvider = memo(function PresenceEngineProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
})
