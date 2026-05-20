import { memo } from 'react'
import { FiInbox, FiSearch, FiAlertCircle, FiCheckCircle, FiLock } from 'react-icons/fi'
import clsx from 'clsx'

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'alert' | 'success' | 'locked'
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const iconMap = {
  inbox: FiInbox,
  search: FiSearch,
  alert: FiAlertCircle,
  success: FiCheckCircle,
  locked: FiLock,
}

export const EmptyState = memo(function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon]

  return (
    <div className={clsx('flex flex-col items-center justify-center p-8 text-center', className)}>
      <Icon className="w-8 h-8 text-text-muted mb-3" />
      <div className="text-[14px] font-medium text-text-secondary mb-1">{title}</div>
      {description && <div className="text-[13px] text-text-muted max-w-sm">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
})

interface LoadingStateProps {
  label?: string
  size?: 'sm' | 'md'
}

export const LoadingState = memo(function LoadingState({
  label = 'Loading...',
  size = 'md',
}: LoadingStateProps) {
  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <div className={clsx(sizeClasses, 'border-2 border-text-muted/30 border-t-active-blue rounded-full animate-spin')} />
      <span className="text-[13px] text-text-muted">{label}</span>
    </div>
  )
})

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState = memo(function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FiAlertCircle className="w-8 h-8 text-error-red mb-3" />
      <div className="text-[14px] font-medium text-text-primary mb-1">{title}</div>
      <div className="text-[13px] text-text-muted max-w-sm mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-[13px] bg-active-blue text-white rounded-md hover:bg-active-blue/90 transition-colors duration-120"
        >
          Retry
        </button>
      )}
    </div>
  )
})
