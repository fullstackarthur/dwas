import { memo, useEffect } from 'react'
import { websocketEngine } from '../../core/services/realtimeEngine'

export const PresenceEngineProvider = memo(function PresenceEngineProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    websocketEngine.connect()

    return () => {
      websocketEngine.disconnect()
    }
  }, [])

  return <>{children}</>
})
