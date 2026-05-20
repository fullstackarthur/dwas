import { memo, forwardRef } from 'react'
import clsx from 'clsx'

interface PanelProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  headerAction?: React.ReactNode
  padding?: 'none' | 'sm' | 'md'
  scrollable?: boolean
}

export const Panel = memo(forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { children, className, title, subtitle, headerAction, padding = 'md', scrollable = false },
  ref
) {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
  }

  return (
    <div
      ref={ref}
      className={clsx('bg-bg-secondary border border-border-panel rounded-md flex flex-col', className)}
    >
      {(title || headerAction) && (
        <div className="px-4 py-2.5 border-b border-divider flex items-center justify-between">
          <div>
            {title && <div className="text-[14px] font-semibold text-text-primary">{title}</div>}
            {subtitle && <div className="text-[12px] text-text-muted mt-0.5">{subtitle}</div>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={clsx(paddingClasses[padding], scrollable && 'overflow-y-auto flex-1')}>
        {children}
      </div>
    </div>
  )
}))

interface BadgeProps {
  label: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'blue'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge = memo(function Badge({ label, variant = 'default', size = 'sm', dot = false }: BadgeProps) {
  const variantClasses = {
    default: 'bg-text-muted/15 text-text-muted border-text-muted/30',
    success: 'bg-success-green/15 text-success-green border-success-green/30',
    warning: 'bg-warning-yellow/15 text-warning-yellow border-warning-yellow/30',
    error: 'bg-error-red/15 text-error-red border-error-red/30',
    info: 'bg-info-cyan/15 text-info-cyan border-info-cyan/30',
    blue: 'bg-active-blue/15 text-active-blue border-active-blue/30',
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-1',
  }

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-medium rounded border',
      variantClasses[variant],
      sizeClasses[size]
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', variantClasses[variant].split(' ')[1].replace('/15', ''))} />}
      {label}
    </span>
  )
})

interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md'
  status?: 'online' | 'away' | 'offline' | 'busy'
}

export const Avatar = memo(function Avatar({ name, size = 'sm', status }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-[11px]',
  }

  const statusColors = {
    online: 'bg-success-green',
    away: 'bg-warning-yellow',
    offline: 'bg-text-muted',
    busy: 'bg-error-red',
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  }

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div className={clsx('rounded-full bg-selected-surface flex items-center justify-center font-medium text-text-secondary', sizeClasses[size])}>
        {initials}
      </div>
      {status && (
        <span className={clsx('absolute -bottom-0.5 -right-0.5 rounded-full border border-bg-secondary', statusColors[status], statusSizes[size])} />
      )}
    </div>
  )
})

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
  type = 'button',
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-active-blue text-white hover:bg-active-blue/90 disabled:bg-active-blue/50',
    secondary: 'bg-bg-tertiary text-text-secondary border border-border-panel hover:bg-hover-surface hover:text-text-primary disabled:opacity-50',
    ghost: 'text-text-secondary hover:bg-hover-surface hover:text-text-primary disabled:opacity-50',
    danger: 'bg-error-red/15 text-error-red border border-error-red/30 hover:bg-error-red/25 disabled:opacity-50',
  }

  const sizeClasses = {
    sm: 'text-[12px] px-2 py-1',
    md: 'text-[13px] px-3 py-1.5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors duration-120 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  )
})

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Divider = memo(function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <div
      className={clsx(
        'bg-divider',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  )
})

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = memo(function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1',
  }

  return (
    <div className="relative group">
      {children}
      <div className={clsx(
        'absolute hidden group-hover:block z-overlay px-2 py-1 bg-bg-tertiary border border-border-panel rounded text-[11px] text-text-secondary whitespace-nowrap',
        positionClasses[position]
      )}>
        {content}
      </div>
    </div>
  )
})
