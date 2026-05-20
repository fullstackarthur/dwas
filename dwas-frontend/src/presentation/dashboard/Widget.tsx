import { memo } from 'react'
import clsx from 'clsx'

interface WidgetProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
  loading?: boolean
}

export const Widget = memo(function Widget({
  title,
  subtitle,
  children,
  className,
  headerAction,
  collapsible = false,
  defaultCollapsed = false,
  loading = false,
}: WidgetProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <div className={clsx('bg-bg-secondary border border-border-panel rounded-md flex flex-col', className)}>
      <div className="px-3 py-2 border-b border-divider flex items-center justify-between flex-shrink-0">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-text-primary truncate">{title}</div>
          {subtitle && <div className="text-[11px] text-text-muted mt-0.5">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {headerAction}
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-text-muted hover:text-text-primary transition-colors duration-120"
            >
              {collapsed ? (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4.5L6 7.5L9 4.5" /></svg>
              ) : (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7.5L6 4.5L9 7.5" /></svg>
              )}
            </button>
          )}
        </div>
      </div>
      {(!collapsed || !collapsible) && (
        <div className={clsx('flex-1 min-h-0', loading && 'opacity-50')}>
          {loading ? (
            <div className="p-3 space-y-2">
              <div className="skeleton h-3 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )
})

import { useState } from 'react'

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
}

export const DashboardGrid = memo(function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 p-4', className)}>
      {children}
    </div>
  )
})

interface WidgetSpanProps {
  children: React.ReactNode
  span?: 1 | 2 | 3 | 4
  className?: string
}

export const WidgetSpan = memo(function WidgetSpan({ children, span = 1, className }: WidgetSpanProps) {
  const spanClasses: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 xl:col-span-3',
    4: 'col-span-1 md:col-span-2 xl:col-span-4',
  }

  return <div className={clsx(spanClasses[span], className)}>{children}</div>
})
