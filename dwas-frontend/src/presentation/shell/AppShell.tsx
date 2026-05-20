import { memo } from 'react'
import { useUIStore } from '../stores'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { RightSidebar } from './RightSidebar'
import clsx from 'clsx'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell = memo(function AppShell({ children }: AppShellProps) {
  const { rightSidebarVisible } = useUIStore()

  return (
    <div className="flex h-full w-full bg-bg-primary">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 min-h-0 overflow-hidden">
          <div className="flex h-full">
            <div
              className={clsx(
                'flex-1 min-w-0 overflow-hidden transition-all duration-180',
                rightSidebarVisible ? 'mr-0' : ''
              )}
            >
              {children}
            </div>
            <RightSidebar />
          </div>
        </main>
      </div>
    </div>
  )
})
