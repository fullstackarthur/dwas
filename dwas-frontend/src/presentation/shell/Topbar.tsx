import { memo } from 'react'
import { useUIStore, useNotificationStore, useAppStore } from '../stores'
import {
  FiSearch,
  FiBell,
  FiCpu,
  FiRefreshCw,
  FiCommand,
} from 'react-icons/fi'
import clsx from 'clsx'

function Breadcrumbs() {
  const { breadcrumbs } = useUIStore()

  return (
    <div className="flex items-center gap-1 text-[13px]">
      {breadcrumbs.map((crumb, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-text-muted">/</span>}
          {crumb.href ? (
            <a
              href={crumb.href}
              className={clsx(
                'hover:text-text-primary transition-colors duration-120',
                crumb.active ? 'text-text-primary font-medium' : 'text-text-secondary'
              )}
            >
              {crumb.label}
            </a>
          ) : (
            <span className={clsx(crumb.active ? 'text-text-primary font-medium' : 'text-text-secondary')}>
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function SearchTrigger() {
  const { openSearch } = useUIStore()

  return (
    <button
      onClick={openSearch}
      className="flex items-center gap-2 px-2 py-1 bg-bg-tertiary border border-border-panel rounded-md text-text-muted hover:text-text-secondary hover:border-text-muted/30 transition-colors duration-120 w-56"
    >
      <FiSearch className="w-3.5 h-3.5" />
      <span className="text-[12px]">Search...</span>
      <kbd className="ml-auto text-[10px] bg-bg-primary px-1.5 py-0.5 rounded border border-border-panel text-text-muted">
        /
      </kbd>
    </button>
  )
}

function CommandPaletteTrigger() {
  const { openCommandPalette } = useUIStore()

  return (
    <button
      onClick={openCommandPalette}
      className="flex items-center gap-1.5 px-2 py-1 text-text-muted hover:text-text-secondary transition-colors duration-120"
      title="Command Palette"
    >
      <FiCommand className="w-4 h-4" />
      <kbd className="text-[10px] bg-bg-tertiary px-1.5 py-0.5 rounded border border-border-panel">
        K
      </kbd>
    </button>
  )
}

function NotificationBell() {
  const { unreadCount } = useNotificationStore()

  return (
    <button className="relative p-1.5 text-text-muted hover:text-text-secondary transition-colors duration-120">
      <FiBell className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error-red text-[9px] font-medium text-white rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

function SyncStatus() {
  const { syncStatus, triggerSync } = useAppStore()

  const syncLabel = {
    synced: 'Synced',
    syncing: 'Syncing...',
    error: 'Sync error',
  }[syncStatus]

  return (
    <button
      onClick={triggerSync}
      className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-text-muted hover:text-text-secondary transition-colors duration-120"
    >
      <FiRefreshCw
        className={clsx(
          'w-3 h-3',
          syncStatus === 'syncing' && 'animate-spin'
        )}
      />
      <span>{syncLabel}</span>
    </button>
  )
}

function AILauncher() {
  return (
    <button className="flex items-center gap-1.5 px-2 py-1 text-text-muted hover:text-active-blue transition-colors duration-120">
      <FiCpu className="w-4 h-4" />
      <span className="text-[12px]">AI</span>
    </button>
  )
}

export const Topbar = memo(function Topbar() {
  return (
    <header className="h-12 bg-bg-secondary border-b border-border-panel flex items-center px-3 gap-2 flex-shrink-0">
      <Breadcrumbs />

      <div className="flex-1" />

      <SearchTrigger />
      <CommandPaletteTrigger />
      <AILauncher />
      <NotificationBell />
      <SyncStatus />

      <div className="w-px h-5 bg-divider mx-1" />

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-selected-surface flex items-center justify-center">
          <span className="text-[10px] font-medium text-text-secondary">AM</span>
        </div>
        <span className="text-[12px] text-text-secondary hidden xl:block">Arjun Mehta</span>
      </div>
    </header>
  )
})
