import { useState, useEffect } from 'react'
import { FiWifi, FiWifiOff, FiRefreshCw } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWAStore } from '../stores/commandStore'

function ReconnectStatusIndicator() {
  const { state } = usePWAStore()
  const [showReconnecting, setShowReconnecting] = useState(false)
  const [lastOffline, setLastOffline] = useState<Date | null>(null)

  useEffect(() => {
    const handleOffline = () => {
      setLastOffline(new Date())
      setShowReconnecting(false)
    }

    const handleOnline = () => {
      setShowReconnecting(true)
      setTimeout(() => setShowReconnecting(false), 2000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {showReconnecting && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1.5 px-2 py-1 bg-[#36B37E]/20 rounded text-xs text-[#36B37E]"
          >
            <FiRefreshCw className="w-3 h-3 animate-spin" />
            Reconnected
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
        state.isOnline
          ? 'bg-[#36B37E]/10 text-[#36B37E]'
          : 'bg-[#DE350B]/10 text-[#DE350B]'
      }`}>
        {state.isOnline ? <FiWifi className="w-3 h-3" /> : <FiWifiOff className="w-3 h-3" />}
        <span className="hidden sm:inline">{state.isOnline ? 'Online' : 'Offline'}</span>
      </div>

      {lastOffline && !state.isOnline && (
        <span className="text-[10px] text-[#6B778C] hidden sm:inline">
          Since {lastOffline.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}

export default ReconnectStatusIndicator
