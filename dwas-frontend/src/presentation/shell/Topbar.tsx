import { memo } from 'react'
import { useNotificationStore } from '../stores'
import { useSearchStore } from '../stores/commandStore'
import {
  FiSearch,
  FiBell,
  FiPlus,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
  FiChevronDown,
} from 'react-icons/fi'

function SearchBar() {
  const { open: openSearch } = useSearchStore()

  return (
    <button
      onClick={openSearch}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DFE1E6] rounded-md text-text-muted hover:text-text-secondary hover:border-text-muted/40 transition-colors duration-120 flex-1 max-w-xl min-w-0"
    >
      <FiSearch className="w-4 h-4 flex-shrink-0" />
      <span className="text-[14px] truncate">Search</span>
    </button>
  )
}

function CreateButton() {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-active-blue text-white text-[14px] font-medium rounded-md hover:bg-active-blue/90 transition-colors duration-120">
      <FiPlus className="w-4 h-4" />
      <span className="hidden sm:inline">Create</span>
    </button>
  )
}

function NotificationBell() {
  const { unreadCount } = useNotificationStore()

  return (
    <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded-md transition-colors duration-120">
      <FiBell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-red rounded-full" />
      )}
    </button>
  )
}

function UserMenu() {
  return (
    <button className="flex items-center gap-2 p-1 hover:bg-hover-surface rounded-md transition-colors duration-120">
      <div className="w-7 h-7 rounded-full bg-active-blue/10 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-active-blue">AM</span>
      </div>
      <FiChevronDown className="w-3.5 h-3.5 text-text-muted" />
    </button>
  )
}

export const Topbar = memo(function Topbar() {
  return (
    <header className="h-12 bg-white border-b border-[#DFE1E6] flex items-center px-4 flex-shrink-0">
      <SearchBar />

      <div className="flex items-center gap-4 ml-6">
        <CreateButton />

        <div className="w-px h-6 bg-[#DFE1E6]" />

        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-text-secondary border border-[#DFE1E6] rounded-md hover:bg-hover-surface hover:text-text-primary transition-colors duration-120">
          <FiMessageSquare className="w-4 h-4" />
          <span className="hidden lg:inline">Chat</span>
        </button>

        <div className="w-px h-6 bg-[#DFE1E6]" />

        <div className="flex items-center gap-2">
          <NotificationBell />

          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded-md transition-colors duration-120">
            <FiHelpCircle className="w-5 h-5" />
          </button>

          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-hover-surface rounded-md transition-colors duration-120">
            <FiSettings className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-[#DFE1E6]" />

          <UserMenu />
        </div>
      </div>
    </header>
  )
})
