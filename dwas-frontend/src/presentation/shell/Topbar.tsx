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
      className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white border border-[#DFE1E6] rounded-md text-text-muted hover:text-text-secondary hover:border-text-muted/40 transition-colors duration-120 w-96 flex-shrink-0"
    >
      <FiSearch className="w-4 h-4 flex-shrink-0" />
      <span className="text-[13px] truncate">Search</span>
      <span className="ml-auto text-[11px] border border-[#DFE1E6] rounded px-1.5 py-0.5 text-text-muted hidden md:inline-block">⌘K</span>
    </button>
  )
}

function CreateButton() {
  return (
    <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-active-blue text-white text-[13px] font-medium rounded-md hover:bg-active-blue/90 transition-colors duration-120 whitespace-nowrap flex-shrink-0">
      <FiPlus className="w-4 h-4" />
      <span className="hidden sm:inline">Create</span>
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-[#DFE1E6] flex-shrink-0" />
}

function IconButton({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <button
      title={title}
      className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-hover-surface rounded-md transition-colors duration-120 flex-shrink-0"
    >
      {children}
    </button>
  )
}

function NotificationBell() {
  const { unreadCount } = useNotificationStore()

  return (
    <button
      title="Notifications"
      className="relative w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-hover-surface rounded-md transition-colors duration-120 flex-shrink-0"
    >
      <FiBell className="w-4.5 h-4.5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error-red rounded-full" />
      )}
    </button>
  )
}

function ChatButton() {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-text-secondary border border-[#DFE1E6] rounded-md hover:bg-hover-surface hover:text-text-primary transition-colors duration-120 flex-shrink-0">
      <FiMessageSquare className="w-4 h-4 flex-shrink-0" />
      <span className="hidden lg:inline">Chat</span>
    </button>
  )
}

function UserMenu() {
  return (
    <button className="flex items-center gap-1.5 pl-1 pr-2 py-1 hover:bg-hover-surface rounded-md transition-colors duration-120 flex-shrink-0">
      <div className="w-7 h-7 rounded-full bg-active-blue/10 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-active-blue">AM</span>
      </div>
      <FiChevronDown className="w-3 h-3 text-text-muted" />
    </button>
  )
}

export const Topbar = memo(function Topbar() {
  return (
    <header className="h-12 bg-white border-b border-[#DFE1E6] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Left spacer — pushes everything to the right */}
      <div className="flex-1" />

      {/* Search */}
      <SearchBar />

      {/* Create */}
      <CreateButton />

      <Divider />

      {/* Chat */}
      <ChatButton />

      <Divider />

      {/* Icon cluster */}
      <div className="flex items-center gap-0.5">
        <NotificationBell />
        <IconButton title="Help"><FiHelpCircle className="w-4 h-4" /></IconButton>
        <IconButton title="Settings"><FiSettings className="w-4 h-4" /></IconButton>
      </div>

      <Divider />

      {/* User */}
      <UserMenu />
    </header>
  )
})
