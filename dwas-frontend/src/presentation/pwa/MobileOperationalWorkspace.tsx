import { useState } from 'react'
import { FiMenu, FiX, FiSearch, FiBell, FiUser } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useCommandStore, useSearchStore } from '../stores/commandStore'

interface MobileOperationalWorkspaceProps {
  children: React.ReactNode
  sidebar: React.ReactNode
}

function MobileOperationalWorkspace({ children, sidebar }: MobileOperationalWorkspaceProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { open: openCommand } = useCommandStore()
  const { open: openSearch } = useSearchStore()

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      <header className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-[#DFE1E6]">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 hover:bg-[#EBECF0] rounded text-[#44546F]"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <span className="text-sm font-semibold text-[#172B4D]">DWAS</span>

        <div className="flex items-center gap-2">
          <button onClick={openSearch} className="p-2 hover:bg-[#EBECF0] rounded text-[#44546F]">
            <FiSearch className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#EBECF0] rounded text-[#44546F] relative">
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#DE350B] rounded-full" />
          </button>
          <button className="p-2 hover:bg-[#EBECF0] rounded text-[#44546F]">
            <FiUser className="w-5 h-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 bg-[#FFFFFF] border-r border-[#DFE1E6]"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#DFE1E6]">
                <span className="text-sm font-semibold text-[#172B4D]">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-[#EBECF0] rounded text-[#6B778C]"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100%-49px)]">{sidebar}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-auto">{children}</main>

      <nav className="flex items-center justify-around px-4 py-2 bg-[#FFFFFF] border-t border-[#DFE1E6]">
        <button onClick={openCommand} className="flex flex-col items-center gap-1 text-[#6B778C] hover:text-[#44546F]">
          <FiSearch className="w-5 h-5" />
          <span className="text-[10px]">Search</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B778C] hover:text-[#44546F]">
          <FiBell className="w-5 h-5" />
          <span className="text-[10px]">Alerts</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B778C] hover:text-[#44546F]">
          <FiUser className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  )
}

export default MobileOperationalWorkspace
