import { useState, useEffect } from 'react'
import { FiWifiOff, FiAlertTriangle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWAStore } from '../stores/commandStore'

function OfflineStatusBanner() {
  const { state, offlineQueue } = usePWAStore()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleOnline = () => usePWAStore.getState().setOnline(true)
    const handleOffline = () => usePWAStore.getState().setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    setDismissed(false)
  }, [state.isOnline])

  return (
    <AnimatePresence>
      {(!state.isOnline || offlineQueue.length > 0) && !dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`overflow-hidden ${
            !state.isOnline ? 'bg-[#DE350B]/20 border-[#DE350B]/40' : 'bg-[#FFAB00]/20 border-[#FFAB00]/40'
          } border-b`}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              {!state.isOnline ? (
                <>
                  <FiWifiOff className="w-4 h-4 text-[#DE350B]" />
                  <span className="text-xs text-[#DE350B]">
                    You are offline. Changes will sync when connection is restored.
                  </span>
                </>
              ) : (
                <>
                  <FiAlertTriangle className="w-4 h-4 text-[#FFAB00]" />
                  <span className="text-xs text-[#FFAB00]">
                    {offlineQueue.length} pending sync{offlineQueue.length !== 1 ? 's' : ''}
                  </span>
                </>
              )}
            </div>
            <button onClick={() => setDismissed(true)} className="text-xs text-[#6B778C] hover:text-[#44546F] transition-colors">
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineStatusBanner
