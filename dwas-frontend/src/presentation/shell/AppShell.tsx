import { memo } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import clsx from 'clsx'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell = memo(function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full w-full bg-bg-primary">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 min-h-0 overflow-auto">
          <div className="flex h-full">
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
})