import { useState, useEffect } from 'react'
import { FiDownload, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWAStore } from '../stores/commandStore'

function PWAInstallPrompt() {
  const { state, setInstalled } = usePWAStore()
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = e as BeforeInstallPromptEvent
      prompt.preventDefault()
      setDeferredPrompt(prompt)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setInstalled(true)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  return (
    <AnimatePresence>
      {showPrompt && !state.isInstalled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50 bg-[#FFFFFF] border border-[#DFE1E6] rounded-lg shadow-2xl p-4 max-w-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#0052CC]/20 rounded">
                <FiDownload className="w-4 h-4 text-[#0052CC]" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-[#172B4D]">Install DWAS</h4>
                <p className="text-[10px] text-[#6B778C] mt-0.5">
                  Install for offline access and faster loading
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-[#6B778C] hover:text-[#44546F] transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-3">
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1.5 text-xs text-[#6B778C] hover:text-[#44546F] transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 text-xs font-medium bg-[#0052CC] text-white rounded hover:bg-[#0747A6] transition-colors"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default PWAInstallPrompt
